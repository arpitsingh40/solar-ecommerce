"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { products } from "@/lib/data/catalog"
import { formatINR } from "@/lib/india"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  IndianRupee,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  Warehouse,
} from "lucide-react"

const sections = {
  products: {
    title: "My kit SKUs",
    description: "Kit SKUs you supply to SolarStore India. Prices include 5% GST.",
    icon: Package,
  },
  orders: {
    title: "Orders",
    description: "Purchase orders from SolarStore and fulfilment status.",
    icon: ShoppingCart,
  },
  inventory: {
    title: "Inventory",
    description: "Stock at your Lucknow warehouse and reorder alerts.",
    icon: Warehouse,
  },
  payouts: {
    title: "Payouts",
    description: "Monthly settlements to your registered bank account.",
    icon: IndianRupee,
  },
  performance: {
    title: "Performance",
    description: "Delivery, quality and dealer satisfaction metrics.",
    icon: BarChart3,
  },
  settings: {
    title: "Supplier settings",
    description: "Business profile, pickup address and payment details.",
    icon: Store,
  },
} as const

type SectionKey = keyof typeof sections

const supplierProducts = products

const supplierOrders = [
  { id: "SUP-2026-1841", product: "LK-06 5 kW Hybrid Kit", qty: 5, amount: 12_80_000, status: "shipped", date: "2026-10-19", city: "Lucknow", payment: "Net 30" },
  { id: "SUP-2026-1840", product: "LK-03 3 kW On-Grid Kit", qty: 10, amount: 11_20_000, status: "processing", date: "2026-10-19", city: "Kanpur", payment: "Advance" },
  { id: "SUP-2026-1839", product: "LK-04 3 kW Hybrid Kit", qty: 6, amount: 9_54_000, status: "pending", date: "2026-10-18", city: "Lucknow", payment: "Advance" },
  { id: "SUP-2026-1838", product: "LK-05 5 kW On-Grid Kit", qty: 8, amount: 13_60_000, status: "shipped", date: "2026-10-18", city: "Noida", payment: "Net 30" },
  { id: "SUP-2026-1837", product: "LK-07 10 kW Three-Phase Kit", qty: 4, amount: 12_72_000, status: "processing", date: "2026-10-17", city: "Varanasi", payment: "Net 30" },
  { id: "SUP-2026-1836", product: "LK-08 15 kW Commercial Kit", qty: 2, amount: 9_02_000, status: "delivered", date: "2026-10-16", city: "Agra", payment: "Advance" },
  { id: "SUP-2026-1835", product: "LK-09 25 kW Commercial Kit", qty: 1, amount: 7_15_000, status: "delivered", date: "2026-10-15", city: "Lucknow", payment: "Net 30" },
]

const payouts = [
  { period: "October 2026", amount: 8_42_500, status: "Scheduled", date: "7 Nov 2026", reference: "—" },
  { period: "September 2026", amount: 6_91_200, status: "Paid", date: "7 Oct 2026", reference: "UTR HDFC26040712841" },
  { period: "August 2026", amount: 5_82_750, status: "Paid", date: "7 Sep 2026", reference: "UTR HDFC26090744120" },
  { period: "July 2026", amount: 4_96_300, status: "Paid", date: "7 Aug 2026", reference: "UTR HDFC26080719332" },
  { period: "June 2026", amount: 4_18_900, status: "Paid", date: "7 Jul 2026", reference: "UTR HDFC26070781245" },
]

export default function SupplierSectionPage() {
  const params = useParams<{ section: string }>()
  const section = params.section as SectionKey
  const config = sections[section]
  if (!config) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/supplier/dashboard" className="hover:text-apple-gray-900">
              Supplier
            </Link>
            <span>/</span>
            <span>{config.title}</span>
          </div>
          <h1 className="mt-1 text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <Store className="mr-2 h-4 w-4" /> View store
          </Link>
        </Button>
      </div>

      {section === "products" && <ProductsPanel />}
      {section === "orders" && <OrdersPanel />}
      {section === "inventory" && <InventoryPanel />}
      {section === "payouts" && <PayoutsPanel />}
      {section === "performance" && <PerformancePanel />}
      {section === "settings" && <SettingsPanel />}
    </div>
  )
}

function ProductsPanel() {
  const [query, setQuery] = React.useState("")
  const filtered = supplierProducts.filter((product) =>
    `${product.name} ${product.sku}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-headline-md">{supplierProducts.length} listings</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search listings"
            className="h-9 w-full pl-9 sm:w-64"
            aria-label="Search supplier listings"
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
            <tr>
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">SKU</th>
              <th className="px-3 py-3 text-right font-medium">Your price</th>
              <th className="px-3 py-3 text-right font-medium">Stock</th>
              <th className="py-3 pl-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block max-w-[260px] truncate font-medium text-apple-gray-900 hover:text-apple-blue-600 dark:text-white"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{product.brand?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{product.sku}</td>
                <td className="px-3 py-3 text-right font-medium">
                  {formatINR(product.salePrice ?? product.basePrice)}
                </td>
                <td className="px-3 py-3 text-right">{product.stock}</td>
                <td className="py-3 pl-3 text-right">
                  <Badge variant={product.stock > 10 ? "success" : "warning"}>
                    {product.stock > 10 ? "Live" : "Low stock"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No listings match your search.</p>
        )}
      </CardContent>
    </Card>
  )
}

function OrdersPanel() {
  const [status, setStatus] = React.useState("all")
  const filtered = supplierOrders.filter((order) => status === "all" || order.status === status)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-headline-md">{filtered.length} purchase orders</CardTitle>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter purchase orders by status"
          className="h-9 rounded-lg border border-apple-gray-300 bg-white px-3 text-sm dark:border-apple-gray-600 dark:bg-apple-gray-900"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
            <tr>
              <th className="py-3 pr-4 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Product</th>
              <th className="px-3 py-3 text-right font-medium">Qty</th>
              <th className="px-3 py-3 font-medium">Ship to</th>
              <th className="px-3 py-3 font-medium">Terms</th>
              <th className="px-3 py-3 text-right font-medium">Amount</th>
              <th className="py-3 pl-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-apple-gray-900 dark:text-white">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </td>
                <td className="max-w-[220px] truncate px-3 py-3">{order.product}</td>
                <td className="px-3 py-3 text-right">{order.qty}</td>
                <td className="px-3 py-3 text-muted-foreground">{order.city}</td>
                <td className="px-3 py-3">{order.payment}</td>
                <td className="px-3 py-3 text-right font-semibold">{formatINR(order.amount)}</td>
                <td className="py-3 pl-3 text-right">
                  <Badge variant={orderVariant(order.status)} className="capitalize">
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No purchase orders with this status.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function InventoryPanel() {
  const initial = React.useMemo(
    () =>
      supplierProducts
        .filter((product) => product.stock <= 25)
        .map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          stock: product.stock,
          threshold: product.lowStockThreshold ?? 10,
        })),
    []
  )
  const [items, setItems] = React.useState(initial)
  const [restocked, setRestocked] = React.useState<string[]>([])

  const restock = (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, stock: item.stock + 20 } : item))
    )
    setRestocked((current) => [...current, id])
  }

  const healthy = items.filter((item) => item.stock > item.threshold).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">SKUs tracked</p>
            <p className="mt-1 text-display-md font-display font-bold">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Below reorder point</p>
            <p className="mt-1 text-display-md font-display font-bold">{items.length - healthy}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Healthy SKUs</p>
            <p className="mt-1 text-display-md font-display font-bold text-apple-green-600">
              {healthy}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Low-stock items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => {
            const low = item.stock <= item.threshold
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-apple-gray-200 p-4 sm:flex-row sm:items-center dark:border-apple-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-apple-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sku} · {item.stock} on hand · reorder at {item.threshold}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={low ? "warning" : "success"}>
                    {low ? "Low stock" : "Healthy"}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => restock(item.id)}>
                    {restocked.includes(item.id) ? (
                      <>
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Restocked
                      </>
                    ) : (
                      <>
                        <Plus className="mr-1.5 h-3.5 w-3.5" /> Add 20
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
          <p className="pt-2 text-xs text-muted-foreground">
            Restock actions in this demonstration update the page only. Production would create a
            warehouse transfer and update live inventory.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function PayoutsPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Next payout</p>
            <p className="mt-1 text-display-md font-display font-bold">{formatINR(8_42_500)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Scheduled for 7 November 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Paid this year</p>
            <p className="mt-1 text-display-md font-display font-bold">{formatINR(56_38_450)}</p>
            <p className="mt-1 text-xs text-muted-foreground">April–September 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Commission rate</p>
            <p className="mt-1 text-display-md font-display font-bold">12%</p>
            <p className="mt-1 text-xs text-muted-foreground">On delivered value, excluding GST</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-headline-md">Payout history</CardTitle>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Statement
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
              <tr>
                <th className="py-3 pr-4 font-medium">Period</th>
                <th className="px-3 py-3 text-right font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="py-3 pl-3 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
              {payouts.map((payout) => (
                <tr key={payout.period}>
                  <td className="py-3 pr-4 font-medium text-apple-gray-900 dark:text-white">
                    {payout.period}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">{formatINR(payout.amount)}</td>
                  <td className="px-3 py-3">
                    <Badge variant={payout.status === "Paid" ? "success" : "info"}>
                      {payout.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{payout.date}</td>
                  <td className="py-3 pl-3 text-xs text-muted-foreground">{payout.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function PerformancePanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "On-time delivery", value: "98.5%", icon: Truck, color: "text-apple-green-600" },
          { label: "Defect rate", value: "0.3%", icon: AlertTriangle, color: "text-apple-red-500" },
          { label: "Avg response", value: "2.1 hrs", icon: Clock, color: "text-apple-blue-600" },
          { label: "Rating", value: "4.9 / 5", icon: Star, color: "text-apple-yellow-600" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <p className="mt-3 text-2xl font-semibold text-apple-gray-900 dark:text-white">
                {item.value}
              </p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-headline-md">On-time delivery trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-3">
              {[
                { month: "May", value: 94 },
                { month: "Jun", value: 96 },
                { month: "Jul", value: 95 },
                { month: "Aug", value: 97 },
                { month: "Sep", value: 98 },
                { month: "Oct", value: 98.5 },
              ].map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">{item.value}%</span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-apple-green-500"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-headline-md">Quality scorecard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Packaging quality", score: 96 },
              { label: "Documentation accuracy", score: 94 },
              { label: "Response time", score: 92 },
              { label: "Warranty support", score: 89 },
              { label: "Catalogue accuracy", score: 97 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
                  <div
                    className="h-full rounded-full bg-apple-gray-900 dark:bg-white"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const [form, setForm] = React.useState({
    businessName: "Suryodaya Solar Kits Pvt Ltd",
    gstin: "09AABCS1429B1ZX",
    contactName: "Meera Rao",
    email: "accounts@suryodayasolar.in",
    phone: "5224712200",
    address: "Plot 42, Amausi Industrial Area",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226009",
    bank: "HDFC Bank — Amausi branch",
    account: "XXXX XXXX 4821",
    ifsc: "HDFC0000421",
  })
  const [saved, setSaved] = React.useState(false)

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    window.localStorage.setItem("solarstore.supplier.settings", JSON.stringify(form))
    setSaved(true)
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Business profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Registered business name" id="businessName" value={form.businessName} onChange={(value) => update("businessName", value)} />
          <Field label="GSTIN" id="supplierGstin" value={form.gstin} onChange={(value) => update("gstin", value.toUpperCase())} />
          <Field label="Contact name" id="contactName" value={form.contactName} onChange={(value) => update("contactName", value)} />
          <Field label="Email" id="supplierEmail" type="email" value={form.email} onChange={(value) => update("email", value)} />
          <Field label="Phone" id="supplierPhone" value={form.phone} onChange={(value) => update("phone", value.replace(/\D/g, "").slice(0, 10))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Pickup address</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Address" id="supplierAddress" value={form.address} onChange={(value) => update("address", value)} />
          </div>
          <Field label="City" id="supplierCity" value={form.city} onChange={(value) => update("city", value)} />
          <Field label="State" id="supplierState" value={form.state} onChange={(value) => update("state", value)} />
          <Field label="Pincode" id="supplierPincode" value={form.pincode} onChange={(value) => update("pincode", value.replace(/\D/g, "").slice(0, 6))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Settlement account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Bank" id="supplierBank" value={form.bank} onChange={(value) => update("bank", value)} />
          <Field label="Account number" id="supplierAccount" value={form.account} onChange={(value) => update("account", value)} />
          <Field label="IFSC" id="supplierIfsc" value={form.ifsc} onChange={(value) => update("ifsc", value.toUpperCase())} />
        </CardContent>
      </Card>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button type="submit">
          <CheckCircle className="mr-2 h-4 w-4" /> Save supplier profile
        </Button>
        {saved && <p className="text-sm text-apple-green-600">Profile saved in this browser.</p>}
      </div>
      <p className="text-xs text-muted-foreground">
        Bank changes in production require re-verification and a cooling period before the next
        payout. This demo stores details locally.
      </p>
    </form>
  )
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

function orderVariant(status: string) {
  switch (status) {
    case "delivered":
      return "success" as const
    case "shipped":
      return "info" as const
    case "processing":
      return "warning" as const
    case "cancelled":
      return "destructive" as const
    default:
      return "default" as const
  }
}
