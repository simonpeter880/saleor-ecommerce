"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { verifyEmailAction, resendConfirmationEmailAction } from "@/app/auth-actions";

export function TemuEmailVerificationPage({ channel, token, email }: { channel: string; token: string | null; email: string | null }) {
	const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
	const [error, setError] = useState<string>("");
	const [resending, setResending] = useState(false);
	const [resendSuccess, setResendSuccess] = useState(false);

	const verifyEmail = async (verificationToken: string, emailAddress: string) => {
		try {
			const result = await verifyEmailAction(verificationToken, emailAddress);
			if (result?.errors) {
				setStatus("error");
				setError(result.errors[0] || "Verification failed");
			} else {
				setStatus("success");
			}
		} catch (err) {
			setStatus("error");
			setError("An unexpected error occurred");
		}
	};

	useEffect(() => {
		if (token && email) {
			verifyEmail(token, email);
		} else {
			setStatus("error");
			setError("No verification token or email provided");
		}
		 
	}, [token, email]);

	const handleResend = async () => {
		setResending(true);
		setResendSuccess(false);
		setError("");

		try {
			const result = await resendConfirmationEmailAction(channel);
			if (result?.errors) {
				setError(result.errors[0] || "Failed to resend verification email");
			} else if (result?.success) {
				setResendSuccess(true);
			}
		} catch (err) {
			setError("An unexpected error occurred while resending email");
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-temu-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				{/* Logo */}
				<div className="text-center mb-8">
					<Link href={`/${channel}/`} className="inline-block">
						<div className="bg-gradient-to-r from-temu-500 to-temu-600 text-white font-black text-4xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
							TECHHUB
						</div>
					</Link>
				</div>

				{/* Main Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					{status === "verifying" && (
						<div className="text-center py-8">
							<div className="flex justify-center mb-6">
								<Loader2 className="animate-spin text-temu-500" size={64} />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Verifying your email...
							</h2>
							<p className="text-gray-600">
								Please wait while we confirm your email address
							</p>
						</div>
					)}

					{status === "success" && (
						<div className="text-center py-8">
							<div className="flex justify-center mb-6">
								<div className="bg-green-100 p-4 rounded-full">
									<CheckCircle className="text-green-600" size={64} />
								</div>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Email Verified!
							</h2>
							<p className="text-gray-600 mb-6">
								Your email has been successfully verified. You can now access all features of your account.
							</p>
							<div className="space-y-3">
								<Link
									href={`/${channel}/account`}
									className="block w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-4 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg hover:shadow-xl text-center"
								>
									Go to My Account
								</Link>
								<Link
									href={`/${channel}/`}
									className="block w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:border-temu-500 hover:bg-temu-50 transition-all text-center"
								>
									Continue Shopping
								</Link>
							</div>
						</div>
					)}

					{status === "error" && (
						<div className="text-center py-8">
							<div className="flex justify-center mb-6">
								<div className="bg-red-100 p-4 rounded-full">
									<AlertCircle className="text-red-600" size={64} />
								</div>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Verification Failed
							</h2>
							<p className="text-gray-600 mb-6">
								{error || "We couldn't verify your email. The link may have expired or is invalid."}
							</p>

							{resendSuccess && (
								<div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
									<div className="flex items-center gap-2 justify-center">
										<CheckCircle className="text-green-600" size={18} />
										<p className="text-sm text-green-700 font-medium">
											Verification email sent! Check your inbox.
										</p>
									</div>
								</div>
							)}

							<div className="space-y-3">
								<button
									onClick={handleResend}
									disabled={resending}
									className="w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-4 rounded-lg hover:from-temu-600 hover:to-temu-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{resending ? (
										<span className="flex items-center justify-center gap-2">
											<Loader2 className="animate-spin" size={18} />
											Sending...
										</span>
									) : (
										"Resend Verification Email"
									)}
								</button>
								<Link
									href={`/${channel}/account`}
									className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-temu-600 transition-colors py-2"
								>
									<ArrowLeft size={16} />
									Back to Account
								</Link>
							</div>
						</div>
					)}
				</div>

				{/* Help Section */}
				<div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
					<p className="text-sm text-blue-900 font-medium mb-2">
						Need help?
					</p>
					<p className="text-sm text-blue-800">
						If you're having trouble verifying your email, please{" "}
						<Link href={`/${channel}/contact`} className="font-semibold underline hover:text-blue-600">
							contact our support team
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
