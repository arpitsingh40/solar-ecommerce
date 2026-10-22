"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Sun } from "lucide-react"

import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"

type DashboardRole = "admin" | "supplier" | "user"

interface DashboardShellProps {
  role: DashboardRole
  children: React.ReactNode
}

const roleMeta: Record<DashboardRole, { label: string; home: string }> = {
  admin: { label: "Store admin", home: "/admin/dashboard" },
  supplier: { label: "Supplier partner", home: "/supplier/dashboard" },
  user: { label: "My account", home: "/dashboard" },
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const meta = roleMeta[role]

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900">
      <Sidebar
        role={role}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((current) => !current)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "min-w-0 transition-[margin] duration-300 ease-apple-out",
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-apple-gray-200 bg-white/90 px-4 backdrop-blur-xl dark:border-apple-gray-800 dark:bg-apple-gray-950/90 lg:hidden">
          <Link href={meta.home} className="flex items-center gap-2" aria-label="SolarStore dashboard home">
            <Sun className="h-6 w-6 text-apple-blue-600 dark:text-apple-blue-400" />
            <span className="text-base font-semibold tracking-tight text-apple-gray-900 dark:text-white">
              SolarStore
            </span>
            <span className="text-xs text-muted-foreground">· {meta.label}</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setCollapsed(false)
              setMobileOpen(true)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-apple-gray-700 transition-colors hover:bg-apple-gray-100 dark:text-apple-gray-200 dark:hover:bg-apple-gray-800"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            aria-controls="dashboard-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <div className="container-apple py-6 lg:py-8">{children}</div>
      </div>
    </div>
  )
}
