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

  return forwardJson(`${backendUrl}/subjects`, {
    method: "GET",
    headers: await buildAuthHeaders(),
  })
}

export async function POST(request: Request) {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  const body = await request.text()

  return forwardJson(`${backendUrl}/subjects`, {
    method: "POST",
    headers: {
      ...(await buildAuthHeaders()),
      "Content-Type": "application/json",
    },
    body,
  })
}
