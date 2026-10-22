import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { articles } from "@/lib/data/content"
import { ArrowRight, Clock, BookOpen, Calculator, Landmark } from "lucide-react"

export const metadata: Metadata = {
  title: "Solar Learning Center",
  description:
    "Practical guides to PM Surya Ghar subsidy, net metering, solar pricing, inverter sizing and rooftop solar for dealer teams quoting Indian homes, societies and businesses.",
}

const categoryOrder = ["Subsidy", "Net metering", "Buying guide", "Installation"]

export default function LearnPage() {
  const featured = articles[0]!
  const rest = articles.slice(1)

  return (
    <div className="container-apple section-space-sm">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="solar" className="mb-5">
          <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Learning Center
        </Badge>
        <h1 className="text-display-xl font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Solar, explained for India.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Subsidy rules, net metering, real prices and installation details — written for dealer teams
          quoting Indian homeowners, societies and businesses.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categoryOrder.map((category) => (
            <span
              key={category}
              className="rounded-full border border-apple-gray-200 px-3.5 py-1.5 text-xs font-medium text-apple-gray-600 dark:border-apple-gray-700 dark:text-apple-gray-400"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Link
          href={`/learn/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-apple-gray-200 bg-white lg:grid-cols-2 dark:border-apple-gray-800 dark:bg-apple-gray-950"
        >
          <div className="relative min-h-[280px] lg:min-h-[400px]">
            <Image
              src={featured.heroImage}
              alt={featured.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Badge variant="outline">{featured.category}</Badge>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" /> {featured.readingTime}
              </span>
            </div>
            <h2 className="mt-4 text-display-lg font-display font-bold tracking-tight text-apple-gray-900 dark:text-white">
              {featured.title}
            </h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted-foreground">
              {featured.excerpt}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-apple-blue-600">
              Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((article) => (
          <Link key={article.slug} href={`/learn/${article.slug}`} className="group">
            <Card className="h-full overflow-hidden">
              <div className="relative aspect-[16/10] bg-apple-gray-100 dark:bg-apple-gray-800">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-muted-foreground">{article.readingTime}</span>
                </div>
                <h2 className="mt-3 text-headline-md font-semibold leading-snug text-apple-gray-900 group-hover:text-apple-blue-600 dark:text-white">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <Calculator className="h-5 w-5 text-apple-gray-600 dark:text-apple-gray-300" />
          <h2 className="mt-4 font-semibold text-apple-gray-900 dark:text-white">Size your system</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Use your state and monthly bill to estimate system size, subsidy and payback.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href="/solar-calculator">
              Open calculator <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
        <Card className="p-6">
          <Landmark className="h-5 w-5 text-apple-gray-600 dark:text-apple-gray-300" />
          <h2 className="mt-4 font-semibold text-apple-gray-900 dark:text-white">Subsidy centre</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Understand the ₹78,000 PM Surya Ghar benefit, documents and timelines.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href="/learn/pm-surya-ghar-subsidy">
              Read the guide <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
        <Card className="p-6">
          <BookOpen className="h-5 w-5 text-apple-gray-600 dark:text-apple-gray-300" />
          <h2 className="mt-4 font-semibold text-apple-gray-900 dark:text-white">Build a project</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Compare 3 kW, 5 kW and 10 kW systems with Indian prices and subsidies.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href="/project-builder">
              Start building <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}
