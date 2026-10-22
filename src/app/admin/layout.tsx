"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DashboardShell } from "@/components/layout/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
    } else if (user.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [isLoading, user, router, pathname])

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-apple-gray-50 dark:bg-apple-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-apple-gray-400" />
      </div>
    )
  }

  return (
    <DashboardShell role="admin">
      {children}
    </DashboardShell>
  )
}
