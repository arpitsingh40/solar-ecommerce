"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatINR } from "@/lib/india"
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Check,
  Copy,
  Share2,
  Printer,
  Building,
  UserCheck,
  Truck,
  Sparkles,
} from "lucide-react"

interface SplitPayEscrowDialogProps {
  kitTitle: string
  sizeKw: number
  state: string
  turnkeyPrice: number
  dealerPrice: number
  dealerMargin: number
  subsidy: number
  homeownerNet: number
  trigger?: React.ReactNode
}

export function SplitPayEscrowDialog({
  kitTitle,
  sizeKw,
  state,
  turnkeyPrice,
  dealerPrice,
  dealerMargin,
  subsidy,
  homeownerNet,
  trigger,
}: SplitPayEscrowDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [customerName, setCustomerName] = React.useState("")
  const [customerPhone, setCustomerPhone] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  // Escrow ID and URL
  const escrowId = React.useMemo(() => {
    const slug = kitTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `ESC-${slug}-${hash}`
  }, [kitTitle, open])

  const escrowUrl = typeof window !== "undefined"
    ? `${window.location.origin}/pay/escrow?id=${escrowId}&kw=${sizeKw}&state=${encodeURIComponent(state)}`
    : `https://solarstore.in/pay/escrow?id=${escrowId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(escrowUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  const shareWhatsApp = () => {
    const greeting = customerName.trim() ? `Dear ${customerName.trim()}, ` : "Hello! "
    const text =
      `${greeting}Here is your verified SolarStore India turnkey proposal for ${kitTitle} (${sizeKw} kW) in ${state}.\n\n` +
      `• Turnkey Installed Cost: ${formatINR(turnkeyPrice)}\n` +
      `• Govt. Subsidy Benefit: -${formatINR(subsidy)}\n` +
      `• Net Out-of-Pocket: ${formatINR(homeownerNet)}\n\n` +
      `🔒 Secure Split-Pay Escrow Protection:\n` +
      `Your payment is safely held in an RBI-regulated escrow account. 65% is settled to Lucknow Central Dispatch only upon kit dispatch, and 35% is released to your certified installer only AFTER DISCOM net-metering inspection & handover OTP.\n\n` +
      `👉 View and complete your escrow reservation:\n${escrowUrl}`

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="w-full gap-2 border-apple-blue-200 text-apple-blue-600 hover:bg-apple-blue-50 dark:border-apple-blue-900/40 dark:text-apple-blue-400">
            <ShieldCheck className="h-4 w-4" /> Generate Split-Pay Escrow Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-apple-blue-300 bg-apple-blue-50 text-apple-blue-700 dark:border-apple-blue-800 dark:bg-apple-blue-950/40 dark:text-apple-blue-300">
              <Lock className="mr-1 h-3 w-3" /> Smart Escrow Protocol
            </Badge>
            <Badge variant="success">Zero Financial Risk</Badge>
          </div>
          <DialogTitle className="mt-2 text-xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Homeowner Split-Pay Escrow Generator
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Close living-room deals instantly. Homeowners deposit the turnkey sum into a protected
            escrow account, eliminating advance risk while guaranteeing your 35% installation margin.
          </DialogDescription>
        </DialogHeader>

        {/* Escrow Mechanism Explainer */}
        <div className="mt-2 rounded-xl border border-apple-gray-200 bg-apple-gray-50/70 p-4 dark:border-apple-gray-800 dark:bg-apple-gray-900/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-700 dark:text-apple-gray-300">
            Automated Fund Settlement Architecture
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-apple-gray-200 bg-white p-3 dark:border-apple-gray-700 dark:bg-apple-gray-800">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-apple-gray-900 dark:text-white">
                  <Truck className="h-3.5 w-3.5 text-apple-blue-600" /> 65% Hardware Escrow
                </span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  {formatINR(dealerPrice)}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-tight text-muted-foreground">
                Settled to Lucknow Central Warehouse upon automated dispatch and barcoded tracking verification.
              </p>
            </div>

            <div className="rounded-lg border border-apple-green-200 bg-apple-green-50/50 p-3 dark:border-apple-green-900/40 dark:bg-apple-green-950/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-apple-green-800 dark:text-apple-green-300">
                  <UserCheck className="h-3.5 w-3.5 text-apple-green-600" /> 35% Installer Escrow
                </span>
                <span className="font-semibold text-apple-green-700 dark:text-apple-green-400">
                  {formatINR(dealerMargin)}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-tight text-apple-green-800/80 dark:text-apple-green-300/80">
                Released directly to your registered bank account upon DISCOM Net-Metering sign-off &amp; customer OTP.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-apple-gray-200 pt-2.5 text-xs text-apple-gray-600 dark:border-apple-gray-700 dark:text-apple-gray-400">
            <span>Homeowner Total Turnkey: <strong className="text-apple-gray-900 dark:text-white">{formatINR(turnkeyPrice)}</strong></span>
            <span>Subsidy Benchmark: <strong className="text-apple-green-600">−{formatINR(subsidy)}</strong></span>
            <span>Net Cost: <strong className="text-apple-gray-900 dark:text-white">{formatINR(homeownerNet)}</strong></span>
          </div>
        </div>

        {/* Homeowner Details Form */}
        <div className="mt-3 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Homeowner &amp; Site Details (Optional)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="customer-name" className="text-xs font-medium text-apple-gray-700 dark:text-apple-gray-300">
                Client Name
              </label>
              <Input
                id="customer-name"
                placeholder="e.g. Ramesh Chandra Verma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <label htmlFor="customer-phone" className="text-xs font-medium text-apple-gray-700 dark:text-apple-gray-300">
                WhatsApp / Mobile Number
              </label>
              <Input
                id="customer-phone"
                placeholder="10-digit mobile number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                maxLength={10}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Escrow Link & Sharing */}
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Unique Protected Escrow Link
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-hidden truncate rounded-lg border border-apple-gray-300 bg-apple-gray-50 px-3 py-2 text-xs font-mono text-apple-gray-800 dark:border-apple-gray-700 dark:bg-apple-gray-900 dark:text-apple-gray-200">
              {escrowUrl}
            </div>
            <Button
              size="sm"
              variant={copied ? "default" : "outline"}
              onClick={copyToClipboard}
              className="shrink-0 gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-apple-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <Button
            size="default"
            className="flex-1 gap-2 bg-[#25D366] text-white hover:bg-[#20BD5A]"
            onClick={shareWhatsApp}
          >
            <Share2 className="h-4 w-4" /> Share via WhatsApp
          </Button>
          <Button
            size="default"
            variant="outline"
            className="gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> Print Proposal
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-apple-gray-100 pt-3 text-[11px] text-muted-foreground dark:border-apple-gray-800">
          <span className="flex items-center gap-1">
            <Building className="h-3 w-3 text-apple-gray-400" /> ICICI Smart Escrow Account
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-apple-green-600" /> RBI-Regulated Trustee
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-apple-yellow-600" /> Instant DISCOM Settlement
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
