import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import type { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-apple-gray-950">
      <Header />
      <main className="flex-1 bg-white dark:bg-apple-gray-950">{children}</main>
      <Footer />
    </div>
  )
}