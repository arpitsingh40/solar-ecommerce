"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronRight,
  Info,
  Lock,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Product, ProductVariant } from "@/types/product"
import { formatINR } from "@/lib/india"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface ProductCtoConfiguratorProps {
  product: Product
  initialIsDealer?: boolean
}

export function ProductCtoConfigurator({
  product,
  initialIsDealer = false,
}: ProductCtoConfiguratorProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()
  const isDealer = Boolean(user) || initialIsDealer

  // Extract kW capacity from product SKU or name (e.g. LK-03 is 3kW, LK-05 is 5kW)
  const kwMatch = product.name.match(/(\d+)\s*k[wW]/i) || product.sku.match(/LK-0*(\d+)/i)
  const capacityKw = kwMatch ? parseInt(kwMatch[1] ?? "3", 10) : 3

  // CTO Option states
  const [moduleTech, setModuleTech] = React.useState<"standard" | "topcon">("standard")
  const [structureType, setStructureType] = React.useState<"standard" | "pergola">("standard")
  const [wiringType, setWiringType] = React.useState<"standard" | "zero_crimp">("standard")

  // Tiered upgrade pricing based on kW capacity
  const topconUpgradeCost = capacityKw <= 3 ? 8_500 : capacityKw <= 10 ? 14_000 : 28_000
  const pergolaUpgradeCost = capacityKw <= 3 ? 12_000 : capacityKw <= 10 ? 18_000 : 35_000
  const zeroCrimpUpgradeCost = 3_500

  // Total CTO add-on amount
  const ctoAddonTotal =
    (moduleTech === "topcon" ? topconUpgradeCost : 0) +
    (structureType === "pergola" ? pergolaUpgradeCost : 0) +
    (wiringType === "zero_crimp" ? zeroCrimpUpgradeCost : 0)

  // Base pricing
  const baseTurnkey = product.basePrice
  const baseDealer = product.salePrice ?? Math.round(product.basePrice * 0.65)
  const subsidyAmount = product.subsidy ?? 0

  // Configured pricing
  const configuredTurnkey = baseTurnkey + Math.round(ctoAddonTotal * 1.35)
  const configuredDealer = baseDealer + ctoAddonTotal
  const configuredMargin = Math.max(0, configuredTurnkey - configuredDealer)
  const netHomeowner = Math.max(0, configuredTurnkey - subsidyAmount)

  const handleAddToCart = () => {
    // Build a CTO variant representation
    const ctoVariant: ProductVariant = {
      id: `cto-${moduleTech}-${structureType}-${wiringType}`,
      sku: `${product.sku}-CTO`,
      price: configuredTurnkey,
      salePrice: configuredDealer,
      stock: product.stock,
      images: product.images,
      attributes: [
        {
          name: "Module Technology",
          value: moduleTech === "topcon" ? "N-Type TOPCon Bifacial (+7% yield)" : "Mono PERC 545W (Included)",
        },
        {
          name: "Mounting Structure",
          value: structureType === "pergola" ? "Elevated Pergola (+Terrace Space)" : "Standard Flat GI (Included)",
        },
        {
          name: "Wiring Harness",
          value: wiringType === "zero_crimp" ? "Zero-Crimping Factory Loom (4-Hr)" : "Standard Wiring Kit",
        },
      ],
    }

    addItem(product, ctoVariant, 1)
  }

  const handleOrderNow = () => {
    handleAddToCart()
    router.push("/checkout")
  }

  return (
    <div className="space-y-6">
      {/* Configure-to-Order (CTO) Hardware Upgrades */}
      <div className="rounded-2xl border border-apple-gray-200 bg-white p-5 shadow-apple-xs dark:border-apple-gray-800 dark:bg-apple-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-apple-blue-600" />
            <h3 className="font-semibold text-apple-gray-900 dark:text-white">
              Configure-to-Order (CTO) Upgrades
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Factory Pre-Engineered
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Select factory upgrades to optimize installation time, summer generation, and terrace utility.
        </p>

        {/* Upgrade 1: Module Tech */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray-500">
            1. Module Technology
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setModuleTech("standard")}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                moduleTech === "standard"
                  ? "border-apple-blue-600 bg-apple-blue-50/40 ring-1 ring-apple-blue-600 dark:bg-apple-blue-950/20"
                  : "border-apple-gray-200 hover:border-apple-gray-300 dark:border-apple-gray-700"
              )}
            >
              <div className="flex w-full items-center justify-between text-xs font-medium">
                <span>Mono PERC 545W</span>
                <span className="text-muted-foreground">Included</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Tier-1 DCR ALMM Mono-crystalline modules
              </p>
            </button>

            <button
              type="button"
              onClick={() => setModuleTech("topcon")}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                moduleTech === "topcon"
                  ? "border-apple-blue-600 bg-apple-blue-50/40 ring-1 ring-apple-blue-600 dark:bg-apple-blue-950/20"
                  : "border-apple-gray-200 hover:border-apple-gray-300 dark:border-apple-gray-700"
              )}
            >
              <div className="flex w-full items-center justify-between text-xs font-medium">
                <span className="font-semibold text-apple-blue-700 dark:text-apple-blue-400">
                  N-Type TOPCon Bifacial
                </span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  +{formatINR(topconUpgradeCost)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                +7% higher generation in North Indian peak summer heat
              </p>
            </button>
          </div>
        </div>

        {/* Upgrade 2: Terrace Mounting Structure */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray-500">
            2. Terrace Mounting Structure
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setStructureType("standard")}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                structureType === "standard"
                  ? "border-apple-blue-600 bg-apple-blue-50/40 ring-1 ring-apple-blue-600 dark:bg-apple-blue-950/20"
                  : "border-apple-gray-200 hover:border-apple-gray-300 dark:border-apple-gray-700"
              )}
            >
              <div className="flex w-full items-center justify-between text-xs font-medium">
                <span>Standard Flat RCC GI</span>
                <span className="text-muted-foreground">Included</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Hot-dip galvanized structure with pre-drilled brackets
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStructureType("pergola")}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                structureType === "pergola"
                  ? "border-apple-blue-600 bg-apple-blue-50/40 ring-1 ring-apple-blue-600 dark:bg-apple-blue-950/20"
                  : "border-apple-gray-200 hover:border-apple-gray-300 dark:border-apple-gray-700"
              )}
            >
              <div className="flex w-full items-center justify-between text-xs font-medium">
                <span className="font-semibold text-apple-blue-700 dark:text-apple-blue-400">
                  Elevated Pergola Mount
                </span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  +{formatINR(pergolaUpgradeCost)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Elevated 8ft clearance preserves usable rooftop leisure space
              </p>
            </button>
          </div>
        </div>

        {/* Upgrade 3: Wiring & ACDB/DCDB */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray-500">
            3. Wiring &amp; Electrical Harness
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setWiringType("standard")}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                wiringType === "standard"
                  ? "border-apple-blue-600 bg-apple-blue-50/40 ring-1 ring-apple-blue-600 dark:bg-apple-blue-950/20"
                  : "border-apple-gray-200 hover:border-apple-gray-300 dark:border-apple-gray-700"
              )}
            >
              <div className="flex w-full items-center justify-between text-xs font-medium">
                <span>Standard Cable Kit</span>
                <span className="text-muted-foreground">Included</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Loose DC/AC cables requiring field cutting and crimping
              </p>
            </button>

            <button
              type="button"
              onClick={() => setWiringType("zero_crimp")}
              className={cn(
                "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                wiringType === "zero_crimp"
                  ? "border-apple-blue-600 bg-apple-blue-50/40 ring-1 ring-apple-blue-600 dark:bg-apple-blue-950/20"
                  : "border-apple-gray-200 hover:border-apple-gray-300 dark:border-apple-gray-700"
              )}
            >
              <div className="flex w-full items-center justify-between text-xs font-medium">
                <span className="font-semibold text-apple-blue-700 dark:text-apple-blue-400">
                  Zero-Crimping Loom
                </span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  +{formatINR(zeroCrimpUpgradeCost)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Pre-crimped MC4 harnesses + pre-wired ACDB/DCDB (4-hour install)
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Surface: Dealer Pro vs Showroom Mode */}
      <div className="rounded-2xl border border-apple-gray-200 p-5 dark:border-apple-gray-800">
        {isDealer ? (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-blue-600">
                Dealer Pro Wholesale Price
              </p>
              <Badge variant="outline" className="border-apple-blue-300 bg-apple-blue-50 text-apple-blue-700">
                65% Wholesale Kit
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-semibold tracking-tight text-apple-gray-900 dark:text-white">
                {formatINR(configuredDealer)}
              </span>
              <span className="text-sm text-muted-foreground">Incl. 5% GST &amp; Freight</span>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-apple-gray-50 p-4 text-sm dark:bg-apple-gray-900">
              <div className="flex items-center justify-between gap-3">
                <span className="text-apple-gray-600 dark:text-apple-gray-400">
                  Homeowner turnkey quote
                </span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  {formatINR(configuredTurnkey)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-apple-gray-600 dark:text-apple-gray-400">
                  Dealer retained margin
                </span>
                <span className="font-semibold text-apple-green-700 dark:text-apple-green-400">
                  {formatINR(configuredMargin)}
                </span>
              </div>
              {ctoAddonTotal > 0 && (
                <div className="flex items-center justify-between gap-3 border-t border-apple-gray-200 pt-2 text-xs text-muted-foreground dark:border-apple-gray-800">
                  <span>CTO Hardware Upgrades included:</span>
                  <span className="font-medium text-apple-gray-900 dark:text-white">
                    +{formatINR(ctoAddonTotal)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add configured kit to order
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handleOrderNow}>
                Order kit now
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Homeowner Turnkey Installed Quote
              </p>
              <Badge variant="outline" className="text-xs text-apple-green-700 border-apple-green-300 bg-apple-green-50">
                PM Surya Ghar Eligible
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-semibold tracking-tight text-apple-gray-900 dark:text-white">
                {formatINR(configuredTurnkey)}
              </span>
              <span className="text-sm text-muted-foreground">Turnkey Installed</span>
            </div>

            <div className="mt-4 rounded-xl border border-apple-green-200 bg-apple-green-50 p-4 dark:border-apple-green-900 dark:bg-apple-green-950/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-apple-green-900 dark:text-apple-green-300">
                  Central + UP State Subsidy:
                </span>
                <span className="font-bold text-apple-green-700 dark:text-apple-green-400">
                  -{formatINR(subsidyAmount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-apple-green-200/80 pt-2 text-base font-semibold">
                <span className="text-apple-green-900 dark:text-white">
                  Estimated Net Homeowner Cost:
                </span>
                <span className="text-apple-green-800 dark:text-apple-green-300">
                  {formatINR(netHomeowner)}
                </span>
              </div>
            </div>

            {/* Dealer sign in CTA */}
            <div className="mt-4 rounded-xl border border-dashed border-apple-gray-300 p-4 text-center dark:border-apple-gray-700">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-apple-gray-900 dark:text-white">
                <Lock className="h-3.5 w-3.5 text-apple-blue-600" />
                Installer / Dealer Wholesale Access
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign in with your verified GSTIN to unlock 65% kit prices and 35% margin.
              </p>
              <Button size="sm" variant="outline" className="mt-3 w-full text-xs" asChild>
                <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(`/products/${product.slug}`)}`}>
                  Sign in as Dealer
                </Link>
              </Button>
            </div>

            {/* Homeowner free survey CTA */}
            <Button size="lg" className="mt-3 w-full" asChild>
              <Link href={`/contact?topic=Installation&orderId=${product.sku}`}>
                <Phone className="mr-2 h-4 w-4" /> Book Free Rooftop Survey in UP
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
