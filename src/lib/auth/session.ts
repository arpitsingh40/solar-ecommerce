import type { UserRole } from "./types"

export const SESSION_COOKIE_NAME = "token"
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const configuredSecret = process.env.AUTH_SECRET?.trim()

if (!configuredSecret && process.env.NODE_ENV === "production") {
  throw new Error(
    "AUTH_SECRET is required in production. Add a long random value to .env.local or your hosting environment."
  )
}

const secret = encoder.encode(
  configuredSecret ?? "solarstore-local-development-secret"
)

export interface SessionPayload {
  userId: string
  email: string
  role: UserRole
  tokenVersion?: number
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
}

function base64UrlEncode(input: Uint8Array | string): string {
  const bytes = typeof input === "string" ? encoder.encode(input) : input
  let binary = ""
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i]
    if (byte !== undefined) binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(input: string): Uint8Array<ArrayBuffer> {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

let keyPromise: Promise<CryptoKey> | null = null

function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    keyPromise = crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, [
      "sign",
      "verify",
    ])
  }
  return keyPromise
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const key = await getKey()
  const now = Math.floor(Date.now() / 1000)

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = base64UrlEncode(
    JSON.stringify({
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
      v: payload.tokenVersion ?? 1,
      iat: now,
      exp: now + SESSION_MAX_AGE_SECONDS,
    })
  )

  const unsigned = `${header}.${body}`
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(unsigned))
  return `${unsigned}.${base64UrlEncode(new Uint8Array(signature))}`
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [headerPart, bodyPart, signaturePart] = parts as [string, string, string]

    const header = JSON.parse(decoder.decode(base64UrlDecode(headerPart))) as { alg?: unknown }
    if (header.alg !== "HS256") return null

    const key = await getKey()
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signaturePart),
      encoder.encode(`${headerPart}.${bodyPart}`)
    )
    if (!valid) return null

    const claims = JSON.parse(decoder.decode(base64UrlDecode(bodyPart))) as {
      sub?: unknown
      email?: unknown
      role?: unknown
      v?: unknown
      exp?: unknown
    }

    if (typeof claims.sub !== "string" || typeof claims.email !== "string") return null
    if (claims.role !== "customer" && claims.role !== "admin" && claims.role !== "supplier") return null
    if (typeof claims.exp !== "number" || claims.exp <= Math.floor(Date.now() / 1000)) return null

    const tokenVersion = typeof claims.v === "number" ? claims.v : 1

    return { userId: claims.sub, email: claims.email, role: claims.role, tokenVersion }
  } catch {
    return null
  }
}
