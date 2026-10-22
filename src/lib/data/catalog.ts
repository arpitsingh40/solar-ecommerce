import type { Brand, Category, Product, ProductImage, ProductSpec } from "@/types/product"

/**
 * SolarStore India kit-only catalogue.
 *
 * `basePrice` is the typical turnkey price a homeowner pays an installer.
 * `salePrice` is the B2B kit price SolarStore charges a dealer — 65% of
 * turnkey, with the remaining 35% left with the dealer for labour and profit.
 * All amounts are in INR and include 5% GST.
 */

const IMAGE_PATHS = {
  panelsClose: "/images/solar/panels-close.jpg",
  panelsArray: "/images/solar/panels-array.jpg",
  panelsAerial: "/images/solar/panels-aerial.jpg",
  rooftop: "/images/solar/rooftop.jpg",
  solarFarm: "/images/solar/solar-farm.jpg",
  technician: "/images/solar/technician.jpg",
} as const

type ImageKey = keyof typeof IMAGE_PATHS

function image(key: ImageKey, alt: string, sortOrder: number): ProductImage {
  return {
    id: `${key}-${sortOrder}`,
    url: IMAGE_PATHS[key],
    alt,
    sortOrder,
    isPrimary: false,
  }
}

export const categories: Category[] = [
  {
    id: "on-grid",
    name: "On-Grid Kits",
    slug: "on-grid",
    description: "Net-metering ready kits for homes, shops and small offices from 1 kW to 10 kW.",
    sortOrder: 1,
    productCount: 0,
  },
  {
    id: "hybrid",
    name: "Hybrid Kits",
    slug: "hybrid",
    description: "Battery-backed kits for homes and clinics that need power through outages.",
    sortOrder: 2,
    productCount: 0,
  },
  {
    id: "commercial",
    name: "Commercial Kits",
    slug: "commercial",
    description: "Three-phase rooftop kits for shops, warehouses and industrial units from 15 kW to 50 kW.",
    sortOrder: 3,
    productCount: 0,
  },
]

export const brands: Brand[] = [
  {
    id: "solarstore",
    name: "SolarStore Pro",
    slug: "solarstore-pro",
    description: "Dealer-ready rooftop kits assembled with Tier-1 modules, BIS inverters and complete BOS.",
    productCount: 0,
  },
]

const categoryMap = new Map(categories.map((category) => [category.id, category]))
const brandMap = new Map(brands.map((brand) => [brand.id, brand]))

interface ProductSeed {
  id: string
  sku: string
  name: string
  slug: string
  categoryId: string
  brandId: string
  /** Typical turnkey price paid by the homeowner. */
  mrp: number
  /** B2B kit price paid by the dealer. */
  price: number
  /** Combined UP subsidy benchmark for eligible residential systems. */
  subsidy?: number
  description: string
  shortDescription: string
  featured?: boolean
  stock?: number
  status?: Product["status"]
  rating?: number
  reviews?: number
  keySpecs: Array<[string, string]>
  specs: Array<[string, string, string?]>
  images: Array<[ImageKey, string]>
  tags: string[]
}

function buildProduct(seed: ProductSeed, index: number): Product {
  const category = categoryMap.get(seed.categoryId)
  const brand = brandMap.get(seed.brandId)
  const createdAt = new Date(Date.UTC(2025, (index * 3) % 12, 4 + (index % 20))).toISOString()
  const specs: ProductSpec[] = seed.specs.map(([key, value, group], specIndex) => ({
    id: `${seed.id}-spec-${specIndex}`,
    key,
    value,
    group: group ?? "General",
    sortOrder: specIndex,
  }))
  const keySpecs: ProductSpec[] = seed.keySpecs.map(([key, value], specIndex) => ({
    id: `${seed.id}-key-${specIndex}`,
    key,
    value,
    group: "Key",
    sortOrder: specIndex,
  }))
  const primaryImage: ProductImage = {
    id: `${seed.id}-primary`,
    url: `/images/solar/kits/${seed.id}.jpg`,
    alt: seed.name,
    sortOrder: 1,
    isPrimary: true,
  }
  const images: ProductImage[] = [
    primaryImage,
    ...seed.images.map(([imageKey, alt], imageIndex) => image(imageKey, alt, imageIndex + 2)),
  ]

  return {
    id: seed.id,
    sku: seed.sku,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    shortDescription: seed.shortDescription,
    categoryId: seed.categoryId,
    category,
    brandId: seed.brandId,
    brand,
    basePrice: seed.mrp,
    salePrice: seed.price,
    subsidy: seed.subsidy,
    status: seed.status ?? (seed.stock === 0 ? "out-of-stock" : "active"),
    featured: seed.featured ?? false,
    rating: seed.rating,
    reviewCount: seed.reviews,
    images,
    specs,
    keySpecs,
    variants: [],
    stock: seed.stock ?? 20,
    lowStockThreshold: 4,
    tags: seed.tags,
    createdAt,
    updatedAt: createdAt,
    publishedAt: createdAt,
  }
}

const seeds: ProductSeed[] = [
  {
    id: "lk-01",
    sku: "LK-01",
    name: "1 kW On-Grid Solar Kit",
    slug: "1kw-on-grid-solar-kit",
    categoryId: "on-grid",
    brandId: "solarstore",
    mrp: 68_000,
    price: 44_000,
    description:
      "An entry-level, net-metering ready kit for a small home or shop. Includes two 545 Wp ALMM-listed mono PERC modules, a 1 kW BIS-certified grid-tie inverter, galvanised mounting structure, DC/AC cabling, MC4 connectors and a Wi-Fi monitoring dongle. Packed as one dispatch for a typical 1 BHK load in Lucknow.",
    shortDescription: "1 kW · On-grid · Dealer margin ₹24,000",
    stock: 24,
    rating: 4.6,
    reviews: 48,
    keySpecs: [["System", "1 kW"], ["Type", "On-grid"], ["Dealer margin", "₹24,000"]],
    specs: [
      ["System capacity", "1 kW", "System"],
      ["Kit model", "LK-01", "System"],
      ["Kit type", "On-grid, single phase", "System"],
      ["Modules", "2 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "1 kW BIS grid-tie inverter", "Equipment"],
      ["Structure", "Galvanised iron elevated structure", "Equipment"],
      ["Balance of system", "DC/AC cabling, MC4, ACDB, earthing, Wi-Fi monitoring", "Equipment"],
      ["Typical generation", "4–5 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "7–10 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["panelsClose", "ALMM-listed modules supplied with the kit"],
      ["technician", "Installer commissioning a rooftop kit"],
    ],
    tags: ["kit", "on-grid", "1kw", "residential", "entry-level", "lucknow"],
  },
  {
    id: "lk-02",
    sku: "LK-02",
    name: "2 kW On-Grid Solar Kit",
    slug: "2kw-on-grid-solar-kit",
    categoryId: "on-grid",
    brandId: "solarstore",
    mrp: 1_22_000,
    price: 79_000,
    description:
      "A strong volume kit for 2 BHK homes. Four 545 Wp ALMM modules pair with a 2 kW BIS-certified inverter, elevated GI structure and complete balance of system. Sized for typical Lucknow consumption of 180–240 units a month and ready for net metering and PM Surya Ghar paperwork.",
    shortDescription: "2 kW · On-grid · Dealer margin ₹43,000",
    stock: 18,
    rating: 4.7,
    reviews: 72,
    keySpecs: [["System", "2 kW"], ["Type", "On-grid"], ["Dealer margin", "₹43,000"]],
    specs: [
      ["System capacity", "2 kW", "System"],
      ["Kit model", "LK-02", "System"],
      ["Kit type", "On-grid, single phase", "System"],
      ["Modules", "4 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "2 kW BIS grid-tie inverter", "Equipment"],
      ["Structure", "Galvanised iron elevated structure", "Equipment"],
      ["Balance of system", "DC/AC cabling, MC4, ACDB, earthing, Wi-Fi monitoring", "Equipment"],
      ["Typical generation", "8–10 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "7–10 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["panelsArray", "Modules included in the 2 kW kit"],
      ["technician", "Rooftop kit installation"],
    ],
    tags: ["kit", "on-grid", "2kw", "residential", "2bhk", "lucknow"],
  },
  {
    id: "lk-03",
    sku: "LK-03",
    name: "3 kW On-Grid Solar Kit",
    slug: "3kw-on-grid-solar-kit",
    categoryId: "on-grid",
    brandId: "solarstore",
    mrp: 1_72_000,
    price: 1_12_000,
    subsidy: 1_08_000,
    description:
      "The best-selling dealer kit. Six 545 Wp ALMM modules, a 3 kW BIS grid-tie inverter, elevated GI structure and complete BOS. At the ₹1.72 lakh turnkey price, the homeowner pays about ₹64,000 after the combined ₹1.08 lakh Uttar Pradesh subsidy — while the dealer keeps ₹60,000 for labour and profit.",
    shortDescription: "3 kW · On-grid · Best seller · Homeowner net ₹64,000 after UP subsidy",
    featured: true,
    stock: 32,
    rating: 4.9,
    reviews: 186,
    keySpecs: [["System", "3 kW"], ["Type", "On-grid"], ["Dealer margin", "₹60,000"]],
    specs: [
      ["System capacity", "3 kW", "System"],
      ["Kit model", "LK-03", "System"],
      ["Kit type", "On-grid, single phase", "System"],
      ["Modules", "6 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "3 kW BIS grid-tie inverter", "Equipment"],
      ["Structure", "Galvanised iron elevated structure", "Equipment"],
      ["Balance of system", "DC/AC cabling, MC4, ACDB, earthing, Wi-Fi monitoring", "Equipment"],
      ["Typical generation", "12–15 units per day", "Performance"],
      ["Subsidy benchmark", "Up to ₹1.08 lakh in Uttar Pradesh (₹78,000 central + ₹30,000 state)", "Commercial"],
      ["Homeowner net cost", "About ₹64,000 after UP subsidy", "Commercial"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "7–10 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["panelsArray", "Six-module array supplied with the 3 kW kit"],
      ["technician", "Installation of a 3 kW rooftop kit"],
    ],
    tags: ["kit", "on-grid", "3kw", "residential", "best-seller", "subsidy", "lucknow"],
  },
  {
    id: "lk-04",
    sku: "LK-04",
    name: "3 kW Hybrid Solar Kit",
    slug: "3kw-hybrid-solar-kit",
    categoryId: "hybrid",
    brandId: "solarstore",
    mrp: 2_45_000,
    price: 1_59_000,
    description:
      "A high-ticket hybrid kit for homes that face long outages. Includes six 545 Wp ALMM modules, a 3 kW hybrid inverter, a 5.12 kWh LiFePO4 battery, elevated structure and complete BOS. Ideal for Mahanagar, Aliganj and other Lucknow localities where backup matters as much as bill savings.",
    shortDescription: "3 kW · Hybrid · 5.12 kWh battery · Dealer margin ₹86,000",
    featured: true,
    stock: 12,
    rating: 4.8,
    reviews: 64,
    keySpecs: [["System", "3 kW"], ["Type", "Hybrid"], ["Battery", "5.12 kWh"]],
    specs: [
      ["System capacity", "3 kW", "System"],
      ["Kit model", "LK-04", "System"],
      ["Kit type", "Hybrid, single phase", "System"],
      ["Modules", "6 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "3 kW hybrid inverter", "Equipment"],
      ["Battery", "5.12 kWh LiFePO4, 6,000+ cycles", "Equipment"],
      ["Structure", "Galvanised iron elevated structure", "Equipment"],
      ["Balance of system", "DC/AC cabling, MC4, ACDB, earthing, Wi-Fi monitoring", "Equipment"],
      ["Backup", "Essential lights, fans, router and one refrigerator", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year battery", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "10–12 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["panelsArray", "Modules supplied with the hybrid kit"],
      ["technician", "Hybrid inverter and battery installation"],
    ],
    tags: ["kit", "hybrid", "3kw", "battery", "backup", "residential", "lucknow"],
  },
  {
    id: "lk-05",
    sku: "LK-05",
    name: "5 kW On-Grid Solar Kit",
    slug: "5kw-on-grid-solar-kit",
    categoryId: "on-grid",
    brandId: "solarstore",
    mrp: 2_62_000,
    price: 1_70_000,
    description:
      "A very strong kit for large independent homes and villas. Ten 545 Wp ALMM modules, a 5 kW BIS grid-tie inverter, elevated GI structure and complete BOS. The right default for Gomti Nagar homes with multiple air conditioners and an EV charger.",
    shortDescription: "5 kW · On-grid · Dealer margin ₹92,000",
    featured: true,
    stock: 15,
    rating: 4.8,
    reviews: 98,
    keySpecs: [["System", "5 kW"], ["Type", "On-grid"], ["Dealer margin", "₹92,000"]],
    specs: [
      ["System capacity", "5 kW", "System"],
      ["Kit model", "LK-05", "System"],
      ["Kit type", "On-grid, single phase", "System"],
      ["Modules", "10 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "5 kW BIS grid-tie inverter", "Equipment"],
      ["Structure", "Galvanised iron elevated structure", "Equipment"],
      ["Balance of system", "DC/AC cabling, MC4, ACDB, earthing, Wi-Fi monitoring", "Equipment"],
      ["Typical generation", "20–24 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "7–10 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["panelsAerial", "Aerial view of a 5 kW rooftop array"],
      ["technician", "Dealer team installing the kit"],
    ],
    tags: ["kit", "on-grid", "5kw", "residential", "villa", "lucknow"],
  },
  {
    id: "lk-06",
    sku: "LK-06",
    name: "5 kW Hybrid Solar Kit",
    slug: "5kw-hybrid-solar-kit",
    categoryId: "hybrid",
    brandId: "solarstore",
    mrp: 3_95_000,
    price: 2_56_000,
    description:
      "The premium residential kit for luxury homes and home offices. Ten 545 Wp ALMM modules, a 5 kW hybrid inverter, 10.24 kWh of LiFePO4 storage, elevated structure and complete BOS. Sized for long evening backup without compromising daytime net metering.",
    shortDescription: "5 kW · Hybrid · 10.24 kWh battery · Dealer margin ₹1,39,000",
    stock: 8,
    rating: 4.9,
    reviews: 41,
    keySpecs: [["System", "5 kW"], ["Type", "Hybrid"], ["Battery", "10.24 kWh"]],
    specs: [
      ["System capacity", "5 kW", "System"],
      ["Kit model", "LK-06", "System"],
      ["Kit type", "Hybrid, single phase", "System"],
      ["Modules", "10 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "5 kW hybrid inverter", "Equipment"],
      ["Battery", "10.24 kWh LiFePO4, 6,000+ cycles", "Equipment"],
      ["Structure", "Galvanised iron elevated structure", "Equipment"],
      ["Balance of system", "DC/AC cabling, MC4, ACDB, earthing, Wi-Fi monitoring", "Equipment"],
      ["Backup", "Essential loads plus 2–3 air conditioners for limited hours", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year battery", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "10–12 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["panelsAerial", "Aerial view of the 5 kW array"],
      ["technician", "Hybrid inverter and battery commissioning"],
    ],
    tags: ["kit", "hybrid", "5kw", "battery", "luxury", "residential", "lucknow"],
  },
  {
    id: "lk-07",
    sku: "LK-07",
    name: "10 kW Three-Phase Solar Kit",
    slug: "10kw-three-phase-solar-kit",
    categoryId: "on-grid",
    brandId: "solarstore",
    mrp: 4_90_000,
    price: 3_18_000,
    description:
      "Excellent conversion for joint-family bungalows and small commercial premises. Eighteen 575 Wp TOPCon modules, a 10 kW three-phase inverter, engineered elevated structure and complete three-phase BOS. One kit, one margin, one coordinated delivery.",
    shortDescription: "10 kW · Three-phase · Dealer margin ₹1,72,000",
    featured: true,
    stock: 7,
    rating: 4.8,
    reviews: 53,
    keySpecs: [["System", "10 kW"], ["Type", "Three-phase"], ["Dealer margin", "₹1,72,000"]],
    specs: [
      ["System capacity", "10 kW", "System"],
      ["Kit model", "LK-07", "System"],
      ["Kit type", "On-grid, three phase", "System"],
      ["Modules", "18 × 575 Wp TOPCon", "Equipment"],
      ["Inverter", "10 kW three-phase grid-tie inverter", "Equipment"],
      ["Structure", "Engineered galvanised iron structure", "Equipment"],
      ["Balance of system", "Three-phase ACDB, DCDB, DC/AC cabling, MC4, earthing, monitoring", "Equipment"],
      ["Typical generation", "40–48 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "10–14 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["rooftop", "Large rooftop array suitable for a 10 kW kit"],
      ["technician", "Three-phase inverter commissioning"],
    ],
    tags: ["kit", "on-grid", "10kw", "three-phase", "bungalow", "commercial", "lucknow"],
  },
  {
    id: "lk-08",
    sku: "LK-08",
    name: "15 kW Commercial Solar Kit",
    slug: "15kw-commercial-solar-kit",
    categoryId: "commercial",
    brandId: "solarstore",
    mrp: 6_95_000,
    price: 4_51_000,
    description:
      "A commercial hook for shops, offices and housing societies. Twenty-eight 545 Wp ALMM modules, a 15 kW three-phase inverter, heavy-duty structure and complete BOS. Priced for dealers who want to undercut local wholesale markets while keeping a healthy installation margin.",
    shortDescription: "15 kW · Commercial · Dealer margin ₹2,44,000",
    stock: 6,
    rating: 4.7,
    reviews: 29,
    keySpecs: [["System", "15 kW"], ["Type", "Commercial"], ["Dealer margin", "₹2,44,000"]],
    specs: [
      ["System capacity", "15 kW", "System"],
      ["Kit model", "LK-08", "System"],
      ["Kit type", "On-grid, three phase, commercial", "System"],
      ["Modules", "28 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "15 kW three-phase grid-tie inverter", "Equipment"],
      ["Structure", "Heavy-duty galvanised iron structure", "Equipment"],
      ["Balance of system", "Three-phase ACDB, DCDB, cabling, MC4, earthing, monitoring", "Equipment"],
      ["Typical generation", "60–70 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "12–15 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["solarFarm", "Commercial-scale rooftop solar installation"],
      ["technician", "Three-phase commercial commissioning"],
    ],
    tags: ["kit", "commercial", "15kw", "three-phase", "shop", "office", "lucknow"],
  },
  {
    id: "lk-09",
    sku: "LK-09",
    name: "25 kW Commercial Solar Kit",
    slug: "25kw-commercial-solar-kit",
    categoryId: "commercial",
    brandId: "solarstore",
    mrp: 11_00_000,
    price: 7_15_000,
    description:
      "A heavy-volume kit for warehouses and commercial buildings. Forty-six 545 Wp ALMM modules, a 25 kW three-phase inverter, engineered structure and full three-phase BOS. Built for Transport Nagar warehouses and growing businesses that need a fast, bankable quote.",
    shortDescription: "25 kW · Commercial · Dealer margin ₹3,85,000",
    stock: 4,
    rating: 4.8,
    reviews: 18,
    keySpecs: [["System", "25 kW"], ["Type", "Commercial"], ["Dealer margin", "₹3,85,000"]],
    specs: [
      ["System capacity", "25 kW", "System"],
      ["Kit model", "LK-09", "System"],
      ["Kit type", "On-grid, three phase, commercial", "System"],
      ["Modules", "46 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "25 kW three-phase grid-tie inverter", "Equipment"],
      ["Structure", "Engineered heavy-duty galvanised structure", "Equipment"],
      ["Balance of system", "Three-phase ACDB, DCDB, cabling, MC4, earthing, monitoring", "Equipment"],
      ["Typical generation", "100–115 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "15–18 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["solarFarm", "Warehouse-scale solar installation"],
      ["technician", "Commercial three-phase installation"],
    ],
    tags: ["kit", "commercial", "25kw", "warehouse", "three-phase", "lucknow"],
  },
  {
    id: "lk-10",
    sku: "LK-10",
    name: "50 kW Industrial Solar Kit",
    slug: "50kw-industrial-solar-kit",
    categoryId: "commercial",
    brandId: "solarstore",
    mrp: 20_50_000,
    price: 13_32_000,
    description:
      "The flagship industrial kit. Ninety-two 545 Wp ALMM modules, a 50 kW three-phase inverter, engineered structure and complete BOS. Designed for industrial estates in Amausi and Chinhat, with documentation for GST input credit and discom approvals.",
    shortDescription: "50 kW · Industrial · Dealer margin ₹7,18,000",
    stock: 3,
    rating: 4.9,
    reviews: 11,
    keySpecs: [["System", "50 kW"], ["Type", "Industrial"], ["Dealer margin", "₹7,18,000"]],
    specs: [
      ["System capacity", "50 kW", "System"],
      ["Kit model", "LK-10", "System"],
      ["Kit type", "On-grid, three phase, industrial", "System"],
      ["Modules", "92 × 545 Wp mono PERC", "Equipment"],
      ["Inverter", "50 kW three-phase grid-tie inverter", "Equipment"],
      ["Structure", "Engineered industrial-grade galvanised structure", "Equipment"],
      ["Balance of system", "Three-phase ACDB, DCDB, cabling, MC4, earthing, monitoring", "Equipment"],
      ["Typical generation", "200–230 units per day", "Performance"],
      ["Certification", "ALMM modules, BIS inverter", "Compliance"],
      ["Warranty", "25-year module performance, 5-year inverter, 10-year structure", "Warranty"],
      ["Installation", "Not included — dealer scope", "Commercial"],
      ["Dispatch", "18–21 working days ex-Lucknow", "Logistics"],
    ],
    images: [
      ["solarFarm", "Industrial rooftop solar plant"],
      ["technician", "Industrial-scale commissioning"],
    ],
    tags: ["kit", "industrial", "50kw", "three-phase", "factory", "lucknow"],
  },
]

export const products: Product[] = seeds.map((seed, index) => buildProduct(seed, index))

products.forEach((product) => {
  if (product.category) product.category.productCount = (product.category.productCount ?? 0) + 1
  if (product.brand) product.brand.productCount = (product.brand.productCount ?? 0) + 1
})

export const productBySlug = new Map(products.map((product) => [product.slug, product]))
export const productById = new Map(products.map((product) => [product.id, product]))

export function getProductBySlug(slug: string): Product | undefined {
  return productBySlug.get(slug)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.categoryId === categoryId)
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.featured).slice(0, limit)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .sort((a, b) => {
      const categoryScoreA = a.categoryId === product.categoryId ? 0 : 1
      const categoryScoreB = b.categoryId === product.categoryId ? 0 : 1
      return categoryScoreA - categoryScoreB
    })
    .slice(0, limit)
}

export function getRecommendedProducts(systemSizeKw: number, batteryBackup = false): Product[] {
  let slug = "3kw-on-grid-solar-kit"
  if (batteryBackup) {
    slug = systemSizeKw >= 5 ? "5kw-hybrid-solar-kit" : "3kw-hybrid-solar-kit"
  } else if (systemSizeKw >= 25) {
    slug = "25kw-commercial-solar-kit"
  } else if (systemSizeKw >= 15) {
    slug = "15kw-commercial-solar-kit"
  } else if (systemSizeKw >= 8) {
    slug = "10kw-three-phase-solar-kit"
  } else if (systemSizeKw >= 4) {
    slug = "5kw-on-grid-solar-kit"
  } else if (systemSizeKw >= 3) {
    slug = "3kw-on-grid-solar-kit"
  } else if (systemSizeKw >= 2) {
    slug = "2kw-on-grid-solar-kit"
  } else {
    slug = "1kw-on-grid-solar-kit"
  }
  const kit = productBySlug.get(slug)
  return kit ? [kit] : []
}

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlug.get(slug)
}
