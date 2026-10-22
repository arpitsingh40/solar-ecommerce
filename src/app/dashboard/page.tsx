"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProductCard } from "@/components/product/product-card"
import { useAuth } from "@/hooks/use-auth"
import { productBySlug } from "@/lib/data/catalog"
import { formatINR } from "@/lib/india"
import {
  Sun,
  Zap,
  Package,
  TrendingUp,
  ShoppingCart,
  Heart,
  HelpCircle,
  ArrowRight,
} from "lucide-react"

const mockOrders = [
  { id: "SS-20260918-1042", date: "2026-09-18", status: "delivered", total: 1_12_000, items: 1 },
  { id: "SS-20260802-1036", date: "2026-08-02", status: "shipped", total: 1_70_000, items: 1 },
  { id: "SS-20260711-1021", date: "2026-07-11", status: "processing", total: 79_000, items: 1 },
]

const mockMetrics = {
  monthlyMargin: 1_55_000,
  kitsSold: 3,
  orderValue: 3_61_000,
  avgMargin: 35,
}

const recommended = [
  productBySlug.get("3kw-on-grid-solar-kit"),
  productBySlug.get("5kw-hybrid-solar-kit"),
].filter((product): product is NonNullable<typeof product> => Boolean(product))

export default function UserDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] || "there"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold text-apple-gray-900 dark:text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-body-md text-muted-foreground">
            {user?.companyName ? `${user.companyName} · ` : ""}Dealer kits, margin and account
            activity at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/solar-calculator">
              <Sun className="mr-2 h-4 w-4" />
              Quote calculator
            </Link>
          </Button>
          <Button asChild>
            <Link href="/project-builder">
              <Package className="mr-2 h-4 w-4" />
              Build a dealer quote
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-body-md font-medium text-muted-foreground">
              Monthly Margin
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-apple-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-display-md font-display font-bold text-apple-gray-900 dark:text-white">
              {formatINR(mockMetrics.monthlyMargin)}
            </div>
            <p className="mt-1 text-sm text-apple-green-600 dark:text-apple-green-400">
              <TrendingUp className="mr-1 inline h-3 w-3" /> +12% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-body-md font-medium text-muted-foreground">
              Kits Sold
            </CardTitle>
            <Package className="h-5 w-5 text-apple-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-display-md font-display font-bold text-apple-gray-900 dark:text-white">
              {mockMetrics.kitsSold}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-body-md font-medium text-muted-foreground">
              Kit Order Value
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-apple-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-display-md font-display font-bold text-apple-gray-900 dark:text-white">
              {formatINR(mockMetrics.orderValue)}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Dealer price incl. GST</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-body-md font-medium text-muted-foreground">
              Average Margin
            </CardTitle>
            <Zap className="h-5 w-5 text-apple-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-display-md font-display font-bold text-apple-gray-900 dark:text-white">
              {mockMetrics.avgMargin}%
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Fixed 65/35 dealer pricing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline-md">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/dashboard/orders">
                  <ShoppingCart className="h-4 w-4" />
                  View all kit orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/wishlist">
                  <Heart className="h-4 w-4" />
                  Saved kits
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/solar-calculator">
                  <Sun className="h-4 w-4" />
                  Quote a homeowner
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/support">
                  <HelpCircle className="h-4 w-4" />
                  Help &amp; support
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-headline-md">Dealer Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Kit target</span>
                  <span className="font-medium">3 of 5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Margin realised</span>
                  <span className="font-medium">₹1.55 L</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Repeat dealer rate</span>
                  <span className="font-medium">42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                Demo dealer metrics for a 5 kW Uttar Pradesh portfolio. Your real orders appear here.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-headline-md">Recent Kit Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 rounded-lg bg-apple-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-apple-gray-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-apple-blue-100 dark:bg-apple-blue-900/30">
                        <Package className="h-6 w-6 text-apple-blue-600 dark:text-apple-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-apple-gray-900 dark:text-white">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {order.items} kit(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-apple-gray-900 dark:text-white">
                        {formatINR(order.total)}
                      </span>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/orders")}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-headline-md">Best-selling dealer kits</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products">
                  View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommended.map((product) => (
                  <ProductCard key={product.id} product={product} variant="compact" showQuickView={false} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function getStatusVariant(status: string) {
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
