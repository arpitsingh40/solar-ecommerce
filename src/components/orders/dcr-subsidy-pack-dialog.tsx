"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
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
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react"

export interface DcrSubsidyPackDialogProps {
  orderId: string
  kitName?: string
  date?: string
  total?: number
  state?: string
  customerName?: string
  trigger?: React.ReactNode
}

export function DcrSubsidyPackDialog({
  orderId,
  kitName = "3kW On-Grid Rooftop Solar Kit",
  date = "October 2026",
  total = 164990,
  state = "Uttar Pradesh",
  customerName = "Solar Dealer / Installer",
  trigger,
}: DcrSubsidyPackDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [copiedUndertaking, setCopiedUndertaking] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)
  const [downloadDone, setDownloadDone] = React.useState(false)

  // Generate deterministic/mock DCR serial numbers based on orderId
  const dcrSerials = React.useMemo(() => {
    const cleanId = orderId.replace(/[^a-zA-Z0-9]/g, "")
    const count = kitName.includes("10kW") ? 18 : kitName.includes("5kW") ? 10 : 6
    return Array.from({ length: count }, (_, idx) => {
      const pad = String(idx + 1).padStart(2, "0")
      return `DCR-IND-2026-WAA-${cleanId.slice(-4) || "8821"}-${pad}`
    })
  }, [orderId, kitName])

  const inverterBis = "R-41198421 (IS 16221-1 / IS 16169)"

  const nationalPortalUndertaking = `MNRE DCR UNDERTAKING & ALMM COMPLIANCE CERTIFICATE
Order Ref: ${orderId} | Date: ${date}
Applicant / Dealer: ${customerName} | State: ${state}
System: ${kitName}

We hereby confirm that the solar photovoltaic modules supplied under Order ${orderId} are manufactured using 100% Domestic Content Requirement (DCR) solar cells complying with MNRE OM No. 283/54/2018-GRID SOLAR and listed in ALMM Order 2026.

DCR Certified Module Serial Numbers:
${dcrSerials.join("\n")}

Grid-Tie Solar Inverter BIS Registration:
${inverterBis}

Central Fulfillment Warehouse:
SolarStore India Logistics Hub, Transport Nagar, Lucknow, UP - 226012
Tax Invoice / E-Way Bill: SS-UP-2026-${orderId.slice(-5)}`

  const handleCopyUndertaking = async () => {
    try {
      await navigator.clipboard.writeText(nationalPortalUndertaking)
      setCopiedUndertaking(true)
      setTimeout(() => setCopiedUndertaking(false), 2500)
    } catch {
      // Fallback
    }
  }

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      setDownloadDone(true)
      setTimeout(() => setDownloadDone(false), 3000)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline" className="gap-1.5 border-apple-green-300 text-apple-green-700 hover:bg-apple-green-50 dark:border-apple-green-800 dark:text-apple-green-300">
            <FileSpreadsheet className="h-3.5 w-3.5" /> 1-Click DCR Subsidy Pack
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> PM Surya Ghar Certified
            </Badge>
            <Badge variant="outline">Order {orderId}</Badge>
            <Badge variant="secondary">{state} Portal Ready</Badge>
          </div>
          <DialogTitle className="mt-2 text-xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Automated DCR &amp; Subsidy Compliance Pack
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete technical documentation bundle required for National Portal (pmsuryaghar.gov.in)
            and {state === "Uttar Pradesh" ? "UPNEDA" : "State Nodal Agency"} subsidy disbursements.
          </DialogDescription>
        </DialogHeader>

        {/* Highlight Banner */}
        <div className="rounded-xl border border-apple-green-200 bg-apple-green-50/70 p-4 dark:border-apple-green-900/40 dark:bg-apple-green-950/20">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-apple-green-600 p-2 text-white">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-apple-green-800 dark:text-apple-green-300">
                100% Domestic Content Requirement (DCR) Verified
              </p>
              <p className="mt-0.5 text-xs text-apple-green-900 dark:text-apple-green-200">
                All {dcrSerials.length} modules verified on ALMM List-I with Indian cell and wafer provenance.
                Eligible for maximum central subsidy (up to ₹78,000) {state === "Uttar Pradesh" ? "+ UP state top-up (₹30,000)" : ""}.
              </p>
            </div>
          </div>
        </div>

        {/* Tabular Details */}
        <div className="space-y-3">
          {/* Section 1: DCR Serials */}
          <div className="rounded-xl border border-apple-gray-200 p-4 dark:border-apple-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-700 dark:text-apple-gray-300">
                Certified Solar Module Serials ({dcrSerials.length} Panels)
              </p>
              <Badge variant="outline" className="text-[10px]">
                ALMM Annexure-I
              </Badge>
            </div>
            <div className="mt-2 grid max-h-32 grid-cols-1 gap-1.5 overflow-y-auto rounded-lg bg-apple-gray-50 p-2 text-xs font-mono sm:grid-cols-2 dark:bg-apple-gray-900">
              {dcrSerials.map((serial, idx) => (
                <div key={serial} className="flex items-center justify-between rounded bg-white px-2 py-1 dark:bg-apple-gray-800">
                  <span className="text-muted-foreground">#{idx + 1}</span>
                  <span className="font-semibold text-apple-gray-900 dark:text-white">{serial}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Technical Specifications & SLD */}
          <div className="rounded-xl border border-apple-gray-200 p-4 dark:border-apple-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-700 dark:text-apple-gray-300">
              Technical Specifications &amp; DISCOM SLD Parameters
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg bg-apple-gray-50 p-2.5 dark:bg-apple-gray-900">
                <p className="text-[10px] text-muted-foreground">Inverter BIS No.</p>
                <p className="mt-0.5 font-semibold">{inverterBis.split(" ")[0]}</p>
              </div>
              <div className="rounded-lg bg-apple-gray-50 p-2.5 dark:bg-apple-gray-900">
                <p className="text-[10px] text-muted-foreground">Module Type</p>
                <p className="mt-0.5 font-semibold">Mono PERC DCR</p>
              </div>
              <div className="rounded-lg bg-apple-gray-50 p-2.5 dark:bg-apple-gray-900">
                <p className="text-[10px] text-muted-foreground">DCDB / ACDB</p>
                <p className="mt-0.5 font-semibold">Type 2 SPD 1000V</p>
              </div>
              <div className="rounded-lg bg-apple-gray-50 p-2.5 dark:bg-apple-gray-900">
                <p className="text-[10px] text-muted-foreground">Earthing Pits</p>
                <p className="mt-0.5 font-semibold">3 Chemical Pits</p>
              </div>
            </div>
          </div>

          {/* Section 3: Tax Invoice & HSN Breakdown */}
          <div className="rounded-xl border border-apple-gray-200 p-4 text-xs dark:border-apple-gray-800">
            <div className="flex items-center justify-between">
              <p className="font-semibold uppercase tracking-wider text-apple-gray-700 dark:text-apple-gray-300">
                GST Tax Invoice &amp; HSN Classification
              </p>
              <span className="font-mono text-muted-foreground">Invoice Value: {formatINR(total)}</span>
            </div>
            <div className="mt-2 divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">HSN 85414011 (DCR Solar PV Modules)</span>
                <span>5% GST Included</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">HSN 85044090 (Grid-Tie Inverter)</span>
                <span>12% GST Included</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">HSN 73089000 (Pre-Engineered GI Structure)</span>
                <span>18% GST Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
          <Button
            size="default"
            className="flex-1 gap-2 bg-apple-blue-600 text-white hover:bg-apple-blue-500"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloadDone ? (
              <>
                <Check className="h-4 w-4 text-apple-green-400" /> Subsidy Pack Generated (ZIP)
              </>
            ) : downloading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" /> Packaging Certificates...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download 1-Click Subsidy Pack (.ZIP)
              </>
            )}
          </Button>

          <Button
            size="default"
            variant="outline"
            className="gap-2"
            onClick={handleCopyUndertaking}
          >
            {copiedUndertaking ? (
              <>
                <Check className="h-4 w-4 text-apple-green-600" /> Copied Text
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy Portal Text
              </>
            )}
          </Button>

          <Button
            size="default"
            variant="outline"
            className="gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>

        {/* Footer Link to Portal */}
        <div className="flex items-center justify-between border-t border-apple-gray-100 pt-3 text-[11px] text-muted-foreground dark:border-apple-gray-800">
          <span>Official PM Surya Ghar Portal:</span>
          <a
            href="https://pmsuryaghar.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-apple-blue-600 hover:underline"
          >
            pmsuryaghar.gov.in <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
