import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getArticle, articles } from "@/lib/data/content"
import { slugify } from "@/lib/utils"
import { ArrowRight, Clock, Phone, Calculator, ChevronRight, CheckCircle } from "lucide-react"
import { INDIA } from "@/lib/india"

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: "Guide not found" }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
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

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2)
  const sectionIds = article.sections.map((section) => slugify(section.heading))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${article.heroImage}`,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: INDIA.legalName },
  }

  return (
    <div className="container-apple section-space-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-apple-gray-900">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/learn" className="hover:text-apple-gray-900">
          Learning Center
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-[260px] truncate text-apple-gray-900 dark:text-white sm:max-w-md">
          {article.title}
        </span>
      </nav>

      <div className="mx-auto mt-8 max-w-3xl text-center">
        <Badge variant="outline">{article.category}</Badge>
        <h1 className="mt-4 text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          {article.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>{article.author}</span>
          <span className="text-apple-gray-300">·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span className="text-apple-gray-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {article.readingTime}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-5xl">
        <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-800">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[0.28fr_0.72fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-400">
            In this guide
          </p>
          <nav className="mt-3 space-y-2">
            {article.sections.map((section, index) => (
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
              Need a quote for your roof?
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Tell us your city, bill and roof type. We&apos;ll suggest a system and a subsidy estimate.
            </p>
            <Button asChild size="sm" className="mt-4 w-full">
              <Link href="/solar-calculator">
                <Calculator className="mr-2 h-4 w-4" /> Calculate savings
              </Link>
            </Button>
            <a
              href={INDIA.supportPhoneHref}
              className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-apple-blue-600 hover:underline"
            >
              <Phone className="h-3 w-3" /> {INDIA.supportPhone}
            </a>
          </Card>
        </aside>

        <article className="min-w-0">
          {article.sections.map((section, index) => (
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
                  <table className="w-full min-w-[520px] text-left text-sm">
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

          <div className="rounded-2xl bg-apple-gray-900 p-6 text-white sm:p-8">
            <p className="text-sm font-medium text-white/60">Ready to quote your next rooftop?</p>
            <h2 className="mt-1 text-headline-lg font-semibold">Build a dealer-ready kit quote.</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
              Use the dealer calculator to estimate system size, UP subsidy, homeowner turnkey cost,
              your 65% kit price and the 35% margin you retain.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" asChild>
                <Link href="/solar-calculator">
                  Open dealer calculator <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/products">Browse dealer kits</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-headline-md font-semibold text-apple-gray-900 dark:text-white">
              Keep reading
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <Link key={item.slug} href={`/learn/${item.slug}`} className="group">
                  <Card className="h-full p-5">
                    <Badge variant="outline">{item.category}</Badge>
                    <h3 className="mt-3 font-semibold leading-snug text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
