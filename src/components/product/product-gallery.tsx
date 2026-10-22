"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import type { ProductImage } from "@/types/product"

interface ProductGalleryProps {
  images: ProductImage[]
  selectedIndex?: number
  onSelectIndex?: (index: number) => void
  onClose?: () => void
  isOpen?: boolean
}

export function ProductGallery({
  images,
  selectedIndex = 0,
  onSelectIndex,
  onClose,
  isOpen = false,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    setCurrentIndex(selectedIndex)
  }, [selectedIndex])

  const imageCount = images.length
  const currentImage = images[currentIndex] ?? images[0]
  const overlayOpen = isFullscreen || isOpen

  const nextImage = () => {
    if (imageCount === 0) return
    setCurrentIndex((prev) => (prev + 1) % imageCount)
  }

  const prevImage = () => {
    if (imageCount === 0) return
    setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount)
  }

  const closeOverlay = () => {
    setIsFullscreen(false)
    onClose?.()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") nextImage()
    if (event.key === "ArrowLeft") prevImage()
    if (event.key === "Escape") closeOverlay()
  }

  if (imageCount === 0) {
    return (
      <div className="flex aspect-product items-center justify-center rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800">
        <Expand className="h-12 w-12 text-apple-gray-400" />
      </div>
    )
  }

  return (
    <>
      <div
        className="group relative aspect-product overflow-hidden rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800"
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Product image gallery"
      >
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `Product image ${currentIndex + 1}`}
            fill
            priority
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {imageCount > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 dark:bg-apple-gray-900/90"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 dark:bg-apple-gray-900/90"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm dark:bg-apple-gray-900/90"
          onClick={() => setIsFullscreen(true)}
          aria-label="View full screen"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {imageCount > 1 && (
        <div
          className="scrollbar-hide mt-3 flex items-center justify-center gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={image.url}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`View image ${index + 1}`}
              onClick={() => {
                setCurrentIndex(index)
                onSelectIndex?.(index)
              }}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 sm:h-24 sm:w-24",
                index === currentIndex
                  ? "border-apple-blue-600 dark:border-apple-blue-400"
                  : "border-transparent hover:border-apple-gray-300 dark:hover:border-apple-gray-600"
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {overlayOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Product image full screen"
        >
          <div
            className="relative mx-4 max-h-[90vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:text-apple-blue-400"
              onClick={closeOverlay}
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || `Product image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            {imageCount > 1 && (
              <div className="scrollbar-hide mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      index === currentIndex
                        ? "border-apple-blue-600"
                        : "border-transparent hover:border-apple-gray-600"
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={image.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
