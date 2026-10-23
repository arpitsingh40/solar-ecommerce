"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2, Lock, Mail, Loader2, Sun, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { safeCallbackUrl } from "@/lib/auth/redirect"

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isLoading, setUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [name, setName] = React.useState("")
  const [companyName, setCompanyName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"))

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace(callbackUrl)
    }
  }, [isLoading, user, router, callbackUrl])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, companyName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Dealer application failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      setUser(data.user)
      toast({
        title: "Dealer account ready",
        description: `Welcome to the dealer desk, ${data.user.name}`,
      })
      router.replace(callbackUrl)
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
        <CardTitle className="text-2xl">Open a dealer account</CardTitle>
        <CardDescription>
          Unlock 65% kit pricing for your solar business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-apple-gray-400" />
            <Input
              type="text"
              placeholder="Business name"
              aria-label="Business name"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              autoComplete="organization"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-apple-gray-400" />
            <Input
              type="text"
              placeholder="Contact name"
              aria-label="Contact name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="Password — at least 8 characters"
              aria-label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create dealer account
          </Button>
        </form>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          Dealer accounts are for registered businesses, EPCs and installation companies. GSTIN is
          captured at checkout for your invoice.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Already have a dealer account?{" "}
          <Link
            href="/auth/signin"
            className="text-apple-blue-600 hover:text-apple-blue-500 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-apple-gray-50 px-4 dark:bg-apple-gray-900">
      <React.Suspense
        fallback={<Loader2 className="h-8 w-8 animate-spin text-apple-gray-400" aria-label="Loading" />}
      >
        <SignUpForm />
      </React.Suspense>
    </div>
  )
}
