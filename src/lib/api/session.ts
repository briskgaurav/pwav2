/**
 * Auth session state machine for the embedded PWA.
 *
 * Responsibilities:
 *  - Hold the host-issued bootstrap token in memory only (never persisted).
 *  - Exchange that token with the backend for httpOnly auth cookies.
 *  - Refresh the session reactively (on 401) and proactively (before expiry).
 *  - Single-flight all bootstrap and refresh calls so concurrent requests
 *    cannot trigger duplicate exchanges.
 *  - Notify the host SDK on terminal failure so it can decide what to do
 *    (re-issue token, close the WebView, etc.).
 *
 * This module is client-only. It must never be imported from a Server
 * Component or Route Handler — it relies on `document.cookie`, timers, and
 * the bridge `postMessage` plumbing.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  MOCK / BACKEND-READINESS NOTES
 * ──────────────────────────────────────────────────────────────────────────
 * Backend contract assumed here:
 *
 *   POST {API_BASE}/auth/session     body: { token }
 *     → 200 JSON { accessTokenExpiresAt: ISO-8601 } (or { expiresIn: seconds })
 *       sets cookies:
 *         accessToken   (HttpOnly, Secure, SameSite=None, ~15m)
 *         refreshToken  (HttpOnly, Secure, SameSite=None, path=/auth/refresh)
 *         csrfToken     (Secure, SameSite=None, readable by JS)
 *
 *   POST {API_BASE}/auth/refresh     no body, cookies carry refresh token
 *     → 200 JSON (same shape). Rotates all three cookies. 401 if expired.
 *
 * Until the backend ships those endpoints, flip each toggle to `false`
 * as the real endpoint becomes ready:
 *
 *   AUTH_MOCK.skipBootstrap  — bypass /auth/session; assume session is valid.
 *   AUTH_MOCK.skipRefresh    — disable proactive timer and 401-retry refresh.
 *   AUTH_MOCK.skipCsrf       — omit X-CSRF-Token; no cookie required.
 *
 * To drive these from env instead of source edits:
 *   skipBootstrap: process.env.NEXT_PUBLIC_SKIP_AUTH_BOOTSTRAP === 'true'
 */

import { notifyError, parseSDKConfig } from '@/lib/bridge';
import { getApiBaseUrl } from './config';
import { AuthError } from './errors';

// ─── Mock toggles ──────────────────────────────────────────────────────────

interface AuthMockConfig {
  skipBootstrap: boolean;
  skipRefresh: boolean;
  skipCsrf: boolean;
}

/**
 * Temporary mock toggles. Each defaults to `true` while the backend is being
 * built. Flip individual flags to `false` as each endpoint becomes ready.
 */
export const AUTH_MOCK: AuthMockConfig = {
  skipBootstrap: true,
  skipRefresh: true,
  skipCsrf: true,
};

// ─── Constants ─────────────────────────────────────────────────────────────

const ENDPOINTS = {
  bootstrap: '/auth/session',
  refresh: '/auth/refresh',
} as const;

/** Name of the non-httpOnly cookie that carries the CSRF token. */
const CSRF_COOKIE_NAME = 'csrfToken';

/**
 * Fire a proactive refresh this many milliseconds before the access token
 * expires. 60 s comfortably covers clock skew and network latency.
 */
const REFRESH_LEEWAY_MS = 60_000;

// ─── Module state ──────────────────────────────────────────────────────────

/** Host-issued token in memory only. Cleared immediately after exchange. */
let hostToken: string | null = null;

/** True once /auth/session has succeeded for the current host token. */
let bootstrapped = false;

/**
 * In-flight bootstrap promise — shared by all concurrent callers so the
 * exchange fires exactly once. Cleared in `.finally()` when it settles.
 */
let bootstrapInFlight: Promise<void> | null = null;

/**
 * AbortController for the active bootstrap fetch. Allows `clearSession` to
 * cancel the pending network call rather than merely orphaning the promise.
 */
let bootstrapAbort: AbortController | null = null;

/** In-flight refresh promise (same single-flight pattern as bootstrap). */
let refreshInFlight: Promise<void> | null = null;

/** AbortController for the active refresh fetch. */
let refreshAbort: AbortController | null = null;

/** Timer handle for the proactive refresh scheduler. */
let proactiveRefreshTimer: ReturnType<typeof setTimeout> | null = null;

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Inject the host-issued bootstrap token. Call once during app startup
 * (e.g. from `auth-context` after `parseSDKConfig`). When not called, the
 * session layer falls back to reading the token directly from the URL.
 *
 * @param token - The JWT issued by the embedding host SDK.
 */
export function setHostToken(token: string): void {
  hostToken = token;
  bootstrapped = false;
}

/**
 * Read the current CSRF token from the non-httpOnly cookie set by the backend.
 *
 * @returns The token string, or `null` when the cookie is absent.
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CSRF_COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(CSRF_COOKIE_NAME.length + 1)) : null;
}

/**
 * Ensure the session is bootstrapped before issuing an authenticated request.
 * Idempotent — safe to call on every request. Single-flight — concurrent
 * callers all await the same exchange promise.
 *
 * @throws {AuthError} `AUTH_MISSING` — no host token is available.
 * @throws {AuthError} `AUTH_BOOTSTRAP_FAILED` — exchange was rejected.
 */
export async function ensureBootstrapped(): Promise<void> {
  if (AUTH_MOCK.skipBootstrap) {
    bootstrapped = true;
    return;
  }
  if (bootstrapped) return;
  if (bootstrapInFlight) return bootstrapInFlight;

  bootstrapAbort = new AbortController();
  bootstrapInFlight = bootstrap(bootstrapAbort.signal).finally(() => {
    bootstrapInFlight = null;
    bootstrapAbort = null;
  });
  return bootstrapInFlight;
}

/**
 * Refresh the session cookies. Single-flight — concurrent callers await
 * the same refresh. On terminal failure the host SDK is notified before
 * this throws so it can decide next steps (close WebView, re-issue token).
 *
 * @throws {AuthError} `AUTH_REFRESH_FAILED` — refresh was rejected.
 */
export async function refreshSession(): Promise<void> {
  if (AUTH_MOCK.skipRefresh) {
    // No-op until /auth/refresh ships. On 401, the original error propagates.
    return;
  }
  if (refreshInFlight) return refreshInFlight;

  refreshAbort = new AbortController();
  refreshInFlight = refresh(refreshAbort.signal).finally(() => {
    refreshInFlight = null;
    refreshAbort = null;
  });
  return refreshInFlight;
}

/**
 * Cancel any in-flight auth requests and reset all session state.
 * Cookies are owned by the backend and are not cleared here.
 */
export function clearSession(): void {
  bootstrapAbort?.abort();
  refreshAbort?.abort();
  bootstrapAbort = null;
  refreshAbort = null;
  bootstrapInFlight = null;
  refreshInFlight = null;
  hostToken = null;
  bootstrapped = false;
  if (proactiveRefreshTimer !== null) {
    clearTimeout(proactiveRefreshTimer);
    proactiveRefreshTimer = null;
  }
}

// ─── Internals ─────────────────────────────────────────────────────────────

/**
 * Prefer the explicitly injected token; fall back to URL parsing for callers
 * that have not yet wired `setHostToken`.
 */
function resolveHostToken(): string | null {
  if (hostToken) return hostToken;
  return parseSDKConfig()?.userToken ?? null;
}

/**
 * Exchange the host-issued token for auth cookies.
 *
 * The response body is parsed eagerly so the `Response` stream is fully
 * consumed before this function returns. `scheduleProactiveRefresh` receives
 * the already-parsed value and runs synchronously — no fire-and-forget.
 */
async function bootstrap(signal: AbortSignal): Promise<void> {
  const token = resolveHostToken();
  if (!token) {
    notifyError('AUTH_MISSING', 'No host token available for session bootstrap');
    throw new AuthError('No host token available', 'AUTH_MISSING');
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${ENDPOINTS.bootstrap}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal,
    });
  } catch (cause) {
    notifyError('AUTH_BOOTSTRAP_FAILED', 'Network failure during session bootstrap');
    throw new AuthError('Network failure during bootstrap', 'AUTH_BOOTSTRAP_FAILED', { cause });
  }

  const body = await safeReadJson(response);

  if (!response.ok) {
    notifyError('AUTH_BOOTSTRAP_FAILED', `Bootstrap rejected with status ${response.status}`);
    throw new AuthError('Session bootstrap rejected', 'AUTH_BOOTSTRAP_FAILED', {
      status: response.status,
      body,
    });
  }

  hostToken = null;
  bootstrapped = true;
  scheduleProactiveRefresh(body);
}

/**
 * Hit the refresh endpoint. The browser carries the refresh cookie
 * automatically; the backend rotates all three cookies on success.
 *
 * Body is parsed eagerly — same rationale as `bootstrap`.
 */
async function refresh(signal: AbortSignal): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${ENDPOINTS.refresh}`, {
      method: 'POST',
      credentials: 'include',
      signal,
    });
  } catch (cause) {
    notifyError('AUTH_REFRESH_FAILED', 'Network failure during session refresh');
    throw new AuthError('Network failure during refresh', 'AUTH_REFRESH_FAILED', { cause });
  }

  const body = await safeReadJson(response);

  if (!response.ok) {
    notifyError('AUTH_REFRESH_FAILED', `Refresh rejected with status ${response.status}`);
    throw new AuthError('Session refresh rejected', 'AUTH_REFRESH_FAILED', {
      status: response.status,
      body,
    });
  }

  scheduleProactiveRefresh(body);
}

/**
 * Schedule a proactive refresh before the access token expires.
 * Synchronous — receives the already-parsed body, no stream reads here.
 *
 * Expiry is inferred in priority order:
 *   1. `accessTokenExpiresAt` — ISO-8601 absolute timestamp in the body.
 *   2. `expiresIn`            — seconds-until-expiry in the body.
 *   3. Fixed fallback         — 14 minutes (safe floor for a 15-minute token).
 *
 * Any pending timer is cancelled before a new one is set.
 */
function scheduleProactiveRefresh(responseBody: unknown): void {
  if (AUTH_MOCK.skipRefresh) return;

  if (proactiveRefreshTimer !== null) {
    clearTimeout(proactiveRefreshTimer);
    proactiveRefreshTimer = null;
  }

  const expiresAt = extractExpiry(responseBody);
  const delay =
    expiresAt !== null
      ? Math.max(expiresAt - Date.now() - REFRESH_LEEWAY_MS, 0)
      : 14 * 60_000;

  proactiveRefreshTimer = setTimeout(() => {
    void refreshSession().catch(() => {
      // refreshSession already notified the host via bridge; swallow here
      // to prevent an unhandled-rejection from the bare timer callback.
    });
  }, delay);
}

/**
 * Extract an absolute expiry epoch from a parsed response body.
 * Returns `null` when neither recognised field is present.
 */
function extractExpiry(body: unknown): number | null {
  if (!body || typeof body !== 'object') return null;
  const record = body as Record<string, unknown>;

  if (typeof record.accessTokenExpiresAt === 'string') {
    const ms = Date.parse(record.accessTokenExpiresAt);
    return Number.isNaN(ms) ? null : ms;
  }
  if (typeof record.expiresIn === 'number') {
    return Date.now() + record.expiresIn * 1000;
  }
  return null;
}

/**
 * Best-effort JSON parse. Returns `null` on empty body or any parse failure
 * so callers never need to guard against a secondary error inside error handling.
 */
async function safeReadJson(response: Response): Promise<unknown> {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
