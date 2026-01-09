"use client";

import { useState } from "react";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/auth-actions";

export function TemuForgotPasswordForm({ channel }: { channel: string }) {
	const [errors, setErrors] = useState<string[]>([]);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		setErrors([]);
		setSuccess(false);

		try {
			const result = await requestPasswordResetAction(formData);
			if (result?.errors) {
				setErrors(result.errors);
			} else if (result?.success) {
				setSuccess(true);
			}
		} catch (error) {
			setErrors(["An unexpected error occurred. Please try again."]);
		} finally {
			setLoading(false);
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
					<h2 className="mt-6 text-3xl font-black text-gray-900">
						Forgot Password?
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						No worries! Enter your email and we'll send you reset instructions
					</p>
				</div>

				{/* Main Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					{/* Success Message */}
					{success && (
						<div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
							<div className="flex items-start gap-2">
								<CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
								<div className="flex-1">
									<p className="text-sm font-semibold text-green-800 mb-1">
										Email Sent!
									</p>
									<p className="text-sm text-green-700">
										We've sent password reset instructions to <strong>{email}</strong>.
										Please check your inbox and spam folder.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Error Messages */}
					{errors.length > 0 && (
						<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
							<div className="flex items-start gap-2">
								<AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
								<div className="flex-1">
									<p className="text-sm font-semibold text-red-800 mb-1">
										Reset Failed
									</p>
									<ul className="text-sm text-red-700 space-y-1">
										{errors.map((error, index) => (
											<li key={index}>{error}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{!success ? (
						<>
							{/* Forgot Password Form */}
							<form action={handleSubmit}>
								{/* Email Field */}
								<div className="mb-6">
									<label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
										Email Address
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Mail className="text-gray-400" size={18} />
										</div>
										<input
											id="email"
											name="email"
											type="email"
											required
											autoComplete="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none transition-all"
											placeholder="Enter your email"
										/>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-4 rounded-lg hover:from-temu-600 hover:to-temu-700 focus:outline-none focus:ring-2 focus:ring-temu-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
								>
									{loading ? (
										<span className="flex items-center justify-center gap-2">
											<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
											</svg>
											Sending...
										</span>
									) : (
										"Send Reset Link"
									)}
								</button>

								{/* Back to Login */}
								<Link
									href={`/${channel}/login`}
									className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-temu-600 transition-colors"
								>
									<ArrowLeft size={16} />
									Back to Sign In
								</Link>
							</form>
						</>
					) : (
						<>
							{/* Success Actions */}
							<div className="space-y-3">
								<Link
									href={`/${channel}/login`}
									className="block w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-4 rounded-lg hover:from-temu-600 hover:to-temu-700 focus:outline-none focus:ring-2 focus:ring-temu-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl text-center"
								>
									Return to Sign In
								</Link>
								<button
									onClick={() => {
										setSuccess(false);
										setEmail("");
									}}
									className="w-full text-sm font-semibold text-gray-600 hover:text-temu-600 transition-colors py-2"
								>
									Didn't receive the email? Try again
								</button>
							</div>
						</>
					)}
				</div>

				{/* Help Section */}
				<div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
					<p className="text-sm text-blue-900 font-medium mb-2">
						Need help?
					</p>
					<p className="text-sm text-blue-800">
						If you're having trouble resetting your password, please{" "}
						<Link href={`/${channel}/contact`} className="font-semibold underline hover:text-blue-600">
							contact our support team
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
