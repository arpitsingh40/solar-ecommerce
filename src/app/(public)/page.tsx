import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product/product-card"
import {
  Sun,
  Zap,
  Shield,
  Truck,
  ArrowRight,
  CheckCircle,
  Star,
  BadgeIndianRupee,
  Landmark,
  MapPin,
  Package,
} from "lucide-react"
import { formatINR } from "@/lib/india"
import { categories, productBySlug } from "@/lib/data/catalog"
import type { Product } from "@/types/product"

const categoryImages: Record<string, string> = {
  "on-grid": "/images/solar/kits/lk-03.jpg",
  hybrid: "/images/solar/kits/lk-04.jpg",
  commercial: "/images/solar/kits/lk-09.jpg",
}

const featuredSlugs = [
  "3kw-on-grid-solar-kit",
  "5kw-on-grid-solar-kit",
  "3kw-hybrid-solar-kit",
  "10kw-three-phase-solar-kit",
]

const featuredProducts = featuredSlugs
  .map((slug) => productBySlug.get(slug))
  .filter((product): product is Product => Boolean(product))

const features = [
  {
    icon: BadgeIndianRupee,
    title: "65% dealer pricing",
    description:
      "Your kit price is fixed at 65% of the turnkey quote. The remaining 35% stays with you for labour, installation and profit.",
  },
  {
    icon: Landmark,
    title: "UP subsidy paperwork",
    description:
      "We supply the invoice, serial numbers and documentation for PM Surya Ghar plus the ₹30,000 Uttar Pradesh top-up.",
  },
  {
    icon: Truck,
    title: "One freight cost",
    description:
      "Modules, inverter, structure and BOS arrive together on one LR. No chasing five suppliers for a single rooftop.",
  },
  {
    icon: Shield,
    title: "Bankable warranties",
    description:
      "ALMM modules, BIS-certified inverters and a 10-year structure warranty, backed by local service support.",
  },
]

const stats = [
  { value: "10", label: "standard kit SKUs" },
  { value: "1–50 kW", label: "residential to industrial" },
  { value: "35%", label: "dealer margin built in" },
  { value: "7–21", label: "working days dispatch" },
]

const steps = [
  {
    number: "01",
    title: "Pick the kit",
    description:
      "Choose a standard 1–50 kW on-grid, hybrid or commercial kit. Every unit ships complete with modules, inverter, structure and BOS.",
  },
  {
    number: "02",
    title: "Quote the homeowner",
    description:
      "Use the turnkey price and UP subsidy benchmark to show the homeowner their net cost, monthly saving and payback.",
  },
  {
    number: "03",
    title: "Install and claim",
    description:
      "Your team installs and commissions the kit. The homeowner gets the ₹1.08 lakh UP subsidy; you keep the dealer margin.",
  },
]

const testimonials = [
  {
    quote:
      "The 3 kW kit is our default quote in Gomti Nagar. The homeowner sees a net cost of about ₹64,000 after the ₹1.08 lakh UP subsidy, and we keep ₹60,000 for installation and profit.",
    name: "Rohit Srivastava",
    location: "Lucknow, Uttar Pradesh",
    system: "Dealer · 3 kW on-grid",
    rating: 5,
  },
  {
    quote:
      "Hybrid kits are moving in Mahanagar because outages still matter. The inverter, battery and BOS arrive matched, so my electrician is not chasing missing parts on installation day.",
    name: "Neeraj Verma",
    location: "Kanpur, Uttar Pradesh",
    system: "Dealer · 3 kW hybrid",
    rating: 5,
  },
  {
    quote:
      "We ordered a 25 kW kit for a warehouse in Transport Nagar. One GST invoice, one freight cost, no running around for structures and cables. The margin was clear before we quoted.",
    name: "Anand Gupta",
    location: "Lucknow, Uttar Pradesh",
    system: "Dealer · 25 kW commercial",
    rating: 5,
  },
]

const trustIndicators = [
  { icon: BadgeIndianRupee, title: "65% kit pricing", desc: "35% left for the dealer" },
  { icon: Landmark, title: "₹1.08L UP subsidy", desc: "Central + state support" },
  { icon: Package, title: "Complete kits", desc: "Modules, inverter, structure, BOS" },
  { icon: Truck, title: "Freight included", desc: "One coordinated dispatch" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white dark:bg-apple-gray-950">
      {/* Hero */}
      <section className="bg-white dark:bg-apple-gray-950">
        <div className="container-apple pt-16 pb-10 text-center lg:pt-24 lg:pb-14">
          <Badge variant="solar" className="mb-6 inline-flex items-center gap-2">
            <Sun className="h-3 w-3" />
            Dealer kit pricing · 65% of turnkey
          </Badge>
          <h1 className="mx-auto max-w-4xl text-display-4xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Rooftop solar kits, built for dealers.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-xl leading-relaxed text-apple-gray-600 dark:text-apple-gray-400">
            Complete 1–50 kW kits with ALMM modules, BIS inverters, structure and BOS. One SKU,
            one freight cost and a clear 35% margin for your team.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="xl" asChild className="group w-full sm:w-auto">
              <Link href="/products">
                Browse dealer kits
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/project-builder">Build a dealer quote</Link>
            </Button>
          </div>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Lucknow dispatch · pan-India freight
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeIndianRupee className="h-3.5 w-3.5" /> Prices include 5% GST
            </span>
          </p>
        </div>

        <div className="container-apple pb-8">
          <div className="relative overflow-hidden rounded-3xl bg-apple-gray-100 dark:bg-apple-gray-900">
            <div className="relative aspect-[16/9] min-h-[340px] w-full sm:aspect-[21/9]">
              <Image
                src="/images/solar/kits/lk-03.jpg"
                alt="3 kW rooftop solar kit installed in Lucknow"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
                <div className="max-w-lg text-white">
                  <p className="text-sm font-medium text-white/70">Best-selling kit in Lucknow</p>
                  <h2 className="mt-1 text-headline-xl font-display font-semibold">
                    3 kW on-grid dealer kit
                  </h2>
                  <p className="mt-2 text-sm text-white/80">
                    Six 545 W modules · 3 kW inverter · structure, cabling and monitoring included
                  </p>
                  <div className="mt-4 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-semibold">{formatINR(1_12_000)}</span>
                    <span className="text-sm text-white/70">dealer kit price</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-apple-gray-900">
                      Dealer keeps {formatINR(60_000)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    Homeowner turnkey {formatINR(1_72_000)} · about {formatINR(64_000)} net after
                    ₹1.08 lakh UP subsidy
                  </p>
                </div>
                <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/products/3kw-on-grid-solar-kit">
                    View the 3 kW kit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component brand strip */}
      <section className="border-y border-apple-gray-100 bg-white py-6 dark:border-apple-gray-800 dark:bg-apple-gray-950">
        <div className="container-apple">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-apple-gray-400">
              Tier-1 components inside every kit
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-apple-gray-500 dark:text-apple-gray-400">
              {["Tata Power Solar", "Adani Solar", "Waaree", "Vikram Solar", "Goldi Solar", "Growatt", "GoodWe", "Polycab"].map(
                (brand) => (
                  <span key={brand}>{brand}</span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-space bg-white dark:bg-apple-gray-950">
        <div className="container-apple">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-medium text-apple-blue-600">Why dealers buy from SolarStore</p>
            <h2 className="mt-2 text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              One kit. One margin. No component chasing.
            </h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              We do not sell loose panels or inverters. Every SKU is a complete, dealer-ready kit
              with the margin and paperwork worked out before it ships.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-apple-gray-900 text-white dark:bg-white dark:text-apple-gray-900">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-space bg-apple-gray-50 dark:bg-apple-gray-900">
        <div className="container-apple">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
                Browse by kit type
              </h2>
              <p className="mt-2 text-body-lg text-muted-foreground">
                Three families, ten standard SKUs, one dealer price structure.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                View all kits <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-800"
              >
                <Image
                  src={categoryImages[category.id] ?? "/images/solar/kits/lk-03.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-headline-lg font-semibold text-white">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/70">
                    {category.productCount} {category.productCount === 1 ? "kit" : "kits"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section-space bg-white dark:bg-apple-gray-950">
        <div className="container-apple">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
                Best-selling dealer kits
              </h2>
              <p className="mt-2 text-body-lg text-muted-foreground">
                The sizes and margins Lucknow dealers are quoting most this month.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products?featured=true">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} priority />
            ))}
          </div>
        </div>
      </section>

      {/* Subsidy steps */}
      <section className="section-space bg-apple-gray-50 dark:bg-apple-gray-900">
        <div className="container-apple">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="outline" className="mb-4 bg-white">
                <Landmark className="mr-1 h-3 w-3" /> Uttar Pradesh · PM Surya Ghar
              </Badge>
              <h2 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
                ₹1.08 lakh back for the homeowner.
              </h2>
              <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">
                Uttar Pradesh stacks ₹78,000 of central assistance with a ₹30,000 state top-up for
                eligible rooftop systems up to 3 kW. On the 3 kW kit, the homeowner pays about
                ₹64,000 net against a ₹1.72 lakh turnkey quote — and the dealer keeps ₹60,000.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/learn/pm-surya-ghar-subsidy">
                    Read the subsidy guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/solar-calculator">Quote a homeowner</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-apple-gray-500">
                Subsidy is paid to the homeowner by MNRE/UPNEDA through the discom. Eligibility,
                sanctioned load and net-metering approvals vary by site.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <Card key={step.number} className="p-6">
                  <div className="flex gap-5">
                    <span className="font-mono text-sm font-semibold text-apple-gray-400">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-apple-gray-900 dark:text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator CTA */}
      <section className="section-space bg-white dark:bg-apple-gray-950">
        <div className="container-apple">
          <div className="overflow-hidden rounded-3xl bg-apple-gray-900 dark:bg-apple-gray-900">
            <div className="grid items-stretch lg:grid-cols-2">
              <div className="p-8 md:p-14 lg:p-16">
                <Badge variant="outline" className="mb-6 border-white/20 bg-white/10 text-white">
                  <Zap className="mr-1 h-3 w-3" />
                  Dealer quote calculator
                </Badge>
                <h2 className="text-display-xl font-display font-bold tracking-tight text-white">
                  Quote the right size in under a minute.
                </h2>
                <p className="mt-4 max-w-lg text-body-lg leading-relaxed text-white/70">
                  Enter the homeowner&apos;s bill, state and roof. Get a system size, UP subsidy
                  benchmark, monthly saving, payback and the matching dealer kit.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  {[
                    "State-wise generation and tariff assumptions",
                    "UP subsidy up to ₹1.08 lakh built into the quote",
                    "Matched 1–50 kW kit you can add to your dealer order",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="xl" variant="secondary" asChild className="mt-8 w-full sm:w-auto">
                  <Link href="/solar-calculator">
                    Start the calculator <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="relative min-h-[320px] lg:min-h-full">
                <Image
                  src="/images/solar/kits/lk-05.jpg"
                  alt="5 kW rooftop solar kit installation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-apple-gray-50 py-14 dark:bg-apple-gray-900">
        <div className="container-apple grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-display-2xl font-display font-bold text-apple-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-space bg-white dark:bg-apple-gray-950">
        <div className="container-apple">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              Built for the dealer&apos;s side of the roof.
            </h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              One kit, one margin, one team accountable for the installation.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-apple-gray-900 text-apple-gray-900 dark:fill-white dark:text-white" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-apple-gray-700 dark:text-apple-gray-300">
                  “{testimonial.quote}”
                </blockquote>
                <div className="mt-5 border-t border-apple-gray-100 pt-4 dark:border-apple-gray-800">
                  <p className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {testimonial.location} · {testimonial.system}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="border-t border-apple-gray-100 bg-white py-12 dark:border-apple-gray-800 dark:bg-apple-gray-950">
        <div className="container-apple grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustIndicators.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
                <item.icon className="h-5 w-5 text-apple-gray-700 dark:text-apple-gray-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-apple-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
