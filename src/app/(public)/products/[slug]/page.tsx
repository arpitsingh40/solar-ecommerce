import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ChevronRight,
  Star,
  ShieldCheck,
  BadgeIndianRupee,
  Truck,
  RotateCcw,
  Landmark,
  CheckCircle,
  Package,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductCtoConfigurator } from "@/components/product/product-cto-configurator"
import { ProductCard } from "@/components/product/product-card"
import { SpecsTable } from "@/components/product/specs-table"
import { productBySlug, products, getRelatedProducts } from "@/lib/data/catalog"
import { formatINR, gstIncluded, INDIA } from "@/lib/india"
import { getCurrentUser } from "@/lib/auth/server"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = productBySlug.get(slug)
  if (!product) return { title: "Kit not found" }

  return {
    title: product.name,
    description: `${product.shortDescription}. Dealer kit price ${formatINR(product.salePrice ?? product.basePrice)}, including GST, freight and complete balance of system. Dispatched from Lucknow.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  }
}

const reviewTemplates = [
  {
    name: "Rohit S.",
    city: "Lucknow, Uttar Pradesh",
    title: "Clear margin, one delivery",
    body:
      "The kit arrived complete with modules, inverter, structure and BOS on one LR. I quoted the homeowner ₹1.72 lakh, paid ₹1.12 lakh for the kit and kept ₹60,000 for installation and profit.",
    date: "12 August 2026",
  },
  {
    name: "Neeraj V.",
    city: "Kanpur, Uttar Pradesh",
    title: "Hybrid kit was plug-and-play",
    body:
      "Everything was matched, including the battery and hybrid inverter. My electrician did not have to chase missing cables or connectors. The UP subsidy documents were ready for the homeowner.",
    date: "28 July 2026",
  },
  {
    name: "Anand G.",
    city: "Lucknow, Uttar Pradesh",
    title: "Good for commercial quotes",
    body:
      "We ordered a 25 kW kit for a Transport Nagar warehouse. One GST invoice, one freight cost and a clear 35% margin before we quoted the client. Dispatch was on schedule.",
    date: "9 July 2026",
  },
]

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = productBySlug.get(slug)
  if (!product) notFound()

  const user = await getCurrentUser()
  const isDealer = Boolean(user)

  const price = product.salePrice ?? product.basePrice
  const turnkeyPrice = product.basePrice
  const dealerMargin = Math.max(0, turnkeyPrice - price)
  const related = getRelatedProducts(product)
  const rating = product.rating ?? 4.7
  const reviewCount = product.reviewCount ?? 64
  const gst = gstIncluded(price)

  const subsidy = product.subsidy ?? 0
  const homeownerNet = Math.max(0, turnkeyPrice - subsidy)

  const highlights = [
    "Dealer kit price — 65% of the typical turnkey quote",
    "Complete kit: modules, inverter, structure and balance of system",
    "GST invoice with input credit and freight included",
    `Dispatched from Lucknow in ${product.tags.includes("commercial") ? "12–21" : "7–12"} working days`,
    "25-year module performance warranty",
    "Dealer desk support for quotes and subsidy paperwork",
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => image.url),
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand?.name ?? "SolarStore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: INDIA.legalName },
    },
  }

  return (
    <div className="container-apple section-space-sm space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-apple-gray-900">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-apple-gray-900">
          Dealer kits
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-apple-gray-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-[220px] truncate text-apple-gray-900 dark:text-white sm:max-w-md">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={product.images} />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Landmark, label: "UP subsidy help" },
              { icon: BadgeIndianRupee, label: "GST invoice" },
              { icon: Truck, label: "Freight included" },
              { icon: ShieldCheck, label: "Kit warranty" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-lg bg-apple-gray-50 px-3 py-2 text-xs text-apple-gray-600 dark:bg-apple-gray-900 dark:text-apple-gray-400"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && (
              <Link
                href={`/products?brand=${product.brand.id}`}
                className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-500 hover:text-apple-blue-600"
              >
                {product.brand.name}
              </Link>
            )}
            {product.featured && <Badge variant="outline">Best seller</Badge>}
            {product.stock > 0 && product.stock <= product.lowStockThreshold && (
              <Badge variant="outline">Low stock</Badge>
            )}
          </div>

          <h1 className="mt-3 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-medium text-apple-gray-900 dark:text-white">
              <Star className="h-4 w-4 fill-apple-gray-900 text-apple-gray-900 dark:fill-white dark:text-white" />
              {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({reviewCount} dealer reviews)</span>
            <span className="text-apple-gray-300">·</span>
            <span className="text-muted-foreground">SKU {product.sku}</span>
          </div>

          <p className="mt-5 text-body-md leading-relaxed text-apple-gray-600 dark:text-apple-gray-400">
            {product.description}
          </p>

          <div className="mt-7">
            <ProductCtoConfigurator product={product} initialIsDealer={isDealer} />
          </div>

          <ul className="mt-6 space-y-2.5">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-apple-green-600" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="warranty">Warranty & delivery</TabsTrigger>
          <TabsTrigger value="reviews">Dealer reviews ({reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 text-body-md leading-relaxed text-apple-gray-600 dark:text-apple-gray-400">
              <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
                About the {product.name}
              </h2>
              <p>{product.description}</p>
              <p>
                Every kit is assembled through authorised channels with ALMM-listed modules, a
                BIS-certified inverter and a matched balance of system. Prices include 5% GST and a
                tax invoice is issued for every order. The kit is sold to you at 65% of the typical
                turnkey quote; your margin covers installation, labour and profit.
              </p>
              <p>
                The homeowner applies for PM Surya Ghar and the Uttar Pradesh top-up through the
                national portal. We provide the kit invoice, serial numbers and documentation your
                team needs for net metering and the subsidy claim.
              </p>
            </div>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-semibold text-apple-gray-900 dark:text-white">
                <Package className="h-4 w-4" /> What&apos;s in the box
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>{product.name} × 1</li>
                <li>ALMM modules, inverter, structure and balance of system</li>
                <li>{product.categoryId === "hybrid" ? "LiFePO4 battery and hybrid inverter" : "Net-metering ready grid-tie inverter"}</li>
                <li>Warranty cards and GST invoice</li>
                <li>Installation and commissioning guide</li>
              </ul>
              <h3 className="mt-5 flex items-center gap-2 font-semibold text-apple-gray-900 dark:text-white">
                <RotateCcw className="h-4 w-4" /> Returns
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                7-day returns on unopened kits in original packaging. Installed modules and
                custom structures are covered by warranty rather than return.
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="pt-6">
          <div className="max-w-4xl">
            <SpecsTable specs={product.specs} />
          </div>
        </TabsContent>

        <TabsContent value="warranty" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-apple-gray-900 dark:text-white">Warranty</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Kit warranty terms are listed in the specifications tab. Modules carry a 25-year
                performance warranty; inverters typically carry 5 years; the structure carries 10
                years and hybrid batteries carry 10 years. Keep your GST invoice and serial numbers
                for claims.
              </p>
              <Link href="/warranty" className="mt-3 inline-block text-sm font-medium text-apple-blue-600 hover:underline">
                How to make a warranty claim
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-apple-gray-900 dark:text-white">Delivery</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Kits are dispatched from Lucknow within 1–2 business days after payment. Delivery
                typically takes {INDIA.deliveryWindow} depending on your state. Freight is included;
                large kits travel by surface transport and need someone to receive them at the site.
              </p>
              <Link href="/shipping" className="mt-3 inline-block text-sm font-medium text-apple-blue-600 hover:underline">
                Read the shipping policy
              </Link>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="h-fit p-6 text-center">
              <p className="text-display-xl font-display font-bold text-apple-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < Math.round(rating)
                        ? "h-4 w-4 fill-apple-gray-900 text-apple-gray-900 dark:fill-white dark:text-white"
                        : "h-4 w-4 text-apple-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Based on {reviewCount} verified dealer reviews</p>
            </Card>
            <div className="space-y-4">
              {reviewTemplates.map((review) => (
                <Card key={review.name} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-apple-gray-900 dark:text-white">{review.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {review.name} · {review.city}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-apple-gray-900 text-apple-gray-900 dark:fill-white dark:text-white" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-apple-gray-600 dark:text-apple-gray-400">
                    {review.body}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">{review.date} · Verified dealer order</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-headline-xl font-display font-semibold text-apple-gray-900 dark:text-white">
                Other dealer kits
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare sizes, turnkey prices and dealer margins across the range.
              </p>
            </div>
            <Link href="/products" className="text-sm font-medium text-apple-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
