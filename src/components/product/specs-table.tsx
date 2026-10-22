"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import type { ProductSpec } from "@/types/product"

interface SpecsTableProps {
  specs: ProductSpec[]
  showGroups?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  highlightDifferences?: boolean
  compareSpecs?: ProductSpec[]
}

export function SpecsTable({
  specs,
  showGroups = true,
  collapsible = true,
  defaultExpanded = true,
  highlightDifferences = false,
  compareSpecs = [],
}: SpecsTableProps) {
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    if (collapsible && showGroups) {
      const initial: Record<string, boolean> = {}
      const groups = [...new Set(specs.map((s) => s.group).filter(Boolean))]
      groups.forEach((group) => {
        initial[group!] = defaultExpanded
      })
      setExpandedGroups(initial)
    }
  }, [specs, collapsible, showGroups, defaultExpanded])

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const getCompareValue = (key: string) => {
    return compareSpecs.find((s) => s.key === key)?.value
  }

  const isDifferent = (key: string) => {
    if (!highlightDifferences || compareSpecs.length === 0) return false
    const compareValue = getCompareValue(key)
    const currentValue = specs.find((s) => s.key === key)?.value
    return compareValue !== undefined && compareValue !== currentValue
  }

  const groupedSpecs = specs.reduce((acc, spec) => {
    const group = spec.group || "General"
    if (!acc[group]) acc[group] = []
    acc[group].push(spec)
    return acc
  }, {} as Record<string, ProductSpec[]>)

  return (
    <div className="space-y-4">
      {showGroups ? (
        Object.entries(groupedSpecs).map(([group, groupSpecs]) => {
          const isExpanded = expandedGroups[group] ?? defaultExpanded
          return (
            <div key={group} className="border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg overflow-hidden">
              {collapsible && (
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between p-4 bg-apple-gray-50 dark:bg-apple-gray-800/50 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <h4 className="font-medium text-apple-gray-900 dark:text-white">{group}</h4>
                  <span className="text-muted-foreground">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </span>
                </button>
              )}
              <div className={cn("overflow-hidden transition-all duration-300", !collapsible || isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                <div className="divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
                  {groupSpecs.map((spec) => (
                    <SpecRow key={spec.key} spec={spec} compareValue={getCompareValue(spec.key)} isDifferent={isDifferent(spec.key)} />
                  ))}
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg overflow-hidden">
          <div className="divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
            {specs.map((spec) => (
              <SpecRow key={spec.key} spec={spec} compareValue={getCompareValue(spec.key)} isDifferent={isDifferent(spec.key)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SpecRow({ spec, compareValue, isDifferent }: { spec: ProductSpec; compareValue?: string; isDifferent: boolean }) {
  const hasUnit = spec.unit && spec.unit !== "none"
  const displayValue = spec.value
  const displayCompare = compareValue

  return (
    <div className={cn("grid grid-cols-[1fr_2fr] gap-4 p-4 transition-colors", isDifferent && "bg-apple-yellow-50 dark:bg-apple-yellow-900/20")}>
      <div className="font-medium text-apple-gray-900 dark:text-white flex items-center gap-2">
        {spec.key}
        {isDifferent && <AlertCircle className="h-4 w-4 text-apple-yellow-500" aria-label="Different from comparison" />}
        {spec.required && <Badge variant="outline" className="text-xs h-4 px-1.5">Required</Badge>}
      </div>
      <div className="text-apple-gray-600 dark:text-apple-gray-300 flex items-center gap-2">
        <span>{displayValue}</span>
        {hasUnit && <span className="text-muted-foreground text-sm">{spec.unit}</span>}
        {displayCompare && displayCompare !== displayValue && (
          <span className="flex items-center gap-1 text-xs text-apple-red-500">
            <AlertCircle className="h-3 w-3" />
            Was: {displayCompare}
          </span>
        )}
      </div>
    </div>
  )
}

interface ComparisonTableProps {
  products: Array<{ id: string; name: string; slug: string; specs: ProductSpec[]; images: Array<{ url: string }> }>
  showOnlyDifferences?: boolean
}

export function ComparisonTable({ products, showOnlyDifferences = false }: ComparisonTableProps) {
  const allSpecKeys = [...new Set(products.flatMap((p) => p.specs.map((s) => s.key)))]
  const groupedSpecs = allSpecKeys.reduce((acc, key) => {
    const firstSpec = products[0]?.specs.find((s) => s.key === key)
    const group = firstSpec?.group || "General"
    if (!acc[group]) acc[group] = []
    acc[group].push(key)
    return acc
  }, {} as Record<string, string[]>)

  const getSpecValue = (product: typeof products[0], key: string) => {
    return product.specs.find((s) => s.key === key)?.value || "—"
  }

  const getSpecUnit = (product: typeof products[0], key: string) => {
    return product.specs.find((s) => s.key === key)?.unit || ""
  }

  const isDifferent = (key: string) => {
    const values = products.map((p) => getSpecValue(p, key))
    return new Set(values).size > 1
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-apple-gray-200 dark:border-apple-gray-700">
            <th className="sticky left-0 z-10 w-48 px-4 py-3 text-left font-medium text-apple-gray-900 dark:text-white bg-white dark:bg-apple-gray-900">
              Specification
            </th>
            {products.map((product) => {
              const image = product.images[0]
              return (
                <th key={product.id} className="px-4 py-3 text-left font-medium text-apple-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {image && (
                      <Image
                        src={image.url}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <a href={`/products/${product.slug}`} className="font-medium hover:text-apple-blue-600 dark:hover:text-apple-blue-400">
                      {product.name}
                    </a>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
          {Object.entries(groupedSpecs).map(([group, keys]) => (
            <React.Fragment key={group}>
              <tr className="bg-apple-gray-50 dark:bg-apple-gray-800/50">
                <th className="px-4 py-2 font-semibold text-apple-gray-900 dark:text-white text-sm uppercase tracking-wider">
                  {group}
                </th>
                {products.map((product) => (
                  <th key={product.id} className="px-4 py-2" />
                ))}
              </tr>
              {keys
                .filter((key) => !showOnlyDifferences || isDifferent(key))
                .map((key) => (
                  <tr key={key} className="hover:bg-apple-gray-50 dark:hover:bg-apple-gray-800/50">
                    <td className="sticky left-0 z-10 px-4 py-3 font-medium text-apple-gray-900 dark:text-white bg-white dark:bg-apple-gray-900">
                      {key}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="px-4 py-3 text-apple-gray-600 dark:text-apple-gray-300">
                        <span className={cn(isDifferent(key) && "font-medium text-apple-gray-900 dark:text-white")}>
                          {getSpecValue(product, key)}
                          {getSpecUnit(product, key) && (
                            <span className="text-muted-foreground text-sm ml-1">{getSpecUnit(product, key)}</span>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}