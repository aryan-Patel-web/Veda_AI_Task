import { NextRequest, NextResponse } from "next/server"

const authRoutes = new Set(["/signin", "/signup"])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  if (authRoutes.has(pathname)) {
    if (token) {
      const url = request.nextUrl.clone()
      url.pathname = "/assignments"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
