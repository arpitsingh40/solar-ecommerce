"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"
import { useWishlist } from "@/hooks/use-wishlist"
import { productById } from "@/lib/data/catalog"
import { Heart, ArrowRight, Trash2 } from "lucide-react"

export default function WishlistPage() {
  const items = useWishlist((state) => state.items)
  const clearWishlist = useWishlist((state) => state.clearWishlist)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const products = items
    .map((id) => productById.get(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))

  if (!mounted) {
    return (
      <div className="container-apple section-space-sm">
        <div className="h-8 w-48 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[460px] animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container-apple section-space-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Saved kits
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "saved kit" : "saved kits"} · Dealer prices
            include 5% GST
          </p>
        </div>
        {products.length > 0 && (
          <button
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground underline underline-offset-4 hover:text-apple-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear saved kits
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mx-auto mt-16 max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
            <Heart className="h-7 w-7 text-apple-gray-500" />
          </div>
          <h2 className="mt-6 text-headline-xl font-display font-semibold text-apple-gray-900 dark:text-white">
            No saved kits yet
          </h2>
          <p className="mt-3 text-body-md text-muted-foreground">
            Tap the heart on any kit to keep it here for your next dealer quote. Saved kits stay on
            this device.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link href="/products">
              Browse dealer kits <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isInWishlist />
          ))}
        </div>
      )}
    </div>
  )
}
