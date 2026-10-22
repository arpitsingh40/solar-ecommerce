import type { CartItem } from "@/types/product"

export type PaymentMethod = "upi" | "card" | "netbanking" | "neft" | "cod"

export interface OrderLine {
  productId: string
  name: string
  slug: string
  image?: string
  brand?: string
  price: number
  quantity: number
}

export interface OrderAddress {
  fullName: string
  email: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  gstin?: string
  notes?: string
}

export interface StoredOrder {
  id: string
  createdAt: string
  status: "confirmed"
  paymentMethod: PaymentMethod
  paymentStatus: "paid" | "pending"
  items: OrderLine[]
  subtotal: number
  productDiscount: number
  couponDiscount: number
  coupon?: string | null
  shipping: number
  codFee: number
  total: number
  gstIncluded: number
  address: OrderAddress
  deliveryEstimate: string
}

const ORDERS_KEY = "solarstore-orders"
const MAX_ORDERS = 25

export function createOrderId(): string {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`
  const random = Math.floor(1000 + Math.random() * 9000)
  return `SS-${date}-${random}`
}

export function toOrderLines(items: CartItem[]): OrderLine[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.images[0]?.url,
    brand: item.product.brand?.name,
    price:
      item.variant?.salePrice ??
      item.variant?.price ??
      item.product.salePrice ??
      item.product.basePrice,
    quantity: item.quantity,
  }))
}

export function saveOrder(order: StoredOrder): void {
  if (typeof window === "undefined") return
  try {
    const existing = getOrders().filter((entry) => entry.id !== order.id)
    const next = [order, ...existing].slice(0, MAX_ORDERS)
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable in private browsing; the confirmation page
    // falls back to sessionStorage in that case.
  }
}

export function getOrders(): StoredOrder[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredOrder[]) : []
  } catch {
    return []
  }
}

export function getOrder(id: string): StoredOrder | null {
  return getOrders().find((order) => order.id === id) ?? null
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit / debit card",
  netbanking: "Net banking",
  neft: "NEFT / RTGS",
  cod: "Cash on delivery",
}
