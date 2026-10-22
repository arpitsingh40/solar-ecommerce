"use client"

import Link from "next/link"
import {
  Sun,
  Truck,
  Shield,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Landmark,
  RotateCcw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { INDIA } from "@/lib/india"

const footerLinks = {
  shop: [
    { name: "On-Grid Kits", href: "/products?category=on-grid" },
    { name: "Hybrid Kits", href: "/products?category=hybrid" },
    { name: "Commercial Kits", href: "/products?category=commercial" },
    { name: "All Dealer Kits", href: "/products" },
    { name: "Project Builder", href: "/project-builder" },
    { name: "Solar Calculator", href: "/solar-calculator" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Kit freight & delivery", href: "/shipping" },
    { name: "Returns & Refunds", href: "/returns" },
    { name: "Warranty Claims", href: "/warranty" },
    { name: "Installation Guide", href: "/installation-guide" },
    { name: "FAQs", href: "/faqs" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Dealer Program", href: "/dealers" },
    { name: "Bulk & Project Quotes", href: "/project-builder" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Careers", href: "/careers" },
  ],
  resources: [
    { name: "Solar Calculator", href: "/solar-calculator" },
    { name: "Project Builder", href: "/project-builder" },
    { name: "Learning Center", href: "/learn" },
    { name: "PM Surya Ghar Guide", href: "/learn/pm-surya-ghar-subsidy" },
    { name: "Net Metering Guide", href: "/learn/net-metering-india" },
  ],
}

const trustBadges = [
  { icon: Truck, title: "Freight included", description: "On every dealer kit" },
  { icon: Shield, title: "25-year warranty", description: "On ALMM modules" },
  { icon: Landmark, title: "UP subsidy support", description: "₹1.08 lakh benchmark" },
  { icon: RotateCcw, title: "7-day returns", description: "On unopened kits" },
]

const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
)

const YouTubeIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23 12s0-3.8-.5-5.6a2.8 2.8 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.8 2.8 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.8 2.8 0 0 0 2-2C23 15.8 23 12 23 12Z" />
    <path d="m10 15 5-3-5-3z" fill="white" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const XIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3l7.2-8.2L2 2h6.4l4.4 5.9L18.9 2Zm-1.1 18h1.7L7.1 3.7H5.3L17.8 20Z" />
  </svg>
)

const socialLinks = [
  { icon: InstagramIcon, href: "https://instagram.com/solarstoreindia", label: "Instagram" },
  { icon: YouTubeIcon, href: "https://youtube.com/@solarstoreindia", label: "YouTube" },
  { icon: LinkedinIcon, href: "https://linkedin.com/company/solarstoreindia", label: "LinkedIn" },
  { icon: XIcon, href: "https://x.com/solarstoreindia", label: "X" },
  { icon: FacebookIcon, href: "https://facebook.com/solarstoreindia", label: "Facebook" },
]

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error("Subscription failed")
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <footer
      className="border-t border-apple-gray-200 bg-white text-apple-gray-900 dark:border-apple-gray-800 dark:bg-apple-gray-950 dark:text-apple-gray-100"
      role="contentinfo"
    >
      {/* Trust badges */}
      <div className="border-b border-apple-gray-200 bg-apple-gray-50 dark:border-apple-gray-800 dark:bg-apple-gray-900">
        <div className="container-apple py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-apple-gray-800">
                  <badge.icon className="h-5 w-5 text-apple-gray-700 dark:text-apple-gray-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-apple-gray-900 dark:text-white">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-apple py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-5 flex items-center gap-2 text-apple-gray-900 dark:text-white" aria-label="SolarStore India home">
              <Sun className="h-8 w-8" />
              <span className="text-xl font-semibold tracking-tight">SolarStore</span>
              <span className="rounded-full border border-apple-gray-300 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-apple-gray-500 dark:border-apple-gray-700">
                India
              </span>
            </Link>
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Dealer-only rooftop solar kits. ALMM modules, BIS-certified inverters and complete BOS
              in one SKU, with 65% kit pricing and freight included across {INDIA.serviceablePincodes} pincodes.
            </p>

            <div className="space-y-2.5 text-sm text-muted-foreground">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {INDIA.legalName}
                  <br />
                  {INDIA.address.line1}, {INDIA.address.line2}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={INDIA.supportPhoneHref} className="hover:text-apple-blue-600">
                  {INDIA.supportPhone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${INDIA.supportEmail}`} className="hover:text-apple-blue-600">
                  {INDIA.supportEmail}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Headphones className="h-4 w-4 shrink-0" />
                <span>{INDIA.supportHours}</span>
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-apple-gray-100 text-apple-gray-600 transition-colors hover:bg-apple-gray-200 hover:text-apple-gray-900 dark:bg-apple-gray-800 dark:text-apple-gray-400 dark:hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Dealer kits">
            <h3 className="mb-4 text-sm font-semibold text-apple-gray-900 dark:text-white">Kits</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-apple-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="mb-4 text-sm font-semibold text-apple-gray-900 dark:text-white">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-apple-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="mb-4 text-sm font-semibold text-apple-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-apple-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="mb-4 text-sm font-semibold text-apple-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-apple-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-apple-gray-200 bg-apple-gray-50 dark:border-apple-gray-800 dark:bg-apple-gray-900">
        <div className="container-apple py-10">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-white">
              Dealer margin and subsidy updates
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New kit launches, UP subsidy changes and quote tips. One email a month, no spam.
            </p>
            {status === "success" ? (
              <p className="mt-5 rounded-lg border border-apple-green-200 bg-white px-4 py-3 text-sm text-apple-green-700 dark:border-apple-green-800 dark:bg-apple-gray-950 dark:text-apple-green-400">
                You&apos;re subscribed. Look out for our next dealer kit update.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="dealer@company.in"
                  className="h-11 flex-1 rounded-full border border-apple-gray-300 bg-white px-5 text-sm text-apple-gray-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-950 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 rounded-full bg-apple-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-apple-blue-700 disabled:opacity-60"
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-3 text-xs text-apple-red-600">
                Could not subscribe just now. Please try again.
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              By subscribing you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-apple-blue-600">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-apple-gray-200 dark:border-apple-gray-800">
        <div className="container-apple py-6">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
            <div className="text-center text-xs text-muted-foreground lg:text-left">
              <p>
                © {currentYear} {INDIA.legalName}. All rights reserved.
              </p>
              <p className="mt-1">
                GSTIN {INDIA.gstin} · CIN {INDIA.cin} · Made in India for dealer-led rooftops.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-apple-blue-600">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-apple-blue-600">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-apple-blue-600">
                Cookies
              </Link>
              <Link href="/accessibility" className="hover:text-apple-blue-600">
                Accessibility
              </Link>
              <Link href="/contact" className="hover:text-apple-blue-600">
                Grievance redressal
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-apple-gray-500">
              {["UPI", "RuPay", "Visa", "Mastercard", "Net Banking", "NEFT / RTGS"].map((method) => (
                <span
                  key={method}
                  className="rounded border border-apple-gray-200 px-2 py-1 dark:border-apple-gray-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
