import { NextResponse } from "next/server"
import { readJsonArray } from "@/lib/server/json-store"
import type { StoredOrder } from "@/lib/orders"

export async function GET() {
  const orders = await readJsonArray<StoredOrder>("orders.json")
  return NextResponse.json({ orders })
}
