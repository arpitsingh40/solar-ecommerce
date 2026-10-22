/**
 * India-specific commerce constants and helpers.
 *
 * All dealer prices on SolarStore are displayed in Indian Rupees and are
 * inclusive of GST at the rate applicable to solar equipment (5%).
 */

export const INDIA = {
  name: "India",
  currency: "INR",
  locale: "en-IN",
  gstRate: 0.05,
  freeShippingThreshold: 4_999,
  standardShipping: 499,
  codFee: 99,
  codOrderLimit: 50_000,
  maxSubsidy: 78_000,
  upStateSubsidy: 30_000,
  upCombinedSubsidy: 1_08_000,
  supportPhone: "+91 522 471 2200",
  supportPhoneHref: "tel:+915224712200",
  whatsapp: "+91 522 471 2200",
  whatsappHref: "https://wa.me/915224712200",
  supportEmail: "support@solarstore.in",
  salesEmail: "hello@solarstore.in",
  supportHours: "Mon–Sat, 9:00 AM – 8:00 PM IST",
  address: {
    line1: "SolarStore House, Vibhuti Khand, Gomti Nagar",
    line2: "Lucknow, Uttar Pradesh 226010",
    country: "India",
  },
  legalName: "SolarStore India Pvt. Ltd.",
  gstin: "09AABCS1429B1ZX",
  cin: "U40106UP2019PTC123456",
  founded: 2019,
  serviceablePincodes: "19,000+",
  deliveryWindow: "7–14 business days",
  returnWindowDays: 7,
} as const

/** Indicative average residential tariff, ₹ per kWh. Actual bills vary by discom and slab. */
export const STATE_TARIFFS: Record<string, number> = {
  "Andhra Pradesh": 8.8,
  "Arunachal Pradesh": 6.9,
  Assam: 7.8,
  Bihar: 7.8,
  Chhattisgarh: 7.2,
  Goa: 7.2,
  Gujarat: 7.2,
  Haryana: 8.0,
  "Himachal Pradesh": 6.8,
  Jharkhand: 7.4,
  Karnataka: 8.2,
  Kerala: 7.6,
  "Madhya Pradesh": 8.3,
  Maharashtra: 10.5,
  Manipur: 7.0,
  Meghalaya: 7.1,
  Mizoram: 7.0,
  Nagaland: 7.0,
  Odisha: 7.5,
  Punjab: 8.4,
  Rajasthan: 8.5,
  Sikkim: 6.9,
  "Tamil Nadu": 8.0,
  Telangana: 9.5,
  Tripura: 7.2,
  "Uttar Pradesh": 7.5,
  Uttarakhand: 7.5,
  "West Bengal": 8.9,
  "Andaman and Nicobar Islands": 8.0,
  Chandigarh: 7.8,
  "Dadra and Nagar Haveli and Daman and Diu": 7.4,
  Delhi: 7.5,
  "Jammu and Kashmir": 7.0,
  Ladakh: 7.0,
  Lakshadweep: 8.0,
  Puducherry: 7.8,
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const

export const INDIAN_UNION_TERRITORIES = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const

export const INDIAN_STATES_AND_UTS = [...INDIAN_STATES, ...INDIAN_UNION_TERRITORIES]

/** Annual generation per kWp, adjusted for typical Indian irradiance. */
export const STATE_SOLAR_YIELD: Record<string, number> = {
  Rajasthan: 1_650,
  Gujarat: 1_600,
  Maharashtra: 1_520,
  Telangana: 1_520,
  "Andhra Pradesh": 1_510,
  Karnataka: 1_500,
  "Tamil Nadu": 1_500,
  "Madhya Pradesh": 1_480,
  Haryana: 1_460,
  Delhi: 1_450,
  Punjab: 1_450,
  "Uttar Pradesh": 1_430,
  Bihar: 1_400,
  Chhattisgarh: 1_420,
  Odisha: 1_400,
  Jharkhand: 1_390,
  "West Bengal": 1_370,
  Assam: 1_320,
  Kerala: 1_350,
  Goa: 1_420,
  Uttarakhand: 1_300,
  "Himachal Pradesh": 1_280,
  "Jammu and Kashmir": 1_250,
  Ladakh: 1_700,
  Sikkim: 1_220,
  "Arunachal Pradesh": 1_240,
  Manipur: 1_300,
  Meghalaya: 1_280,
  Mizoram: 1_320,
  Nagaland: 1_300,
  Tripura: 1_330,
  Chandigarh: 1_450,
  Puducherry: 1_480,
  "Andaman and Nicobar Islands": 1_380,
  "Dadra and Nagar Haveli and Daman and Diu": 1_520,
  Lakshadweep: 1_400,
}

export function getStateTariff(state: string): number {
  return STATE_TARIFFS[state] ?? 8
}

export function getStateSolarYield(state: string): number {
  return STATE_SOLAR_YIELD[state] ?? 1_450
}

/**
 * PM Surya Ghar: Muft Bijli Yojana central financial assistance for
 * residential rooftop solar (as notified by MNRE).
 *   1 kW  → ₹30,000
 *   2 kW  → ₹60,000
 *   ≥3 kW → ₹78,000
 */
export function calculatePmSuryaGharSubsidy(capacityKw: number): number {
  if (!Number.isFinite(capacityKw) || capacityKw <= 0) return 0
  if (capacityKw >= 3) return INDIA.maxSubsidy
  if (capacityKw >= 2) return Math.round(60_000 + (capacityKw - 2) * 18_000)
  return Math.round(capacityKw * 30_000)
}

/**
 * Uttar Pradesh combined benchmark: central PM Surya Ghar assistance plus the
 * ₹30,000 state top-up for eligible residential systems up to 3 kW.
 */
export function calculateUttarPradeshSubsidy(capacityKw: number): number {
  const central = calculatePmSuryaGharSubsidy(capacityKw)
  if (central === 0) return 0
  const stateTopUp = capacityKw <= 3 ? INDIA.upStateSubsidy : 0
  return central + stateTopUp
}

/** Combined benchmark for the selected state; UP includes its ₹30,000 top-up. */
export function calculateSubsidyForState(state: string, capacityKw: number): number {
  if (state === "Uttar Pradesh") return calculateUttarPradeshSubsidy(capacityKw)
  return calculatePmSuryaGharSubsidy(capacityKw)
}

/** GST component contained in an inclusive price. */
export function gstIncluded(amount: number): number {
  return Math.round(amount - amount / (1 + INDIA.gstRate))
}

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0
  return subtotal >= INDIA.freeShippingThreshold ? 0 : INDIA.standardShipping
}

export function formatINR(
  amount: number,
  options: { decimals?: boolean; compact?: boolean } = {}
): string {
  if (options.compact) return formatINRCompact(amount)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: options.decimals ? 2 : 0,
    maximumFractionDigits: options.decimals ? 2 : 0,
  }).format(Number.isFinite(amount) ? amount : 0)
}

/** Indian short scale: ₹1.2 L, ₹3.4 Cr. */
export function formatINRCompact(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0"
  const abs = Math.abs(amount)
  if (abs >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(1)} Cr`
  if (abs >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(1)} L`
  if (abs >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`
  return formatINR(amount)
}

export function emiFor(amount: number, annualRate: number, months: number): number {
  if (amount <= 0 || months <= 0) return 0
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) return Math.ceil(amount / months)
  const factor = Math.pow(1 + monthlyRate, months)
  return Math.ceil((amount * monthlyRate * factor) / (factor - 1))
}

/** Approximate kit delivery window by state/UT zone, including dispatch lead time. */
export function deliveryEstimate(state: string): string {
  const metro = ["Delhi", "Haryana", "Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Gujarat", "West Bengal", "Punjab", "Rajasthan", "Uttar Pradesh"]
  const remote = ["Andaman and Nicobar Islands", "Lakshadweep", "Ladakh", "Arunachal Pradesh", "Sikkim", "Mizoram", "Nagaland", "Manipur", "Meghalaya", "Tripura"]
  if (remote.includes(state)) return "10–21 business days"
  if (metro.includes(state)) return "7–14 business days"
  return "8–16 business days"
}

export function isValidIndianPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, "").slice(-10))
}

export function isValidPincode(value: string): boolean {
  return /^[1-9]\d{5}$/.test(value)
}

export function isValidGstin(value: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value.toUpperCase())
}

export function isValidUpi(value: string): boolean {
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(value)
}
