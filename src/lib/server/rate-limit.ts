import { NextResponse } from "next/server"

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Periodic cleanup of expired entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupExpired() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim()
    if (ip) return ip
  }
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  const cfIp = request.headers.get("cf-connecting-ip")
  if (cfIp) return cfIp.trim()

  return "127.0.0.1"
}

export interface RateLimitOptions {
  limit: number
  windowSeconds: number
  prefix?: string
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetSeconds: number
}

export function checkRateLimit(
  request: Request,
  options: RateLimitOptions
): RateLimitResult {
  cleanupExpired()

  const ip = getClientIp(request)
  const key = `${options.prefix ?? "default"}:${ip}`
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000

  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return {
      success: true,
      remaining: options.limit - 1,
      resetSeconds: options.windowSeconds,
    }
  }

  if (entry.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
    return {
      success: false,
      remaining: 0,
      resetSeconds: retryAfterSeconds,
    }
  }

  entry.count += 1
  return {
    success: true,
    remaining: options.limit - entry.count,
    resetSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  }
}

export function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please slow down and try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfterSeconds.toString(),
      },
    }
  )
}
