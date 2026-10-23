/**
 * Validates and normalizes callback URLs to prevent open redirect vulnerabilities.
 * Strictly blocks protocol-relative URLs (//) and backslash redirects (/\).
 */
export function safeCallbackUrl(raw: string | null, fallback: string = "/dashboard"): string {
  if (!raw) return fallback
  const trimmed = raw.trim()
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.startsWith("/auth")
  ) {
    try {
      const parsed = new URL(trimmed, "http://localhost")
      if (parsed.origin === "http://localhost" && parsed.pathname.startsWith("/")) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`
      }
    } catch {
      return fallback
    }
  }
  return fallback
}
