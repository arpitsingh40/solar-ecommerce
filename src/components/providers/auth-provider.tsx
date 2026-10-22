"use client"

import { useEffect } from "react"

import { useAuth } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refresh = useAuth((state) => state.refresh)

  useEffect(() => {
    void refresh()
  }, [refresh])

  return <>{children}</>
}
