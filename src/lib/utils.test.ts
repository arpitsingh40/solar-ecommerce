import { describe, it, expect } from "vitest"
import { cn, formatCurrency, formatNumber, slugify, truncate, generateSKU, getCategoryById, SOLAR_CATEGORIES } from "@/lib/utils"

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("base", "override")).toBe("base override")
    })

    it("handles conditional classes", () => {
      expect(cn("base", true && "conditional", false && "hidden")).toBe("base conditional")
    })

    it("merges Tailwind classes with tailwind-merge", () => {
      expect(cn("p-4", "p-6")).toBe("p-6")
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
    })
  })

  describe("formatCurrency", () => {
    it("formats Indian rupees by default", () => {
      expect(formatCurrency(1000)).toBe("₹1,000")
      expect(formatCurrency(1000.5)).toBe("₹1,000.5")
      expect(formatCurrency(0)).toBe("₹0")
    })

    it("handles different currencies", () => {
      expect(formatCurrency(1000, "USD")).toBe("$1,000")
      expect(formatCurrency(1000, "EUR")).toContain("€")
      expect(formatCurrency(1000, "GBP")).toContain("£")
    })
  })

  describe("formatNumber", () => {
    it("formats large numbers with Indian units", () => {
      expect(formatNumber(1500)).toBe("1.5K")
      expect(formatNumber(1500000)).toBe("15.0 L")
      expect(formatNumber(15000000)).toBe("1.5 Cr")
      expect(formatNumber(500)).toBe("500")
    })
  })

  describe("slugify", () => {
    it("creates URL-friendly slugs", () => {
      expect(slugify("Hello World")).toBe("hello-world")
      expect(slugify("Solar Panel 400W")).toBe("solar-panel-400w")
      expect(slugify("Special @#$% Characters")).toBe("special-characters")
      expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces")
    })
  })

  describe("truncate", () => {
    it("truncates long strings", () => {
      expect(truncate("Hello World", 8)).toBe("Hello Wo...")
      expect(truncate("Short", 10)).toBe("Short")
    })
  })

  describe("generateSKU", () => {
    it("generates unique SKUs with prefix", () => {
      const sku1 = generateSKU("SOL")
      const sku2 = generateSKU("SOL")
      expect(sku1).toMatch(/^SOL-[A-Z0-9]+-[A-Z0-9]+$/)
      expect(sku2).toMatch(/^SOL-[A-Z0-9]+-[A-Z0-9]+$/)
      expect(sku1).not.toBe(sku2)
    })
  })

  describe("SOLAR_CATEGORIES", () => {
    it("has only kit categories", () => {
      expect(SOLAR_CATEGORIES).toHaveLength(3)
      const ids = SOLAR_CATEGORIES.map((c) => c.id)
      expect(ids).toContain("on-grid")
      expect(ids).toContain("hybrid")
      expect(ids).toContain("commercial")
      expect(ids).not.toContain("panels")
    })
  })

  describe("getCategoryById", () => {
    it("returns category for valid ID", () => {
      const category = getCategoryById("on-grid")
      expect(category).toBeDefined()
      expect(category?.name).toBe("On-Grid Kits")
    })

    it("returns undefined for invalid ID", () => {
      expect(getCategoryById("invalid")).toBeUndefined()
    })
  })
})