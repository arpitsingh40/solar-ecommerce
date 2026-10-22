import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
import { products } from "@/lib/data/catalog"

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() ?? ""
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10) || 10, 1), 50)
  const category = searchParams.get("category")
  const brand = searchParams.get("brand")
  const minPrice = parseFloat(searchParams.get("minPrice") || "0")
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "2100000")

  let filtered = products

  if (query) {
    const normalized = query.toLowerCase()
    filtered = filtered.filter((product) =>
      [
        product.name,
        product.sku,
        product.description,
        product.shortDescription ?? "",
        product.category?.name ?? "",
        product.brand?.name ?? "",
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  }

  if (category && category !== "all") {
    filtered = filtered.filter((product) => product.categoryId === category)
  }

  if (brand && brand !== "all") {
    filtered = filtered.filter((product) => product.brandId === brand)
  }

  filtered = filtered.filter((product) => {
    const price = product.salePrice || product.basePrice
    return price >= minPrice && price <= maxPrice
  })

  const results = filtered.slice(0, limit)

  return NextResponse.json({
    products: results,
    total: filtered.length,
    query,
    limit,
  })
}
