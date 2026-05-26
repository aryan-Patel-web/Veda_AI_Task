import { getBackendUrl, forwardJson } from "@/app/api/_helpers"

export async function POST(request: Request) {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  const body = await request.json().catch(() => ({}))

  return forwardJson(`${backendUrl}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}
