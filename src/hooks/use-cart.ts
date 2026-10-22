"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CartItem, Product, ProductVariant } from "@/types/product"
import { toast } from "@/hooks/use-toast"

interface CartState {
  items: CartItem[]
  coupon: string | null
  isOpen: boolean
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  setCoupon: (coupon: string | null) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (product: Product, variant?: ProductVariant, quantity = 1) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (item) => item.productId === product.id && item.variantId === variant?.id
        )

        if (existingIndex > -1) {
          const newItems = [...items]
          // TypeScript doesn't know existingIndex is valid, so we check
          if (newItems[existingIndex]) {
            newItems[existingIndex].quantity += quantity
          }
          set({ items: newItems })
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${variant?.id || "default"}-${Date.now()}`,
            productId: product.id,
            variantId: variant?.id,
            quantity,
            product,
            variant,
            addedAt: new Date().toISOString(),
          }
          set({ items: [...items, newItem] })
        }

        // Skip variant text for now to avoid TypeScript issues
        toast({
          title: "Kit added to dealer order",
          description: `${product.name} is now in your kit order.`,
        })

        get().openCart()
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter((item) => item.id !== itemId) })
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [], coupon: null }),

      setCoupon: (coupon) => set({ coupon }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "solarstore-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
      skipHydration: true,
    }
  )
)