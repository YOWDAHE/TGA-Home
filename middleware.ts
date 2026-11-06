import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isKnownModuleType, isPageKey } from "@/lib/modules";

/** Unknown preview pages get a real 404: the pages themselves stream (app/loading.tsx), and a
 *  notFound() thrown while streaming can only answer 200. */
function isUnknownPreview(path: string) {
	const page = path.match(/^\/preview\/page\/([^/]+)\/?$/);
	if (page) return !isPageKey(decodeURIComponent(page[1]));
	const module = path.match(/^\/preview\/module\/([^/]+)\/?$/);
	if (module) return !isKnownModuleType(decodeURIComponent(module[1]));
	return false;
}

export function middleware(request: NextRequest) {
	// Get the pathname of the request
	const path = request.nextUrl.pathname;

	// Rewriting to a route that doesn't exist renders the site's not-found page with a 404
	if (isUnknownPreview(path)) {
		return NextResponse.rewrite(new URL("/preview/_unknown/_unknown", request.url));
	}

	// Define public paths that don't require authentication
	const isPublicPath = path === "/login" || path === "/signup";

	// Get the token from cookies
	const token = request.cookies.get("accessToken")?.value;

	// If the user is not authenticated and trying to access a protected route
	if (!token && !isPublicPath) {
		// Allow access to public routes (home, about, etc.)
		return NextResponse.next();
	}

	// If the user is authenticated and trying to access login/signup pages
	if (token && isPublicPath) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
}; 