"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { calculateCartTotals } from "@/lib/commerce"
import {
  INDIA,
  INDIAN_STATES_AND_UTS,
  deliveryEstimate,
  formatINR,
  gstIncluded,
  isValidGstin,
  isValidIndianPhone,
  isValidPincode,
  isValidUpi,
} from "@/lib/india"
import {
  createOrderId,
  saveOrder,
  toOrderLines,
  type OrderAddress,
  type PaymentMethod,
  type StoredOrder,
} from "@/lib/orders"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  BadgeIndianRupee,
  Banknote,
  Check,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react"

const paymentOptions: Array<{
  id: PaymentMethod
  title: string
  description: string
  icon: React.ElementType
  extra?: string
}> = [
  {
    id: "upi",
    title: "UPI",
    description: "Google Pay, PhonePe, Paytm or any UPI app",
    icon: Smartphone,
  },
  {
    id: "card",
    title: "Credit / debit card",
    description: "RuPay, Visa and Mastercard · 3D Secure",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "Net banking",
    description: "All major Indian banks",
    icon: Landmark,
  },
  {
    id: "neft",
    title: "NEFT / RTGS",
    description: "Dealer bank transfer against a GST invoice",
    icon: Banknote,
    extra: "Proforma invoice",
  },
]

interface CheckoutForm {
  fullName: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  gstin: string
  poReference: string
  notes: string
  upiId: string
}

const emptyForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  gstin: "",
  poReference: "",
  notes: "",
  upiId: "",
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCart((state) => state.items)
  const coupon = useCart((state) => state.coupon)
  const clearCart = useCart((state) => state.clearCart)
  const validCoupon = coupon?.toUpperCase() === "DEALER5K" ? coupon : null
  const { user } = useAuth()
  const [mounted, setMounted] = React.useState(false)
  const [form, setForm] = React.useState<CheckoutForm>(emptyForm)
  const [payment, setPayment] = React.useState<PaymentMethod>("upi")
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [error, setError] = React.useState("")
  const [isPlacing, setIsPlacing] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!user) return
    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      email: current.email || user.email || "",
    }))
  }, [user])

  React.useEffect(() => {
    if (mounted && items.length === 0 && !isPlacing) {
      router.replace("/cart")
    }
  }, [mounted, items.length, isPlacing, router])

  const totals = calculateCartTotals(items, validCoupon)
  const total = totals.total
  const gst = gstIncluded(totals.total - totals.shipping)
  const estimatedDelivery = form.state ? deliveryEstimate(form.state) : INDIA.deliveryWindow

  const update = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError("")
  }

  const validate = (): string | null => {
    if (form.fullName.trim().length < 3) return "Please enter your full name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address."
    if (!isValidIndianPhone(form.phone)) return "Please enter a valid 10-digit Indian mobile number."
    if (form.line1.trim().length < 5) return "Please enter your street address, house or flat number."
    if (form.city.trim().length < 2) return "Please enter your city or town."
    if (!INDIAN_STATES_AND_UTS.includes(form.state as (typeof INDIAN_STATES_AND_UTS)[number]))
      return "Please select your state or union territory."
    if (!isValidPincode(form.pincode)) return "Please enter a valid 6-digit pincode."
    if (!form.gstin.trim()) return "GSTIN is required for a dealer invoice."
    if (!isValidGstin(form.gstin.trim())) return "Please enter a valid 15-character GSTIN."
    if (payment === "upi" && !isValidUpi(form.upiId.trim())) return "Please enter a valid UPI ID, for example name@okhdfcbank."
    if (!termsAccepted) return "Please accept the dealer terms and return policy to place your order."
    return null
  }

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsPlacing(true)
    setError("")

    // Payment gateway simulation. No card or bank credentials are collected
    // or stored by this demo storefront.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const address: OrderAddress = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, "").slice(-10),
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode,
      gstin: form.gstin.trim().toUpperCase(),
      notes:
        [form.poReference.trim() ? `PO: ${form.poReference.trim()}` : "", form.notes.trim()]
          .filter(Boolean)
          .join(" · ") || undefined,
    }

    const order: StoredOrder = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      paymentMethod: payment,
      paymentStatus: payment === "neft" ? "pending" : "paid",
      items: toOrderLines(items),
      subtotal: totals.subtotal,
      productDiscount: totals.productDiscount,
      couponDiscount: totals.couponDiscount,
      coupon: validCoupon,
      shipping: totals.shipping,
      codFee: 0,
      total,
      gstIncluded: gst,
      address,
      deliveryEstimate: estimatedDelivery,
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          paymentMethod: payment,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          coupon: validCoupon,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Failed to place order. Please try again.")
        setIsPlacing(false)
        return
      }

      const data = await res.json()
      const confirmedOrder = data.order || order
      saveOrder(confirmedOrder)
      clearCart()
      router.push(`/order-confirmation?id=${encodeURIComponent(confirmedOrder.id)}`)
    } catch {
      saveOrder(order)
      clearCart()
      router.push(`/order-confirmation?id=${encodeURIComponent(order.id)}`)
    }
  }

  if (!mounted) {
    return (
      <div className="container-apple section-space-sm">
        <div className="h-8 w-40 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div className="space-y-4">
            <div className="h-48 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
            <div className="h-80 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
          </div>
          <div className="h-96 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="container-apple section-space-sm">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-apple-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dealer order
      </Link>

      <div className="mt-4">
        <h1 className="text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Dealer checkout
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dealer pricing · GST invoice · Freight included · Dispatch from Lucknow
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-apple-red-200 bg-apple-red-50 px-4 py-3 text-sm text-apple-red-700 dark:border-apple-red-900 dark:bg-apple-red-950/40 dark:text-apple-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                Dealer contact
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll send the GST invoice and dispatch updates here.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="dealer@company.in"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                    Mobile number
                  </label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 border-apple-gray-300 bg-apple-gray-50 px-3 text-sm text-muted-foreground dark:border-apple-gray-600 dark:bg-apple-gray-800">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={form.phone}
                      onChange={(event) =>
                        update("phone", event.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="98765 43210"
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                Site / delivery address
              </h2>
              <div className="mt-5 grid gap-4">
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                    Contact name
                  </label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(event) => update("fullName", event.target.value)}
                    placeholder="As it should appear on the GST invoice"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="line1" className="mb-1.5 block text-sm font-medium">
                    Flat / house number, building, street
                  </label>
                  <Input
                    id="line1"
                    autoComplete="address-line1"
                    value={form.line1}
                    onChange={(event) => update("line1", event.target.value)}
                    placeholder="Plot / building, street, industrial area"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="line2" className="mb-1.5 block text-sm font-medium">
                    Area, landmark <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="line2"
                    autoComplete="address-line2"
                    value={form.line2}
                    onChange={(event) => update("line2", event.target.value)}
                    placeholder="Near Metro station"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
                      City / town
                    </label>
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(event) => update("city", event.target.value)}
                      placeholder="Lucknow"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="mb-1.5 block text-sm font-medium">
                      State / UT
                    </label>
                    <select
                      id="state"
                      value={form.state}
                      onChange={(event) => update("state", event.target.value)}
                      className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES_AND_UTS.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pincode" className="mb-1.5 block text-sm font-medium">
                      Pincode
                    </label>
                    <Input
                      id="pincode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={form.pincode}
                      onChange={(event) =>
                        update("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="226010"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="gstin" className="mb-1.5 block text-sm font-medium">
                    GSTIN for dealer invoice{" "}
                    <span className="font-normal text-muted-foreground">(required)</span>
                  </label>
                  <Input
                    id="gstin"
                    value={form.gstin}
                    onChange={(event) => update("gstin", event.target.value.toUpperCase().slice(0, 15))}
                    placeholder="09AABCS1429B1ZX"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your GST invoice will be issued against this number for input credit.
                  </p>
                </div>
                <div>
                  <label htmlFor="poReference" className="mb-1.5 block text-sm font-medium">
                    PO / reference number{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="poReference"
                    value={form.poReference}
                    onChange={(event) => update("poReference", event.target.value)}
                    placeholder="Your purchase order or project reference"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                    Dispatch notes{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="Site access, unloading equipment, preferred delivery window or installation date"
                    rows={3}
                  />
                </div>
              </div>
              {form.state && (
                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" /> Estimated kit delivery to {form.state}: {estimatedDelivery}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                Payment method
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                UPI, card, net banking or dealer bank transfer against a GST invoice.
              </p>

              <div className="mt-5 space-y-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                      payment === option.id
                        ? "border-apple-gray-900 bg-apple-gray-50 dark:border-white dark:bg-apple-gray-900"
                        : "border-apple-gray-200 hover:border-apple-gray-400 dark:border-apple-gray-700"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={payment === option.id}
                      onChange={() => {
                        setPayment(option.id)
                        setError("")
                      }}
                      className="mt-1 h-4 w-4 accent-apple-gray-900"
                    />
                    <option.icon className="mt-0.5 h-5 w-5 shrink-0 text-apple-gray-600 dark:text-apple-gray-300" />
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-apple-gray-900 dark:text-white">
                          {option.title}
                        </span>
                        {option.extra && (
                          <span className="text-xs text-muted-foreground">{option.extra}</span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              {payment === "upi" && (
                <div className="mt-4 rounded-xl bg-apple-gray-50 p-4 dark:bg-apple-gray-900">
                  <label htmlFor="upiId" className="mb-1.5 block text-sm font-medium">
                    UPI ID
                  </label>
                  <Input
                    id="upiId"
                    value={form.upiId}
                    onChange={(event) => update("upiId", event.target.value)}
                    placeholder="yourname@okhdfcbank"
                    autoComplete="off"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    You will receive a collect request in your UPI app after placing the order.
                  </p>
                </div>
              )}

              {payment === "card" && (
                <p className="mt-4 rounded-xl bg-apple-gray-50 p-4 text-xs leading-relaxed text-muted-foreground dark:bg-apple-gray-900">
                  You will be redirected to your bank&apos;s 3D Secure page to enter card details.
                  SolarStore does not store card numbers.
                </p>
              )}

              {payment === "netbanking" && (
                <p className="mt-4 rounded-xl bg-apple-gray-50 p-4 text-xs leading-relaxed text-muted-foreground dark:bg-apple-gray-900">
                  You will be redirected to your bank to complete the payment. Net banking is
                  available for all major Indian banks.
                </p>
              )}

              {payment === "neft" && (
                <p className="mt-4 rounded-xl bg-apple-gray-50 p-4 text-xs leading-relaxed text-muted-foreground dark:bg-apple-gray-900">
                  Place the order and our dealer desk will send a proforma invoice with bank details.
                  Your kit is reserved once the transfer is confirmed. Add your PO or reference number
                  in the order notes.
                </p>
              )}
            </CardContent>
          </Card>

          <label className="flex items-start gap-3 text-sm text-apple-gray-600 dark:text-apple-gray-400">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-apple-gray-900"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="underline hover:text-apple-blue-600">
                dealer terms
              </Link>{" "}
              and{" "}
              <Link href="/returns" className="underline hover:text-apple-blue-600">
                return policy
              </Link>
              . I confirm the delivery address, GSTIN and mobile number are correct.
            </span>
          </label>
        </div>

        <div>
          <Card className="sticky top-28">
            <CardContent className="p-6">
              <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                Dealer order summary
              </h2>

              <ul className="mt-4 space-y-3">
                {items.map((item) => {
                  const price =
                    item.variant?.salePrice ??
                    item.variant?.price ??
                    item.product.salePrice ??
                    item.product.basePrice
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-apple-gray-100 dark:bg-apple-gray-800">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-apple-gray-900 text-[10px] font-medium text-white dark:bg-white dark:text-apple-gray-900">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-apple-gray-900 dark:text-white">
                          {item.product.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatINR(price)} each
                        </p>
                      </div>
                      <p className="text-sm font-medium">{formatINR(price * item.quantity)}</p>
                    </li>
                  )
                })}
              </ul>

              <Separator className="my-4" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(totals.subtotal)}</span>
                </div>
                {totals.productDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dealer margin on this order</span>
                    <span className="font-medium text-apple-green-700 dark:text-apple-green-400">
                      {formatINR(totals.productDiscount)}
                    </span>
                  </div>
                )}
                {totals.couponDiscount > 0 && (
                  <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                    <span>Dealer credit {validCoupon}</span>
                    <span>−{formatINR(totals.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freight</span>
                  <span>{totals.shipping === 0 ? "Included" : formatINR(totals.shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-apple-gray-200 pt-3 text-base font-semibold dark:border-apple-gray-800">
                  <span>Total payable</span>
                  <span>{formatINR(total)}</span>
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  Includes {formatINR(gst)} GST
                </p>
              </div>

              <Button type="submit" size="lg" className="mt-5 w-full" disabled={isPlacing}>
                {isPlacing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order…
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Place dealer order · {formatINR(total)}
                  </>
                )}
              </Button>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure 256-bit checkout
                </p>
                <p className="flex items-center gap-2">
                  <BadgeIndianRupee className="h-3.5 w-3.5" /> GST invoice emailed after dispatch
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5" /> {estimatedDelivery}
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> 7-day returns on unopened kits
                </p>
              </div>

              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                Need help? Call {INDIA.supportPhone}
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
