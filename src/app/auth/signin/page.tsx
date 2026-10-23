"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Lock, Mail, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { safeCallbackUrl } from "@/lib/auth/redirect"

function dashboardForRole(role: string): string {
  if (role === "admin") return "/admin/dashboard"
  if (role === "supplier") return "/supplier/dashboard"
  return "/dashboard"
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isLoading, setUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"))

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace(callbackUrl ?? dashboardForRole(user.role))
    }
  }, [isLoading, user, router, callbackUrl])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Sign in failed",
          description: data.error || "Invalid email or password",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      setUser(data.user)
      toast({ title: "Signed in", description: `Welcome back, ${data.user.name}` })
      router.replace(callbackUrl ?? dashboardForRole(data.user.role))
      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-apple-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-apple-gray-900 text-white dark:bg-white dark:text-apple-gray-900">
          <Sun className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">Dealer sign in</CardTitle>
        <CardDescription>Access 65% kit pricing and your dealer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-apple-gray-400" />
            <Input
              type="email"
              placeholder="Work email"
              aria-label="Work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0 text-apple-gray-400" />
            <Input
              type="password"
              placeholder="••••••••"
              aria-label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in to dealer desk
          </Button>
        </form>

        <div className="mt-6 rounded-lg border border-apple-gray-200 bg-apple-gray-50 p-3 text-xs text-muted-foreground dark:border-apple-gray-800 dark:bg-apple-gray-900">
          <p className="mb-1 font-medium text-apple-gray-700 dark:text-apple-gray-300">
            Demo dealer accounts
          </p>
          <p>Dealer · customer@solarstore.com / customer123</p>
          <p>Admin · admin@solarstore.com / admin123</p>
          <p>Supplier · supplier@solarstore.com / supplier123</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          New to SolarStore?{" "}
          <Link
            href="/auth/signup"
            className="text-apple-blue-600 hover:text-apple-blue-500 underline underline-offset-4"
          >
            Apply for dealer access
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Dealer accounts are for registered solar businesses and installers.
        </p>
      </CardFooter>
    </Card>
  )
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-apple-gray-50 px-4 dark:bg-apple-gray-900">
      <React.Suspense
        fallback={<Loader2 className="h-8 w-8 animate-spin text-apple-gray-400" aria-label="Loading" />}
      >
        <SignInForm />
      </React.Suspense>
    </div>
  )
}
