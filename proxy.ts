import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

const PUBLIC_API_ROUTES_PREFIX = ["/api/auth/login", "/api/auth/register"];

const PROTECTED_ROUTES_PREFIX = ["/dashboard", "/urls"];

function matchesPattern(pathname: string, routesPrefix: string[]): boolean {
	return routesPrefix.some((routesPrefix) => pathname.startsWith(routesPrefix));
}

export function proxy(request: NextRequest) {
	const token = request.cookies.get("token");

	const isAuthenticated = token ? verifyToken(token.value) !== null : false;

	const { pathname } = request.nextUrl;

	const isProtectedRoute = matchesPattern(pathname, PROTECTED_ROUTES_PREFIX);

	const isApiRoute = pathname.startsWith("/api/");
	const isPublicApi = matchesPattern(pathname, PUBLIC_API_ROUTES_PREFIX);

	if (isProtectedRoute && !isAuthenticated) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (isApiRoute && !isPublicApi && !isAuthenticated) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
