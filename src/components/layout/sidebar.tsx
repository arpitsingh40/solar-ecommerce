"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Crown,
  Warehouse,
  ArrowUpRight,
  Store,
  X,
} from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  external?: boolean
}

const adminNavigation: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Dealers", href: "/admin/customers", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Store settings", href: "/admin/settings", icon: Settings },
]

const supplierNavigation: NavItem[] = [
  { name: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard },
  { name: "My products", href: "/supplier/products", icon: Package },
  { name: "Orders", href: "/supplier/orders", icon: ShoppingCart },
  { name: "Inventory", href: "/supplier/inventory", icon: Warehouse },
  { name: "Payouts", href: "/supplier/payouts", icon: CreditCard },
  { name: "Performance", href: "/supplier/performance", icon: BarChart3 },
  { name: "Settings", href: "/supplier/settings", icon: Settings },
]

const userNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Saved kits", href: "/wishlist", icon: Crown },
  { name: "Solar calculator", href: "/solar-calculator", icon: Sun },
  { name: "Project builder", href: "/project-builder", icon: Package },
  { name: "Addresses", href: "/dashboard/addresses", icon: Warehouse },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & support", href: "/support", icon: HelpCircle },
]

interface SidebarProps {
  role: "admin" | "supplier" | "user"
  className?: string
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const roleLabels = {
  admin: "Store admin",
  supplier: "Supplier partner",
  user: "My account",
}

export function Sidebar({
  role,
  className,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()

  const navigation =
    role === "admin" ? adminNavigation : role === "supplier" ? supplierNavigation : userNavigation
  const home =
    role === "admin" ? "/admin/dashboard" : role === "supplier" ? "/supplier/dashboard" : "/dashboard"

  return (
    <aside
      id="dashboard-sidebar"
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-apple-gray-200 bg-white transition-all duration-300 ease-apple-out dark:border-apple-gray-800 dark:bg-apple-gray-950 lg:z-40",
        collapsed ? "w-20" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}
      aria-label={`${roleLabels[role]} navigation`}
    >
      <div className="flex h-16 items-center justify-between border-b border-apple-gray-200 px-4 dark:border-apple-gray-800">
        <Link href={home} className="flex items-center gap-2" onClick={onMobileClose}>
          <Sun className="h-8 w-8 shrink-0 text-apple-blue-600 dark:text-apple-blue-400" />
          {!collapsed && (
            <span className="text-xl font-semibold tracking-tight text-apple-gray-900 dark:text-white">
              SolarStore
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {!collapsed && (
        <p className="px-5 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-apple-gray-400">
          {roleLabels[role]}
        </p>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)) ||
            (role === "user" && item.href === "/dashboard" && pathname === "/dashboard")
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                !collapsed && "hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800",
                isActive &&
                  "bg-apple-gray-100 text-apple-gray-900 dark:bg-apple-gray-800 dark:text-white",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.name : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}

        <div className="!mt-4 border-t border-apple-gray-100 pt-3 dark:border-apple-gray-800">
          <Link
            href="/"
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-apple-gray-600 transition-colors hover:bg-apple-gray-100 hover:text-apple-gray-900 dark:text-apple-gray-400 dark:hover:bg-apple-gray-800 dark:hover:text-white",
              collapsed && "justify-center"
            )}
            title={collapsed ? "View storefront" : undefined}
          >
            <Store className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && (
              <>
                <span className="flex-1">View storefront</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </>
            )}
          </Link>
        </div>
      </nav>

      <div className="border-t border-apple-gray-200 p-4 dark:border-apple-gray-800">
        {!collapsed ? (
          <div>
            <p className="text-xs font-medium text-apple-gray-900 dark:text-white">
              SolarStore India
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Prices in INR · 5% GST</p>
          </div>
        ) : (
          <Sun className="mx-auto h-4 w-4 text-apple-gray-400" />
        )}
      </div>
    </aside>
  )
}
