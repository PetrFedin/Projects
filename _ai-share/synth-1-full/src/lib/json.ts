/**
 * Strict-mode helper: `Response.json()` resolves to `unknown`.
 * Use at fetch boundaries with an explicit target shape.
 */
export function jsonAs<T>(data: unknown): T {
  return data as T;
}
