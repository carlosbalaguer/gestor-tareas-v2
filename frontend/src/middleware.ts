import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("accessToken");

	const isAuthPage =
		request.nextUrl.pathname.startsWith("/login") ||
		request.nextUrl.pathname.startsWith("/register");

	const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard");

	if (isAuthPage && accessToken) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (isProtectedPage && !accessToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}