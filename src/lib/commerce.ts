import type { CartItem } from "@/types/product"
import { shippingFor } from "@/lib/india"

export const GST_LABEL = "5% GST included"
export const FREE_SHIPPING_THRESHOLD_LABEL = "Free above ₹4,999"

export interface CartTotals {
  subtotal: number
  mrpTotal: number
  productDiscount: number
  couponDiscount: number
  shipping: number
  total: number
}

export function calculateCartTotals(items: CartItem[], coupon?: string | null): CartTotals {
  const subtotal = items.reduce((sum, item) => {
    const price =
      item.variant?.salePrice ?? item.variant?.price ?? item.product.salePrice ?? item.product.basePrice
    return sum + price * item.quantity
  }, 0)

  const mrpTotal = items.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  )

  let couponDiscount = 0
  if (coupon?.toUpperCase() === "DEALER5K" && subtotal >= 1_00_000) {
    couponDiscount = Math.min(5_000, subtotal)
  }

  const shipping = shippingFor(subtotal)
  const total = Math.max(0, subtotal - couponDiscount) + shipping

  return {
    subtotal,
    mrpTotal,
    productDiscount: Math.max(0, mrpTotal - subtotal),
    couponDiscount,
    shipping,
    total,
  }
}
