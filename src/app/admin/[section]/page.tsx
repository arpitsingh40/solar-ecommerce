"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { products, categories } from "@/lib/data/catalog"
import { formatINR } from "@/lib/india"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  BarChart3,
  Download,
  IndianRupee,
  Package,
  Search,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Warehouse,
  AlertTriangle,
  CheckCircle,
  Save,
} from "lucide-react"

const sections = {
  products: {
    title: "Products",
    description: "Your India catalogue, prices inclusive of 5% GST.",
    icon: Package,
  },
  orders: {
    title: "Orders",
    description: "Orders, payments and fulfilment across India.",
    icon: ShoppingCart,
  },
  customers: {
    title: "Dealers",
    description: "Registered dealer businesses and their kit purchases.",
    icon: Users,
  },
  inventory: {
    title: "Inventory",
    description: "Stock on hand and reorder alerts from the Lucknow warehouse.",
    icon: Warehouse,
  },
  analytics: {
    title: "Analytics",
    description: "Demand, conversion and category performance in India.",
    icon: BarChart3,
  },
  settings: {
    title: "Store settings",
    description: "GST, delivery, support and storefront preferences.",
    icon: Store,
  },
} as const

type SectionKey = keyof typeof sections

const adminOrders = [
  { id: "SS-20261019-1042", customer: "Rohit Srivastava", city: "Lucknow", date: "19 Oct 2026", total: 1_12_000, payment: "UPI", status: "processing" },
  { id: "SS-20261019-1041", customer: "Neeraj Verma", city: "Kanpur", date: "19 Oct 2026", total: 1_70_000, payment: "Netbanking", status: "shipped" },
  { id: "SS-20261018-1040", customer: "Anand Gupta", city: "Lucknow", date: "18 Oct 2026", total: 2_56_000, payment: "Netbanking", status: "delivered" },
  { id: "SS-20261018-1039", customer: "Sneha Iyer", city: "Noida", date: "18 Oct 2026", total: 79_000, payment: "UPI", status: "pending" },
  { id: "SS-20261017-1038", customer: "Vikram Singh", city: "Varanasi", date: "17 Oct 2026", total: 44_000, payment: "UPI", status: "cancelled" },
  { id: "SS-20261017-1037", customer: "Ananya Das", city: "Prayagraj", date: "17 Oct 2026", total: 3_18_000, payment: "Card", status: "delivered" },
  { id: "SS-20261016-1036", customer: "Mohammed Irfan", city: "Lucknow", date: "16 Oct 2026", total: 1_59_000, payment: "Card", status: "shipped" },
  { id: "SS-20261016-1035", customer: "Kavita Joshi", city: "Agra", date: "16 Oct 2026", total: 13_32_000, payment: "Netbanking", status: "delivered" },
]

const customers = [
  { name: "Rohit Srivastava", email: "rohit@lucknowsolar.in", city: "Lucknow, Uttar Pradesh", orders: 3, spend: 3_94_000, type: "Dealer" },
  { name: "Neeraj Verma", email: "neeraj@kanpursolar.in", city: "Kanpur, Uttar Pradesh", orders: 1, spend: 1_70_000, type: "Dealer" },
  { name: "Amit Patel", email: "amit@upenergy.in", city: "Noida, Uttar Pradesh", orders: 2, spend: 6_49_000, type: "EPC partner" },
  { name: "Sneha Iyer", email: "sneha@agraenergy.in", city: "Agra, Uttar Pradesh", orders: 4, spend: 2_41_000, type: "Dealer" },
  { name: "Vikram Singh", email: "vikram@varanasisolar.in", city: "Varanasi, Uttar Pradesh", orders: 2, spend: 3_18_000, type: "Dealer" },
  { name: "Ananya Das", email: "ananya@prayagrajsolar.in", city: "Prayagraj, Uttar Pradesh", orders: 1, spend: 1_32_000, type: "Dealer" },
]

const demand = [
  { state: "Uttar Pradesh", share: 34 },
  { state: "Delhi NCR", share: 16 },
  { state: "Bihar", share: 12 },
  { state: "Madhya Pradesh", share: 10 },
  { state: "Rajasthan", share: 9 },
  { state: "Haryana", share: 8 },
  { state: "Maharashtra", share: 6 },
  { state: "Others", share: 5 },
]

export default function AdminSectionPage() {
  const params = useParams<{ section: string }>()
  const section = params.section as SectionKey
  const config = sections[section]
  if (!config) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin/dashboard" className="hover:text-apple-gray-900">
              Admin
            </Link>
            <span>/</span>
            <span>{config.title}</span>
          </div>
          <h1 className="mt-1 text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Store className="mr-2 h-4 w-4" /> View store
            </Link>
          </Button>
        </div>
      </div>

      {section === "products" && <ProductsPanel />}
      {section === "orders" && <OrdersPanel />}
      {section === "customers" && <CustomersPanel />}
      {section === "inventory" && <InventoryPanel />}
      {section === "analytics" && <AnalyticsPanel />}
      {section === "settings" && <SettingsPanel />}
    </div>
  )
}

function ProductsPanel() {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("all")

  const filtered = products.filter((product) => {
    const matchesCategory = category === "all" || product.categoryId === category
    const haystack = `${product.name} ${product.sku} ${product.brand?.name ?? ""}`.toLowerCase()
    return matchesCategory && haystack.includes(query.trim().toLowerCase())
  })

  const exportCatalogue = () => {
    const rows = [
      ["Name", "SKU", "Brand", "Category", "Price INR", "Stock", "Status"],
      ...products.map((product) => [
        product.name,
        product.sku,
        product.brand?.name ?? "",
        product.category?.name ?? "",
        String(product.salePrice ?? product.basePrice),
        String(product.stock),
        product.status,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "solarstore-catalogue.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-headline-md">{products.length} products</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-9 w-full pl-9 sm:w-56"
              aria-label="Search products"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="h-9 rounded-lg border border-apple-gray-300 bg-white px-3 text-sm dark:border-apple-gray-600 dark:bg-apple-gray-900"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" onClick={exportCatalogue}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
            <tr>
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">SKU</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 text-right font-medium">Price</th>
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
                        className="block max-w-[280px] truncate font-medium text-apple-gray-900 hover:text-apple-blue-600 dark:text-white"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{product.brand?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{product.sku}</td>
                <td className="px-3 py-3 text-sm">{product.category?.name}</td>
                <td className="px-3 py-3 text-right font-medium">
                  {formatINR(product.salePrice ?? product.basePrice)}
                </td>
                <td className="px-3 py-3 text-right">{product.stock}</td>
                <td className="py-3 pl-3 text-right">
                  <Badge variant={product.status === "active" ? "success" : "warning"}>
                    {product.status === "active" ? "Active" : "Low stock"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No products match your search.</p>
        )}
      </CardContent>
    </Card>
  )
}

function OrdersPanel() {
  const [status, setStatus] = React.useState("all")
  const [liveOrders, setLiveOrders] = React.useState<typeof adminOrders>([])

  React.useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orders && Array.isArray(data.orders)) {
          const mapped = data.orders.map((o: any) => ({
            id: o.id,
            customer: o.address?.fullName || "Dealer",
            city: o.address?.city || "Lucknow",
            date: new Date(o.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            total: o.total,
            payment: (o.paymentMethod || "UPI").toUpperCase(),
            status: o.status || "processing",
          }))
          setLiveOrders(mapped)
        }
      })
      .catch(() => {})
  }, [])

  const combinedOrders = React.useMemo(() => {
    const existingIds = new Set(liveOrders.map((o) => o.id))
    return [...liveOrders, ...adminOrders.filter((o) => !existingIds.has(o.id))]
  }, [liveOrders])

  const filtered = combinedOrders.filter((order) => status === "all" || order.status === status)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-headline-md">{filtered.length} orders</CardTitle>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter orders by status"
          className="h-9 rounded-lg border border-apple-gray-300 bg-white px-3 text-sm dark:border-apple-gray-600 dark:bg-apple-gray-900"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
            <tr>
              <th className="py-3 pr-4 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Dealer</th>
              <th className="px-3 py-3 font-medium">City</th>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Payment</th>
              <th className="px-3 py-3 text-right font-medium">Total</th>
              <th className="py-3 pl-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="py-3 pr-4 font-medium text-apple-gray-900 dark:text-white">{order.id}</td>
                <td className="px-3 py-3">{order.customer}</td>
                <td className="px-3 py-3 text-muted-foreground">{order.city}</td>
                <td className="px-3 py-3 text-muted-foreground">{order.date}</td>
                <td className="px-3 py-3">{order.payment}</td>
                <td className="px-3 py-3 text-right font-semibold">{formatINR(order.total)}</td>
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
          <p className="py-10 text-center text-sm text-muted-foreground">No orders with this status.</p>
        )}
      </CardContent>
    </Card>
  )
}

function CustomersPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-headline-md">8,420 registered dealers</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
            <tr>
              <th className="py-3 pr-4 font-medium">Dealer</th>
              <th className="px-3 py-3 font-medium">City</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 text-right font-medium">Orders</th>
              <th className="py-3 pl-3 text-right font-medium">Lifetime spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
            {customers.map((customer) => (
              <tr key={customer.email}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-apple-gray-900 dark:text-white">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{customer.city}</td>
                <td className="px-3 py-3">
                  <Badge variant="outline">{customer.type}</Badge>
                </td>
                <td className="px-3 py-3 text-right">{customer.orders}</td>
                <td className="py-3 pl-3 text-right font-semibold">{formatINR(customer.spend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function InventoryPanel() {
  const sorted = [...products].sort((a, b) => a.stock - b.stock)
  const lowStock = sorted.filter((product) => product.stock <= (product.lowStockThreshold ?? 10))
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0)
  const stockValue = products.reduce(
    (sum, product) => sum + product.stock * (product.salePrice ?? product.basePrice),
    0
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Units on hand</p>
            <p className="mt-1 text-display-md font-display font-bold">{totalUnits.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Stock value (retail)</p>
            <p className="mt-1 text-display-md font-display font-bold">{formatINR(stockValue)}</p>
          </CardContent>
        </Card>
        <Card className="border-apple-yellow-200 dark:border-apple-yellow-800">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-apple-yellow-500" /> Low-stock SKUs
            </p>
            <p className="mt-1 text-display-md font-display font-bold">{lowStock.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Stock levels</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-apple-gray-200 text-xs uppercase tracking-wider text-muted-foreground dark:border-apple-gray-800">
              <tr>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="px-3 py-3 font-medium">SKU</th>
                <th className="px-3 py-3 text-right font-medium">On hand</th>
                <th className="px-3 py-3 text-right font-medium">Reorder at</th>
                <th className="py-3 pl-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
              {sorted.map((product) => {
                const low = product.stock <= (product.lowStockThreshold ?? 10)
                return (
                  <tr key={product.id}>
                    <td className="max-w-[320px] truncate py-3 pr-4 font-medium text-apple-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{product.sku}</td>
                    <td className="px-3 py-3 text-right">{product.stock}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">
                      {product.lowStockThreshold ?? 10}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <Badge variant={low ? "warning" : "success"}>
                        {low ? (product.stock === 0 ? "Out of stock" : "Low stock") : "Healthy"}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue (30 days)", value: "₹1.27 Cr", icon: IndianRupee },
          { label: "Orders", value: "1,234", icon: ShoppingCart },
          { label: "Conversion", value: "3.24%", icon: TrendingUp },
          { label: "Repeat buyers", value: "38%", icon: Users },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <item.icon className="h-5 w-5 text-apple-gray-400" />
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
            <CardTitle className="text-headline-md">Demand by state</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {demand.map((item) => (
              <div key={item.state}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{item.state}</span>
                  <span className="font-medium">{item.share}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
                  <div
                    className="h-full rounded-full bg-apple-gray-900 dark:bg-white"
                    style={{ width: `${(item.share / 24) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-headline-md">Revenue by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "On-grid kits", share: 44, revenue: 78_60_000 },
              { name: "Hybrid kits", share: 21, revenue: 37_50_000 },
              { name: "Commercial kits", share: 35, revenue: 62_40_000 },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.share}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
                    <div
                      className="h-full rounded-full bg-apple-blue-500"
                      style={{ width: `${item.share * 2.6}%` }}
                    />
                  </div>
                </div>
                <span className="w-20 text-right text-xs font-medium">
                  {formatINR(item.revenue, { compact: true })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-apple-gray-900 dark:text-white">
              Looking for a specific report?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Export the order book or download the catalogue with current INR prices.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/orders">
                Orders <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/products">
                Products <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsPanel() {
  const [settings, setSettings] = React.useState({
    storeName: "SolarStore India",
    supportEmail: "support@solarstore.in",
    supportPhone: "+91 522 471 2200",
    gstin: "09AABCS1429B1ZX",
    gstRate: "5",
    freeShipping: "4999",
    shippingFee: "499",
    returnWindow: "7",
  })
  const [saved, setSaved] = React.useState(false)

  const update = (field: keyof typeof settings, value: string) => {
    setSettings((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      window.localStorage.setItem("solarstore.admin.settings", JSON.stringify(settings))
    } catch {
      // Settings are a demo convenience; ignore storage failures.
    }
    setSaved(true)
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Store details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name" id="storeName" value={settings.storeName} onChange={(value) => update("storeName", value)} />
          <Field label="Support email" id="supportEmail" type="email" value={settings.supportEmail} onChange={(value) => update("supportEmail", value)} />
          <Field label="Support phone" id="supportPhone" value={settings.supportPhone} onChange={(value) => update("supportPhone", value)} />
          <Field label="GSTIN" id="gstin" value={settings.gstin} onChange={(value) => update("gstin", value.toUpperCase())} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Tax and delivery</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="GST rate (%)" id="gstRate" type="number" value={settings.gstRate} onChange={(value) => update("gstRate", value)} />
          <Field label="Dealer freight included above (₹)" id="freeShipping" type="number" value={settings.freeShipping} onChange={(value) => update("freeShipping", value)} />
          <Field label="Standard delivery fee (₹)" id="shippingFee" type="number" value={settings.shippingFee} onChange={(value) => update("shippingFee", value)} />
          <Field label="Return window (days)" id="returnWindow" type="number" value={settings.returnWindow} onChange={(value) => update("returnWindow", value)} />
        </CardContent>
      </Card>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" /> Save settings
        </Button>
        {saved && (
          <p className="flex items-center gap-1.5 text-sm text-apple-green-600">
            <CheckCircle className="h-4 w-4" /> Settings saved in this browser.
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        This demonstration stores settings locally. A production deployment would persist them in
        the store database and audit every change.
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
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(type === "number" && "tabular-nums")}
      />
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
