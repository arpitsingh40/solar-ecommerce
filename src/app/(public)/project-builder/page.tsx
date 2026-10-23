"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { productBySlug } from "@/lib/data/catalog"
import {
  INDIA,
  INDIAN_STATES_AND_UTS,
  calculateSubsidyForState,
  formatINR,
  getStateSolarYield,
  getStateTariff,
} from "@/lib/india"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Battery,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  Landmark,
  Leaf,
  MapPin,
  Phone,
  Printer,
  Ruler,
  ShieldCheck,
  Sun,
} from "lucide-react"
import { SplitPayEscrowDialog } from "@/components/project-builder/split-pay-escrow-dialog"

const presets = [
  {
    id: "3-ongrid",
    title: "3 kW on-grid",
    slug: "3kw-on-grid-solar-kit",
    sizeKw: 3,
    panelCount: 6,
    tagline: "2–3 BHK home · best seller",
    highlights: ["6 × 545 W ALMM modules", "3 kW BIS grid-tie inverter", "Dealer margin ₹60,000"],
    residential: true,
    battery: false,
  },
  {
    id: "3-hybrid",
    title: "3 kW hybrid",
    slug: "3kw-hybrid-solar-kit",
    sizeKw: 3,
    panelCount: 6,
    tagline: "Homes with power cuts",
    highlights: ["5.12 kWh LiFePO4 battery", "3 kW hybrid inverter", "Dealer margin ₹86,000"],
    residential: true,
    battery: true,
  },
  {
    id: "5-ongrid",
    title: "5 kW on-grid",
    slug: "5kw-on-grid-solar-kit",
    sizeKw: 5,
    panelCount: 10,
    tagline: "Large homes & villas",
    highlights: ["10 × 545 W ALMM modules", "5 kW BIS grid-tie inverter", "Dealer margin ₹92,000"],
    residential: true,
    battery: false,
  },
  {
    id: "5-hybrid",
    title: "5 kW hybrid",
    slug: "5kw-hybrid-solar-kit",
    sizeKw: 5,
    panelCount: 10,
    tagline: "Luxury homes & home offices",
    highlights: ["10.24 kWh battery storage", "5 kW hybrid inverter", "Dealer margin ₹1,39,000"],
    residential: true,
    battery: true,
  },
  {
    id: "10-commercial",
    title: "10 kW commercial",
    slug: "10kw-three-phase-solar-kit",
    sizeKw: 10,
    panelCount: 18,
    tagline: "Bungalows, shops & offices",
    highlights: ["18 × 575 W TOPCon modules", "10 kW three-phase inverter", "Dealer margin ₹1,72,000"],
    residential: false,
    battery: false,
  },
]

const roofOptions = [
  { value: "flat", label: "Flat concrete (RCC)", factor: 1 },
  { value: "sloped", label: "Sloped concrete", factor: 0.98 },
  { value: "metal", label: "Metal sheet", factor: 0.97 },
  { value: "tiled", label: "Tiled roof", factor: 0.95 },
]

export default function ProjectBuilderPage() {
  const addItem = useCart((state) => state.addItem)
  const [presetId, setPresetId] = React.useState("3-ongrid")
  const [state, setState] = React.useState("Uttar Pradesh")
  const [roofType, setRoofType] = React.useState("flat")
  const [monthlyBill, setMonthlyBill] = React.useState("3000")
  const [added, setAdded] = React.useState(false)
  const [presentationMode, setPresentationMode] = React.useState(false)

  const preset = presets.find((item) => item.id === presetId) ?? presets[0]!
  const product = productBySlug.get(preset.slug)
  const dealerPrice = product ? product.salePrice ?? product.basePrice : 0
  const turnkeyPrice = product?.basePrice ?? dealerPrice
  const dealerMargin = Math.max(0, turnkeyPrice - dealerPrice)
  const subsidy = preset.residential ? calculateSubsidyForState(state, preset.sizeKw) : 0
  const homeownerNet = Math.max(0, turnkeyPrice - subsidy)
  const yieldPerKw =
    getStateSolarYield(state) * (roofOptions.find((item) => item.value === roofType)?.factor ?? 1)
  const annualGeneration = Math.round(preset.sizeKw * yieldPerKw)
  const bill = Math.max(0, Number(monthlyBill) || 0)
  const tariff = getStateTariff(state)
  const annualUnits = tariff > 0 ? (bill / tariff) * 12 : 0
  const annualSavings = Math.round(
    Math.min(annualGeneration, annualUnits > 0 ? annualUnits : annualGeneration) * tariff
  )
  const monthlySavings = Math.round(annualSavings / 12)
  const payback = annualSavings > 0 ? homeownerNet / annualSavings : 0
  const panelCount = preset.panelCount

  React.useEffect(() => setAdded(false), [presetId])

  const addSystem = () => {
    if (!product) return
    addItem(product, undefined, 1)
    setAdded(true)
  }

  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="solar" className="mb-5">
          <Home className="mr-1.5 h-3.5 w-3.5" /> Dealer project builder
        </Badge>
        <h1 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Build a dealer quote.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Pick a standard kit, set the site, and see the homeowner turnkey cost, UP subsidy, your
          65% kit price and margin before you add it to your dealer order.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-400">
                  Step 1
                </p>
                <h2 className="mt-1 text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
                  Choose a kit
                </h2>
              </div>
              <Link
                href="/solar-calculator"
                className="text-sm font-medium text-apple-blue-600 hover:underline"
              >
                Need a custom size?
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {presets.map((option) => {
                const optionProduct = productBySlug.get(option.slug)
                const selected = presetId === option.id
                const optionPrice = optionProduct?.salePrice ?? optionProduct?.basePrice ?? 0
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPresetId(option.id)}
                    className={cn(
                      "overflow-hidden rounded-2xl border text-left transition-colors",
                      selected
                        ? "border-apple-gray-900 ring-1 ring-apple-gray-900 dark:border-white dark:ring-white"
                        : "border-apple-gray-200 hover:border-apple-gray-400 dark:border-apple-gray-700"
                    )}
                    aria-pressed={selected}
                  >
                    <div className="relative h-28 w-full bg-apple-gray-100 dark:bg-apple-gray-800">
                      {optionProduct?.images[0] && (
                        <Image
                          src={optionProduct.images[0].url}
                          alt={option.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 300px"
                        />
                      )}
                      {option.id === "5-ongrid" && (
                        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-apple-gray-900">
                          Best seller
                        </span>
                      )}
                      {!option.residential && (
                        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-apple-gray-900">
                          Commercial
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-apple-gray-900 dark:text-white">
                            {option.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">{option.tagline}</p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold">{formatINR(optionPrice)}</span>
                      </div>
                      <ul className="mt-3 space-y-1">
                        {option.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-apple-green-600" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-400">
              Step 2
            </p>
            <h2 className="mt-1 text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
              Tell us about the site
            </h2>
            <Card className="mt-3">
              <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="builder-state" className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" /> State / UT
                  </label>
                  <select
                    id="builder-state"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-900 dark:text-white"
                  >
                    {INDIAN_STATES_AND_UTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="builder-roof" className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                    <Ruler className="h-4 w-4" /> Roof type
                  </label>
                  <select
                    id="builder-roof"
                    value={roofType}
                    onChange={(event) => setRoofType(event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-900 dark:text-white"
                  >
                    {roofOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="builder-bill" className="mb-1.5 block text-sm font-medium">
                    Homeowner&apos;s average monthly bill (₹){" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="builder-bill"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={100}
                      value={monthlyBill}
                      onChange={(event) => setMonthlyBill(event.target.value)}
                      className="pl-7"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Used to cap the homeowner&apos;s savings at actual consumption. Generation depends
                    on {state} solar yield and roof type.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Sun, title: "Site survey", text: "Free remote review before dispatch" },
              { icon: Landmark, title: "Subsidy help", text: "Documents and net-meter guidance" },
              { icon: Phone, title: "Engineer call", text: INDIA.supportPhone },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-apple-gray-200 p-4 dark:border-apple-gray-800"
              >
                <item.icon className="h-4 w-4 text-apple-gray-500" />
                <p className="mt-2 text-sm font-medium text-apple-gray-900 dark:text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </section>
        </div>

        <div>
          <Card className="sticky top-28">
            <CardContent className="p-0">
              {product?.images[0] && (
                <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-apple-gray-100 dark:bg-apple-gray-800">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-400">
                    {presentationMode ? "Homeowner Turnkey Proposal" : "Your dealer quote"}
                  </p>
                  <Button
                    size="sm"
                    variant={presentationMode ? "default" : "outline"}
                    onClick={() => setPresentationMode(!presentationMode)}
                    className="h-7 text-xs"
                  >
                    {presentationMode ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" /> Dealer Mode
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" /> Hide Margin (Client View)
                      </>
                    )}
                  </Button>
                </div>
                <h2 className="mt-1 text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
                  {product?.name ?? preset.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {preset.sizeKw} kW · {panelCount} modules · {state}
                </p>

                {!presentationMode ? (
                  <div className="mt-5 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dealer kit price</span>
                      <span className="font-semibold">{formatINR(dealerPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Homeowner turnkey</span>
                      <span>{formatINR(turnkeyPrice)}</span>
                    </div>
                    <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                      <span>Your dealer margin</span>
                      <span className="font-semibold">{formatINR(dealerMargin)}</span>
                    </div>
                    <div className="border-t border-apple-gray-200 pt-2.5 dark:border-apple-gray-800">
                      {subsidy > 0 && (
                        <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                          <span>{state === "Uttar Pradesh" ? "UP combined subsidy" : "PM Surya Ghar subsidy"}</span>
                          <span>−{formatINR(subsidy)}</span>
                        </div>
                      )}
                      <div className="mt-2 flex justify-between text-base font-semibold">
                        <span>Homeowner net after subsidy</span>
                        <span>{formatINR(homeownerNet)}</span>
                      </div>
                    </div>
                    <p className="text-right text-[11px] text-muted-foreground">
                      5% GST and freight included · Installation by dealer
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-apple-green-200 bg-apple-green-50/70 p-4 dark:border-apple-green-900/40 dark:bg-apple-green-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-apple-green-800 dark:text-apple-green-300">
                          Turnkey Quote
                        </span>
                        <Badge variant="outline" className="border-apple-green-300 bg-white text-apple-green-800 dark:bg-apple-gray-900">
                          All-Inclusive
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Turnkey Cost</span>
                          <span className="font-semibold">{formatINR(turnkeyPrice)}</span>
                        </div>
                        {subsidy > 0 && (
                          <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                            <span>{state === "Uttar Pradesh" ? "Govt. Subsidy (UP Surya Ghar)" : "Central Subsidy"}</span>
                            <span>−{formatINR(subsidy)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-apple-green-200/80 pt-2 text-base font-bold text-apple-gray-900 dark:border-apple-green-800 dark:text-white">
                          <span>Net Cost After Subsidy</span>
                          <span>{formatINR(homeownerNet)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-apple-gray-200 p-3.5 text-xs dark:border-apple-gray-800">
                      <p className="font-semibold text-apple-gray-900 dark:text-white">
                        Turnkey Inclusions &amp; Guarantees:
                      </p>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-apple-green-600" />
                          25-Year Linear Solar Module Output Warranty
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-apple-green-600" />
                          BIS-Certified Inverter with 5-Year Replacement Warranty
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-apple-green-600" />
                          Hot-Dip Galvanized Mounting (150 km/h wind rated)
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-apple-green-600" />
                          Complete DISCOM Net-Metering &amp; Subsidy Liaison
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-apple-gray-50 p-3 dark:bg-apple-gray-900">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Yearly generation
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {annualGeneration.toLocaleString("en-IN")} units
                    </p>
                  </div>
                  <div className="rounded-lg bg-apple-gray-50 p-3 dark:bg-apple-gray-900">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Monthly saving
                    </p>
                    <p className="mt-1 text-sm font-semibold text-apple-green-700 dark:text-apple-green-400">
                      {formatINR(monthlySavings)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-apple-gray-50 p-3 dark:bg-apple-gray-900">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Payback
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {payback > 0 ? `${payback.toFixed(1)} years` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-apple-gray-50 p-3 dark:bg-apple-gray-900">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      CO₂ avoided
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {(annualGeneration * 0.00071).toFixed(1)} t/yr
                    </p>
                  </div>
                </div>

                {presentationMode ? (
                  <div className="mt-5 space-y-2.5">
                    <SplitPayEscrowDialog
                      kitTitle={product?.name ?? preset.title}
                      sizeKw={preset.sizeKw}
                      state={state}
                      turnkeyPrice={turnkeyPrice}
                      dealerPrice={dealerPrice}
                      dealerMargin={dealerMargin}
                      subsidy={subsidy}
                      homeownerNet={homeownerNet}
                      trigger={
                        <Button size="lg" className="w-full gap-2 bg-apple-green-600 hover:bg-apple-green-700 text-white">
                          <ShieldCheck className="h-4 w-4" /> Book with Split-Pay Escrow
                        </Button>
                      }
                    />
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4" /> Print Homeowner Proposal
                    </Button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-2.5">
                    <Button size="lg" className="w-full" onClick={addSystem} disabled={!product || added}>
                      {added ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Added to order
                        </>
                      ) : (
                        <>
                          Add dealer kit to order <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <SplitPayEscrowDialog
                      kitTitle={product?.name ?? preset.title}
                      sizeKw={preset.sizeKw}
                      state={state}
                      turnkeyPrice={turnkeyPrice}
                      dealerPrice={dealerPrice}
                      dealerMargin={dealerMargin}
                      subsidy={subsidy}
                      homeownerNet={homeownerNet}
                    />
                    <Button size="lg" variant="outline" className="w-full" asChild>
                      <Link href="/cart">View kit order</Link>
                    </Button>
                  </div>
                )}

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Battery className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {preset.battery
                      ? "Battery-backed hybrid kit included for backup during outages."
                      : "Battery backup is available with the 3 kW and 5 kW hybrid kits."}
                  </p>
                  <p className="flex items-start gap-2">
                    <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Homeowner savings are conservative and assume net metering. Your margin covers
                    installation, labour and profit.
                  </p>
                </div>

                <div className="mt-5 border-t border-apple-gray-100 pt-4 dark:border-apple-gray-800">
                  <p className="text-xs text-muted-foreground">
                    Not sure this is the right size?{" "}
                    <Link href="/solar-calculator" className="font-medium text-apple-blue-600 hover:underline">
                      Use the calculator
                    </Link>{" "}
                    or call{" "}
                    <a href={INDIA.supportPhoneHref} className="font-medium text-apple-blue-600 hover:underline">
                      {INDIA.supportPhone}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
