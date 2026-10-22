"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IndianRupee,
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Warehouse,
  Star,
  Truck,
  ArrowRight,
} from "lucide-react"
import { formatINR } from "@/lib/india"
import { useAuth } from "@/hooks/use-auth"

const stats = [
  {
    name: "Revenue this month",
    value: "₹45,20,000",
    change: "+15.3%",
    icon: IndianRupee,
    bg: "bg-apple-green-100 dark:bg-apple-green-900/30",
    color: "text-apple-green-600",
  },
  {
    name: "Orders fulfilled",
    value: "156",
    change: "+8.7%",
    icon: CheckCircle,
    bg: "bg-apple-blue-100 dark:bg-apple-blue-900/30",
    color: "text-apple-blue-600",
  },
  {
    name: "Average ship time",
    value: "1.2 days",
    change: "−0.3 days",
    icon: Clock,
    bg: "bg-apple-orange-100 dark:bg-apple-orange-900/30",
    color: "text-apple-orange-600",
  },
  {
    name: "Dealer rating",
    value: "4.9 / 5",
    change: "+0.1",
    icon: Star,
    bg: "bg-apple-yellow-100 dark:bg-apple-yellow-900/30",
    color: "text-apple-yellow-600",
  },
]

const recentOrders = [
  { id: "SUP-2026-1841", product: "LK-06 5kW Hybrid Kit", qty: 5, amount: 12_80_000, status: "shipped", date: "2026-10-19", city: "Lucknow" },
  { id: "SUP-2026-1840", product: "LK-03 3kW On-Grid Kit", qty: 10, amount: 11_20_000, status: "processing", date: "2026-10-19", city: "Kanpur" },
  { id: "SUP-2026-1839", product: "LK-04 3kW Hybrid Kit", qty: 6, amount: 9_54_000, status: "pending", date: "2026-10-18", city: "Lucknow" },
  { id: "SUP-2026-1838", product: "LK-05 5kW On-Grid Kit", qty: 8, amount: 13_60_000, status: "shipped", date: "2026-10-18", city: "Noida" },
  { id: "SUP-2026-1837", product: "LK-07 10kW Three-Phase Kit", qty: 4, amount: 12_72_000, status: "processing", date: "2026-10-17", city: "Varanasi" },
]

const inventoryAlerts = [
  { product: "LK-03 3kW On-Grid Kit", sku: "LK-03", current: 5, threshold: 10, status: "critical" },
  { product: "LK-06 5kW Hybrid Kit", sku: "LK-06", current: 8, threshold: 10, status: "low" },
  { product: "LK-08 15kW Commercial Kit", sku: "LK-08", current: 12, threshold: 20, status: "low" },
  { product: "LK-10 50kW Industrial Kit", sku: "LK-10", current: 45, threshold: 50, status: "low" },
]

const performance = [
  { label: "On-time delivery", value: "98.5%", icon: Truck, color: "text-apple-green-600" },
  { label: "Defect rate", value: "0.3%", icon: AlertTriangle, color: "text-apple-red-500" },
  { label: "Avg response", value: "2.1 hrs", icon: Clock, color: "text-apple-blue-600" },
  { label: "Dealer rating", value: "4.9 / 5", icon: Star, color: "text-apple-yellow-600" },
]

export default function SupplierDashboard() {
  const { user } = useAuth()
  const supplierName = user?.name || "SolarStore partner"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            Supplier dashboard
          </h1>
          <p className="mt-1 text-body-md text-muted-foreground">
            Welcome back, {supplierName}. Manage stock, orders and payouts across India.
          </p>
        </div>
        <Badge variant="success" className="w-fit px-3 py-1.5 text-sm">
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Verified supplier
        </Badge>
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
                <TrendingUp className="h-3 w-3 text-apple-green-500" />
                <span className="text-sm font-medium text-apple-green-600 dark:text-apple-green-400">
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {performance.map((metric) => (
          <Card key={metric.label} className="p-5 text-center">
            <metric.icon className={`mx-auto h-5 w-5 ${metric.color}`} />
            <p className="mt-2 text-2xl font-semibold text-apple-gray-900 dark:text-white">
              {metric.value}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-headline-md">
              <AlertTriangle className="h-5 w-5 text-apple-yellow-500" /> Inventory alerts
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/supplier/inventory">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryAlerts.map((alert) => (
                <div
                  key={alert.sku}
                  className={`flex flex-col justify-between gap-3 rounded-lg p-3 sm:flex-row sm:items-center ${
                    alert.status === "critical"
                      ? "border border-apple-red-200 bg-apple-red-50 dark:border-apple-red-800 dark:bg-apple-red-900/20"
                      : "border border-apple-yellow-200 bg-apple-yellow-50 dark:border-apple-yellow-800 dark:bg-apple-yellow-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-apple-gray-900/50">
                      {alert.status === "critical" ? (
                        <AlertTriangle className="h-4 w-4 text-apple-red-500" />
                      ) : (
                        <Warehouse className="h-4 w-4 text-apple-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-apple-gray-900 dark:text-white">
                        {alert.product}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {alert.current} / {alert.threshold} units
                    </span>
                    <Badge variant={alert.status === "critical" ? "destructive" : "warning"}>
                      {alert.status === "critical" ? "Critical" : "Low stock"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-headline-md">Recent orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/supplier/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
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
                        {order.product}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.qty} units · {order.city} ·{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                      {formatINR(order.amount)}
                    </span>
                    <Badge variant={orderVariant(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Payout summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Next payout</p>
              <p className="mt-1 text-2xl font-semibold text-apple-gray-900 dark:text-white">
                {formatINR(8_42_500)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Due 7 November 2026 · UPI ending 4821
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last payout</p>
              <p className="mt-1 text-2xl font-semibold text-apple-gray-900 dark:text-white">
                {formatINR(6_91_200)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Paid 7 October 2026</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission rate</p>
              <p className="mt-1 text-2xl font-semibold text-apple-gray-900 dark:text-white">12%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Applied to delivered orders excluding GST
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="mt-5">
            <Link href="/supplier/payouts">
              View payout history <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline-md">Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/supplier/products">
                <Package className="h-6 w-6" />
                <span>My products</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/supplier/inventory">
                <Warehouse className="h-6 w-6" />
                <span>Update stock</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/supplier/orders">
                <ShoppingCart className="h-6 w-6" />
                <span>Process orders</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/supplier/payouts">
                <IndianRupee className="h-6 w-6" />
                <span>Payouts</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function orderVariant(status: string) {
  switch (status) {
    case "shipped":
      return "info" as const
    case "delivered":
      return "success" as const
    case "processing":
      return "warning" as const
    default:
      return "default" as const
  }
}
