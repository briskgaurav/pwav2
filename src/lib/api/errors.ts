/**
 * Typed error classes thrown by `fetchWithAuth` and the auth session layer.
 *
 * Callers can use `instanceof` to branch on failure mode without parsing
 * error messages. Every error carries a stable machine-readable `code` so
 * higher layers (UI, host SDK bridge, telemetry) can react deterministically.
 */

/** Stable, machine-readable error codes surfaced by the API layer. */
export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'AUTH_MISSING'
  | 'AUTH_BOOTSTRAP_FAILED'
  | 'AUTH_REFRESH_FAILED'
  | 'AUTH_EXPIRED'
  | 'CSRF_MISSING'
  | 'HTTP_ERROR'
  | 'PARSE_ERROR'
  | 'ABORTED';

/**
 * Base error for any failure originating from the API layer.
 * Prefer the more specific subclasses below when raising.
 */
export class ApiError extends Error {
  /** HTTP status code, or `0` when the failure happened before a response. */
  readonly status: number;
  /** Machine-readable error category. */
  readonly code: ApiErrorCode;
  /** Parsed response body when available, useful for surfacing server detail. */
  readonly body: unknown;

  constructor(
    message: string,
    options: { status?: number; code: ApiErrorCode; body?: unknown; cause?: unknown },
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code;
    this.body = options.body;
  }
}

/** Thrown when the request never reached or never completed at the network layer. */
export class NetworkError extends ApiError {
  constructor(message = 'Network request failed', cause?: unknown) {
    super(message, { code: 'NETWORK_ERROR', cause });
    this.name = 'NetworkError';
  }
}

/** Thrown when a request exceeds its configured timeout. */
export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out') {
    super(message, { code: 'TIMEOUT' });
    this.name = 'TimeoutError';
  }
}

/**
 * Thrown for authentication-related failures: missing host token, failed
 * bootstrap, failed refresh, or unrecoverable 401 after retry. UI layers
 * should treat this as terminal — the host SDK has already been notified
 * via the bridge by the time this is thrown.
 */
export class AuthError extends ApiError {
  constructor(
    message: string,
    code: Extract<
      ApiErrorCode,
      'AUTH_MISSING' | 'AUTH_BOOTSTRAP_FAILED' | 'AUTH_REFRESH_FAILED' | 'AUTH_EXPIRED' | 'CSRF_MISSING'
    >,
    options: { status?: number; body?: unknown; cause?: unknown } = {},
  ) {
    super(message, { code, status: options.status, body: options.body, cause: options.cause });
    this.name = 'AuthError';
  }
}
