import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getInfoPage, infoPages } from "@/lib/data/content"
import { slugify } from "@/lib/utils"
import { INDIA } from "@/lib/india"
import {
  ChevronRight,
  CheckCircle,
  Phone,
  Mail,
  Calculator,
  ArrowRight,
  Clock,
} from "lucide-react"

export function generateStaticParams() {
  return infoPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getInfoPage(slug)
  if (!page) return { title: "Page not found" }
  return {
    title: page.title,
    description: page.description,
  }
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatDate(value: string) {
  const parts = value.split("-")
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])
  return `${day} ${months[month - 1] ?? ""} ${year}`
}

export default async function InfoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getInfoPage(slug)
  if (!page) notFound()

  const sectionIds = page.sections.map((section) => slugify(section.heading))
  const isLegal = ["privacy", "terms", "cookies", "accessibility"].includes(page.slug)

  return (
    <div className="container-apple section-space-sm">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-apple-gray-900">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-apple-gray-900 dark:text-white">{page.title}</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <Badge variant="outline" className="mb-4">
          {isLegal ? "Legal" : "SolarStore India"}
        </Badge>
        <h1 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          {page.title}
        </h1>
        <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">{page.description}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Last updated {formatDate(page.updated)}
        </p>
      </div>

      <div className={`mt-10 grid gap-10 ${isLegal ? "max-w-4xl" : "lg:grid-cols-[0.27fr_0.73fr]"}`}>
        {!isLegal && (
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-400">
              On this page
            </p>
            <nav className="mt-3 space-y-2">
              {page.sections.map((section, index) => (
                <a
                  key={section.heading}
                  href={`#${sectionIds[index]}`}
                  className="block text-sm leading-snug text-apple-gray-600 hover:text-apple-blue-600 dark:text-apple-gray-400"
                >
                  {section.heading}
                </a>
              ))}
            </nav>

            <Card className="mt-6 p-5">
              <p className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                Talk to our dealer desk
              </p>
              <a
                href={INDIA.supportPhoneHref}
                className="mt-2 flex items-center gap-2 text-sm font-medium text-apple-blue-600 hover:underline"
              >
                <Phone className="h-4 w-4" /> {INDIA.supportPhone}
              </a>
              <a
                href={`mailto:${INDIA.supportEmail}`}
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-apple-blue-600"
              >
                <Mail className="h-4 w-4" /> {INDIA.supportEmail}
              </a>
              <p className="mt-2 text-xs text-muted-foreground">{INDIA.supportHours}</p>
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href="/solar-calculator">
                  <Calculator className="mr-2 h-4 w-4" /> Build a dealer quote
                </Link>
              </Button>
            </Card>
          </aside>
        )}

        <article className={isLegal ? "min-w-0" : "min-w-0 max-w-3xl"}>
          {page.sections.map((section, index) => (
            <section key={section.heading} id={sectionIds[index]} className="scroll-mt-28 pb-9">
              <h2 className="text-headline-lg font-display font-semibold tracking-tight text-apple-gray-900 dark:text-white">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-body-md leading-relaxed text-apple-gray-600 dark:text-apple-gray-400"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 60)}
                      className="flex items-start gap-2.5 text-body-md leading-relaxed text-apple-gray-600 dark:text-apple-gray-400"
                    >
                      <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-apple-green-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="mt-5 overflow-x-auto rounded-xl border border-apple-gray-200 dark:border-apple-gray-800">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="bg-apple-gray-50 dark:bg-apple-gray-900">
                      <tr>
                        {section.table.headers.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-4 py-3 font-semibold text-apple-gray-900 dark:text-white"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-apple-gray-100 bg-white dark:divide-apple-gray-800 dark:bg-apple-gray-950">
                      {section.table.rows.map((row) => (
                        <tr key={row.join("-")}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${cell}-${cellIndex}`}
                              className="px-4 py-3 text-apple-gray-600 dark:text-apple-gray-400"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          {!isLegal && (
            <>
              <div className="rounded-2xl bg-apple-gray-900 p-6 text-white sm:p-8">
                <h2 className="text-headline-lg font-semibold">Ready to quote your next rooftop?</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                  Estimate system size, PM Surya Ghar subsidy, homeowner turnkey cost, your 65% kit
                  price and the margin you retain.
                </p>
                <Button variant="secondary" asChild className="mt-5">
                  <Link href="/solar-calculator">
                    Open dealer calculator <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8">
                <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
                  Explore SolarStore
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Browse dealer kits", href: "/products" },
                    { label: "Learning Center", href: "/learn" },
                    { label: "Project builder", href: "/project-builder" },
                    { label: "Support", href: "/support" },
                    { label: "Installation guide", href: "/installation-guide" },
                    { label: "FAQs", href: "/faqs" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="rounded-full border border-apple-gray-200 px-4 py-2 text-sm text-apple-gray-700 transition-colors hover:border-apple-gray-400 hover:text-apple-gray-900 dark:border-apple-gray-700 dark:text-apple-gray-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </article>
      </div>
    </div>
  )
}
