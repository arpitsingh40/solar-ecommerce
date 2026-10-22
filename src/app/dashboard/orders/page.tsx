"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOrders, paymentMethodLabels, type StoredOrder } from "@/lib/orders"
import { formatINR } from "@/lib/india"
import { Package, ArrowRight, Truck, MapPin, CreditCard, ShoppingBag } from "lucide-react"

const sampleOrders = [
  {
    id: "SS-20260918-1042",
    date: "2026-09-18",
    status: "Delivered",
    total: 1_64_990,
    items: ["3kW On-Grid Rooftop Solar Kit"],
    payment: "UPI",
    city: "Pune, Maharashtra",
    delivery: "Delivered on 23 September 2026",
  },
  {
    id: "SS-20260802-1036",
    date: "2026-08-02",
    status: "Shipped",
    total: 59_990,
    items: ["Growatt 5kW Hybrid Inverter"],
    payment: "Card",
    city: "Coimbatore, Tamil Nadu",
    delivery: "Expected 7 August 2026",
  },
  {
    id: "SS-20260711-1021",
    date: "2026-07-11",
    status: "Processing",
    total: 13_990,
    items: ["Exide 150Ah Tubular Battery"],
    payment: "NEFT",
    city: "Lucknow, Uttar Pradesh",
    delivery: "Dispatch in 7–12 business days",
  },
]

export default function DashboardOrdersPage() {
  const [mounted, setMounted] = React.useState(false)
  const [orders, setOrders] = React.useState<StoredOrder[]>([])

  React.useEffect(() => {
    setMounted(true)
    setOrders(getOrders())
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="h-64 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            Kit orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length > 0
              ? `${orders.length} dealer order${orders.length === 1 ? "" : "s"} placed on this device, plus sample history.`
              : "Your dealer kit order history and dispatch status."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" /> Browse dealer kits
          </Link>
        </Button>
      </div>

      {orders.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Placed on this device
          </h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-apple-green-50 dark:bg-apple-green-900/20">
                        <Package className="h-6 w-6 text-apple-green-700 dark:text-apple-green-400" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-apple-gray-900 dark:text-white">{order.id}</p>
                          <Badge variant="success">Confirmed</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Placed{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          · {order.items.length} kit{order.items.length === 1 ? "" : "s"}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                          {order.items.map((item) => (
                            <li key={item.productId}>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {order.address.city}, {order.address.state} {order.address.pincode}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5" />
                            {paymentMethodLabels[order.paymentMethod]} ·{" "}
                            {order.paymentStatus === "paid" ? "Paid" : "Payment pending"}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" />
                            {order.deliveryEstimate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold text-apple-gray-900 dark:text-white">
                          {formatINR(order.total)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/order-confirmation?id=${encodeURIComponent(order.id)}`}>
                          View order <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sample order history
        </h2>
        <Card>
          <CardContent className="divide-y divide-apple-gray-100 p-0 dark:divide-apple-gray-800">
            {sampleOrders.map((order) => (
              <div key={order.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-apple-gray-50 dark:bg-apple-gray-900">
                    <Package className="h-5 w-5 text-apple-gray-600 dark:text-apple-gray-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-apple-gray-900 dark:text-white">{order.id}</p>
                      <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                      <Badge variant="outline">Sample</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {order.items.join(", ")}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {order.city} · {order.payment} · {order.delivery}
                    </p>
                  </div>
                </div>
                <p className="text-base font-semibold text-apple-gray-900 dark:text-white">
                  {formatINR(order.total)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl bg-apple-gray-50 p-5 text-sm text-muted-foreground dark:bg-apple-gray-900">
        <p>
          Orders placed through this demonstration storefront are saved in your browser only. No
          payment is collected. Need help with a real order?{" "}
          <Link href="/support" className="font-medium text-apple-blue-600 hover:underline">
            Contact support
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

function statusVariant(status: string) {
  if (status === "Delivered") return "success" as const
  if (status === "Shipped") return "info" as const
  return "warning" as const
}
