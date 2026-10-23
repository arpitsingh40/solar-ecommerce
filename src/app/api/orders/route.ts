import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { products } from "@/lib/data/catalog"
import { updateJsonArray } from "@/lib/server/json-store"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit"
import { validateCoupon } from "@/lib/commerce"
import {
  createOrderId,
  type OrderAddress,
  type OrderLine,
  type PaymentMethod,
  type StoredOrder,
} from "@/lib/orders"
import {
  INDIAN_STATES_AND_UTS,
  isValidGstin,
  isValidIndianPhone,
  isValidPincode,
  deliveryEstimate,
} from "@/lib/india"

export async function POST(request: Request) {
  // Rate limit: 10 orders per 60 seconds per IP
  const rateLimit = checkRateLimit(request, {
    prefix: "orders",
    limit: 10,
    windowSeconds: 60,
  })
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.resetSeconds)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 })
  }

  const payload = (body ?? {}) as {
    address?: OrderAddress
    paymentMethod?: PaymentMethod
    items?: Array<{ productId: string; quantity: number }>
    coupon?: string | null
  }

  const address = payload.address
  if (!address) {
    return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
  }

  // Address validation
  if (!address.fullName || address.fullName.trim().length < 3) {
    return NextResponse.json({ error: "Valid full name is required" }, { status: 400 })
  }
  if (!address.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
    return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
  }
  if (!isValidIndianPhone(address.phone)) {
    return NextResponse.json({ error: "Valid 10-digit Indian phone number is required" }, { status: 400 })
  }
  if (!address.line1 || address.line1.trim().length < 5) {
    return NextResponse.json({ error: "Valid street address is required" }, { status: 400 })
  }
  if (!address.city || address.city.trim().length < 2) {
    return NextResponse.json({ error: "Valid city is required" }, { status: 400 })
  }
  if (!INDIAN_STATES_AND_UTS.includes(address.state as (typeof INDIAN_STATES_AND_UTS)[number])) {
    return NextResponse.json({ error: "Valid Indian state or union territory is required" }, { status: 400 })
  }
  if (!isValidPincode(address.pincode)) {
    return NextResponse.json({ error: "Valid 6-digit Indian pincode is required" }, { status: 400 })
  }
  if (!address.gstin || !isValidGstin(address.gstin.trim())) {
    return NextResponse.json({ error: "Valid 15-character GSTIN is required" }, { status: 400 })
  }

  // Items validation & authoritative server-side price lookup
  const incomingItems = payload.items
  if (!Array.isArray(incomingItems) || incomingItems.length === 0) {
    return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 })
  }

  const verifiedLines: OrderLine[] = []
  let subtotal = 0

  for (const item of incomingItems) {
    const qty = Math.max(1, Math.min(Math.floor(item.quantity || 1), 50))
    const catalogProduct = products.find((p) => p.id === item.productId)
    if (!catalogProduct) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 })
    }

    const unitPrice = catalogProduct.salePrice || catalogProduct.basePrice
    subtotal += unitPrice * qty

    verifiedLines.push({
      productId: catalogProduct.id,
      name: catalogProduct.name,
      slug: catalogProduct.slug,
      image: catalogProduct.images[0]?.url,
      brand: catalogProduct.brand?.name,
      price: unitPrice,
      quantity: qty,
    })
  }

  const couponResult = validateCoupon(payload.coupon, subtotal)
  const validCoupon = couponResult ? couponResult.code : null
  const couponDiscount = couponResult ? couponResult.discount : 0
  const productDiscount = 0
  const shipping = 0 // Freight included on all dealer kits
  const total = Math.max(0, subtotal - couponDiscount)
  const gstRate = 0.05
  const gstIncluded = Math.round(total - total / (1 + gstRate))

  const paymentMethod: PaymentMethod = payload.paymentMethod || "upi"
  const paymentStatus = paymentMethod === "neft" ? "pending" : "paid"

  // Check if authenticated user
  let userId: string | undefined
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      const session = await verifySessionToken(token)
      if (session) userId = session.userId
    }
  } catch {
    // Guest checkout or error reading cookies
  }

  const cleanAddress: OrderAddress = {
    fullName: address.fullName.trim(),
    email: address.email.trim().toLowerCase(),
    phone: address.phone.replace(/\D/g, "").slice(-10),
    line1: address.line1.trim(),
    line2: address.line2?.trim() || undefined,
    city: address.city.trim(),
    state: address.state,
    pincode: address.pincode.trim(),
    gstin: address.gstin.trim().toUpperCase(),
    notes: address.notes?.trim() || undefined,
  }

  const order: StoredOrder & { userId?: string } = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    status: "confirmed",
    paymentMethod,
    paymentStatus,
    items: verifiedLines,
    subtotal,
    productDiscount,
    couponDiscount,
    coupon: validCoupon,
    shipping,
    codFee: 0,
    total,
    gstIncluded,
    address: cleanAddress,
    deliveryEstimate: deliveryEstimate(cleanAddress.state),
    userId,
  }

  // Persist order on server
  await updateJsonArray<StoredOrder & { userId?: string }>("orders.json", (orders) => [
    order,
    ...orders,
  ].slice(0, 5000))

  return NextResponse.json({ ok: true, order }, { status: 201 })
}
