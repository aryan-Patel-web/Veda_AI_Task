import { Suspense } from "react"
import VerifyEmailClient from "./verify-email-client"

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-[#ededed] px-4 text-sm text-gray-500">
          Loading verification...
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  )
}
