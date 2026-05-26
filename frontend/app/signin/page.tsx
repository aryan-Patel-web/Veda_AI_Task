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

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
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
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formValues),
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setFormError(data.message || "Unable to sign in.")
        setFieldErrors(data.errors || {})
        return
      }

      router.push("/assignments")
    } catch (error) {
      console.error(error)
      setFormError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
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
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">Sign in to your account</p>
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
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <p className="mb-3 text-center text-xs font-medium text-gray-600">
                Demo Credentials
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormValues({
                    email: "holmes.trevoraj@gmail.com",
                    password: "Ankit209.",
                  })
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
              >
                <p className="text-xs font-medium text-gray-900">
                  Email: holmes.trevoraj@gmail.com
                </p>
                <p className="text-xs text-gray-600">Password: Ankit209.</p>
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link className="font-medium text-[#111111]" href="/signup">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
