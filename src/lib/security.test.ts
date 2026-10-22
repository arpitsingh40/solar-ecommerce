import { describe, it, expect } from "vitest"
import { checkRateLimit } from "@/lib/server/rate-limit"
import { createSessionToken, verifySessionToken } from "@/lib/auth/session"

describe("Security hardening", () => {
  describe("Rate Limiting", () => {
    it("permits requests within configured threshold and blocks subsequent ones", () => {
      const mockRequest = new Request("http://localhost:3000/api/test", {
        headers: { "x-forwarded-for": "203.0.113.195" },
      })

      const options = { prefix: "test-limit", limit: 3, windowSeconds: 10 }

      const first = checkRateLimit(mockRequest, options)
      expect(first.success).toBe(true)
      expect(first.remaining).toBe(2)

      const second = checkRateLimit(mockRequest, options)
      expect(second.success).toBe(true)
      expect(second.remaining).toBe(1)

      const third = checkRateLimit(mockRequest, options)
      expect(third.success).toBe(true)
      expect(third.remaining).toBe(0)

      // Exceeded limit
      const fourth = checkRateLimit(mockRequest, options)
      expect(fourth.success).toBe(false)
      expect(fourth.remaining).toBe(0)
      expect(fourth.resetSeconds).toBeGreaterThan(0)
    })
  })

  describe("Session JWT and Token Versioning", () => {
    it("encodes and verifies session payload with token version", async () => {
      const payload = {
        userId: "usr_test123",
        email: "dealer@example.in",
        role: "customer" as const,
        tokenVersion: 2,
      }

      const token = await createSessionToken(payload)
      expect(token).toBeDefined()
      expect(token.split(".").length).toBe(3)

      const verified = await verifySessionToken(token)
      expect(verified).not.toBeNull()
      expect(verified?.userId).toBe("usr_test123")
      expect(verified?.email).toBe("dealer@example.in")
      expect(verified?.tokenVersion).toBe(2)
    })

    it("rejects tampered tokens", async () => {
      const payload = {
        userId: "usr_test456",
        email: "admin@example.in",
        role: "admin" as const,
      }

      const token = await createSessionToken(payload)
      const tampered = token.slice(0, -5) + "abcde"
      const verified = await verifySessionToken(tampered)
      expect(verified).toBeNull()
    })
  })

  describe("Safe Callback URL Validation Logic", () => {
    function safeCallbackUrl(raw: string | null): string | null {
      if (!raw) return null
      if (
        raw.startsWith("/") &&
        !raw.startsWith("//") &&
        !raw.startsWith("/\\") &&
        !raw.startsWith("/auth")
      ) {
        try {
          const parsed = new URL(raw, "http://localhost")
          if (parsed.origin === "http://localhost" && parsed.pathname.startsWith("/")) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`
          }
        } catch {
          return null
        }
      }
      return null
    }

    it("accepts valid internal paths", () => {
      expect(safeCallbackUrl("/admin/dashboard")).toBe("/admin/dashboard")
      expect(safeCallbackUrl("/products/lk-03?tab=specs")).toBe("/products/lk-03?tab=specs")
      expect(safeCallbackUrl("/checkout")).toBe("/checkout")
    })

    it("rejects open redirect attacks including protocol-relative URLs", () => {
      expect(safeCallbackUrl("//evil.com")).toBeNull()
      expect(safeCallbackUrl("//attacker.com/exploit")).toBeNull()
      expect(safeCallbackUrl("/\\evil.com")).toBeNull()
      expect(safeCallbackUrl("https://evil.com")).toBeNull()
      expect(safeCallbackUrl("javascript:alert(1)")).toBeNull()
      expect(safeCallbackUrl("/auth/signin")).toBeNull()
    })
  })
})
