"use server";

import { executeGraphQL } from "@/lib/graphql";
import {
	TokenCreateDocument,
	AccountRegisterDocument,
	RequestPasswordResetDocument,
	SetPasswordDocument,
	ConfirmAccountDocument,
	ExternalAuthenticationUrlDocument,
	ExternalObtainAccessTokensDocument,
	SendConfirmationEmailDocument,
} from "@/gql/graphql";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getServerAuthClient } from "@/app/config";
import {
	validatePasswordStrength,
	validateEmail,
	sanitizeInput,
	logSecurityEvent,
	formatAuthError,
	detectSuspiciousActivity,
	validateRedirectUrl,
} from "@/lib/auth-utils";

export async function loginAction(formData: FormData, _rememberMe: boolean) {
	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();
	const redirectUrl = formData.get("redirect")?.toString() || "/account";

	// Get request metadata for security logging
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
	const userAgent = headersList.get("user-agent") || "unknown";

	// Input validation
	if (!email || !password) {
		return { errors: ["Email and password are required"] };
	}

	// Email validation
	const emailValidation = validateEmail(email);
	if (!emailValidation.isValid) {
		return { errors: [emailValidation.error || "Invalid email"] };
	}

	// Detect suspicious activity
	const activityCheck = detectSuspiciousActivity(email, ip, userAgent);
	if (activityCheck.isSuspicious) {
		logSecurityEvent({
			type: "suspicious_activity",
			email,
			ip,
			userAgent,
			timestamp: new Date(),
			metadata: { reasons: activityCheck.reasons },
		});
	}

	try {
		// Use Saleor Auth SDK to handle login and cookie management
		const authClient = await getServerAuthClient();
		const result = await authClient.signIn({ email, password });

		// Check if sign in was successful
		if (!result) {
			// Log failed login attempt
			logSecurityEvent({
				type: "failed_login",
				email,
				ip,
				userAgent,
				timestamp: new Date(),
			});
			return { errors: ["Invalid email or password. Please try again."] };
		}

		// Log successful login
		logSecurityEvent({
			type: "login",
			email,
			ip,
			userAgent,
			timestamp: new Date(),
		});

		// Validate and sanitize redirect URL
		const safeRedirect = validateRedirectUrl(redirectUrl);

		// Successful login - redirect to requested page or account
		redirect(`/channel-pln${safeRedirect}`);
	} catch (error) {
		// Check if it's a redirect (which throws in Next.js)
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}

		// Log failed login attempt
		logSecurityEvent({
			type: "failed_login",
			email,
			ip,
			userAgent,
			timestamp: new Date(),
			metadata: { error: error instanceof Error ? error.message : "Unknown error" },
		});

		console.error("Login exception:", error);
		return { errors: [formatAuthError(error)] };
	}
}

export async function registerAction(formData: FormData) {
	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();
	const confirmPassword = formData.get("confirmPassword")?.toString();
	const firstName = formData.get("firstName")?.toString();
	const lastName = formData.get("lastName")?.toString();

	// Get request metadata for security logging
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
	const userAgent = headersList.get("user-agent") || "unknown";

	// Validation
	if (!email || !password || !confirmPassword || !firstName || !lastName) {
		return { errors: ["All fields are required"] };
	}

	// Email validation
	const emailValidation = validateEmail(email);
	if (!emailValidation.isValid) {
		return { errors: [emailValidation.error || "Invalid email"] };
	}

	// Sanitize inputs
	const sanitizedFirstName = sanitizeInput(firstName);
	const sanitizedLastName = sanitizeInput(lastName);

	if (password !== confirmPassword) {
		return { errors: ["Passwords do not match"] };
	}

	// Password strength validation
	const passwordStrength = validatePasswordStrength(password);
	if (!passwordStrength.isValid) {
		return { errors: passwordStrength.feedback };
	}

	try {
		const { accountRegister } = await executeGraphQL(AccountRegisterDocument, {
			variables: {
				input: {
					email,
					password,
					firstName: sanitizedFirstName,
					lastName: sanitizedLastName,
					channel: "channel-pln",
					redirectUrl: `${process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000"}/channel-pln/verify-email`,
				},
			},
			cache: "no-store",
		});

		if (accountRegister?.errors && accountRegister.errors.length > 0) {
			return {
				errors: accountRegister.errors.map((error) => error.message || "Registration failed"),
			};
		}

		// Log successful registration
		logSecurityEvent({
			type: "register",
			email,
			ip,
			userAgent,
			timestamp: new Date(),
		});

		// Auto-login after successful registration
		const { tokenCreate } = await executeGraphQL(TokenCreateDocument, {
			variables: { email, password },
			cache: "no-store",
		});

		if (tokenCreate?.token) {
			const cookieStore = await cookies();
			cookieStore.set("saleorAuthToken", tokenCreate.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
			});
			if (tokenCreate.refreshToken) {
				cookieStore.set("saleorAuthRefreshToken", tokenCreate.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/",
					maxAge: 30 * 24 * 60 * 60,
				});
			}

			// Log successful login after registration
			logSecurityEvent({
				type: "login",
				email,
				ip,
				userAgent,
				timestamp: new Date(),
				metadata: { context: "post-registration" },
			});

			redirect("/channel-pln/account");
		}

		// If auto-login fails, redirect to login page
		redirect("/channel-pln/login");
	} catch (error) {
		// Check if it's a redirect
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}
		console.error("Registration error:", error);
		return { errors: [formatAuthError(error)] };
	}
}

export async function logoutAction() {
	// Get request metadata for security logging
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
	const userAgent = headersList.get("user-agent") || "unknown";

	try {
		const authClient = await getServerAuthClient();
		await authClient.signOut();

		// Log logout event
		logSecurityEvent({
			type: "logout",
			ip,
			userAgent,
			timestamp: new Date(),
		});

		redirect("/channel-pln/");
	} catch (error) {
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}
		console.error("Logout error:", error);
		return { errors: ["Logout failed. Please try again."] };
	}
}

export async function requestPasswordResetAction(formData: FormData) {
	const email = formData.get("email")?.toString();

	if (!email) {
		return { errors: ["Email is required"] };
	}

	try {
		const { requestPasswordReset } = await executeGraphQL(RequestPasswordResetDocument, {
			variables: {
				email,
				redirectUrl: `${process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000"}/channel-pln/reset-password`,
				channel: "channel-pln",
			},
			cache: "no-store",
		});

		if (requestPasswordReset?.errors && requestPasswordReset.errors.length > 0) {
			return {
				errors: requestPasswordReset.errors.map((error) => error.message || "Reset request failed"),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Password reset request error:", error);
		return { errors: ["Failed to send password reset email. Please try again."] };
	}
}

export async function resetPasswordAction(formData: FormData, token: string, email: string) {
	const password = formData.get("password")?.toString();
	const confirmPassword = formData.get("confirmPassword")?.toString();

	// Get request metadata for security logging
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
	const userAgent = headersList.get("user-agent") || "unknown";

	if (!password || !confirmPassword) {
		return { errors: ["All fields are required"] };
	}

	if (password !== confirmPassword) {
		return { errors: ["Passwords do not match"] };
	}

	// Password strength validation
	const passwordStrength = validatePasswordStrength(password);
	if (!passwordStrength.isValid) {
		return { errors: passwordStrength.feedback };
	}

	try {
		const { setPassword } = await executeGraphQL(SetPasswordDocument, {
			variables: { token, email, password },
			cache: "no-store",
		});

		if (setPassword?.errors && setPassword.errors.length > 0) {
			return {
				errors: setPassword.errors.map((error) => error.message || "Password reset failed"),
			};
		}

		// Log password reset
		logSecurityEvent({
			type: "password_reset",
			email,
			ip,
			userAgent,
			timestamp: new Date(),
		});

		redirect("/channel-pln/login");
	} catch (error) {
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}
		console.error("Password reset error:", error);
		return { errors: [formatAuthError(error)] };
	}
}

export async function verifyEmailAction(token: string, email: string) {
	try {
		const { confirmAccount } = await executeGraphQL(ConfirmAccountDocument, {
			variables: { email, token },
			cache: "no-store",
		});

		if (confirmAccount?.errors && confirmAccount.errors.length > 0) {
			return {
				errors: confirmAccount.errors.map((error) => error.message || "Verification failed"),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Email verification error:", error);
		return { errors: ["Failed to verify email. The link may have expired."] };
	}
}

// Google OAuth Actions
const OPENID_PLUGIN_ID = "mirumee.authentication.openidconnect";

export async function getGoogleAuthUrlAction(redirectUrl: string) {
	try {
		const { externalAuthenticationUrl } = await executeGraphQL(ExternalAuthenticationUrlDocument, {
			variables: {
				pluginId: OPENID_PLUGIN_ID,
				input: JSON.stringify({
					redirectUri: redirectUrl,
				}),
			},
			cache: "no-store",
		});

		if (externalAuthenticationUrl?.errors && externalAuthenticationUrl.errors.length > 0) {
			return {
				errors: externalAuthenticationUrl.errors.map((error) => error.message || "Failed to get auth URL"),
			};
		}

		if (!externalAuthenticationUrl?.authenticationData) {
			return { errors: ["Failed to initialize Google Sign-In. Please check your configuration."] };
		}

		const authData = JSON.parse(externalAuthenticationUrl.authenticationData as string) as { authorizationUrl?: string; url?: string };
		return { authUrl: authData.authorizationUrl || authData.url };
	} catch (error) {
		console.error("Google auth URL error:", error);
		return { errors: ["Failed to initialize Google Sign-In. Please try again."] };
	}
}

export async function handleGoogleCallbackAction(code: string, state: string) {
	try {
		const { externalObtainAccessTokens } = await executeGraphQL(ExternalObtainAccessTokensDocument, {
			variables: {
				pluginId: OPENID_PLUGIN_ID,
				input: JSON.stringify({
					code,
					state,
				}),
			},
			cache: "no-store",
		});

		if (externalObtainAccessTokens?.errors && externalObtainAccessTokens.errors.length > 0) {
			return {
				errors: externalObtainAccessTokens.errors.map((error) => error.message || "Authentication failed"),
			};
		}

		if (!externalObtainAccessTokens?.token) {
			return { errors: ["Authentication failed. Please try again."] };
		}

		// Set auth cookies using Saleor Auth SDK cookie names
		const cookieStore = await cookies();

		if (externalObtainAccessTokens.token) {
			cookieStore.set("saleorAuthToken", externalObtainAccessTokens.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 30 * 24 * 60 * 60, // 30 days
			});
		}

		if (externalObtainAccessTokens.refreshToken) {
			cookieStore.set("saleorAuthRefreshToken", externalObtainAccessTokens.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 30 * 24 * 60 * 60, // 30 days
			});
		}

		redirect("/channel-pln/account");
	} catch (error) {
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}
		console.error("Google callback error:", error);
		return { errors: ["Authentication failed. Please try again."] };
	}
}

export async function resendConfirmationEmailAction(channel: string) {
	try {
		const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000";
		const redirectUrl = `${storefrontUrl}/${channel}/verify-email`;

		const { sendConfirmationEmail } = await executeGraphQL(
			SendConfirmationEmailDocument,
			{
				variables: {
					channel,
					redirectUrl,
				},
				withAuth: true,
			}
		);

		if (sendConfirmationEmail?.errors && sendConfirmationEmail.errors.length > 0) {
			const errorMessages = sendConfirmationEmail.errors.map((error) => error.message || "Failed to resend confirmation email");
			return { errors: errorMessages, success: false };
		}

		return { success: true };
	} catch (error) {
		console.error("Resend confirmation email error:", error);
		return { errors: ["Failed to resend confirmation email. Please try again."], success: false };
	}
}
