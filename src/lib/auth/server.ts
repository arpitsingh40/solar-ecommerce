import { cookies } from "next/headers"

import { SESSION_COOKIE_NAME, verifySessionToken } from "./session"
import { findUserById, toPublicUser } from "./store"
import type { PublicUser } from "./types"

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const session = await verifySessionToken(token)
  if (!session) return null

  const user = await findUserById(session.userId)
  if (!user) return null

  // Ensure revoked sessions are rejected
  const currentVersion = user.tokenVersion ?? 1
  const sessionVersion = session.tokenVersion ?? 1
  if (currentVersion !== sessionVersion) {
    return null
  }

  return toPublicUser(user)
}
