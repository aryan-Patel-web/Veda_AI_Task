"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { VedaLogo } from "@/components/veda/logo"

type FieldErrors = Record<string, string[] | undefined>

export default function VerifyEmailClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    email: "",
    code: "",
  })

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setFormValues((prev) => ({ ...prev, email: emailParam }))
    }
  }, [searchParams])

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setFormError(data.message || "Unable to verify email.")
        setFieldErrors(data.errors || {})
        return
      }

      router.push("/signin")
    } catch (error) {
      console.error(error)
      setFormError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!formValues.email) {
      setFormError("Please enter your email to resend the code.")
      return
    }

    setIsResending(true)
    setFormError(null)
    setFieldErrors({})

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formValues.email }),
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setFormError(data.message || "Unable to resend code.")
        setFieldErrors(data.errors || {})
        return
      }

      setFormError("Verification code sent. Check your inbox.")
    } catch (error) {
      console.error(error)
      setFormError("Something went wrong. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#ededed] px-4">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#f7f7f7,_#ededed_58%,_#e4e4e4)]" />
      <Card className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
        <CardHeader className="space-y-4">
          <VedaLogo />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Verify your email
            </h1>
            <p className="text-sm text-gray-500">
              Enter the 6-digit code we sent to your inbox.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.com"
                className="h-11 rounded-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                value={formValues.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
              {fieldErrors.email?.length ? (
                <p className="text-xs text-red-500">{fieldErrors.email[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-700">
                Verification Code
              </Label>
              <Input
                id="code"
                inputMode="numeric"
                placeholder="123456"
                className="h-11 rounded-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                value={formValues.code}
                onChange={(event) =>
                  handleChange("code", event.target.value.replace(/\s/g, ""))
                }
              />
              {fieldErrors.code?.length ? (
                <p className="text-xs text-red-500">{fieldErrors.code[0]}</p>
              ) : null}
            </div>

            {formError ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {formError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full rounded-full border border-orange-400 bg-[#111111] text-white shadow-[0_12px_26px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <button
              type="button"
              className="font-medium text-[#111111]"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
            <Link className="font-medium text-[#111111]" href="/signin">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
