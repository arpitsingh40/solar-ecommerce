import { NextResponse } from "next/server"
import { readJsonArray } from "@/lib/server/json-store"
import { getCurrentUser } from "@/lib/auth/server"
import type { StoredOrder } from "@/lib/orders"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await readJsonArray<StoredOrder>("orders.json")
  return NextResponse.json({ orders })
}
