import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { sessionCookieOptions, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"
import { revokeUserSessions } from "@/lib/auth/store"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      const session = await verifySessionToken(token)
      if (session?.userId) {
        await revokeUserSessions(session.userId)
      }
    }
  } catch {
    // Continue even if session extraction fails
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE_NAME, "", { ...sessionCookieOptions, maxAge: 0 })
  return response
}
