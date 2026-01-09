import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route patterns that require authentication
const PROTECTED_ROUTES = [
	"/account",
	"/orders",
	"/wishlist",
	"/checkout",
];

// Public routes that should redirect authenticated users
const AUTH_ROUTES = ["/login", "/register"];

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxAttempts: 5, // Max 5 attempts per window
	authEndpoints: ["/login", "/register", "/forgot-password"],
};

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const channel = pathname.split("/")[1] || "channel-pln";

	// Extract route without channel prefix
	const route = pathname.replace(`/${channel}`, "");

	// Rate limiting for authentication endpoints
	if (RATE_LIMIT.authEndpoints.some((endpoint) => route.startsWith(endpoint))) {
		const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
		const rateLimitKey = `${ip}:${route}`;

		const now = Date.now();
		const userLimit = rateLimitStore.get(rateLimitKey);

		if (userLimit && now < userLimit.resetTime) {
			if (userLimit.count >= RATE_LIMIT.maxAttempts) {
				// Too many requests
				return new NextResponse(
					JSON.stringify({
						error: "Too many attempts. Please try again later.",
						retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
					}),
					{
						status: 429,
						headers: {
							"Content-Type": "application/json",
							"Retry-After": String(Math.ceil((userLimit.resetTime - now) / 1000)),
						},
					}
				);
			}
			userLimit.count++;
		} else {
			rateLimitStore.set(rateLimitKey, {
				count: 1,
				resetTime: now + RATE_LIMIT.windowMs,
			});
		}

		// Clean up expired entries periodically
		if (Math.random() < 0.01) {
			for (const [key, value] of rateLimitStore.entries()) {
				if (now >= value.resetTime) {
					rateLimitStore.delete(key);
				}
			}
		}
	}

	// Check for authentication token
	const authToken = request.cookies.get("saleorAuthToken");
	const isAuthenticated = !!authToken;

	// Redirect authenticated users away from auth pages
	if (isAuthenticated && AUTH_ROUTES.some((authRoute) => route.startsWith(authRoute))) {
		const redirectTo = request.nextUrl.searchParams.get("redirect") || "/account";
		return NextResponse.redirect(new URL(`/${channel}${redirectTo}`, request.url));
	}

	// Protect authenticated routes
	const isProtectedRoute = PROTECTED_ROUTES.some((protectedRoute) => route.startsWith(protectedRoute));

	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL(`/${channel}/login`, request.url);
		loginUrl.searchParams.set("redirect", route);
		return NextResponse.redirect(loginUrl);
	}

	// Security headers
	const response = NextResponse.next();

	// Add security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("X-XSS-Protection", "1; mode=block");

	// Add CSP header for additional security
	response.headers.set(
		"Content-Security-Policy",
		"default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
			"style-src 'self' 'unsafe-inline'; " +
			"img-src 'self' data: https: blob:; " +
			"font-src 'self' data:; " +
			"connect-src 'self' " + (process.env.NEXT_PUBLIC_SALEOR_API_URL || "") + "; " +
			"frame-src https://accounts.google.com;"
	);

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
