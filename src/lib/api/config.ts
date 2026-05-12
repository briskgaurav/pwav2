/**
 * Shared API configuration resolved from environment variables.
 * Single source of truth — import from here, do not read
 * `NEXT_PUBLIC_API_BASE_URL` directly elsewhere in the API layer.
 */

/**
 * Return the backend API base URL with any trailing slashes stripped.
 * Throws immediately on first use when the variable is absent so
 * misconfiguration fails loudly rather than producing silent 404s.
 */
export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error(
      '[api] NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local.',
    );
  }
  return url.replace(/\/+$/, '');
}

/**
 * Resolve a request input into an absolute URL.
 * Relative paths (e.g. `/cards`) are joined onto the API base URL.
 * Absolute URLs (`https://…`) pass through unchanged.
 *
 * @param input - Relative path or absolute URL.
 */
export function resolveUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  const path = input.startsWith('/') ? input : `/${input}`;
  return `${getApiBaseUrl()}${path}`;
}
