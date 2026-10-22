import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { updateJsonArray } from "@/lib/server/json-store"
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit"

interface NewsletterRecord {
  id: string
  email: string
  createdAt: string
  source: string
}

export async function POST(request: Request) {
  // Rate limit: 5 newsletter signups per 60 seconds per IP
  const rateLimit = checkRateLimit(request, {
    prefix: "newsletter",
    limit: 5,
    windowSeconds: 60,
  })
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.resetSeconds)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim().toLowerCase()
      : ""

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }

  await updateJsonArray<NewsletterRecord>("newsletter.json", (records) => {
    if (records.some((record) => record.email === email)) return records
    const record: NewsletterRecord = {
      id: randomUUID(),
      email,
      createdAt: new Date().toISOString(),
      source: "footer",
    }
    return [record, ...records].slice(0, 5_000)
  })

  return NextResponse.json({ ok: true })
}
