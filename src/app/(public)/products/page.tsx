"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react"
import { brands, categories, products } from "@/lib/data/catalog"
import { formatINR } from "@/lib/india"

const MAX_PRICE = 21_00_000

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<ProductsSkeleton />}>
      <ProductsBrowser />
    </React.Suspense>
  )
}

function ProductsBrowser() {
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "")
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get("category") ?? "all")
  const [selectedBrand, setSelectedBrand] = React.useState(searchParams.get("brand") ?? "all")
  const [featuredOnly, setFeaturedOnly] = React.useState(searchParams.get("featured") === "true")
  const [sortBy, setSortBy] = React.useState("relevance")
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, MAX_PRICE])
  const [showFilters, setShowFilters] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const productsPerPage = 12

  React.useEffect(() => {
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const featured = searchParams.get("featured")
    const q = searchParams.get("q")
    if (category) setSelectedCategory(category)
    if (brand) setSelectedBrand(brand)
    if (featured === "true") setFeaturedOnly(true)
    if (q) setQuery(q)
  }, [searchParams])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedBrand, featuredOnly, sortBy, priceRange, query])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    const matchesBrand = selectedBrand === "all" || product.brandId === selectedBrand
    const matchesFeatured = !featuredOnly || product.featured
    const price = product.salePrice || product.basePrice
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1]
    const searchable = `${product.name} ${product.brand?.name ?? ""} ${product.shortDescription ?? ""} ${product.tags.join(" ")}`.toLowerCase()
    const matchesQuery = !query.trim() || searchable.includes(query.trim().toLowerCase())
    return matchesCategory && matchesBrand && matchesFeatured && matchesPrice && matchesQuery
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.basePrice
    const priceB = b.salePrice || b.basePrice
    switch (sortBy) {
      case "price-asc":
        return priceA - priceB
      case "price-desc":
        return priceB - priceA
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0)
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (featuredOnly ? 1 : 0) +
    (query.trim() ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedBrand("all")
    setFeaturedOnly(false)
    setPriceRange([0, MAX_PRICE])
    setQuery("")
  }

  return (
    <div className="container-apple section-space-sm space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-apple-blue-600">Dealer-only kit catalogue</p>
          <h1 className="mt-2 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Complete rooftop kits
          </h1>
          <p className="mt-2 text-body-md text-muted-foreground">
            {sortedProducts.length} SKUs · 65% dealer price · GST and freight included
          </p>
        </div>
        <Button variant="outline" className="gap-2 self-start sm:self-auto" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 min-w-5 justify-center px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className={`transition-all duration-300 ease-apple-out ${showFilters ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-apple-gray-900 dark:text-white">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-gray-400" />
                  <Input
                    placeholder="Search 1–50 kW kits, on-grid, hybrid..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="pl-9"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-700"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-apple-gray-900 dark:text-white">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-apple-gray-900 dark:text-white">
                  Brand
                </label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-apple-gray-900 dark:text-white">
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-apple-gray-900 dark:text-white">
                  Price range (₹)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Min"
                    value={priceRange[0] || ""}
                    onChange={(event) =>
                      setPriceRange([parseInt(event.target.value) || 0, priceRange[1]])
                    }
                    className="w-full"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Max"
                    value={priceRange[1] === MAX_PRICE ? "" : priceRange[1]}
                    onChange={(event) =>
                      setPriceRange([priceRange[0], parseInt(event.target.value) || MAX_PRICE])
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  variant={featuredOnly ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  aria-pressed={featuredOnly}
                >
                  Featured only
                </Button>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-apple-gray-100 pt-4 dark:border-apple-gray-800">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== "all" && (
                  <Badge variant="outline" className="gap-1">
                    {categories.find((category) => category.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("all")} aria-label="Remove category filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedBrand !== "all" && (
                  <Badge variant="outline" className="gap-1">
                    {brands.find((brand) => brand.id === selectedBrand)?.name}
                    <button onClick={() => setSelectedBrand("all")} aria-label="Remove brand filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {featuredOnly && (
                  <Badge variant="outline" className="gap-1">
                    Featured
                    <button onClick={() => setFeaturedOnly(false)} aria-label="Remove featured filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {query.trim() && (
                  <Badge variant="outline" className="gap-1">
                    “{query.trim()}”
                    <button onClick={() => setQuery("")} aria-label="Remove search filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                  <Badge variant="outline" className="gap-1">
                    {formatINR(priceRange[0])} – {formatINR(priceRange[1])}
                    <button onClick={() => setPriceRange([0, MAX_PRICE])} aria-label="Remove price filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {paginatedProducts.length} of {sortedProducts.length} kits
        </span>
        <span className="hidden text-sm text-muted-foreground sm:block">Freight included across India</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}

        {paginatedProducts.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-apple-gray-300 dark:text-apple-gray-600" />
            <h3 className="mb-2 text-headline-md text-apple-gray-900 dark:text-white">No kits found</h3>
            <p className="mb-4 text-muted-foreground">Try adjusting your filters or search terms.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(pageNumber)}
              className="h-10 w-10"
              aria-label={`Page ${pageNumber}`}
              aria-current={currentPage === pageNumber ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="container-apple section-space-sm space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[460px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
