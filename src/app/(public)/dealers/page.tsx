import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CheckCircle,
  FileText,
  Handshake,
  Landmark,
  Package,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatINR } from "@/lib/india"

export const metadata: Metadata = {
  title: "Dealer program",
  description:
    "Buy complete rooftop solar kits at 65% of the homeowner turnkey quote. Fixed 35% dealer margin, GST invoices, freight included and UP subsidy support for solar installers and EPCs.",
}

const benefits = [
  {
    icon: BadgeIndianRupee,
    title: "Fixed 65/35 pricing",
    description:
      "Your kit price is always 65% of the typical homeowner turnkey quote. The other 35% stays with you for installation, labour and profit.",
  },
  {
    icon: Package,
    title: "One complete SKU",
    description:
      "Modules, inverter, structure, cables, connectors, monitoring and BOS arrive together. You never chase loose components or missing parts.",
  },
  {
    icon: FileText,
    title: "GST-ready paperwork",
    description:
      "Every order ships with a GST invoice, serial numbers and the documents your business needs for input credit.",
  },
  {
    icon: Truck,
    title: "Freight included",
    description:
      "One coordinated dispatch from Lucknow with freight included. Commercial kits move on a single LR, not five supplier shipments.",
  },
  {
    icon: Landmark,
    title: "UP subsidy pack",
    description:
      "Invoice, ALMM details, net-metering checklist and PM Surya Ghar guidance for the ₹1.08 lakh Uttar Pradesh benchmark at 3 kW.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty back-to-back",
    description:
      "ALMM module performance warranties, BIS-certified inverters, structure warranty and local service escalation for your team.",
  },
]

const steps = [
  {
    number: "01",
    title: "Apply once",
    description:
      "Create a dealer account with your work email. Use the same account for every quote, order and GST invoice.",
  },
  {
    number: "02",
    title: "Pick the standard kit",
    description:
      "Choose from ten on-grid, hybrid and commercial SKUs from 1 kW to 50 kW. Each SKU has a published turnkey and dealer price.",
  },
  {
    number: "03",
    title: "Quote the homeowner",
    description:
      "Use the quote calculator or project builder to show the homeowner their net cost after subsidy and the margin you retain.",
  },
  {
    number: "04",
    title: "Install and keep the margin",
    description:
      "Your team installs and commissions. The homeowner claims the subsidy; the 35% difference is your dealer margin.",
  },
]

const audiences = [
  { icon: Users, label: "Rooftop solar installers" },
  { icon: Building2, label: "EPC and contracting firms" },
  { icon: Handshake, label: "Electrical and hardware dealers" },
  { icon: Landmark, label: "UP-focused project developers" },
]

const faqs = [
  {
    question: "Do you sell loose panels or inverters?",
    answer:
      "No. SolarStore is a kit-only dealer business. Every SKU includes the modules, inverter, structure, cabling and balance of system required to install a complete rooftop system.",
  },
  {
    question: "How is the dealer margin calculated?",
    answer:
      "The dealer kit price is 65% of the published homeowner turnkey quote. The remaining 35% is retained by the dealer for installation, labour and profit. There are no hidden component mark-ups.",
  },
  {
    question: "Is freight really included?",
    answer:
      "Yes. Freight is included on every dealer kit and every kit dispatches from Lucknow. Commercial kits are coordinated on a single consignment where site access allows.",
  },
  {
    question: "Who claims the subsidy?",
    answer:
      "The homeowner claims PM Surya Ghar and any state top-up. The subsidy is never deducted from the dealer kit invoice. We supply the invoice and documentation needed for the application.",
  },
]

export default function DealersPage() {
  return (
    <div className="bg-white dark:bg-apple-gray-950">
      <section className="border-b border-apple-gray-100 bg-apple-gray-50 dark:border-apple-gray-800 dark:bg-apple-gray-900">
        <div className="container-apple section-space-sm text-center">
          <Badge variant="solar" className="mb-5">
            <Handshake className="mr-1.5 h-3.5 w-3.5" /> Dealer-only rooftop kits
          </Badge>
          <h1 className="mx-auto max-w-4xl text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            The predictable way to buy and quote rooftop solar.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg text-muted-foreground">
            Complete 1–50 kW kits at 65% of the homeowner turnkey quote. You quote the install,
            keep the 35% margin, and leave the component sourcing and paperwork to us.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Apply for dealer access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/project-builder">Build a sample quote</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Dealer pricing · GST invoice · Freight included · Lucknow dispatch
          </p>
        </div>
      </section>

      <section className="border-b border-apple-gray-100 bg-white py-10 dark:border-apple-gray-800 dark:bg-apple-gray-950">
        <div className="container-apple grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "65%", label: "dealer kit price" },
            { value: "35%", label: "retained margin" },
            { value: "10", label: "standard kit SKUs" },
            { value: "1–50 kW", label: "on-grid, hybrid, commercial" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-display-md font-display font-bold text-apple-gray-900 dark:text-white">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="container-apple">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-medium text-apple-blue-600">Built for the dealer business</p>
            <h2 className="mt-2 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              Everything except the installation.
            </h2>
            <p className="mt-4 text-body-md text-muted-foreground">
              One purchase order, one delivery and one invoice. The kit arrives ready for your
              crew, with the margin already built in.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="card-hover p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-apple-gray-900 text-white dark:bg-white dark:text-apple-gray-900">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-apple-gray-50 dark:bg-apple-gray-900">
        <div className="container-apple grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-apple-blue-600">The 3 kW benchmark</p>
            <h2 className="mt-2 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              ₹60,000 margin on the most-quoted kit in Lucknow.
            </h2>
            <p className="mt-4 text-body-md text-muted-foreground">
              This is the deal your team can take to a homeowner today. The subsidy is paid to the
              homeowner, not deducted from your kit invoice.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Complete 3 kW kit: modules, inverter, structure and BOS",
                "GST invoice and freight included from Lucknow",
                "Homeowner net cost about ₹64,000 after the ₹1.08 lakh UP benchmark",
                "Dealer margin retained before installation labour",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-apple-gray-700 dark:text-apple-gray-300">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-apple-green-600" />
                  {item}
                </p>
              ))}
            </div>
            <Button className="mt-7" asChild>
              <Link href="/products/3kw-on-grid-solar-kit">
                View the 3 kW kit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Card className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              LK-03 · 3 kW on-grid
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Homeowner turnkey quote</span>
                <span className="font-medium">{formatINR(1_72_000)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Dealer kit price (65%)</span>
                <span className="font-semibold">{formatINR(1_12_000)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-apple-green-700 dark:text-apple-green-400">
                <span>Dealer margin (35%)</span>
                <span className="font-semibold">{formatINR(60_000)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-apple-gray-200 pt-3 dark:border-apple-gray-800">
                <span className="text-muted-foreground">UP subsidy benchmark</span>
                <span>{formatINR(1_08_000)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-base font-semibold">
                <span>Homeowner net</span>
                <span>{formatINR(64_000)}</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Indicative benchmark. Final subsidy depends on the homeowner&apos;s eligibility and
              discom approval. Installation is quoted separately by the dealer.
            </p>
          </Card>
        </div>
      </section>

      <section className="section-space">
        <div className="container-apple">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              Four steps from quote to rooftop.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.number} className="p-6">
                <p className="text-sm font-semibold text-apple-blue-600">{step.number}</p>
                <h3 className="mt-3 text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-apple-gray-100 bg-apple-gray-50 py-10 dark:border-apple-gray-800 dark:bg-apple-gray-900">
        <div className="container-apple flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <div>
            <p className="text-sm font-medium text-apple-blue-600">Who it is for</p>
            <h2 className="mt-1 text-headline-xl font-display font-semibold text-apple-gray-900 dark:text-white">
              Dealers who want a clean, repeatable kit.
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {audiences.map((audience) => (
              <span
                key={audience.label}
                className="inline-flex items-center gap-2 rounded-full border border-apple-gray-200 bg-white px-4 py-2 text-sm text-apple-gray-700 dark:border-apple-gray-700 dark:bg-apple-gray-950 dark:text-apple-gray-300"
              >
                <audience.icon className="h-4 w-4" />
                {audience.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-apple grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-apple-blue-600">Dealer questions</p>
            <h2 className="mt-2 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              Clear before you order.
            </h2>
            <p className="mt-4 text-body-md text-muted-foreground">
              Still deciding whether the kit model fits your business? Talk to our Lucknow team
              before you apply.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/contact">Talk to the dealer desk</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-5">
                <h3 className="font-semibold text-apple-gray-900 dark:text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-apple-gray-900 py-14 text-white dark:bg-black">
        <div className="container-apple flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-display-md font-display font-bold tracking-tight">
              Ready to quote your next rooftop?
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Open a dealer account and order your first complete kit at 65% of turnkey.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Become a dealer</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/products">View kit catalogue</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
