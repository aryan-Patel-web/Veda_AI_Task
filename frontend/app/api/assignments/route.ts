import {
  buildAuthHeaders,
  forwardJson,
  getBackendUrl,
} from "@/app/api/_helpers"

export async function GET(request: Request) {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  const url = new URL(request.url)
  const query = url.searchParams.toString()
  const target = query
    ? `${backendUrl}/assignments?${query}`
    : `${backendUrl}/assignments`

  return forwardJson(target, {
    method: "GET",
    headers: await buildAuthHeaders(),
  })
}

export async function POST(request: Request) {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const headers = await buildAuthHeaders()
    delete headers["Content-Type"]

    return forwardJson(`${backendUrl}/assignments`, {
      method: "POST",
      headers,
      body: formData,
    })
  }

  const body = await request.json().catch(() => ({}))

  return forwardJson(`${backendUrl}/assignments`, {
    method: "POST",
    headers: await buildAuthHeaders(),
    body: JSON.stringify(body),
  })
}
