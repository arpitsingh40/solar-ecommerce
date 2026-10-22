import { NextResponse } from "next/server"

import { createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth/session"
import { createUser, toPublicUser } from "@/lib/auth/store"
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  // Rate limit: 5 signups per 60 seconds per IP
  const rateLimit = checkRateLimit(request, {
    prefix: "signup",
    limit: 5,
    windowSeconds: 60,
  })
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.resetSeconds)
  }

  let body: { name?: unknown; email?: unknown; password?: unknown; companyName?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const password = typeof body.password === "string" ? body.password : ""
  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : ""

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
  }
  if (!companyName) {
    return NextResponse.json({ error: "Business name is required for a dealer account" }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const user = await createUser({ name, email, password, companyName })
  if (!user) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 1,
  })

  const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 })
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions)
  return response
}
