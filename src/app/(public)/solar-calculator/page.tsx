"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProductCard } from "@/components/product/product-card"
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
  ArrowLeft,
  ArrowRight,
  Battery,
  Building2,
  Calculator,
  CheckCircle,
  Home,
  IndianRupee,
  Info,
  Landmark,
  Leaf,
  MapPin,
  Printer,
  RotateCcw,
  Sun,
  TrendingUp,
} from "lucide-react"

const roofTypes = [
  { value: "flat", label: "Flat concrete", description: "RCC slab, most common", factor: 1 },
  { value: "sloped", label: "Sloped concrete", description: "Pitched RCC roof", factor: 0.98 },
  { value: "metal", label: "Metal sheet", description: "Factory or shed roof", factor: 0.97 },
  { value: "tiled", label: "Tiled roof", description: "Mangalore or clay tiles", factor: 0.95 },
  { value: "asbestos", label: "Asbestos sheet", description: "Older roof, survey needed", factor: 0.92 },
]

const orientations = [
  { value: "south", label: "South", factor: 1 },
  { value: "east-west", label: "East / West", factor: 0.9 },
  { value: "north", label: "North", factor: 0.75 },
]

const shadingOptions = [
  { value: "none", label: "No shading", description: "Clear sky for most of the day", factor: 1 },
  { value: "partial", label: "Partial shading", description: "Trees or buildings for a few hours", factor: 0.85 },
  { value: "heavy", label: "Heavy shading", description: "Shade for much of the day", factor: 0.65 },
]

const steps = [
  { title: "Bill & state", icon: IndianRupee },
  { title: "Roof", icon: Home },
  { title: "Your quote", icon: TrendingUp },
]

const STANDARD_KIT_SIZES = [1, 2, 3, 5, 10, 15, 25, 50]

export default function SolarCalculatorPage() {
  const addItem = useCart((state) => state.addItem)
  const [step, setStep] = React.useState(1)
  const [state, setState] = React.useState("Uttar Pradesh")
  const [monthlyBill, setMonthlyBill] = React.useState("2500")
  const [tariff, setTariff] = React.useState(String(getStateTariff("Uttar Pradesh")))
  const [roofArea, setRoofArea] = React.useState("")
  const [roofType, setRoofType] = React.useState("flat")
  const [orientation, setOrientation] = React.useState("south")
  const [shading, setShading] = React.useState("none")
  const [batteryBackup, setBatteryBackup] = React.useState(false)
  const [error, setError] = React.useState("")
  const [added, setAdded] = React.useState(false)

  const bill = Math.max(0, Number(monthlyBill) || 0)
  const unitRate = Math.max(0.1, Number(tariff) || getStateTariff(state))
  const roofAreaSqft = Math.max(0, Number(roofArea) || 0)
  const roofFactor = roofTypes.find((item) => item.value === roofType)?.factor ?? 1
  const orientationFactor = orientations.find((item) => item.value === orientation)?.factor ?? 1
  const shadingFactor = shadingOptions.find((item) => item.value === shading)?.factor ?? 1

  const annualUnits = (bill / unitRate) * 12
  const yieldPerKw = getStateSolarYield(state) * roofFactor * orientationFactor * shadingFactor
  const requiredKw = annualUnits / yieldPerKw
  const roofCappedKw = roofAreaSqft > 0 ? roofAreaSqft / 100 : Infinity
  const rawKw = Math.min(requiredKw, roofCappedKw, 50)
  const systemKw = Math.max(
    1,
    STANDARD_KIT_SIZES.reduce((closest, size) =>
      Math.abs(size - rawKw) < Math.abs(closest - rawKw) ? size : closest
    )
  )
  const panelCount = Math.ceil((systemKw * 1000) / 545)
  const roofNeeded = Math.ceil(systemKw * 100)

  const costPerKw = 58_000 + (batteryBackup ? 22_000 : 0)
  const systemCost = Math.round(systemKw * costPerKw)
  const subsidy = calculateSubsidyForState(state, systemKw)
  const netCost = Math.max(0, systemCost - subsidy)
  const dealerPrice = Math.round(systemCost * 0.65)
  const dealerMargin = Math.max(0, systemCost - dealerPrice)
  const annualGeneration = Math.round(systemKw * yieldPerKw)
  const annualSavings = Math.round(Math.min(annualGeneration, annualUnits) * unitRate)
  const monthlySavings = Math.round(annualSavings / 12)
  const paybackYears = annualSavings > 0 ? netCost / annualSavings : 0
  const co2Tonnes = (annualGeneration * 0.00071).toFixed(1)
  const lifetimeSavings = Math.max(0, annualSavings * 25 - netCost)

  const recommendedKit = React.useMemo(() => {
    if (batteryBackup) {
      if (systemKw >= 5) return productBySlug.get("5kw-hybrid-solar-kit")
      return productBySlug.get("3kw-hybrid-solar-kit")
    }
    if (systemKw >= 50) return productBySlug.get("50kw-industrial-solar-kit")
    if (systemKw >= 25) return productBySlug.get("25kw-commercial-solar-kit")
    if (systemKw >= 15) return productBySlug.get("15kw-commercial-solar-kit")
    if (systemKw >= 10) return productBySlug.get("10kw-three-phase-solar-kit")
    if (systemKw >= 5) return productBySlug.get("5kw-on-grid-solar-kit")
    if (systemKw >= 3) return productBySlug.get("3kw-on-grid-solar-kit")
    if (systemKw >= 2) return productBySlug.get("2kw-on-grid-solar-kit")
    return productBySlug.get("1kw-on-grid-solar-kit")
  }, [batteryBackup, systemKw])

  const recommendedItems = recommendedKit ? [recommendedKit] : []

  const changeState = (value: string) => {
    setState(value)
    setTariff(String(getStateTariff(value)))
  }

  const goNext = () => {
    if (step === 1) {
      if (bill < 500) {
        setError("Enter a monthly electricity bill of at least ₹500 to get a useful estimate.")
        return
      }
      if (!state) {
        setError("Please select your state or union territory.")
        return
      }
    }
    setError("")
    setStep((current) => Math.min(3, current + 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setError("")
    setStep((current) => Math.max(1, current - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const reset = () => {
    setStep(1)
    setState("Uttar Pradesh")
    setMonthlyBill("2500")
    setTariff(String(getStateTariff("Uttar Pradesh")))
    setRoofArea("")
    setRoofType("flat")
    setOrientation("south")
    setShading("none")
    setBatteryBackup(false)
    setError("")
    setAdded(false)
  }

  const addSystem = () => {
    recommendedItems.forEach((product) => addItem(product, undefined, 1))
    setAdded(true)
  }

  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="solar" className="mb-5">
          <Calculator className="mr-1.5 h-3.5 w-3.5" /> Dealer quote calculator
        </Badge>
        <h1 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Quote a rooftop system in under a minute.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Estimate the right kit size, homeowner turnkey cost, UP subsidy, your 65% dealer kit price
          and margin before you quote. Takes about a minute.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((item, index) => {
              const number = index + 1
              const active = step === number
              const complete = step > number
              return (
                <div key={item.title} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                        active &&
                          "border-apple-gray-900 bg-apple-gray-900 text-white dark:border-white dark:bg-white dark:text-apple-gray-900",
                        complete &&
                          "border-apple-green-600 bg-apple-green-600 text-white",
                        !active && !complete && "border-apple-gray-300 text-apple-gray-400"
                      )}
                    >
                      {complete ? <CheckCircle className="h-4 w-4" /> : <item.icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={cn(
                        "hidden text-sm sm:block",
                        active
                          ? "font-medium text-apple-gray-900 dark:text-white"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-apple-gray-200 dark:bg-apple-gray-800" />
                  )}
                </div>
              )
            })}
          </div>
          <Progress value={(step / 3) * 100} className="mt-5 h-1" />
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-apple-red-200 bg-apple-red-50 px-4 py-3 text-sm text-apple-red-700 dark:border-apple-red-900 dark:bg-apple-red-950/40 dark:text-apple-red-300"
          >
            {error}
          </div>
        )}

        {step === 1 && (
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
                Start with the homeowner&apos;s electricity use
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Their latest bill is the easiest way to size a rooftop kit.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" /> State / union territory
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(event) => changeState(event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-900 dark:text-white"
                  >
                    {INDIAN_STATES_AND_UTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Generation assumptions use typical solar yield for {state}.
                  </p>
                </div>

                <div>
                  <label htmlFor="bill" className="mb-1.5 block text-sm font-medium">
                    Homeowner&apos;s average monthly bill (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="bill"
                      type="number"
                      inputMode="numeric"
                      min={500}
                      step={100}
                      value={monthlyBill}
                      onChange={(event) => {
                        setMonthlyBill(event.target.value)
                        setError("")
                      }}
                      className="pl-7"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1500, 3000, 5000, 8000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setMonthlyBill(String(amount))}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs transition-colors",
                          Number(monthlyBill) === amount
                            ? "border-apple-gray-900 bg-apple-gray-900 text-white dark:border-white dark:bg-white dark:text-apple-gray-900"
                            : "border-apple-gray-200 text-apple-gray-600 hover:border-apple-gray-400 dark:border-apple-gray-700"
                        )}
                      >
                        ₹{amount.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="tariff" className="mb-1.5 block text-sm font-medium">
                    Average tariff (₹ per unit)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="tariff"
                      type="number"
                      inputMode="decimal"
                      min={0.1}
                      step={0.1}
                      value={tariff}
                      onChange={(event) => setTariff(event.target.value)}
                      className="pl-7"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Pre-filled with an indicative {state} residential tariff. Adjust to match your bill.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-apple-gray-50 p-4 text-sm dark:bg-apple-gray-900">
                <p className="flex items-start gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Their bill of {formatINR(bill)} works out to about{" "}
                    <span className="font-medium text-apple-gray-900 dark:text-white">
                      {Math.round(bill / unitRate)} units per month
                    </span>
                    . We&apos;ll size a standard kit to offset as much of that as practical.
                  </span>
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={goNext}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
                Now, the roof
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                These details adjust generation and kit size. A site survey confirms the final
                design.
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">Roof type</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {roofTypes.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRoofType(option.value)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        roofType === option.value
                          ? "border-apple-gray-900 bg-apple-gray-50 dark:border-white dark:bg-apple-gray-900"
                          : "border-apple-gray-200 hover:border-apple-gray-400 dark:border-apple-gray-700"
                      )}
                    >
                      <span className="block text-sm font-medium text-apple-gray-900 dark:text-white">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="orientation" className="mb-1.5 block text-sm font-medium">
                    Main roof direction
                  </label>
                  <select
                    id="orientation"
                    value={orientation}
                    onChange={(event) => setOrientation(event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-900 dark:text-white"
                  >
                    {orientations.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    South-facing roofs generate the most in India.
                  </p>
                </div>

                <div>
                  <label htmlFor="roofArea" className="mb-1.5 block text-sm font-medium">
                    Available roof area (sq ft) <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="roofArea"
                    type="number"
                    inputMode="numeric"
                    min={100}
                    step={50}
                    value={roofArea}
                    onChange={(event) => setRoofArea(event.target.value)}
                    placeholder="e.g. 500"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    We assume about 100 sq ft per kW including walkways.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">Shading</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {shadingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setShading(option.value)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        shading === option.value
                          ? "border-apple-gray-900 bg-apple-gray-50 dark:border-white dark:bg-apple-gray-900"
                          : "border-apple-gray-200 hover:border-apple-gray-400 dark:border-apple-gray-700"
                      )}
                    >
                      <span className="block text-sm font-medium text-apple-gray-900 dark:text-white">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-apple-gray-200 p-4 dark:border-apple-gray-700">
                <input
                  type="checkbox"
                  checked={batteryBackup}
                  onChange={(event) => setBatteryBackup(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-apple-gray-900"
                />
                <Battery className="mt-0.5 h-5 w-5 shrink-0 text-apple-gray-600 dark:text-apple-gray-300" />
                <span>
                  <span className="block text-sm font-medium text-apple-gray-900 dark:text-white">
                    Use a hybrid kit
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Battery-backed kit for outages. Adds about ₹22,000 per kW to the homeowner
                    turnkey quote.
                  </span>
                </span>
              </label>

              {shading === "heavy" && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-apple-orange-50 p-4 text-sm text-apple-orange-800 dark:bg-apple-orange-900/20 dark:text-apple-orange-300">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  Heavy shading can make rooftop solar uneconomical. We recommend a site survey
                  before ordering.
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                <Button variant="outline" size="lg" onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button size="lg" onClick={goNext}>
                  Generate dealer quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-apple-blue-600">
                      Recommended dealer kit
                    </p>
                    <h2 className="mt-1 text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
                      {systemKw} kW {batteryBackup ? "hybrid" : "on-grid"} kit
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      About {panelCount} × 545 W modules · {roofNeeded} sq ft of roof ·{" "}
                      {annualGeneration.toLocaleString("en-IN")} units generated a year.
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit bg-white">
                    <MapPin className="mr-1 h-3 w-3" /> {state}
                  </Badge>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-apple-gray-50 p-4 dark:bg-apple-gray-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Homeowner monthly saving
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold text-apple-green-700 dark:text-apple-green-400">
                      {formatINR(monthlySavings)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatINR(annualSavings)} a year
                    </p>
                  </div>
                  <div className="rounded-xl bg-apple-gray-50 p-4 dark:bg-apple-gray-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {state === "Uttar Pradesh" ? "UP combined subsidy" : "Subsidy benchmark"}
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold text-apple-gray-900 dark:text-white">
                      {formatINR(subsidy)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {state === "Uttar Pradesh" ? "Central + UP state top-up" : "Central assistance estimate"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-apple-gray-50 p-4 dark:bg-apple-gray-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Homeowner payback
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold text-apple-gray-900 dark:text-white">
                      {paybackYears > 0 ? `${paybackYears.toFixed(1)} years` : "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">After subsidy</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-apple-gray-200 p-5 dark:border-apple-gray-800">
                  <h3 className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                    Homeowner quote
                  </h3>
                  <div className="mt-3 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Turnkey cost ({systemKw} kW @ {formatINR(costPerKw)}/kW)
                      </span>
                      <span>{formatINR(systemCost)}</span>
                    </div>
                    <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                      <span>Less subsidy benchmark</span>
                      <span>−{formatINR(subsidy)}</span>
                    </div>
                    <div className="flex justify-between border-t border-apple-gray-200 pt-2.5 text-base font-semibold dark:border-apple-gray-800">
                      <span>Homeowner net cost</span>
                      <span>{formatINR(netCost)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Homeowner turnkey estimate at {formatINR(costPerKw)} per kW including GST,
                      structure, cabling and standard installation. A site survey gives the final
                      quotation.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-apple-gray-900 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                        Your dealer numbers
                      </p>
                      <p className="mt-1 text-sm text-white/80">
                        Kit price is 65% of the homeowner turnkey quote.
                      </p>
                    </div>
                    <Badge className="border-white/20 bg-white/10 text-white">
                      35% margin
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-white/60">Dealer kit price</p>
                      <p className="mt-1 text-2xl font-semibold">{formatINR(dealerPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Dealer margin</p>
                      <p className="mt-1 text-2xl font-semibold text-apple-green-400">
                        {formatINR(dealerMargin)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    Your invoice is the 65% kit price plus GST. The subsidy is paid to the homeowner,
                    not deducted from your kit invoice. The margin covers installation, labour and
                    profit.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="flex items-start gap-2 rounded-lg bg-apple-gray-50 px-3 py-2.5 text-xs dark:bg-apple-gray-900">
                    <Landmark className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Dealer finance and GST input credit available on request
                    </span>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-apple-gray-50 px-3 py-2.5 text-xs dark:bg-apple-gray-900">
                    <Leaf className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Avoids <strong>{co2Tonnes} tonnes</strong> of CO₂ a year
                    </span>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-apple-gray-50 px-3 py-2.5 text-xs dark:bg-apple-gray-900">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>{formatINR(lifetimeSavings)}</strong> saved over 25 years
                    </span>
                  </div>
                </div>

                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Estimate only. Savings assume net metering credits at your retail tariff,
                  generation at {Math.round(yieldPerKw).toLocaleString("en-IN")} units/kW/year and
                  no major shading. State subsidies, discom charges and actual installation costs
                  vary.
                </p>
              </CardContent>
            </Card>

            {recommendedItems.length > 0 && (
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                        Matching dealer kit
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The closest standard kit to this homeowner quote.
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      Dealer price · GST included
                    </Badge>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {recommendedItems.map((product) => (
                      <div key={product.id} className="[&>article]:h-full">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" onClick={addSystem} disabled={added}>
                      {added ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Added to order
                        </>
                      ) : (
                        <>
                          Add matching kit to order <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/cart">View kit order</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Adjust details
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" /> Print estimate
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start over
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-apple-gray-900 p-6 text-white dark:bg-apple-gray-900 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <Landmark className="h-4 w-4" /> PM Surya Ghar + UP
                  </p>
                  <h3 className="mt-1 text-headline-lg font-semibold">
                    Next step: check the homeowner&apos;s eligibility
                  </h3>
                  <p className="mt-2 max-w-lg text-sm text-white/70">
                    The homeowner registers on the national portal, gets feasibility approval from
                    the discom and selects a registered vendor. We&apos;ve written a step-by-step
                    UP subsidy guide for your team.
                  </p>
                </div>
                <Button variant="secondary" asChild className="w-full sm:w-auto">
                  <Link href="/learn/pm-surya-ghar-subsidy">
                    Read the guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Sun, title: "State-wise yield", text: "Assumptions tuned for Indian irradiance" },
            { icon: IndianRupee, title: "Rupee estimates", text: "Subsidy and payback in ₹" },
            { icon: Building2, title: "Made for India", text: "28 states and 8 union territories" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl border border-apple-gray-200 p-4 dark:border-apple-gray-800">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
              <div>
                <p className="text-sm font-medium text-apple-gray-900 dark:text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Questions about the estimate? Call{" "}
          <a href={INDIA.supportPhoneHref} className="font-medium text-apple-blue-600 hover:underline">
            {INDIA.supportPhone}
          </a>{" "}
          · {INDIA.supportHours}
        </p>
      </div>
    </div>
  )
}
