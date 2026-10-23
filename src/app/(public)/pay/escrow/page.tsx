"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatINR, calculateSubsidyForState } from "@/lib/india"
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  Truck,
  UserCheck,
  Building,
  Zap,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Phone,
} from "lucide-react"

export default function EscrowPaymentPage() {
  return (
    <React.Suspense fallback={<EscrowSkeleton />}>
      <EscrowCheckout />
    </React.Suspense>
  )
}

function EscrowCheckout() {
  const searchParams = useSearchParams()
  const escrowId = searchParams.get("id") ?? "ESC-3KW-DEMO"
  const sizeKw = Number(searchParams.get("kw")) || 3
  const state = searchParams.get("state") ?? "Uttar Pradesh"

  const [paymentComplete, setPaymentComplete] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)

  // System benchmark math
  const turnkeyPrice = sizeKw === 10 ? 465000 : sizeKw === 5 ? 262000 : 172000
  const subsidy = calculateSubsidyForState(state, sizeKw)
  const netHomeownerCost = Math.max(0, turnkeyPrice - subsidy)
  const hardwareSplit = Math.round(turnkeyPrice * 0.65)
  const installerSplit = turnkeyPrice - hardwareSplit

  const handleSimulatePayment = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setPaymentComplete(true)
    }, 1500)
  }

  if (paymentComplete) {
    return (
      <div className="container-apple section-space-sm">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-green-50 dark:bg-apple-green-900/20">
            <CheckCircle className="h-8 w-8 text-apple-green-600 dark:text-apple-green-400" />
          </div>
          <Badge variant="success" className="mt-4">
            Escrow Deposit Secured
          </Badge>
          <h1 className="mt-3 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Payment Protected in Smart Escrow.
          </h1>
          <p className="mt-3 text-body-md text-muted-foreground">
            Escrow Ref: <strong className="font-mono text-apple-gray-900 dark:text-white">{escrowId}</strong>.
            Your deposit of {formatINR(turnkeyPrice)} is held safely by our RBI-regulated trustee.
          </p>

          <div className="mt-6 rounded-2xl border border-apple-gray-200 bg-apple-gray-50/70 p-5 text-left text-xs dark:border-apple-gray-800 dark:bg-apple-gray-900/50">
            <p className="font-semibold uppercase tracking-wider text-apple-gray-700 dark:text-apple-gray-300">
              Next Steps &amp; Release Schedule
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apple-blue-100 text-apple-blue-700">
                  1
                </div>
                <div>
                  <p className="font-semibold text-apple-gray-900 dark:text-white">Hardware Allocation &amp; Dispatch</p>
                  <p className="text-muted-foreground">65% ({formatINR(hardwareSplit)}) released to Lucknow Central Logistics only when your kit ships with verified tracking.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apple-green-100 text-apple-green-700">
                  2
                </div>
                <div>
                  <p className="font-semibold text-apple-gray-900 dark:text-white">Net-Metering &amp; Final Handover</p>
                  <p className="text-muted-foreground">35% ({formatINR(installerSplit)}) released to your certified installer only when DISCOM installs your bidirectional net-meter and you provide the completion OTP.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">Back to Storefront</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Support Desk</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Badge variant="outline" className="border-apple-blue-300 bg-apple-blue-50 text-apple-blue-700 dark:border-apple-blue-800 dark:bg-apple-blue-950/40 dark:text-apple-blue-300">
            <Lock className="mr-1 h-3 w-3" /> RBI-Regulated Smart Escrow
          </Badge>
          <h1 className="mt-3 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Secure Solar Escrow Reservation
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escrow Agreement <span className="font-mono">{escrowId}</span> · Guaranteed protection for {sizeKw} kW Rooftop Solar in {state}
          </p>
        </div>

        {/* Pricing Summary Card */}
        <Card className="mt-8 overflow-hidden">
          <div className="border-b border-apple-gray-200 bg-apple-gray-50/70 p-5 dark:border-apple-gray-800 dark:bg-apple-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Turnkey System Package
                </p>
                <h2 className="text-xl font-bold text-apple-gray-900 dark:text-white">
                  {sizeKw} kW Rooftop Solar Kit (Pre-Engineered)
                </h2>
              </div>
              <Badge variant="success">PM Surya Ghar Ready</Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Turnkey Equipment &amp; Installation</span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">{formatINR(turnkeyPrice)}</span>
              </div>
              {subsidy > 0 && (
                <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                  <span>{state === "Uttar Pradesh" ? "PM Surya Ghar + UP State Subsidy Benefit" : "Central Subsidy Benchmark"}</span>
                  <span className="font-semibold">−{formatINR(subsidy)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-apple-gray-200 pt-3 text-base font-bold dark:border-apple-gray-800">
                <span>Net Cost After Direct Subsidy</span>
                <span className="text-apple-green-700 dark:text-apple-green-400">{formatINR(netHomeownerCost)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                *The subsidy is credited directly to your Aadhaar-linked bank account by MNRE/DISCOM post commissioning.
              </p>
            </div>

            {/* Escrow Protection Guarantee */}
            <div className="mt-6 rounded-xl border border-apple-blue-200 bg-apple-blue-50/60 p-4 dark:border-apple-blue-900/40 dark:bg-apple-blue-950/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-apple-blue-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-apple-blue-800 dark:text-apple-blue-300">
                    Why your money is 100% safe
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-apple-blue-900 dark:text-apple-blue-200">
                    Your deposit remains in a trust-managed escrow account. Funds are released strictly in milestones:
                    65% upon factory dispatch tracking verification from Lucknow, and 35% only after you approve the net-meter commissioning.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-6 space-y-3">
              <Button
                size="lg"
                className="w-full gap-2 bg-apple-blue-600 text-white hover:bg-apple-blue-500"
                onClick={handleSimulatePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" /> Verifying Escrow Vault...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Deposit {formatINR(turnkeyPrice)} into Escrow
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" /> ICICI Smart Escrow
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-apple-green-600" /> Instant Bank Verification
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EscrowSkeleton() {
  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="mx-auto h-12 w-80 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="h-96 animate-pulse rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-800" />
      </div>
    </div>
  )
}
