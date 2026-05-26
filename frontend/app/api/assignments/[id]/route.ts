import {
  buildAuthHeaders,
  forwardJson,
  getBackendUrl,
} from "@/app/api/_helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params
  const id = resolved?.id

  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  return forwardJson(`${backendUrl}/assignments/${id}`, {
    method: "GET",
    headers: await buildAuthHeaders(),
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params
  const id = resolved?.id

  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  return forwardJson(`${backendUrl}/assignments/${id}`, {
    method: "DELETE",
    headers: await buildAuthHeaders(),
  })
}
