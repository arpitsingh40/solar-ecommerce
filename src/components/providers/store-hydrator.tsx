"use client"

import { useEffect } from "react"

import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

/**
 * Rehydrate browser-persisted stores after mount.
 *
 * The static HTML is rendered without access to localStorage, so hydrating
 * during module evaluation causes the server and client trees to disagree.
 * Running hydration in an effect keeps the first client render deterministic
 * while restoring the dealer order and saved kits immediately afterwards.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate()
    void useWishlist.persist.rehydrate()
  }, [])

  return null
}
