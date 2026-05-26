import {
  buildAuthHeaders,
  forwardJson,
  getBackendUrl,
} from "@/app/api/_helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; result_id: string }> }
) {
  const resolved = await params
  const id = resolved?.id
  const resultId = resolved?.result_id

  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 })
  }

  return forwardJson(`${backendUrl}/assignments/${id}/result/${resultId}`, {
    method: "GET",
    headers: await buildAuthHeaders(),
  })
}
