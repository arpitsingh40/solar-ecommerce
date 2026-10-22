export interface ProductImage {
  id: string
  url: string
  alt: string
  sortOrder: number
  isPrimary: boolean
}

export interface ProductSpec {
  id: string
  key: string
  value: string
  unit?: string
  group?: string
  sortOrder: number
  required?: boolean
}

export interface ProductVariantAttribute {
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  sku: string
  attributes: ProductVariantAttribute[]
  price: number
  salePrice?: number
  stock: number
  images: ProductImage[]
  weight?: number
  dimensions?: { length: number; width: number; height: number }
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  categoryId: string
  category?: Category
  brandId: string
  brand?: Brand
  /** Typical homeowner turnkey price for a kit. */
  basePrice: number
  /** B2B dealer kit price charged by SolarStore. */
  salePrice?: number
  /** Combined subsidy benchmark for eligible residential kits. */
  subsidy?: number
  costPrice?: number
  status: "draft" | "active" | "archived" | "out-of-stock" | "low-stock"
  featured: boolean
  rating?: number
  reviewCount?: number
  images: ProductImage[]
  specs: ProductSpec[]
  keySpecs?: ProductSpec[]
  variants: ProductVariant[]
  stock: number
  lowStockThreshold: number
  weight?: number
  dimensions?: { length: number; width: number; height: number }
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  imageUrl?: string
  sortOrder: number
  productCount?: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl?: string
  description?: string
  website?: string
  productCount?: number
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
  addedAt: string
}

export interface Address {
  id: string
  userId: string
  type: "shipping" | "billing"
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  unitPrice: number
  total: number
  product: Product
  variant?: ProductVariant
}

export interface Order {
  id: string
  userId: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "returned"
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: Address
  billingAddress: Address
  shippingMethod?: string
  trackingNumber?: string
  trackingUrl?: string
  notes?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  role: "customer" | "admin" | "supplier" | "staff"
  emailVerified: boolean
  phone?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface Supplier {
  id: string
  userId: string
  companyName: string
  taxId: string
  verificationStatus: "pending" | "approved" | "rejected" | "suspended"
  commissionRate: number
  payoutDetails?: {
    bankName: string
    accountNumber: string
    routingNumber: string
    accountHolder: string
  }
  address: Address
  contactPerson: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  updatedAt: string
}

export interface SupplierProduct {
  id: string
  supplierId: string
  productId: string
  costPrice: number
  stock: number
  leadTime: number
  minOrderQty: number
  createdAt: string
  updatedAt: string
}

export interface InventoryLog {
  id: string
  productId: string
  variantId?: string
  supplierId?: string
  type: "in" | "out" | "adjustment" | "return" | "damaged" | "transfer"
  quantity: number
  reference?: string
  referenceId?: string
  notes?: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "order" | "shipping" | "payment" | "review" | "price-drop" | "back-in-stock" | "system" | "promo"
  title: string
  message: string
  read: boolean
  data?: Record<string, unknown>
  createdAt: string
}

export interface SolarCalculatorInput {
  location: string
  monthlyBill: number
  roofType: "flat" | "pitched" | "metal" | "tile" | "shingle"
  roofOrientation: "south" | "southwest" | "southeast" | "east" | "west" | "north"
  shading: "none" | "light" | "moderate" | "heavy"
  batteryBackup: boolean
  offGrid: boolean
}

export interface SolarCalculatorResult {
  systemSizeKw: number
  panelCount: number
  estimatedProductionKwh: number
  estimatedSavingsPerYear: number
  estimatedCost: number
  paybackPeriodYears: number
  co2OffsetTonsPerYear: number
  recommendedProducts: Product[]
  financingOptions?: FinancingOption[]
}

export interface FinancingOption {
  id: string
  name: string
  type: "loan" | "lease" | "ppa" | "cash"
  monthlyPayment: number
  downPayment: number
  termMonths: number
  apr: number
  totalCost: number
  provider: string
  providerLogo?: string
}

export interface ProjectBuilderState {
  panels: Product[]
  inverter: Product | null
  battery: Product | null
  mounting: Product[]
  monitoring: Product | null
  accessories: Product[]
}

export interface AnalyticsEvent {
  event: string
  properties: Record<string, unknown>
  userId?: string
  timestamp: string
}

export interface SearchFilters {
  query?: string
  category?: string
  brand?: string[]
  priceRange?: [number, number]
  powerRange?: [number, number]
  voltage?: string[]
  certification?: string[]
  inStock?: boolean
  featured?: boolean
  sortBy?: "relevance" | "price-asc" | "price-desc" | "newest" | "top-rated" | "best-selling"
  page?: number
  limit?: number
}

export interface SearchResult {
  products: Product[]
  total: number
  facets: SearchFacets
  page: number
  limit: number
  totalPages: number
}

export interface SearchFacets {
  categories: Array<{ value: string; label: string; count: number }>
  brands: Array<{ value: string; label: string; count: number }>
  priceRange: { min: number; max: number }
  powerRange: { min: number; max: number }
  voltages: Array<{ value: string; label: string; count: number }>
  certifications: Array<{ value: string; label: string; count: number }>
}

export interface DashboardStats {
  revenue: number
  orders: number
  conversionRate: number
  averageOrderValue: number
  activeUsers: number
  topProducts: Array<{ product: Product; revenue: number; quantity: number }>
  revenueByDay: Array<{ date: string; revenue: number }>
  ordersByStatus: Array<{ status: string; count: number }>
  revenueByCategory: Array<{ category: string; revenue: number }>
  geographicData: Array<{ country: string; revenue: number; orders: number }>
}