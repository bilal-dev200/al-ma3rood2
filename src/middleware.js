import { NextResponse } from "next/server";

const protectedRoutes = ["/listing", "/account", "/favourite", "/watchlist"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Check if current route starts with any protected route
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Redirect to login if token is missing
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/listing/:path*", "/account/:path*"],
};
