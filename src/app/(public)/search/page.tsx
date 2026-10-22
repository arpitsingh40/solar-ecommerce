"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product/product-card"
import { categories, products } from "@/lib/data/catalog"
import { Search, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const popularSearches = [
  "3 kW on-grid",
  "5 kW hybrid",
  "10 kW three-phase",
  "commercial kit",
  "UP subsidy",
  "battery backup",
  "dealer margin",
  "Lucknow",
]

export default function SearchPage() {
  return (
    <React.Suspense fallback={<SearchSkeleton />}>
      <SearchBrowser />
    </React.Suspense>
  )
}

function SearchBrowser() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""
  const initialCategory = searchParams.get("category") ?? "all"
  const [input, setInput] = React.useState(initialQuery)
  const [query, setQuery] = React.useState(initialQuery)
  const [category, setCategory] = React.useState(initialCategory)

  React.useEffect(() => {
    const nextQuery = searchParams.get("q") ?? ""
    const nextCategory = searchParams.get("category") ?? "all"
    setInput(nextQuery)
    setQuery(nextQuery)
    setCategory(nextCategory)
  }, [searchParams])

  const results = products.filter((product) => {
    const matchesCategory = category === "all" || product.categoryId === category
    const haystack = [
      product.name,
      product.sku,
      product.description,
      product.shortDescription ?? "",
      product.brand?.name ?? "",
      product.category?.name ?? "",
      product.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase()
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setQuery(input.trim())
    window.history.replaceState(
      null,
      "",
      input.trim() ? `/search?q=${encodeURIComponent(input.trim())}` : "/search"
    )
  }

  const showIdleState = !query.trim() && category === "all"

  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Search dealer kits
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete 1–50 kW rooftop kits with 65% dealer pricing.
        </p>

        <form onSubmit={submit} className="mt-7">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-apple-gray-400" />
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search by kit size, type, SKU or use case"
              className="h-14 rounded-full pl-12 pr-32 text-base"
              aria-label="Search kits"
              autoFocus
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="absolute right-28 top-1/2 -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="submit"
              className="absolute right-1.5 top-1/2 h-11 -translate-y-1/2 rounded-full px-6"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => {
            setCategory("all")
            setQuery("")
            setInput("")
            window.history.replaceState(null, "", "/search")
          }}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            category === "all"
              ? "border-apple-gray-900 bg-apple-gray-900 text-white dark:border-white dark:bg-white dark:text-apple-gray-900"
              : "border-apple-gray-200 text-apple-gray-600 hover:border-apple-gray-400 dark:border-apple-gray-700 dark:text-apple-gray-400"
          )}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCategory(item.id)
              setQuery("")
              setInput("")
              window.history.replaceState(null, "", `/search?category=${item.slug}`)
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              category === item.id
                ? "border-apple-gray-900 bg-apple-gray-900 text-white dark:border-white dark:bg-white dark:text-apple-gray-900"
                : "border-apple-gray-200 text-apple-gray-600 hover:border-apple-gray-400 dark:border-apple-gray-700 dark:text-apple-gray-400"
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      {showIdleState ? (
        <div className="mx-auto mt-12 max-w-2xl">
          <h2 className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Popular searches
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setInput(term)
                  setQuery(term)
                }}
                className="rounded-full bg-apple-gray-100 px-4 py-2 text-sm text-apple-gray-700 transition-colors hover:bg-apple-gray-200 dark:bg-apple-gray-800 dark:text-apple-gray-300"
              >
                {term}
              </button>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/products">
                Browse all kits <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "result" : "results"}
              {query.trim() && (
                <>
                  {" "}
                  for <span className="font-medium text-apple-gray-900 dark:text-white">“{query}”</span>
                </>
              )}
              {category !== "all" && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-medium text-apple-gray-900 dark:text-white">
                    {categories.find((item) => item.id === category)?.name}
                  </span>
                </>
              )}
            </p>
            {(query || category !== "all") && (
              <button
                onClick={() => {
                  setQuery("")
                  setInput("")
                  setCategory("all")
                  window.history.replaceState(null, "", "/search")
                }}
                className="text-sm text-apple-blue-600 hover:underline"
              >
                Reset search
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="py-16 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-apple-gray-300 dark:text-apple-gray-600" />
              <h3 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                No results found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Try a broader term like “3 kW”, “hybrid” or “commercial”, or browse a category above.
              </p>
              <Button asChild className="mt-6">
                <Link href="/products">Browse all kits</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-10 text-center">
              <Badge variant="outline" className="px-4 py-2 text-xs font-normal">
                Dealer kit prices include 5% GST · Freight included
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto h-10 w-72 animate-pulse rounded bg-apple-gray-100 dark:bg-apple-gray-800" />
      <div className="mx-auto mt-6 h-14 max-w-3xl animate-pulse rounded-full bg-apple-gray-100 dark:bg-apple-gray-800" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[460px] animate-pulse rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800"
          />
        ))}
      </div>
    </div>
  )
}
