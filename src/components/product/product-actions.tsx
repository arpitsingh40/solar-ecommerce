"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Minus, Plus, ShoppingCart, Truck, Check, Phone } from "lucide-react"
import type { Product } from "@/types/product"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { INDIA, isValidPincode } from "@/lib/india"
import { cn } from "@/lib/utils"

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = React.useState(1)
  const [pincode, setPincode] = React.useState("")
  const [delivery, setDelivery] = React.useState<{ ok: boolean; message: string } | null>(null)
  const wishlisted = isInWishlist(product.id)
  const maxQuantity = Math.max(1, Math.min(product.stock || 1, 10))

  const changeQuantity = (delta: number) => {
    setQuantity((current) => Math.min(maxQuantity, Math.max(1, current + delta)))
  }

  const handleAdd = () => {
    addItem(product, undefined, quantity)
  }

  const handleBuyNow = () => {
    addItem(product, undefined, quantity)
    router.push("/checkout")
  }

  const checkPincode = (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValidPincode(pincode)) {
      setDelivery({ ok: false, message: "Enter a valid 6-digit Indian pincode." })
      return
    }
    setDelivery({
      ok: true,
      message: `Deliverable in ${INDIA.deliveryWindow}. Freight included and GST invoice issued with every dealer kit.`,
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-apple-gray-300 dark:border-apple-gray-700">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => changeQuantity(-1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => changeQuantity(1)}
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {product.stock === 0 ? (
            <span className="font-medium text-apple-red-600">Out of stock</span>
          ) : product.stock <= product.lowStockThreshold ? (
            <span className="font-medium text-apple-orange-600">Only {product.stock} left in stock</span>
          ) : (
            <span className="font-medium text-apple-green-600">In stock</span>
          )}
          <span className="mx-2 text-apple-gray-300">·</span>
          Ships from Lucknow
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" onClick={handleAdd} disabled={product.stock === 0}>
          <ShoppingCart className="h-5 w-5" />
          Add kit to order
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={product.stock === 0}
        >
          Order kit now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn("px-4", wishlisted && "text-apple-red-500")}
          onClick={() => toggleItem(product)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from saved kits" : "Save this kit"}
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
        </Button>
      </div>

      <div className="rounded-xl border border-apple-gray-200 p-4 dark:border-apple-gray-800">
        <div className="flex items-center gap-2 text-sm font-medium text-apple-gray-900 dark:text-white">
          <Truck className="h-4 w-4" />
          Check delivery to your pincode
        </div>
        <form onSubmit={checkPincode} className="mt-3 flex gap-2">
          <Input
            value={pincode}
            onChange={(event) => {
              setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))
              setDelivery(null)
            }}
            inputMode="numeric"
            placeholder="6-digit pincode"
            aria-label="Delivery pincode"
            maxLength={6}
            className="max-w-[200px]"
          />
          <Button type="submit" variant="outline">
            Check
          </Button>
        </form>
        {delivery && (
          <p
            className={cn(
              "mt-3 flex items-start gap-2 text-xs",
              delivery.ok ? "text-apple-green-700 dark:text-apple-green-400" : "text-apple-red-600"
            )}
          >
            {delivery.ok && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            {delivery.message}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Freight included on every kit. Returns accepted within 7 days on unopened kits.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" />
        Need help with a kit or dealer pricing?{" "}
        <a href={INDIA.supportPhoneHref} className="font-medium text-apple-blue-600 hover:underline">
          {INDIA.supportPhone}
        </a>
      </div>
    </div>
  )
}
