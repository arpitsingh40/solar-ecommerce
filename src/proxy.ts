import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"

type Role = "customer" | "admin" | "supplier"

const PROTECTED_ROUTES: Array<{ prefix: string; roles?: Role[] }> = [
  { prefix: "/dashboard" },
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/supplier", roles: ["supplier"] },
  { prefix: "/api/admin", roles: ["admin"] },
  { prefix: "/api/supplier", roles: ["supplier"] },
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const rule = PROTECTED_ROUTES.find(
    (route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)
  )
  if (!rule) return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (rule.roles && !rule.roles.includes(session.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
