import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export function getBackendUrl() {
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL
}

export async function buildAuthHeaders() {
  const cookieStore = await cookies()
  const token = await  cookieStore.get("token")?.value
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.cookie = `token=${token}`
  }

  return headers
}

export async function forwardJson(
  input: string,
  init: RequestInit,
  includeSetCookie = false
) {
  const response = await fetch(input, init)
  const data = await response.json().catch(() => ({}))
  const nextResponse = NextResponse.json(data, { status: response.status })

  if (includeSetCookie) {
    const setCookie = response.headers.get("set-cookie")
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie)
    }
  }

  return nextResponse
}
