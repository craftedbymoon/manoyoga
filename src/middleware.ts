import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, DEFAULT_REDIRECTS } from "@/lib/auth/constants";
import { hasAccessToPath } from "@/lib/auth/permissions";
import { Session } from "@/types/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Only intercept protected admin paths
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/admin/login";

  if (!isAdminPath) {
    return NextResponse.next();
  }

  // 2. Retrieve session cookie
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Case A: User is trying to access admin pages but has no session
  if (!sessionCookie && !isLoginPath) {
    const loginUrl = new URL(DEFAULT_REDIRECTS.login, request.url);
    // Keep reference of where user was heading to redirect them back later
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case B: User has session, let's validate and check permissions
  if (sessionCookie) {
    try {
      const session: Session = JSON.parse(sessionCookie.value);
      const isExpired = new Date(session.expires).getTime() < Date.now();

      if (isExpired) {
        // Clear expired cookie and redirect to login
        const response = NextResponse.redirect(new URL(DEFAULT_REDIRECTS.login, request.url));
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }

      // If user is already authenticated and visits login page, redirect to dashboard
      if (isLoginPath) {
        return NextResponse.redirect(new URL(DEFAULT_REDIRECTS.dashboard, request.url));
      }

      // Check role-based permission for requested sub-path
      const hasAccess = hasAccessToPath(session.user.role, pathname);
      if (!hasAccess) {
        // Redirect unauthorized users back to the dashboard with an error parameter
        const dashboardUrl = new URL(DEFAULT_REDIRECTS.dashboard, request.url);
        dashboardUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(dashboardUrl);
      }

    } catch {
      // In case of parsing errors, wipe cookie and redirect to login
      const response = NextResponse.redirect(new URL(DEFAULT_REDIRECTS.login, request.url));
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

// Map middleware matcher paths
export const config = {
  matcher: ["/admin/:path*"],
};
