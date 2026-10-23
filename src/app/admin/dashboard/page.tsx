"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Download,
  RefreshCw,
  Package,
  BarChart3,
  ExternalLink,
} from "lucide-react"
import { formatINR } from "@/lib/india"

const stats = [
  {
    name: "Revenue this month",
    value: "₹1.27 Cr",
    change: "+12.5%",
    icon: IndianRupee,
    bg: "bg-apple-green-100 dark:bg-apple-green-900/30",
    color: "text-apple-green-600",
  },
  {
    name: "Orders",
    value: "1,234",
    change: "+8.2%",
    icon: ShoppingCart,
    bg: "bg-apple-blue-100 dark:bg-apple-blue-900/30",
    color: "text-apple-blue-600",
  },
  {
    name: "Conversion rate",
    value: "3.24%",
    change: "+0.3%",
    icon: TrendingUp,
    bg: "bg-apple-orange-100 dark:bg-apple-orange-900/30",
    color: "text-apple-orange-600",
  },
  {
    name: "Average order value",
    value: "₹1,48,000",
    change: "+4.1%",
    icon: IndianRupee,
    bg: "bg-apple-purple-100 dark:bg-apple-purple-900/30",
    color: "text-apple-purple-600",
  },
]

const recentOrders = [
  { id: "SS-20261019-1042", customer: "Rohit Srivastava", date: "2026-10-19", total: 1_12_000, status: "processing", city: "Lucknow" },
  { id: "SS-20261019-1041", customer: "Neeraj Verma", date: "2026-10-19", total: 1_70_000, status: "shipped", city: "Kanpur" },
  { id: "SS-20261018-1040", customer: "Amit Patel", date: "2026-10-18", total: 2_56_000, status: "delivered", city: "Noida" },
  { id: "SS-20261018-1039", customer: "Sneha Iyer", date: "2026-10-18", total: 79_000, status: "pending", city: "Agra" },
  { id: "SS-20261017-1038", customer: "Vikram Singh", date: "2026-10-17", total: 44_000, status: "cancelled", city: "Varanasi" },
]

const topProducts = [
  { name: "LK-03 3kW On-Grid Solar Kit", sku: "LK-03", revenue: 46_20_000, sold: 41, category: "On-Grid Kits" },
  { name: "LK-05 5kW On-Grid Solar Kit", sku: "LK-05", revenue: 39_10_000, sold: 23, category: "On-Grid Kits" },
  { name: "LK-04 3kW Hybrid Solar Kit", sku: "LK-04", revenue: 35_76_000, sold: 22, category: "Hybrid Kits" },
  { name: "LK-06 5kW Hybrid Solar Kit", sku: "LK-06", revenue: 33_28_000, sold: 13, category: "Hybrid Kits" },
  { name: "LK-08 15kW Commercial Solar Kit", sku: "LK-08", revenue: 31_57_000, sold: 7, category: "Commercial Kits" },
]

const revenue = [
  { month: "Apr", value: 62 },
  { month: "May", value: 78 },
  { month: "Jun", value: 71 },
  { month: "Jul", value: 88 },
  { month: "Aug", value: 96 },
  { month: "Sep", value: 112 },
  { month: "Oct", value: 127 },
]

const statusCounts = [
  { status: "Pending", count: 23, color: "text-apple-yellow-500", bar: "bg-apple-yellow-500" },
  { status: "Processing", count: 45, color: "text-apple-blue-500", bar: "bg-apple-blue-500" },
  { status: "Shipped", count: 67, color: "text-apple-orange-500", bar: "bg-apple-orange-500" },
  { status: "Delivered", count: 890, color: "text-apple-green-500", bar: "bg-apple-green-500" },
  { status: "Cancelled", count: 12, color: "text-apple-red-500", bar: "bg-apple-red-500" },
  { status: "Returned", count: 8, color: "text-apple-gray-500", bar: "bg-apple-gray-400" },
]

const alerts = [
  { message: "5 products below minimum stock level", action: "View inventory", href: "/admin/inventory" },
  { message: "12 orders awaiting fulfilment", action: "Process orders", href: "/admin/orders" },
  { message: "3 reviews need moderation", action: "Moderate", href: "/admin/products" },
]

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = React.useState("Just now")
  const [liveOrders, setLiveOrders] = React.useState<typeof recentOrders>([])

  React.useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orders && Array.isArray(data.orders)) {
          const mapped = data.orders.map((o: any) => ({
            id: o.id,
            customer: o.address?.fullName || "Dealer",
            city: o.address?.city || "Lucknow",
            date: (o.createdAt || new Date().toISOString()).slice(0, 10),
            total: o.total,
            status: o.status || "processing",
          }))
          setLiveOrders(mapped)
        }
      })
      .catch(() => {})
  }, [])

  const displayOrders = React.useMemo(() => {
    const existingIds = new Set(liveOrders.map((o) => o.id))
    return [...liveOrders, ...recentOrders.filter((o) => !existingIds.has(o.id))].slice(0, 5)
  }, [liveOrders])

  const exportReport = () => {
    const rows = [
      ["Order", "Dealer", "City", "Date", "Total INR", "Status"],
      ...displayOrders.map((order) => [
        order.id,
        order.customer,
        order.city,
        order.date,
        String(order.total),
        order.status,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `solarstore-orders-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const refresh = () => {
    setLastUpdated(
      new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            Admin dashboard
          </h1>
          <p className="mt-1 text-body-md text-muted-foreground">
            Store performance across India. Last updated {lastUpdated}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" /> Export report
          </Button>
          <Button onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {alerts.map((alert) => (
          <Card
            key={alert.message}
            className="border-apple-yellow-200 bg-apple-yellow-50 dark:border-apple-yellow-800 dark:bg-apple-yellow-900/20"
          >
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-apple-yellow-100 dark:bg-apple-yellow-900/30">
                  <AlertTriangle className="h-4 w-4 text-apple-yellow-600 dark:text-apple-yellow-400" />
                </div>
                <p className="text-sm text-apple-gray-900 dark:text-white">{alert.message}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={alert.href}>{alert.action}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-body-md font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-display-md font-display font-bold text-apple-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-apple-green-500" />
                <span className="text-sm font-medium text-apple-green-600 dark:text-apple-green-400">
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-headline-md">Revenue overview</CardTitle>
            <select
              aria-label="Revenue period"
              className="rounded-lg border border-apple-gray-300 bg-white px-3 py-1 text-sm dark:border-apple-gray-600 dark:bg-apple-gray-800"
              defaultValue="7"
            >
              <option value="7">Last 7 months</option>
              <option value="3">Last 3 months</option>
              <option value="12">Last 12 months</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-2 sm:gap-3">
              {revenue.map((item) => {
                const max = Math.max(...revenue.map((entry) => entry.value))
                return (
                  <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      ₹{item.value}L
                    </span>
                    <div className="flex min-h-0 w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-apple-gray-900 transition-all hover:bg-apple-blue-600 dark:bg-white"
                        style={{ height: `${(item.value / max) * 100}%` }}
                        title={`${item.month}: ₹${item.value} lakh`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-apple-gray-100 pt-4 text-sm dark:border-apple-gray-800">
              <span className="text-muted-foreground">7-month revenue</span>
              <span className="font-semibold text-apple-gray-900 dark:text-white">₹6.34 Cr</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-headline-md">Orders by status</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">
                View all <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusCounts.map((item) => (
                <div key={item.status} className="flex items-center justify-between gap-4">
                  <div className="flex w-28 items-center gap-2.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${item.bar}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex flex-1 items-center justify-end gap-4">
                    <span className="text-sm font-semibold tabular-nums">{item.count}</span>
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-apple-gray-100 sm:w-40 dark:bg-apple-gray-800">
                      <div
                        className={`h-full rounded-full ${item.bar}`}
                        style={{ width: `${(item.count / 890) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-apple-gray-100 pt-4 text-xs text-muted-foreground dark:border-apple-gray-800">
              1,045 orders in the last 30 days across 28 states and 8 union territories.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-headline-md">Recent orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col justify-between gap-3 rounded-lg bg-apple-gray-50 p-3 sm:flex-row sm:items-center dark:bg-apple-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-apple-blue-100 dark:bg-apple-blue-900/30">
                      <ShoppingCart className="h-5 w-5 text-apple-blue-600 dark:text-apple-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-apple-gray-900 dark:text-white">
                        {order.customer} · {order.city}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.id} ·{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                      {formatINR(order.total)}
                    </span>
                    <Badge variant={getOrderStatusVariant(order.status)} className="text-xs capitalize">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-headline-md">Top selling products</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.sku}
                  className="flex items-center gap-4 rounded-lg p-3 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-800/50"
                >
                  <span className="w-6 text-center text-lg font-semibold text-apple-gray-300 dark:text-apple-gray-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-apple-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sku} · {product.sold} sold · {product.category}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-apple-gray-900 dark:text-white">
                    {formatINR(product.revenue, { compact: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Package, title: "Catalogue", text: "10 kit SKUs · 3 families", href: "/admin/products" },
          { icon: Users, title: "Dealers", text: "8,420 registered dealer businesses", href: "/admin/customers" },
          { icon: BarChart3, title: "Analytics", text: "Conversion and state demand", href: "/admin/analytics" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex items-start gap-3 rounded-xl border border-apple-gray-200 p-4 transition-colors hover:border-apple-gray-400 dark:border-apple-gray-800"
          >
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-apple-gray-500" />
            <div>
              <p className="text-sm font-medium text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                {item.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function getOrderStatusVariant(status: string) {
  switch (status) {
    case "delivered":
      return "success" as const
    case "shipped":
      return "info" as const
    case "processing":
      return "warning" as const
    case "pending":
      return "default" as const
    case "cancelled":
      return "destructive" as const
    default:
      return "default" as const
  }
}
