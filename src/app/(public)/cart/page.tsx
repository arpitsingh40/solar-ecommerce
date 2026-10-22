"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { GST_LABEL, calculateCartTotals } from "@/lib/commerce"
import { INDIA, formatINR, gstIncluded } from "@/lib/india"
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
  Landmark,
  Tag,
} from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const items = useCart((state) => state.items)
  const coupon = useCart((state) => state.coupon)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const removeItem = useCart((state) => state.removeItem)
  const clearCart = useCart((state) => state.clearCart)
  const setCoupon = useCart((state) => state.setCoupon)
  const validCoupon = coupon?.toUpperCase() === "DEALER5K" ? coupon : null
  const [couponInput, setCouponInput] = React.useState("")
  const [couponError, setCouponError] = React.useState("")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const totals = calculateCartTotals(items, validCoupon)
  const gst = gstIncluded(totals.total)

  const applyCoupon = (event: React.FormEvent) => {
    event.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (code === "DEALER5K") {
      if (totals.subtotal < 1_00_000) {
        setCouponError("DEALER5K is valid on dealer orders above ₹1,00,000.")
        return
      }
      setCoupon(code)
      setCouponError("")
      setCouponInput("")
      return
    }
    setCouponError("That code is not valid. Try DEALER5K.")
  }

  if (!mounted) {
    return (
      <div className="container-apple section-space-sm">
        <div className="h-8 w-48 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-64 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
          <div className="h-72 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-apple section-space-sm">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
            <ShoppingBag className="h-7 w-7 text-apple-gray-500" />
          </div>
          <h1 className="mt-6 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Your kit order is empty
          </h1>
          <p className="mt-3 text-body-md text-muted-foreground">
            Browse complete rooftop kits with 65% dealer pricing and freight included.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/products">Browse dealer kits</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/project-builder">Build a dealer quote</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-apple section-space-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Your dealer order
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "kit" : "kits"} · Dealer prices include 5% GST
          </p>
        </div>
        <button
          onClick={clearCart}
          className="self-start text-sm text-muted-foreground underline underline-offset-4 hover:text-apple-red-600"
        >
          Clear order
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-apple-green-50 px-4 py-3 text-sm text-apple-green-800 dark:bg-apple-green-900/20 dark:text-apple-green-300">
        <Truck className="h-4 w-4" />
        Freight included on every dealer kit · dispatched from Lucknow.
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => {
            const product = item.product
            const unitPrice = item.variant?.salePrice ?? item.variant?.price ?? product.salePrice ?? product.basePrice
            const lineTotal = unitPrice * item.quantity
            const maxQuantity = Math.max(1, Math.min(product.stock || 10, 10))

            return (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-apple-gray-100 dark:bg-apple-gray-800 sm:h-28 sm:w-28"
                  >
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {product.brand?.name}
                          </p>
                          <Link
                            href={`/products/${product.slug}`}
                            className="mt-1 block font-semibold text-apple-gray-900 hover:text-apple-blue-600 dark:text-white"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {product.shortDescription}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 rounded-full p-2 text-apple-gray-400 hover:bg-apple-gray-50 hover:text-apple-red-600 dark:hover:bg-apple-gray-800"
                          aria-label={`Remove ${product.name} from your order`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-apple-gray-300 dark:border-apple-gray-700">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-7 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= maxQuantity}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-apple-gray-900 dark:text-white">
                          {formatINR(lineTotal)}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatINR(unitPrice)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}

          <div className="flex items-center justify-between border-t border-apple-gray-200 pt-4 dark:border-apple-gray-800">
            <Button asChild variant="ghost">
              <Link href="/products">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Continue to catalogue
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">Freight included · GST invoice at checkout</p>
          </div>
        </div>

        <div>
          <Card className="sticky top-28">
            <CardContent className="space-y-5 p-6">
              <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
                Order summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatINR(totals.subtotal)}</span>
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
                    <span>Dealer credit {coupon}</span>
                    <span>−{formatINR(totals.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freight</span>
                  <span className="font-medium">
                    {totals.shipping === 0 ? "Included" : formatINR(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-apple-gray-200 pt-3 text-base dark:border-apple-gray-800">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatINR(totals.total)}</span>
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  Includes {formatINR(gst)} GST ({GST_LABEL})
                </p>
              </div>

              <form onSubmit={applyCoupon} className="space-y-2">
                <label htmlFor="coupon" className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" /> Dealer credit code
                </label>
                {validCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-apple-green-50 px-3 py-2 text-sm dark:bg-apple-green-900/20">
                    <span className="font-medium text-apple-green-800 dark:text-apple-green-300">
                      Dealer credit {validCoupon} applied
                    </span>
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={() => setCoupon(null)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      value={couponInput}
                      onChange={(event) => {
                        setCouponInput(event.target.value)
                        setCouponError("")
                      }}
                      placeholder="DEALER5K"
                      className="uppercase"
                    />
                    <Button type="submit" variant="outline">
                      Apply
                    </Button>
                  </div>
                )}
                {couponError && <p className="text-xs text-apple-red-600">{couponError}</p>}
                {!validCoupon && (
                  <p className="text-xs text-muted-foreground">
                    Launch credit: ₹5,000 off dealer orders above ₹1,00,000 with{" "}
                    <span className="font-medium">DEALER5K</span>.
                  </p>
                )}
              </form>

              <Button size="lg" className="w-full" onClick={() => router.push("/checkout")}>
                Review dealer order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure dealer checkout · UPI, cards, net banking, NEFT
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5" /> Dispatch in 1–2 business days
                </p>
                <p className="flex items-center gap-2">
                  <Landmark className="h-3.5 w-3.5" /> GST invoice included
                </p>
              </div>

              <Badge variant="outline" className="w-full justify-center py-2 text-[11px] font-normal">
                Need help? Call {INDIA.supportPhone}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
