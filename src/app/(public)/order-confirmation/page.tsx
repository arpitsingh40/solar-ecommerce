"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getOrder, paymentMethodLabels, type StoredOrder } from "@/lib/orders"
import { formatINR, INDIA } from "@/lib/india"
import {
  CheckCircle,
  Package,
  Truck,
  Printer,
  ArrowRight,
  MapPin,
  CreditCard,
  Phone,
  ShieldCheck,
} from "lucide-react"
import { DcrSubsidyPackDialog } from "@/components/orders/dcr-subsidy-pack-dialog"

export default function OrderConfirmationPage() {
  return (
    <React.Suspense fallback={<ConfirmationSkeleton />}>
      <Confirmation />
    </React.Suspense>
  )
}

function Confirmation() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") ?? ""
  const [mounted, setMounted] = React.useState(false)
  const [order, setOrder] = React.useState<StoredOrder | null>(null)

  React.useEffect(() => {
    setMounted(true)
    setOrder(getOrder(orderId))
  }, [orderId])

  if (!mounted) return <ConfirmationSkeleton />

  if (!order) {
    return (
      <div className="container-apple section-space-sm">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-gray-100 dark:bg-apple-gray-800">
            <Package className="h-7 w-7 text-apple-gray-500" />
          </div>
          <h1 className="mt-6 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            We couldn&apos;t find that order
          </h1>
          <p className="mt-3 text-body-md text-muted-foreground">
            The order may have been placed in a different browser, or the link may have expired.
            Our team can help you track it if you have the order confirmation.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/products">Browse dealer kits</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Call {INDIA.supportPhone} · {INDIA.supportHours}
          </p>
        </div>
      </div>
    )
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-apple-green-50 dark:bg-apple-green-900/20">
            <CheckCircle className="h-8 w-8 text-apple-green-600 dark:text-apple-green-400" />
          </div>
          <Badge variant="outline" className="mt-5">
            Order {order.id}
          </Badge>
          <h1 className="mt-4 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            {order.paymentStatus === "paid" ? "Order confirmed." : "Order placed."}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-body-md text-muted-foreground">
            Thank you, {order.address.fullName.split(" ")[0]}. Our dealer desk has received your
            order and will confirm stock, payment and the dispatch schedule. Standard kits leave
            Lucknow in 7–21 working days. Your GST invoice will be emailed to {order.address.email}.
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Package className="h-3.5 w-3.5" /> Order date
                </p>
                <p className="mt-1.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                  {orderDate}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" /> Estimated delivery
                </p>
                <p className="mt-1.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                  {order.deliveryEstimate}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" /> Payment
                </p>
                <p className="mt-1.5 text-sm font-medium text-apple-gray-900 dark:text-white">
                  {paymentMethodLabels[order.paymentMethod]}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {order.paymentStatus === "paid"
                      ? "Paid"
                      : order.paymentMethod === "neft"
                        ? "Awaiting transfer"
                        : "Payment pending"}
                  </span>
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-apple-gray-900 dark:text-white">
                  <MapPin className="h-4 w-4" /> Site / delivery address
                </p>
                <address className="mt-2 text-sm not-italic leading-relaxed text-muted-foreground">
                  {order.address.fullName}
                  <br />
                  {order.address.line1}
                  {order.address.line2 && (
                    <>
                      <br />
                      {order.address.line2}
                    </>
                  )}
                  <br />
                  {order.address.city}, {order.address.state} {order.address.pincode}
                  <br />
                  India
                  <br />
                  +91 {order.address.phone}
                </address>
              </div>
              <div>
                <p className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                  Need help with this order?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Quote order {order.id}. Our dealer desk is available {INDIA.supportHours}.
                </p>
                <a
                  href={INDIA.supportPhoneHref}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-apple-blue-600 hover:underline"
                >
                  <Phone className="h-4 w-4" /> {INDIA.supportPhone}
                </a>
                <p className="mt-2 text-sm text-muted-foreground">{INDIA.supportEmail}</p>
                {order.address.gstin && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Dealer GSTIN: <span className="font-medium">{order.address.gstin}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardContent className="p-6">
            <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
              Order summary
            </h2>
            <ul className="mt-4 divide-y divide-apple-gray-100 dark:divide-apple-gray-800">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-apple-gray-900 hover:text-apple-blue-600 dark:text-white"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.brand} · Qty {item.quantity} · {formatINR(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="ml-auto max-w-sm space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-apple-green-700 dark:text-apple-green-400">
                  <span>Dealer credit {order.coupon}</span>
                  <span>−{formatINR(order.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Freight</span>
                <span>{order.shipping === 0 ? "Included" : formatINR(order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-apple-gray-200 pt-3 text-base font-semibold dark:border-apple-gray-800">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
              <p className="text-right text-xs text-muted-foreground">
                Includes {formatINR(order.gstIncluded)} GST
              </p>
            </div>
          </CardContent>
        </Card>

        {/* DCR Subsidy Pack Generator Callout */}
        <div className="mt-5 rounded-2xl border border-apple-green-200 bg-apple-green-50/70 p-5 dark:border-apple-green-900/40 dark:bg-apple-green-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="h-3 w-3" /> PM Surya Ghar
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-wider text-apple-green-800 dark:text-apple-green-300">
                  DCR Subsidy Pack Ready
                </span>
              </div>
              <p className="text-sm font-medium text-apple-gray-900 dark:text-white">
                Download ALMM DCR serial certificates, BIS declarations &amp; DISCOM SLD.
              </p>
              <p className="text-xs text-muted-foreground">
                Auto-assigned from Lucknow Logistics Hub for National Portal and UPNEDA submission.
              </p>
            </div>
            <DcrSubsidyPackDialog
              orderId={order.id}
              kitName={order.items[0]?.name ?? "Standard Rooftop Solar Kit"}
              date={orderDate}
              total={order.total}
              state={order.address.state}
              customerName={order.address.fullName}
              trigger={
                <Button className="shrink-0 gap-1.5 bg-apple-green-600 text-white hover:bg-apple-green-700">
                  <ShieldCheck className="h-4 w-4" /> Download 1-Click Subsidy Pack
                </Button>
              }
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/products">
              Browse dealer kits <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/orders">View dealer orders</Link>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print invoice
          </Button>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
          This is a demonstration storefront. No payment has been collected and no physical goods
          will be dispatched. Order details are stored only in this browser.
        </p>
      </div>
    </div>
  )
}

function ConfirmationSkeleton() {
  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="mx-auto h-4 w-40 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="mx-auto h-10 w-72 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="h-48 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
        <div className="h-64 animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800" />
      </div>
    </div>
  )
}
