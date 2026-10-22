import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ContactForm } from "@/components/forms/contact-form"
import { INDIA } from "@/lib/india"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Handshake,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Contact SolarStore India in Lucknow for dealer kits, support, warranty and privacy enquiries. Phone, WhatsApp, email and office address.",
}

const departments = [
  {
    icon: ShoppingBag,
    title: "Sales and kit advice",
    email: INDIA.salesEmail,
    detail: "Kit sizing, dealer pricing and project quotations.",
  },
  {
    icon: ShieldCheck,
    title: "Support and warranty",
    email: INDIA.supportEmail,
    detail: "Order status, returns, warranty claims and installation issues.",
  },
  {
    icon: Handshake,
    title: "Dealer program",
    email: "hello@solarstore.in",
    detail: "Dealer onboarding, 65% kit pricing and project supply.",
  },
  {
    icon: Landmark,
    title: "Privacy and grievances",
    email: "privacy@solarstore.in",
    detail: "Data protection requests and formal complaints.",
  },
]

export default function ContactPage() {
  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="solar" className="mb-5">
          <MapPin className="mr-1.5 h-3.5 w-3.5" /> Lucknow, Uttar Pradesh
        </Badge>
        <h1 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Contact us
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Questions about a dealer kit, an order, a subsidy or a warranty claim? Send a message or
          call our team in Lucknow.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 sm:p-8">
          <h2 className="text-headline-lg font-semibold text-apple-gray-900 dark:text-white">
            Send a message
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We reply within one business day. For urgent order issues, please call.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
              Reach us directly
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              <a href={INDIA.supportPhoneHref} className="flex items-start gap-3 group">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <span>
                  <span className="block font-medium text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                    {INDIA.supportPhone}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {INDIA.supportHours}
                  </span>
                </span>
              </a>
              <a href={INDIA.whatsappHref} className="flex items-start gap-3 group">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <span>
                  <span className="block font-medium text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                    WhatsApp {INDIA.whatsapp}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Share order photos and documents
                  </span>
                </span>
              </a>
              <a href={`mailto:${INDIA.supportEmail}`} className="flex items-start gap-3 group">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <span>
                  <span className="block font-medium text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                    {INDIA.supportEmail}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Replies within one business day
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <span>
                  <span className="block font-medium text-apple-gray-900 dark:text-white">
                    Registered office
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {INDIA.legalName}
                    <br />
                    {INDIA.address.line1}
                    <br />
                    {INDIA.address.line2}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <span>
                  <span className="block font-medium text-apple-gray-900 dark:text-white">
                    Office hours
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Monday to Saturday, 9:00 AM – 8:00 PM IST
                    <br />
                    Closed on national holidays
                  </span>
                </span>
              </div>
            </div>
            <p className="mt-5 border-t border-apple-gray-100 pt-4 text-xs text-muted-foreground dark:border-apple-gray-800">
              GSTIN {INDIA.gstin} · CIN {INDIA.cin}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
              Department emails
            </h2>
            <div className="mt-4 space-y-4">
              {departments.map((department) => (
                <div key={department.title} className="flex items-start gap-3">
                  <department.icon className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-apple-gray-900 dark:text-white">
                      {department.title}
                    </p>
                    <a
                      href={`mailto:${department.email}`}
                      className="text-xs text-apple-blue-600 hover:underline"
                    >
                      {department.email}
                    </a>
                    <p className="mt-0.5 text-xs text-muted-foreground">{department.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-apple-gray-900 dark:text-white">
              Looking for a quick answer?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Most questions about delivery, returns and warranty are answered on the support page.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "Support", href: "/support" },
                { label: "FAQs", href: "/faqs" },
                { label: "Shipping", href: "/shipping" },
                { label: "Warranty", href: "/warranty" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-apple-gray-200 px-3 py-1 text-xs text-apple-gray-600 hover:border-apple-gray-400 dark:border-apple-gray-700 dark:text-apple-gray-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
