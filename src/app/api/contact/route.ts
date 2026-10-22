import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { updateJsonArray } from "@/lib/server/json-store"
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit"

const allowedTopics = new Set([
  "General enquiry",
  "Order status",
  "PM Surya Ghar subsidy",
  "Warranty claim",
  "Returns and refunds",
  "Installation",
  "Dealer program",
  "Something else",
])

interface ContactRecord {
  id: string
  name: string
  email: string
  phone: string
  orderId: string
  topic: string
  message: string
  createdAt: string
  status: "open"
}

function ticketId(): string {
  return `SC-${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`
}

export async function POST(request: Request) {
  // Rate limit: 5 contact requests per 60 seconds per IP
  const rateLimit = checkRateLimit(request, {
    prefix: "contact",
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

  const payload = (body ?? {}) as Record<string, unknown>
  const name = String(payload.name ?? "").trim().slice(0, 120)
  const email = String(payload.email ?? "").trim().toLowerCase().slice(0, 254)
  const phone = String(payload.phone ?? "").replace(/\D/g, "").slice(-10)
  const orderId = String(payload.orderId ?? "").trim().toUpperCase().slice(0, 40)
  const topic = String(payload.topic ?? "General enquiry")
  const message = String(payload.message ?? "").trim().slice(0, 5_000)

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (phone && !/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid Indian mobile number." }, { status: 400 })
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please describe your question in at least 10 characters." },
      { status: 400 }
    )
  }

  const id = ticketId()
  const record: ContactRecord = {
    id,
    name,
    email,
    phone,
    orderId,
    topic: allowedTopics.has(topic) ? topic : "General enquiry",
    message,
    createdAt: new Date().toISOString(),
    status: "open",
  }

  await updateJsonArray<ContactRecord>("messages.json", (records) => [record, ...records].slice(0, 5_000))

  return NextResponse.json({ ok: true, id })
}
