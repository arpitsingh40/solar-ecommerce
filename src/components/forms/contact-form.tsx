"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Loader2 } from "lucide-react"
import { isValidIndianPhone } from "@/lib/india"

const topics = [
  "General enquiry",
  "Order status",
  "PM Surya Ghar subsidy",
  "Warranty claim",
  "Returns and refunds",
  "Installation",
  "Dealer program",
  "Something else",
]

interface ContactFormProps {
  defaultTopic?: string
  compact?: boolean
}

export function ContactForm({ defaultTopic = "General enquiry", compact = false }: ContactFormProps) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    topic: defaultTopic,
    message: "",
  })
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = React.useState("")
  const [ticket, setTicket] = React.useState("")

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError("")
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (form.name.trim().length < 2) {
      setError("Please enter your name.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    if (form.phone.trim() && !isValidIndianPhone(form.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number, or leave it blank.")
      return
    }
    if (form.message.trim().length < 10) {
      setError("Please describe your question in at least 10 characters.")
      return
    }

    setStatus("loading")
    setError("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\D/g, "").slice(-10),
        }),
      })
      const data = (await response.json()) as { id?: string; error?: string }
      if (!response.ok) throw new Error(data.error || "Could not send message")
      setTicket(data.id ?? "")
      setStatus("success")
    } catch (submitError) {
      setStatus("error")
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not send your message. Please try again."
      )
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-apple-green-200 bg-apple-green-50 p-6 text-center dark:border-apple-green-800 dark:bg-apple-green-900/20">
        <CheckCircle className="mx-auto h-8 w-8 text-apple-green-600 dark:text-apple-green-400" />
        <h3 className="mt-3 text-headline-md font-semibold text-apple-green-900 dark:text-apple-green-200">
          Message received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-apple-green-800 dark:text-apple-green-300">
          Thank you, {form.name.split(" ")[0]}. Our India support team will reply to {form.email}{" "}
          within one business day.
          {ticket && (
            <>
              {" "}
              Your reference is <span className="font-semibold">{ticket}</span>.
            </>
          )}
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => {
            setStatus("idle")
            setForm({
              name: "",
              email: "",
              phone: "",
              orderId: "",
              topic: defaultTopic,
              message: "",
            })
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
            Your name
          </label>
          <Input
            id="contact-name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
            Email address
          </label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.in"
            required
          />
        </div>
        {!compact && (
          <>
            <div>
              <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium">
                Mobile number <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={form.phone}
                onChange={(event) =>
                  update("phone", event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="98765 43210"
              />
            </div>
            <div>
              <label htmlFor="contact-order" className="mb-1.5 block text-sm font-medium">
                Order number <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="contact-order"
                value={form.orderId}
                onChange={(event) => update("orderId", event.target.value.toUpperCase())}
                placeholder="SS-20261019-1234"
              />
            </div>
          </>
        )}
      </div>

      <div>
        <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium">
          What is this about?
        </label>
        <select
          id="contact-topic"
          value={form.topic}
          onChange={(event) => update("topic", event.target.value)}
          className="flex h-11 w-full rounded-lg border border-apple-gray-300 bg-white px-3 text-sm text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:border-apple-gray-600 dark:bg-apple-gray-900 dark:text-white"
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
          How can we help?
        </label>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Share your city, monthly bill, roof type or the issue with your order."
          rows={5}
          required
        />
      </div>

      {error && <p className="text-sm text-apple-red-600">{error}</p>}

      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        By submitting, you agree to our privacy policy. We use your details only to respond to this
        enquiry.
      </p>
    </form>
  )
}
