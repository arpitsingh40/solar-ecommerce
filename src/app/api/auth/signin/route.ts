import { NextResponse } from "next/server"

import { createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth/session"
import { findUserByEmail, toPublicUser, verifyPassword } from "@/lib/auth/store"
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit"

export async function POST(request: Request) {
  // Rate limit: 5 signin attempts per 60 seconds per IP
  const rateLimit = checkRateLimit(request, {
    prefix: "signin",
    limit: 5,
    windowSeconds: 60,
  })
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.resetSeconds)
  }

  let body: { email?: unknown; password?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const password = typeof body.password === "string" ? body.password : ""

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  const user = await findUserByEmail(email)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 1,
  })

  const response = NextResponse.json({ user: toPublicUser(user) })
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions)
  return response
}
