import { forwardJson, getBackendUrl } from "@/app/api/_helpers"

export async function POST() {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  return forwardJson(
    `${backendUrl}/auth/logout`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    true
  )
}
