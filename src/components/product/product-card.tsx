"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/india"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Heart, Search } from "lucide-react"
import type { Product } from "@/types/product"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

interface ProductCardProps {
  product: Product
  variant?: "default" | "compact" | "featured"
  showQuickView?: boolean
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
  priority?: boolean
}

export function ProductCard({
  product,
  variant = "default",
  showQuickView = true,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleItem, isInWishlist: checkWishlist } = useWishlist()
  const wishlisted = isInWishlist || checkWishlist(product.id)
  const dealerPrice = product.salePrice ?? product.basePrice
  const dealerMargin = Math.max(0, product.basePrice - dealerPrice)

  const handleAddToCart = onAddToCart ?? ((item: Product) => addItem(item))
  const handleToggleWishlist = onToggleWishlist ?? ((item: Product) => toggleItem(item))
  const formatPrice = (price: number) => formatINR(price)

  if (variant === "compact") {
    return (
      <Link href={`/products/${product.slug}`} className="group flex gap-4 p-2 rounded-lg hover:bg-apple-gray-50 dark:hover:bg-apple-gray-800 transition-colors">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-apple-gray-100 dark:bg-apple-gray-800">
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="80px"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-apple-gray-900 dark:text-white line-clamp-1 group-hover:text-apple-blue-600 dark:group-hover:text-apple-blue-400 transition-colors">
              {product.name}
            </p>
            <p className="text-sm font-semibold text-apple-blue-600 dark:text-apple-blue-400">
              {formatPrice(dealerPrice)}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Card className="card-hover group flex flex-col h-full">
      <div className="relative aspect-product overflow-hidden rounded-t-xl bg-apple-gray-100 dark:bg-apple-gray-800">
        <Link href={`/products/${product.slug}`} className="relative block h-full" aria-label={`View ${product.name}`}>
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className="flex h-full items-center justify-center text-apple-gray-400">
              <Search className="h-8 w-8" />
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <Badge variant="default" className="bg-apple-gray-900 px-2 py-1 text-xs text-white dark:bg-white dark:text-apple-gray-900">
            B2B kit
          </Badge>
          {product.featured && (
            <Badge variant="outline" className="border-apple-gray-200/80 bg-white/90 px-2 py-1 text-xs text-apple-gray-700 backdrop-blur-sm dark:border-apple-gray-700 dark:bg-apple-gray-900/90 dark:text-apple-gray-200">
              Featured
            </Badge>
          )}
          {product.status === "low-stock" && (
            <Badge variant="outline" className="border-apple-gray-300 bg-white/90 text-xs px-2 py-1 text-apple-gray-700 backdrop-blur-sm dark:border-apple-gray-600 dark:bg-apple-gray-900/90 dark:text-apple-gray-300">
              Low Stock
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {showQuickView && onQuickView && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 dark:bg-apple-gray-900/90 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onQuickView(product)
              }}
              aria-label={`Quick view ${product.name}`}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("bg-white/90 dark:bg-apple-gray-900/90 backdrop-blur-sm", wishlisted && "text-apple-red-500")}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleWishlist(product)
            }}
            aria-label={wishlisted ? `Remove ${product.name} from saved kits` : `Save ${product.name}`}
            aria-pressed={wishlisted}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
          </Button>
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product.category && (
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {typeof product.category === "string" ? product.category : product.category.name}
              </span>
            )}
            <Link href={`/products/${product.slug}`} className="block group">
              <h3 className="mt-1 text-lg font-semibold text-apple-gray-900 dark:text-white line-clamp-2 group-hover:text-apple-blue-600 dark:group-hover:text-apple-blue-400 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        {product.shortDescription && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Key specs preview */}
        {product.keySpecs && product.keySpecs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.keySpecs.slice(0, 3).map((spec) => (
              <Badge key={spec.key} variant="outline" className="text-xs gap-1">
                <span className="text-muted-foreground">{spec.key}:</span>
                <span>{spec.value}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full border-t border-apple-gray-100 pt-4 dark:border-apple-gray-800">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Dealer kit price
              </p>
              <span className="text-lg font-bold text-apple-gray-900 dark:text-white">
                {formatPrice(dealerPrice)}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">Incl. GST</span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Homeowner turnkey {formatPrice(product.basePrice)}
            {dealerMargin > 0 ? ` · Dealer keeps ${formatPrice(dealerMargin)}` : ""}
          </p>

          <Button
            size="sm"
            className="mt-3 w-full"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAddToCart(product)
            }}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? "Out of stock" : "Add kit to order"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}