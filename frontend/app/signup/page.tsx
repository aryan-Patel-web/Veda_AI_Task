"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { VedaLogo } from "@/components/veda/logo"

type FieldErrors = Record<string, string[] | undefined>

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"form" | "verify">("form")
  const [verificationCode, setVerificationCode] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    try {
      const response = await fetch(
        step === "form" ? "/api/auth/signup" : "/api/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body:
            step === "form"
              ? JSON.stringify({
                  firstName: formValues.firstName,
                  lastName: formValues.lastName,
                  email: formValues.email,
                  password: formValues.password,
                })
              : JSON.stringify({
                  email: formValues.email,
                  code: verificationCode,
                }),
        }
      )

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setFormError(
          data.message ||
            (step === "form"
              ? "Unable to send verification code."
              : "Unable to verify email.")
        )
        setFieldErrors(data.errors || {})
        return
      }

      if (step === "form") {
        setStep("verify")
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
      <Card className="w-full max-w-lg rounded-[28px] border border-gray-200 bg-white shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
        <CardHeader className="space-y-4">
          <VedaLogo />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="text-sm text-gray-500">
              Join VedaAI and start building assignments faster.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {step === "form" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Priya"
                      className="h-11 rounded-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      value={formValues.firstName}
                      onChange={(event) =>
                        handleChange("firstName", event.target.value)
                      }
                    />
                    {fieldErrors.firstName?.length ? (
                      <p className="text-xs text-red-500">
                        {fieldErrors.firstName[0]}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      className="h-11 rounded-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      value={formValues.lastName}
                      onChange={(event) =>
                        handleChange("lastName", event.target.value)
                      }
                    />
                    {fieldErrors.lastName?.length ? (
                      <p className="text-xs text-red-500">
                        {fieldErrors.lastName[0]}
                      </p>
                    ) : null}
                  </div>
                </div>

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
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                  />
                  {fieldErrors.email?.length ? (
                    <p className="text-xs text-red-500">
                      {fieldErrors.email[0]}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="h-11 rounded-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      value={formValues.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password?.length ? (
                    <p className="text-xs text-red-500">
                      {fieldErrors.password[0]}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[18px] border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm text-gray-600">
                  We sent a 6-digit code to <strong>{formValues.email}</strong>.
                </div>

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
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                  />
                  {fieldErrors.email?.length ? (
                    <p className="text-xs text-red-500">
                      {fieldErrors.email[0]}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-gray-700">
                    Verification Code
                  </Label>
                  <Input
                    id="verificationCode"
                    inputMode="numeric"
                    placeholder="123456"
                    className="h-11 rounded-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value.replace(/\s/g, ""))
                    }
                  />
                  {fieldErrors.code?.length ? (
                    <p className="text-xs text-red-500">
                      {fieldErrors.code[0]}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <button
                    type="button"
                    className="font-medium text-[#111111]"
                    onClick={handleResend}
                    disabled={isResending}
                  >
                    {isResending ? "Sending..." : "Resend code"}
                  </button>
                  <button
                    type="button"
                    className="font-medium text-[#111111]"
                    onClick={() => setStep("form")}
                  >
                    Edit details
                  </button>
                </div>
              </>
            )}

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
              {isLoading
                ? step === "form"
                  ? "Sending Code..."
                  : "Verifying..."
                : step === "form"
                  ? "Send Verification Code"
                  : "Verify Email"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link className="font-medium text-[#111111]" href="/signin">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
