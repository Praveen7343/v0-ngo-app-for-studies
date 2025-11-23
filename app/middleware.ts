import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if user is trying to access admin routes
  if (pathname.startsWith("/admin")) {
    const chairmanCookie = request.cookies.get("pssChairman")
    if (!chairmanCookie) {
      // Redirect to chairman login if not authenticated
      return NextResponse.redirect(new URL("/chairman-login", request.url))
    }
  }

  // Check if user is trying to access student dashboard
  if (pathname.startsWith("/dashboard")) {
    const studentCookie = request.cookies.get("pssUser")
    if (!studentCookie) {
      // Redirect to student login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
