"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Product } from "@/types/product"
import { toast } from "@/hooks/use-toast"

interface WishlistState {
  items: string[] // product IDs
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items
        if (!items.includes(product.id)) {
          set({ items: [...items, product.id] })
          toast({
            title: "Kit saved",
            description: `${product.name} has been added to your saved kits.`,
          })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) })
        toast({
          title: "Kit removed",
          description: "The kit has been removed from your saved kits.",
        })
      },

      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isInWishlist: (productId) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "solarstore-wishlist",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)