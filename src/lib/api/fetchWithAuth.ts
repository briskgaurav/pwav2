/**
 * `fetchWithAuth` — the single entry point for every authenticated request
 * the PWA makes to the backend.
 *
 * Responsibilities:
 *  - Ensure the auth session is bootstrapped before the first call.
 *  - Attach `credentials: 'include'` so the browser sends auth cookies.
 *  - Attach `X-CSRF-Token` on non-GET requests (double-submit pattern).
 *  - Auto-serialize JSON request bodies and parse JSON responses.
 *  - Apply a configurable per-request timeout via `AbortController`.
 *  - On `401`, perform a single-flight refresh and retry the request once.
 *  - Throw typed errors (`ApiError`, `AuthError`, `NetworkError`,
 *    `TimeoutError`) so callers can branch deterministically.
 *
 * Direct use of `fetch` for backend calls is forbidden — always go through
 * this wrapper. The lint rule that enforces this should land alongside the
 * first real consumer.
 *
 * @example Simple GET
 * ```ts
 * const profile = await fetchWithAuth<UserProfile>('/users/me');
 * ```
 *
 * @example POST with JSON body
 * ```ts
 * const card = await fetchWithAuth<Card>('/cards', {
 *   method: 'POST',
 *   json: { type: 'debit', currency: 'USD' },
 * });
 * ```
 *
 * @example Cancellation
 * ```ts
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 5000);
 * await fetchWithAuth('/slow', { signal: controller.signal });
 * ```
 *
 * @remarks
 * MOCK NOTES — see `./session.ts` for the `AUTH_MOCK` toggles. Until the
 * backend is ready, bootstrap, refresh, and CSRF are all stubbed off so
 * this wrapper can be exercised against unauthenticated endpoints.
 */

import { ApiError, AuthError, NetworkError, TimeoutError } from './errors';
import {
  AUTH_MOCK,
  ensureBootstrapped,
  getCsrfToken,
  refreshSession,
} from './session';
import { resolveUrl } from './config';

/** HTTP methods that must carry a CSRF token under the double-submit policy. */
const CSRF_REQUIRED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Default per-request timeout. Override per call via `RequestOptions.timeoutMs`. */
const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Options accepted by `fetchWithAuth`. A superset of the standard `RequestInit`
 * with two additions:
 *
 *  - `json`: a plain object that will be JSON-stringified into `body` and
 *    automatically tagged with `Content-Type: application/json`. Mutually
 *    exclusive with `body`.
 *  - `timeoutMs`: per-request timeout in milliseconds. The request is aborted
 *    once the timeout fires; an external `signal` is honoured in addition.
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Plain object to send as a JSON body. */
  json?: unknown;
  /** Raw body, when `json` is not appropriate (FormData, Blob, string, …). */
  body?: BodyInit | null;
  /** Per-request timeout in ms. Defaults to {@link DEFAULT_TIMEOUT_MS}. */
  timeoutMs?: number;
}

/**
 * Issue an authenticated request and return the parsed response body.
 *
 * The response is parsed as JSON when the `Content-Type` is JSON-ish or the
 * body is non-empty; otherwise `undefined` is returned. For raw access to
 * the underlying `Response` (e.g. binary downloads), use {@link fetchWithAuthRaw}.
 *
 * @typeParam T - Expected shape of the parsed JSON response.
 * @param input - Path relative to `NEXT_PUBLIC_API_BASE_URL`, or an absolute URL.
 * @param options - Request options. See {@link RequestOptions}.
 * @returns Parsed JSON body, or `undefined` for empty/204 responses.
 *
 * @throws {AuthError} when bootstrap or refresh fails, or a 401 persists
 *   after retry. The host SDK has been notified by the time this throws.
 * @throws {ApiError} for any non-2xx response that is not a recoverable 401.
 * @throws {NetworkError} when the request never reached the server.
 * @throws {TimeoutError} when the request exceeds its timeout.
 */
export async function fetchWithAuth<T = unknown>(
  input: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetchWithAuthRaw(input, options);
  return (await parseBody(response)) as T;
}

/**
 * Variant of {@link fetchWithAuth} that returns the raw `Response` object.
 * Use when you need headers, streaming, or a non-JSON body. Auth, CSRF,
 * timeout, and 401-retry semantics are identical.
 */
export async function fetchWithAuthRaw(
  input: string,
  options: RequestOptions = {},
): Promise<Response> {
  await ensureBootstrapped();

  const response = await sendOnce(input, options);

  if (response.status !== 401) return response;

  // Reactive refresh is mocked off. Still throw so callers fail loudly
  // rather than silently navigating forward with empty response data.
  if (AUTH_MOCK.skipRefresh) {
    const body = await safeClone(response);
    throw new ApiError('HTTP 401', { code: 'HTTP_ERROR', status: 401, body });
  }

  await refreshSession();
  const retried = await sendOnce(input, options);

  if (retried.status === 401) {
    const body = await safeClone(retried);
    throw new AuthError('Unauthorized after refresh', 'AUTH_EXPIRED', {
      status: 401,
      body,
    });
  }
  return retried;
}

// ─── Internals ─────────────────────────────────────────────────────────────

/**
 * Build the final `RequestInit`, dispatch a single attempt, translate
 * low-level fetch failures into typed errors, and turn non-2xx (other than
 * 401) into {@link ApiError}.
 *
 * @internal
 */
async function sendOnce(input: string, options: RequestOptions): Promise<Response> {
  const url = resolveUrl(input);
  const method = (options.method ?? 'GET').toUpperCase();
  const { headers, body } = buildRequest(method, options);

  const { signal, cancel } = composeSignal(options.signal, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      method,
      headers,
      body,
      credentials: 'include',
      signal,
    });
  } catch (cause) {
    if (isAbortError(cause)) {
      // Distinguish caller-aborted from timeout-aborted.
      if (options.signal?.aborted) {
        throw new ApiError('Request aborted', { code: 'ABORTED', cause });
      }
      throw new TimeoutError();
    }
    throw new NetworkError(undefined, cause);
  } finally {
    cancel();
  }

  // 401 is handled by the caller (refresh + retry). Other non-2xx codes are
  // terminal here and must be wrapped in a typed error.
  if (response.status === 401) return response;
  if (!response.ok) {
    const parsed = await safeClone(response);
    throw new ApiError(`HTTP ${response.status}`, {
      code: 'HTTP_ERROR',
      status: response.status,
      body: parsed,
    });
  }
  return response;
}

/**
 * Assemble headers and body. Applies JSON serialization, CSRF, and lets
 * caller-provided headers win over our defaults.
 *
 * @internal
 */
function buildRequest(
  method: string,
  options: RequestOptions,
): { headers: Headers; body: BodyInit | null | undefined } {
  if (options.json !== undefined && options.body !== undefined && options.body !== null) {
    throw new Error('[fetchWithAuth] Provide either `json` or `body`, not both.');
  }

  const headers = new Headers(options.headers);

  let body: BodyInit | null | undefined = options.body;
  if (options.json !== undefined) {
    body = JSON.stringify(options.json);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // ── DEV ONLY — remove once /auth/session cookie exchange is live ──────────
  // When the backend expects a Bearer token instead of a session cookie,
  // set NEXT_PUBLIC_DEV_AUTH_TOKEN in .env.local. Never commit a real token.
  // To remove: delete this block and unset the env var.
  if (process.env.NODE_ENV !== 'production') {
    const devToken = process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN;
    if (devToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${devToken}`);
    }
  }
  // ── END DEV ONLY ──────────────────────────────────────────────────────────

  if (CSRF_REQUIRED_METHODS.has(method) && !AUTH_MOCK.skipCsrf) {
    const csrf = getCsrfToken();
    if (!csrf) {
      // Fail closed: a missing CSRF token on a state-changing request is a
      // bug, not something to silently send through.
      throw new AuthError('Missing CSRF token for non-GET request', 'CSRF_MISSING');
    }
    headers.set('X-CSRF-Token', csrf);
  }

  return { headers, body };
}

/**
 * Compose an external `AbortSignal` with a timeout-driven one. The returned
 * `cancel()` clears the timeout regardless of which side won.
 *
 * @internal
 */
function composeSignal(
  external: AbortSignal | null | undefined,
  timeoutMs: number,
): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (external) {
    if (external.aborted) {
      controller.abort();
    } else {
      external.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timer),
  };
}

/** @internal */
function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

/**
 * Parse a successful response. JSON when the body declares (or smells like)
 * JSON; `undefined` for empty or 204 responses; raw text otherwise.
 *
 * @internal
 */
async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (cause) {
      throw new ApiError('Failed to parse JSON response', { code: 'PARSE_ERROR', cause });
    }
  }

  const text = await response.text();
  return text === '' ? undefined : text;
}

/**
 * Read a response body for inclusion in an error, without disturbing the
 * caller's ability to read it again. Returns `null` on any failure.
 *
 * @internal
 */
async function safeClone(response: Response): Promise<unknown> {
  try {
    const text = await response.clone().text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}
