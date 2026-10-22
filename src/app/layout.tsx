import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/providers/auth-provider"
import { StoreHydrator } from "@/components/providers/store-hydrator"
import { ThemeProvider } from "@/components/providers/theme-provider"

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "SolarStore India — Dealer-Only Rooftop Solar Kits",
    template: "%s | SolarStore India",
  },
  description: "Complete 1–50 kW rooftop solar kits for dealers. ALMM modules, BIS-certified inverters and full BOS at 65% of turnkey, with GST invoices, UP subsidy support and freight included.",
  keywords: ["solar kits India", "dealer solar kits", "rooftop solar kits", "on-grid solar kit", "hybrid solar kit", "commercial solar kit", "PM Surya Ghar", "UP solar subsidy", "Lucknow solar", "net metering"],
  authors: [{ name: "SolarStore India" }],
  creator: "SolarStore India",
  publisher: "SolarStore India",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "SolarStore India",
    title: "SolarStore India — Dealer-Only Rooftop Solar Kits",
    description: "Complete rooftop solar kits at 65% of turnkey. One SKU, one freight cost and clear dealer margins.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarStore India — complete rooftop solar kits for dealers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarStore India — Dealer Rooftop Solar Kits",
    description: "Complete 1–50 kW kits at 65% of turnkey, with GST invoices, UP subsidy support and freight included.",
    images: ["/og-image.jpg"],
    creator: "@solarstoreindia",
  },
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
          <AuthProvider>
            <StoreHydrator />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}