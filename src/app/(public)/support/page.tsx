import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/forms/contact-form"
import { INDIA } from "@/lib/india"
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Truck,
  RotateCcw,
  ShieldCheck,
  Wrench,
  HelpCircle,
  ArrowRight,
  Languages,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Support",
  description:
    "India support for solar orders, PM Surya Ghar subsidy questions, delivery, returns, warranty claims and installation.",
}

const channels = [
  {
    icon: Phone,
    title: "Call us",
    value: INDIA.supportPhone,
    href: INDIA.supportPhoneHref,
    detail: INDIA.supportHours,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: INDIA.whatsapp,
    href: INDIA.whatsappHref,
    detail: "Fastest for order photos and documents",
  },
  {
    icon: Mail,
    title: "Email",
    value: INDIA.supportEmail,
    href: `mailto:${INDIA.supportEmail}`,
    detail: "Replies within one business day",
  },
  {
    icon: MapPin,
    title: "Visit",
    value: "Lucknow office",
    href: "/contact",
    detail: "Vibhuti Khand, Gomti Nagar",
  },
]

const quickLinks = [
  { icon: Truck, title: "Kit freight", text: "Dispatch and delivery windows", href: "/shipping" },
  { icon: RotateCcw, title: "Returns", text: "7-day return policy", href: "/returns" },
  { icon: ShieldCheck, title: "Warranty", text: "Claims and coverage", href: "/warranty" },
  { icon: Wrench, title: "Installation", text: "Site and wiring checklist", href: "/installation-guide" },
  { icon: HelpCircle, title: "FAQs", text: "Quick answers", href: "/faqs" },
  { icon: Languages, title: "Languages", text: "English and Hindi", href: "/contact" },
]

const faqs = [
  {
    question: "How do I check the status of a dealer order?",
    answer:
      "Use the tracking link in your dispatch SMS or WhatsApp message, or call the dealer desk with your order number. Demo orders placed on this site are stored in your browser and can be viewed under Dashboard → Kit orders.",
  },
  {
    question: "Can you help with the PM Surya Ghar application?",
    answer:
      "Yes. We supply the kit invoice, serial numbers, ALMM details and net-metering checklist your team needs. The application must be in the homeowner's name through a registered vendor; we can review the documents before submission.",
  },
  {
    question: "Is installation included in the kit price?",
    answer:
      "No. The dealer kit price covers equipment, structure, cabling and freight. Your team quotes and performs installation, net-meter liaison and any civil work, and retains the 35% dealer margin.",
  },
  {
    question: "A module arrived damaged. What should I do?",
    answer:
      "Do not install it. Send photographs of the packaging, module and shipping label to support@solarstore.in within 48 hours. We will arrange an inspection and a replacement or credit note.",
  },
  {
    question: "How do warranty claims work?",
    answer:
      "Call or email with your order number, serial number and photos of the fault. We raise an RMA with the manufacturer and coordinate inspection or pickup. Keep your GST invoice and commissioning report handy.",
  },
  {
    question: "Do you supply outside India?",
    answer:
      "No. This dealer storefront is built specifically for India and delivers only to Indian pincodes. Prices are in INR and include 5% GST.",
  },
]

export default function SupportPage() {
  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="solar" className="mb-5">
          <Phone className="mr-1.5 h-3.5 w-3.5" /> India support
        </Badge>
        <h1 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          How can we help?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Real people in Lucknow, not a chatbot loop. Ask us about a dealer kit, an order, the
          subsidy or a warranty claim.
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {INDIA.supportHours}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" /> English · हिन्दी
          </span>
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((channel) => (
          <a
            key={channel.title}
            href={channel.href}
            className="group rounded-2xl border border-apple-gray-200 p-5 transition-colors hover:border-apple-gray-400 dark:border-apple-gray-800 dark:hover:border-apple-gray-600"
          >
            <channel.icon className="h-5 w-5 text-apple-gray-600 dark:text-apple-gray-300" />
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {channel.title}
            </p>
            <p className="mt-1 font-semibold text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
              {channel.value}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{channel.detail}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
            Quick answers
          </h2>
          <div className="mt-4 divide-y divide-apple-gray-200 rounded-2xl border border-apple-gray-200 dark:divide-apple-gray-800 dark:border-apple-gray-800">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-apple-gray-900 marker:hidden dark:text-white">
                  <span className="flex items-start justify-between gap-3">
                    {faq.question}
                    <span className="mt-0.5 text-apple-gray-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group flex items-start gap-3 rounded-xl border border-apple-gray-200 p-4 transition-colors hover:border-apple-gray-400 dark:border-apple-gray-800"
              >
                <link.icon className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <span>
                  <span className="block text-sm font-medium text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                    {link.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{link.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <Card className="p-6 sm:p-8">
            <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
              Send us a message
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Include your city, order number or monthly bill so we can help faster.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>

          <Card className="mt-4 p-6">
            <h3 className="font-semibold text-apple-gray-900 dark:text-white">
              Urgent safety issue?
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              If you smell burning, see a spark or notice damage to wiring, switch off the solar AC
              breaker and the inverter, then call us immediately. Do not climb on the roof or touch
              exposed DC cables.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <a href={INDIA.supportPhoneHref}>
                <Phone className="mr-2 h-4 w-4" /> Call {INDIA.supportPhone}
              </a>
            </Button>
          </Card>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-apple-gray-50 p-6 text-center dark:bg-apple-gray-900 sm:p-8">
        <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
          Prefer to plan before you call?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Run the calculator for a system size and subsidy estimate, or read the PM Surya Ghar guide.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/solar-calculator">
              Solar calculator <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn/pm-surya-ghar-subsidy">Subsidy guide</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
