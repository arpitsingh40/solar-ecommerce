"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Building2, CheckCircle, Download, LogOut, ShieldCheck, Mail, Phone, User } from "lucide-react"

const STORAGE_KEY = "solarstore.preferences"

const defaultPreferences = {
  orderWhatsapp: true,
  productNews: true,
  subsidyGuides: true,
  priceAlerts: false,
}

const preferenceLabels = [
  {
    key: "orderWhatsapp" as const,
    title: "Order updates on WhatsApp",
    description: "Dispatch, delivery and net-metering updates on your registered mobile number.",
  },
  {
    key: "productNews" as const,
    title: "New kits and dealer offers",
    description: "Occasional emails about new kit SKUs, margins and freight offers. No spam.",
  },
  {
    key: "subsidyGuides" as const,
    title: "PM Surya Ghar updates",
    description: "Changes to subsidy rules, documents and state-wise schemes.",
  },
  {
    key: "priceAlerts" as const,
    title: "Dealer price alerts",
    description: "Tell me when saved kits or dealer pricing changes.",
  },
]

export default function DashboardSettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = React.useState(defaultPreferences)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (parsed && typeof parsed === "object") {
          setPreferences((current) => ({ ...current, ...(parsed as Partial<typeof current>) }))
        }
      }
    } catch {
      // Use defaults if storage is unavailable.
    }
  }, [])

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
    setSaved(false)
  }

  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    setSaved(true)
  }

  const downloadData = () => {
    const payload = {
      account: user
        ? {
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            role: user.role,
            createdAt: user.createdAt,
          }
        : null,
      preferences,
      exportedAt: new Date().toISOString(),
      note: "Demonstration storefront. Cart and demo orders are stored separately in this browser.",
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "solarstore-account-data.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
          Account settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account details, notification preferences and data controls.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Name</p>
                <p className="mt-0.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                  {user?.name ?? "—"}
                </p>
              </div>
            </div>
            {user?.companyName && (
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Business</p>
                  <p className="mt-0.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                    {user.companyName}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="mt-0.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Mobile</p>
                <p className="mt-0.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                  {user?.phone ? `+91 ${user.phone}` : "Not added"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Account</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {user?.role === "customer" ? "Dealer" : (user?.role ?? "Dealer")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Member since {memberSince}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-5 border-t border-apple-gray-100 pt-4 text-xs text-muted-foreground dark:border-apple-gray-800">
            To change your name, email or registered mobile number, contact support with your account
            email. Changes to email require re-verification.
          </p>
          <Button variant="outline" asChild className="mt-3">
            <Link href="/support">Contact support</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferenceLabels.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-apple-gray-200 p-4 dark:border-apple-gray-800"
            >
              <span>
                <span className="block text-sm font-medium text-apple-gray-900 dark:text-white">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </span>
              <input
                type="checkbox"
                checked={preferences[item.key]}
                onChange={() => toggle(item.key)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-apple-gray-900"
                aria-label={item.title}
              />
            </label>
          ))}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button onClick={save}>Save preferences</Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-apple-green-600">
                <CheckCircle className="h-4 w-4" /> Preferences saved.
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Order and warranty messages are always sent because they are necessary to fulfil your
            purchase. Marketing preferences can be changed at any time.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Privacy and data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Download a copy of your account and preferences. Cart, saved kits and demonstration orders
            are stored locally in your browser and are not included in this export.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadData}>
              <Download className="mr-2 h-4 w-4" /> Download my data
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy">Privacy policy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/terms">Terms of sale</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Sign out</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign out of SolarStore on this browser. Your kit order and saved kits stay on this device.
          </p>
          <Button variant="outline" onClick={handleSignOut} className="mt-4">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
