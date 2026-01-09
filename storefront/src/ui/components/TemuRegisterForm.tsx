"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import { registerAction, getGoogleAuthUrlAction } from "@/app/auth-actions";
import { FormInput } from "./FormInput";
import { validateEmail, validatePassword, validateName, getPasswordStrength } from "@/lib/validation";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function TemuRegisterForm({ channel }: { channel: string }) {
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const passwordStrengthInfo = getPasswordStrength(password);

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		setErrors([]);

		try {
			const result = await registerAction(formData);
			if (result?.errors) {
				setErrors(result.errors);
			}
		} catch (error) {
			setErrors(["An unexpected error occurred. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		const callbackUrl = `${window.location.origin}/${channel}/auth/callback`;
		const result = await getGoogleAuthUrlAction(callbackUrl);

		if (result?.errors) {
			setErrors(result.errors);
		} else if (result?.authUrl) {
			window.location.href = result.authUrl;
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
						Create Your Account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Join thousands of happy shoppers and start saving today!
					</p>
				</div>

				{/* Main Registration Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					{/* Error Messages */}
					{errors.length > 0 && (
						<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
							<div className="flex items-start gap-2">
								<AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
								<div className="flex-1">
									<p className="text-sm font-semibold text-red-800 mb-1">
										Registration Failed
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

					{/* Social Registration Buttons */}
					<div className="space-y-3 mb-6">
						<button
							type="button"
							onClick={handleGoogleSignIn}
							disabled={loading}
							className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-temu-500 hover:bg-temu-50 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							Sign up with Google
						</button>

						<button
							type="button"
							className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700"
						>
							<svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
							</svg>
							Sign up with Facebook
						</button>
					</div>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-gray-500 font-medium">
								Or sign up with email
							</span>
						</div>
					</div>

					{/* Registration Form */}
					<form action={handleSubmit}>
						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-4 mb-4">
							<div>
								<FormInput
									label="First Name"
									name="firstName"
									type="text"
									required
									autoComplete="given-name"
									placeholder="First name"
									onValidate={(value) => validateName(value, "First name")}
								/>
							</div>
							<div>
								<FormInput
									label="Last Name"
									name="lastName"
									type="text"
									required
									autoComplete="family-name"
									placeholder="Last name"
									onValidate={(value) => validateName(value, "Last name")}
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className="mb-4">
							<FormInput
								label="Email Address"
								name="email"
								type="email"
								required
								autoComplete="email"
								placeholder="Enter your email"
								onValidate={validateEmail}
								hint="We'll never share your email with anyone"
							/>
						</div>

						{/* Password Field */}
						<div className="mb-4">
							<FormInput
								label="Password"
								name="password"
								type="password"
								required
								autoComplete="new-password"
								placeholder="Create a password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								showPasswordToggle
								onValidate={validatePassword}
								hint="At least 8 characters with uppercase, lowercase, numbers, and symbols"
							/>
							{/* Password Strength Indicator */}
							{password && (
								<div className="mt-2">
									<div className="flex gap-1 mb-1">
										{[...Array(5)].map((_, i) => (
											<div
												key={i}
												className={`h-1 flex-1 rounded transition-colors ${
													i < passwordStrengthInfo.strength ? passwordStrengthInfo.color : "bg-gray-200"
												}`}
											/>
										))}
									</div>
									<p className={`text-xs font-medium ${passwordStrengthInfo.strength >= 4 ? "text-green-600" : "text-gray-600"}`}>
										Password strength: {passwordStrengthInfo.label}
									</p>
								</div>
							)}
						</div>

						{/* Confirm Password Field */}
						<div className="mb-6">
							<FormInput
								label="Confirm Password"
								name="confirmPassword"
								type="password"
								required
								autoComplete="new-password"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								showPasswordToggle
								onValidate={(value) => {
									if (value !== password) {
										return { isValid: false, errors: ["Passwords do not match"] };
									}
									return { isValid: true, errors: [] };
								}}
							/>
						</div>

						{/* Terms Checkbox */}
						<div className="mb-6">
							<label className="flex items-start cursor-pointer">
								<input
									type="checkbox"
									required
									className="w-4 h-4 mt-1 text-temu-500 border-gray-300 rounded focus:ring-temu-500 focus:ring-2 cursor-pointer"
								/>
								<span className="ml-2 text-sm text-gray-700">
									I agree to the{" "}
									<Link href={`/${channel}/terms`} className="text-temu-600 font-semibold hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link href={`/${channel}/privacy`} className="text-temu-600 font-semibold hover:underline">
										Privacy Policy
									</Link>
								</span>
							</label>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-4 rounded-lg hover:from-temu-600 hover:to-temu-700 focus:outline-none focus:ring-2 focus:ring-temu-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
									</svg>
									Creating account...
								</span>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
						</div>
					</div>

					{/* Google Sign-In */}
					<GoogleSignInButton onSignIn={handleGoogleSignIn} text="Sign up with Google" />
				</div>

				{/* Sign In Link */}
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href={`/${channel}/login`}
							className="font-bold text-temu-600 hover:text-temu-700 hover:underline"
						>
							Sign in
						</Link>
					</p>
				</div>

				{/* Benefits Section */}
				<div className="mt-8 bg-gradient-to-r from-temu-500 to-temu-600 rounded-2xl p-6 text-white">
					<h3 className="font-bold text-lg mb-3 flex items-center gap-2">
						<CheckCircle size={24} />
						Your Benefits
					</h3>
					<ul className="space-y-2 text-sm">
						<li className="flex items-center gap-2">
							<span className="text-yellow-300">✓</span>
							Welcome discount on first order
						</li>
						<li className="flex items-center gap-2">
							<span className="text-yellow-300">✓</span>
							Exclusive member-only deals
						</li>
						<li className="flex items-center gap-2">
							<span className="text-yellow-300">✓</span>
							Free shipping on orders over UGX 50,000
						</li>
						<li className="flex items-center gap-2">
							<span className="text-yellow-300">✓</span>
							Early access to sales and new products
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
