"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/india"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react"
import { useAuth, type AuthUser } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import type { Product } from "@/types/product"

interface NavEntry {
  name: string
  href: string
  hasDropdown?: boolean
}

const navigation: NavEntry[] = [
  { name: "Kit catalogue", href: "/products", hasDropdown: true },
  { name: "Dealer program", href: "/dealers" },
  { name: "Quote calculator", href: "/solar-calculator" },
  { name: "Project builder", href: "/project-builder" },
  { name: "Support", href: "/support" },
]

const productCategories = [
  { name: "On-Grid Kits", href: "/products?category=on-grid", description: "1–10 kW · net-metering ready" },
  { name: "Hybrid Kits", href: "/products?category=hybrid", description: "Battery-backed 3–5 kW kits" },
  { name: "Commercial Kits", href: "/products?category=commercial", description: "15–50 kW · three-phase" },
  { name: "All Dealer Kits", href: "/products", description: "10 SKUs · 65% of turnkey" },
]

function dashboardHref(role: AuthUser["role"]): string {
  if (role === "admin") return "/admin/dashboard"
  if (role === "supplier") return "/supplier/dashboard"
  return "/dashboard"
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const cartCount = useCart((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )
  const wishlistCount = useWishlist((state) => state.items.length)
  const { user, isLoading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const navigate = (href: string) => {
    router.push(href)
  }

  const navigateMobile = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  const handleSignOut = () => {
    void signOut().then(() => {
      setMobileMenuOpen(false)
      router.push("/")
      router.refresh()
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-apple-gray-200 bg-white/95 text-apple-gray-900 dark:border-apple-gray-800 dark:bg-apple-gray-950/95 dark:text-apple-gray-100 backdrop-blur-xl">
      {/* Top bar - Announcement */}
      <div className="hidden lg:block border-b border-apple-gray-200 bg-apple-gray-50 py-1.5 text-apple-gray-600 dark:border-apple-gray-800 dark:bg-apple-gray-900 dark:text-apple-gray-400">
        <div className="container-apple flex items-center justify-center gap-4 text-xs">
          <span>Dealer kit pricing · 65% of turnkey</span>
          <span className="h-3 w-px bg-apple-gray-300 dark:bg-apple-gray-700" />
          <span>UP subsidy up to ₹1,08,000</span>
          <span className="h-3 w-px bg-apple-gray-300 dark:bg-apple-gray-700" />
          <span>Freight included · Lucknow dispatch</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="relative" role="navigation" aria-label="Main navigation">
        <div className="container-apple">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-apple-gray-900 dark:text-white" aria-label="SolarStore Home">
              <Sun className="h-7 w-7" aria-hidden="true" />
              <span className="text-xl font-semibold tracking-tight">SolarStore</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navigation.map((item) => (
                <NavigationItem key={item.name} item={item} pathname={pathname} onNavigate={navigate} />
              ))}
            </div>

            {/* Search, Cart, User Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/wishlist")}
                aria-label={`Saved kits ${wishlistCount > 0 ? `(${wishlistCount})` : ""}`}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-apple-red-500 text-[10px] font-medium text-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/cart")}
                aria-label={`Dealer order ${
                  cartCount > 0 ? `(${cartCount} ${cartCount === 1 ? "kit" : "kits"})` : "empty"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-apple-blue-600 text-[10px] font-medium text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <UserMenu
                user={user}
                isLoading={isLoading}
                signInHref={signInHref}
                onNavigate={navigate}
                onSignOut={handleSignOut}
              />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-apple-gray-200 dark:border-apple-gray-800 bg-white dark:bg-apple-gray-950 animate-slide-in-from-top">
          <div className="container-apple py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400" />
              <Input
                placeholder="Search kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <nav className="space-y-2" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <MobileNavItem key={item.name} item={item} pathname={pathname} onNavigate={navigateMobile} />
              ))}
            </nav>
            <div className="flex gap-2 pt-4 border-t border-apple-gray-200 dark:border-apple-gray-800">
              <Button variant="outline" className="flex-1" onClick={() => navigateMobile("/cart")}>
                Kit order ({cartCount})
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigateMobile("/wishlist")}>
                Saved kits ({wishlistCount})
              </Button>
            </div>
            <div className="flex gap-2">
              {user ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => navigateMobile(dashboardHref(user.role))}>
                    Dashboard
                  </Button>
                  <Button variant="outline" className="flex-1 text-apple-red-500" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => navigateMobile(signInHref)}>
                    Dealer login
                  </Button>
                  <Button className="flex-1" onClick={() => navigateMobile("/auth/signup")}>
                    Become a dealer
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  )
}

function NavigationItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavEntry
  pathname: string
  onNavigate: (href: string) => void
}) {
  const isActive = pathname === item.href || (item.hasDropdown && pathname.startsWith(item.href))

  if (item.hasDropdown) {
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          className={cn("h-10 px-3 text-sm font-medium transition-colors", isActive && "text-apple-blue-600 dark:text-apple-blue-400")}
          onClick={() => onNavigate(item.href)}
        >
          {item.name}
          <ChevronDown className="h-4 w-4 ml-1" aria-hidden="true" />
        </Button>

        {/* Mega Menu */}
        <div className="absolute left-0 top-full hidden group-hover:block lg:group-hover:flex w-full lg:w-[800px] rounded-b-xl border border-apple-gray-200 bg-white dark:border-apple-gray-700 dark:bg-apple-gray-950 shadow-apple-xl p-6 animate-slide-in-from-top">
          <div className="grid grid-cols-4 gap-6">
            {productCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group hover:text-apple-blue-600 dark:hover:text-apple-blue-400 transition-colors"
              >
                <p className="font-medium text-apple-gray-900 dark:text-white">{category.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      className={cn("h-10 px-3 text-sm font-medium transition-colors", isActive && "text-apple-blue-600 dark:text-apple-blue-400")}
      onClick={() => onNavigate(item.href)}
    >
      {item.name}
    </Button>
  )
}

function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavEntry
  pathname: string
  onNavigate: (href: string) => void
}) {
  const [expanded, setExpanded] = React.useState(false)
  const isActive = pathname === item.href

  if (item.hasDropdown) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn("w-full justify-between py-3 text-left", isActive && "text-apple-blue-600 dark:text-apple-blue-400")}
          onClick={() => setExpanded(!expanded)}
        >
          {item.name}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </Button>
        {expanded && (
          <div className="pl-4 space-y-2 pt-2 border-l border-apple-gray-200 dark:border-apple-gray-700">
            {productCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block py-2 text-sm text-muted-foreground hover:text-apple-blue-600 dark:hover:text-apple-blue-400"
                onClick={() => onNavigate(category.href)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      className={cn("w-full justify-start py-3", isActive && "text-apple-blue-600 dark:text-apple-blue-400")}
      onClick={() => onNavigate(item.href)}
    >
      {item.name}
    </Button>
  )
}

function UserMenu({
  user,
  isLoading,
  signInHref,
  onNavigate,
  onSignOut,
}: {
  user: AuthUser | null
  isLoading: boolean
  signInHref: string
  onNavigate: (href: string) => void
  onSignOut: () => void
}) {
  if (isLoading) {
    return (
      <div
        className="h-9 w-9 animate-pulse rounded-full bg-apple-gray-200 dark:bg-apple-gray-800"
        aria-hidden="true"
      />
    )
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => onNavigate(signInHref)}>
          Dealer login
        </Button>
        <Button className="hidden sm:inline-flex" onClick={() => onNavigate("/auth/signup")}>
          Become a dealer
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Dealer login"
          onClick={() => onNavigate(signInHref)}
        >
          <User className="h-5 w-5" />
        </Button>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" aria-label="Account menu">
          <Avatar className="h-9 w-9">
            {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="border-b border-apple-gray-200 px-4 py-2 dark:border-apple-gray-700">
          <p className="truncate text-sm font-medium">{user.name}</p>
          {user.companyName && (
            <p className="truncate text-xs text-apple-gray-500">{user.companyName}</p>
          )}
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => onNavigate(dashboardHref(user.role))}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => onNavigate("/dashboard/orders")}>
          <Package className="h-4 w-4" />
          Kit orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 text-apple-red-500" onClick={onSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data.products || [])
      } catch {
        if (!controller.signal.aborted) setResults([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 200)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query])

  const go = (href: string) => {
    onClose()
    router.push(href)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 bg-white dark:bg-apple-gray-950 rounded-xl shadow-apple-2xl overflow-hidden animate-zoom-in"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-apple-gray-200 dark:border-apple-gray-800">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search kits by size, type or SKU..."
            className="flex-1 bg-transparent text-lg text-apple-gray-900 dark:text-white placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-apple-gray-100 dark:bg-apple-gray-800 text-xs text-muted-foreground">
            <span>⌘</span>K
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Searching...</div>
          ) : query && results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No results found for &ldquo;{query}&rdquo;</div>
          ) : query && results.length > 0 ? (
            <div className="divide-y divide-apple-gray-200 dark:divide-apple-gray-800">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => go(`/products/${product.slug}`)}
                  className="flex w-full items-center gap-4 p-4 text-left hover:bg-apple-gray-50 dark:hover:bg-apple-gray-800 transition-colors"
                >
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-apple-gray-100 dark:bg-apple-gray-800">
                    {product.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-apple-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-sm text-apple-blue-600 dark:text-apple-blue-400 font-semibold">
                      {formatINR(product.salePrice || product.basePrice)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <p className="text-sm font-medium text-apple-gray-900 dark:text-white">Popular right now</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: "3 kW on-grid", href: "/products/3kw-on-grid-solar-kit" },
                  { label: "5 kW hybrid", href: "/products/5kw-hybrid-solar-kit" },
                  { label: "Commercial kits", href: "/products?category=commercial" },
                  { label: "Solar calculator", href: "/solar-calculator" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => go(item.href)}
                    className="rounded-full border border-apple-gray-200 px-3 py-1.5 text-sm text-apple-gray-700 transition-colors hover:border-apple-gray-400 hover:text-apple-gray-900 dark:border-apple-gray-700 dark:text-apple-gray-300"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                All prices include 5% GST · Freight included · Lucknow dispatch
              </p>
            </div>
          )}
        </div>

        {query && results.length > 0 && (
          <div className="p-4 border-t border-apple-gray-200 dark:border-apple-gray-800">
            <button
              className="text-sm font-medium text-apple-blue-600 dark:text-apple-blue-400 hover:underline"
              onClick={() => go(`/search?q=${encodeURIComponent(query)}`)}
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
