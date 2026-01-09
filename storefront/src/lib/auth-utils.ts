import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { redirect } from "next/navigation";

/**
 * Password strength validation
 */
export interface PasswordStrength {
	score: number; // 0-4
	feedback: string[];
	isValid: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
	const feedback: string[] = [];
	let score = 0;

	// Length check
	if (password.length < 8) {
		feedback.push("Password must be at least 8 characters long");
		return { score: 0, feedback, isValid: false };
	}

	if (password.length >= 12) score++;
	if (password.length >= 16) score++;

	// Complexity checks
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasNumbers = /[0-9]/.test(password);
	const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);

	if (!hasLowercase) feedback.push("Add lowercase letters");
	if (!hasUppercase) feedback.push("Add uppercase letters");
	if (!hasNumbers) feedback.push("Add numbers");
	if (!hasSpecialChars) feedback.push("Add special characters (!@#$%^&*)");

	const complexityCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
	score += complexityCount;

	// Common patterns to avoid
	const commonPatterns = [
		/^123456/,
		/password/i,
		/qwerty/i,
		/^abc123/i,
		/(.)\1{2,}/, // Repeated characters
	];

	const hasCommonPattern = commonPatterns.some((pattern) => pattern.test(password));
	if (hasCommonPattern) {
		feedback.push("Avoid common patterns and repeated characters");
		score = Math.max(0, score - 1);
	}

	const isValid = score >= 3 && complexityCount >= 3;

	if (isValid && feedback.length === 0) {
		if (score === 6) feedback.push("Very strong password");
		else if (score >= 4) feedback.push("Strong password");
		else feedback.push("Password meets requirements");
	}

	return { score, feedback, isValid };
}

/**
 * Email validation
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!email) {
		return { isValid: false, error: "Email is required" };
	}

	if (!emailRegex.test(email)) {
		return { isValid: false, error: "Invalid email format" };
	}

	// Check for disposable email domains (basic check)
	const disposableDomains = ["tempmail", "throwaway", "guerrillamail", "10minutemail"];
	const domain = email.split("@")[1]?.toLowerCase();

	if (domain && disposableDomains.some((d) => domain.includes(d))) {
		return { isValid: false, error: "Disposable email addresses are not allowed" };
	}

	return { isValid: true };
}

/**
 * Get current authenticated user with error handling
 */
export async function getCurrentUser() {
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, {
			cache: "no-store",
		});
		return me;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(channel: string, redirectPath?: string) {
	const user = await getCurrentUser();

	if (!user) {
		const loginUrl = `/${channel}/login`;
		const params = redirectPath ? `?redirect=${redirectPath}` : "";
		redirect(loginUrl + params);
	}

	return user;
}

/**
 * Check if user has verified email
 */
export async function requireVerifiedEmail(channel: string) {
	const user = await requireAuth(channel);

	if (!user.isConfirmed) {
		redirect(`/${channel}/account?verify=true`);
	}

	return user;
}

/**
 * User roles and permissions
 */
export enum UserRole {
	CUSTOMER = "CUSTOMER",
	STAFF = "STAFF",
	ADMIN = "ADMIN",
}

export enum Permission {
	// Customer permissions
	VIEW_OWN_ORDERS = "VIEW_OWN_ORDERS",
	MANAGE_OWN_ACCOUNT = "MANAGE_OWN_ACCOUNT",
	CREATE_REVIEWS = "CREATE_REVIEWS",

	// Staff permissions
	VIEW_ALL_ORDERS = "VIEW_ALL_ORDERS",
	MANAGE_PRODUCTS = "MANAGE_PRODUCTS",
	MANAGE_CUSTOMERS = "MANAGE_CUSTOMERS",

	// Admin permissions
	MANAGE_STAFF = "MANAGE_STAFF",
	MANAGE_SETTINGS = "MANAGE_SETTINGS",
	VIEW_ANALYTICS = "VIEW_ANALYTICS",
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
	[UserRole.CUSTOMER]: [
		Permission.VIEW_OWN_ORDERS,
		Permission.MANAGE_OWN_ACCOUNT,
		Permission.CREATE_REVIEWS,
	],
	[UserRole.STAFF]: [
		Permission.VIEW_OWN_ORDERS,
		Permission.MANAGE_OWN_ACCOUNT,
		Permission.CREATE_REVIEWS,
		Permission.VIEW_ALL_ORDERS,
		Permission.MANAGE_PRODUCTS,
		Permission.MANAGE_CUSTOMERS,
	],
	[UserRole.ADMIN]: Object.values(Permission), // All permissions
};

/**
 * Check if user has specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
	return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
	return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
	return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
	return input
		.trim()
		.replace(/[<>]/g, "") // Remove potential HTML tags
		.substring(0, 1000); // Limit length
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let token = "";
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);

	for (let i = 0; i < length; i++) {
		token += chars[array[i] % chars.length];
	}

	return token;
}

/**
 * Validate redirect URL to prevent open redirect vulnerabilities
 */
export function validateRedirectUrl(url: string, allowedDomains: string[] = []): string {
	try {
		// If it's a relative URL, allow it
		if (url.startsWith("/") && !url.startsWith("//")) {
			return url;
		}

		// Parse absolute URLs
		const parsed = new URL(url);

		// Check if domain is in allowed list
		if (allowedDomains.includes(parsed.hostname)) {
			return url;
		}

		// Default: only allow same origin
		if (parsed.origin === process.env.NEXT_PUBLIC_STOREFRONT_URL) {
			return url;
		}

		// Reject external URLs
		return "/";
	} catch {
		// Invalid URL format
		return "/";
	}
}

/**
 * Format auth error messages for user display
 */
export function formatAuthError(error: unknown): string {
	if (error instanceof Error) {
		// Map specific error messages to user-friendly ones
		const message = error.message.toLowerCase();

		if (message.includes("signature has expired") || message.includes("invalid token")) {
			return "Your session has expired. Please log in again.";
		}

		if (message.includes("invalid credentials") || message.includes("invalid email or password")) {
			return "Invalid email or password. Please try again.";
		}

		if (message.includes("email already exists") || message.includes("already registered")) {
			return "An account with this email already exists.";
		}

		if (message.includes("network") || message.includes("fetch")) {
			return "Network error. Please check your connection and try again.";
		}

		if (message.includes("rate limit") || message.includes("too many")) {
			return "Too many attempts. Please try again later.";
		}
	}

	return "An unexpected error occurred. Please try again.";
}

/**
 * Log security events (in production, send to monitoring service)
 */
export interface SecurityEvent {
	type: "login" | "logout" | "register" | "password_reset" | "failed_login" | "suspicious_activity";
	userId?: string;
	email?: string;
	ip?: string;
	userAgent?: string;
	timestamp: Date;
	metadata?: Record<string, unknown>;
}

export function logSecurityEvent(event: SecurityEvent): void {
	// In production, send to your logging/monitoring service (e.g., Sentry, DataDog, CloudWatch)
	console.log("[SECURITY_EVENT]", {
		...event,
		timestamp: event.timestamp.toISOString(),
	});

	// Example: Send to external service
	// await fetch('/api/security-events', {
	//   method: 'POST',
	//   body: JSON.stringify(event)
	// });
}

/**
 * Detect suspicious activity patterns
 */
export interface ActivityCheck {
	isSuspicious: boolean;
	reasons: string[];
}

export function detectSuspiciousActivity(
	email: string,
	ip: string,
	userAgent: string
): ActivityCheck {
	const reasons: string[] = [];

	// Check for automated requests
	if (!userAgent || userAgent.toLowerCase().includes("bot") || userAgent.toLowerCase().includes("curl")) {
		reasons.push("Suspicious user agent detected");
	}

	// Check for rapid requests (would need to implement request tracking)
	// This is a placeholder for more sophisticated checks

	return {
		isSuspicious: reasons.length > 0,
		reasons,
	};
}
