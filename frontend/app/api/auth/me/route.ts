import {
  buildAuthHeaders,
  forwardJson,
  getBackendUrl,
} from "@/app/api/_helpers"

export async function GET() {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  
  return forwardJson(`${backendUrl}/auth/me`, {
    method: "GET",
    headers: await buildAuthHeaders(),
  })
}
