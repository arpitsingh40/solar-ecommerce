import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + " Cr"
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + " L"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return new Intl.NumberFormat("en-IN").format(num)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "..."
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateSKU(prefix: string = "SOL"): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export const SOLAR_CATEGORIES = [
  { id: "on-grid", name: "On-Grid Kits", icon: "package" },
  { id: "hybrid", name: "Hybrid Kits", icon: "battery" },
  { id: "commercial", name: "Commercial Kits", icon: "building" },
] as const

export type SolarCategory = typeof SOLAR_CATEGORIES[number]["id"]

export function getCategoryById(id: string) {
  return SOLAR_CATEGORIES.find((c) => c.id === id)
}