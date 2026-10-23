"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { INDIAN_STATES_AND_UTS, isValidIndianPhone, isValidPincode } from "@/lib/india"
import { cn } from "@/lib/utils"
import { MapPin, Plus, Trash2, CheckCircle, Home, Building2, X } from "lucide-react"

interface SavedAddress {
  id: string
  label: string
  fullName: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

const STORAGE_KEY = "solarstore.addresses"

const seedAddresses: SavedAddress[] = [
  {
    id: "addr-home",
    label: "Home",
    fullName: "Rajesh Kumar",
    phone: "9876543210",
    line1: "402, Lotus Residency, Baner Road",
    line2: "Near Balewadi Stadium",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    isDefault: true,
  },
  {
    id: "addr-office",
    label: "Office",
    fullName: "Rajesh Kumar",
    phone: "9876543210",
    line1: "7th Floor, Prestige Atrium, MG Road",
    line2: "",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226010",
    isDefault: false,
  },
]

const emptyForm = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Uttar Pradesh",
  pincode: "",
}

export default function AddressesPage() {
  const { user } = useAuth()
  const [mounted, setMounted] = React.useState(false)
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState(emptyForm)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setMounted(true)
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        setAddresses(Array.isArray(parsed) ? (parsed as SavedAddress[]) : seedAddresses)
      } else {
        setAddresses(seedAddresses)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAddresses))
      }
    } catch {
      setAddresses(seedAddresses)
    }
  }, [])

  const persist = (next: SavedAddress[]) => {
    setAddresses(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      setError("Could not save this address in your browser.")
    }
  }

  const openForm = () => {
    setForm({
      ...emptyForm,
      fullName: user?.name ?? "",
      phone: user?.phone?.replace(/\D/g, "").slice(-10) ?? "",
    })
    setError("")
    setShowForm(true)
  }

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError("")
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (form.fullName.trim().length < 2) {
      setError("Please enter the full name for this address.")
      return
    }
    if (!isValidIndianPhone(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.")
      return
    }
    if (form.line1.trim().length < 5) {
      setError("Please enter the building and street address.")
      return
    }
    if (!form.city.trim()) {
      setError("Please enter the city.")
      return
    }
    if (!isValidPincode(form.pincode)) {
      setError("Enter a valid 6-digit Indian pincode.")
      return
    }

    const record: SavedAddress = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `addr-${Date.now()}`,
      label: form.label.trim() || "Home",
      fullName: form.fullName.trim(),
      phone: form.phone.replace(/\D/g, "").slice(-10),
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode,
      isDefault: addresses.length === 0,
    }
    persist([...addresses, record])
    setShowForm(false)
    setForm(emptyForm)
  }

  const setDefault = (id: string) => {
    persist(addresses.map((address) => ({ ...address, isDefault: address.id === id })))
  }

  const remove = (id: string) => {
    const next = addresses.filter((address) => address.id !== id)
    if (next.length > 0 && !next.some((address) => address.isDefault)) {
      next[0] = { ...next[0]!, isDefault: true }
    }
    persist(next)
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-44 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
          <div className="h-44 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            Addresses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Delivery addresses saved on this device. Used to speed up checkout.
          </p>
        </div>
        {!showForm && (
          <Button onClick={openForm}>
            <Plus className="mr-2 h-4 w-4" /> Add address
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                  New delivery address
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use a pincode served by our India logistics partners.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} aria-label="Close form">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={save} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="address-label" className="mb-1.5 block text-sm font-medium">
                    Label
                  </label>
                  <select
                    id="address-label"
                    value={form.label}
                    onChange={(event) => update("label", event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm dark:border-apple-gray-600 dark:bg-apple-gray-900"
                  >
                    <option>Home</option>
                    <option>Office</option>
                    <option>Site</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="address-name" className="mb-1.5 block text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="address-name"
                    value={form.fullName}
                    onChange={(event) => update("fullName", event.target.value)}
                    placeholder="Name of the person receiving delivery"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address-phone" className="mb-1.5 block text-sm font-medium">
                    Mobile number
                  </label>
                  <Input
                    id="address-phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address-pincode" className="mb-1.5 block text-sm font-medium">
                    Pincode
                  </label>
                  <Input
                    id="address-pincode"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={(event) => update("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="560001"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address-line1" className="mb-1.5 block text-sm font-medium">
                    Flat / building / street
                  </label>
                  <Input
                    id="address-line1"
                    value={form.line1}
                    onChange={(event) => update("line1", event.target.value)}
                    placeholder="Flat 402, Lotus Residency, Baner Road"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address-line2" className="mb-1.5 block text-sm font-medium">
                    Landmark / area <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="address-line2"
                    value={form.line2}
                    onChange={(event) => update("line2", event.target.value)}
                    placeholder="Near Balewadi Stadium"
                  />
                </div>
                <div>
                  <label htmlFor="address-city" className="mb-1.5 block text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="address-city"
                    value={form.city}
                    onChange={(event) => update("city", event.target.value)}
                    placeholder="Pune"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address-state" className="mb-1.5 block text-sm font-medium">
                    State / UT
                  </label>
                  <select
                    id="address-state"
                    value={form.state}
                    onChange={(event) => update("state", event.target.value)}
                    className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm dark:border-apple-gray-600 dark:bg-apple-gray-900"
                  >
                    {INDIAN_STATES_AND_UTS.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-apple-red-600">{error}</p>}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save address</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <MapPin className="mx-auto h-9 w-9 text-apple-gray-300" />
            <h2 className="mt-4 text-headline-md font-semibold">No saved addresses</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Add a delivery address to make your next solar order faster.
            </p>
            <Button className="mt-5" onClick={openForm}>
              <Plus className="mr-2 h-4 w-4" /> Add address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={cn(address.isDefault && "border-apple-gray-900 dark:border-white")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {address.label === "Home" ? (
                      <Home className="h-4 w-4 text-apple-gray-500" />
                    ) : (
                      <Building2 className="h-4 w-4 text-apple-gray-500" />
                    )}
                    <span className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                      {address.label}
                    </span>
                    {address.isDefault && <Badge variant="solar">Default</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-apple-gray-400 hover:text-apple-red-600"
                    onClick={() => remove(address.id)}
                    aria-label={`Delete ${address.label} address`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <address className="mt-3 text-sm not-italic leading-relaxed text-apple-gray-600 dark:text-apple-gray-400">
                  <span className="font-medium text-apple-gray-900 dark:text-white">
                    {address.fullName}
                  </span>
                  <br />
                  {address.line1}
                  {address.line2 && (
                    <>
                      <br />
                      {address.line2}
                    </>
                  )}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                  <br />
                  India · +91 {address.phone}
                </address>
                {!address.isDefault && (
                  <button
                    onClick={() => setDefault(address.id)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-apple-blue-600 hover:underline"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Set as default
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Addresses are stored in this browser for the demonstration. Checkout accepts any valid Indian
        address. Large solar shipments may need a ground-floor delivery point or lift access.
      </p>
    </div>
  )
}
