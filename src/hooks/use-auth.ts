"use client"

import { create } from "zustand"

export type UserRole = "customer" | "admin" | "supplier"

export interface AuthUser {
  id: string
  email: string
  name: string
  companyName?: string
  role: UserRole
  avatar?: string
  phone?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  refresh: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      const data = (await res.json()) as { user: AuthUser | null }
      set({ user: data.user ?? null, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },

  signOut: async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
    } catch {
      // Clear local state even if the network request fails.
    }
    set({ user: null, isLoading: false })
  },
}))
