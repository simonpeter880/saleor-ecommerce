"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/auth-actions";

export function TemuResetPasswordForm({ channel, token, email }: { channel: string; token: string; email: string }) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");

	// Password strength indicator
	const getPasswordStrength = (pwd: string) => {
		let strength = 0;
		if (pwd.length >= 8) strength++;
		if (pwd.length >= 12) strength++;
		if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
		if (/\d/.test(pwd)) strength++;
		if (/[^a-zA-Z\d]/.test(pwd)) strength++;
		return strength;
	};

	const passwordStrength = getPasswordStrength(password);
	const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
	const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		setErrors([]);

		try {
			const result = await resetPasswordAction(formData, token, email);
			if (result?.errors) {
				setErrors(result.errors);
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
						Reset Your Password
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Create a new secure password for your account
					</p>
				</div>

				{/* Main Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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

					{/* Password Requirements */}
					<div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-sm font-semibold text-blue-900 mb-2">
							Password Requirements:
						</p>
						<ul className="text-sm text-blue-800 space-y-1">
							<li className="flex items-center gap-2">
								<CheckCircle size={14} className={password.length >= 8 ? "text-green-600" : "text-gray-400"} />
								At least 8 characters
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle size={14} className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-600" : "text-gray-400"} />
								Mix of uppercase and lowercase letters
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle size={14} className={/\d/.test(password) ? "text-green-600" : "text-gray-400"} />
								At least one number
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle size={14} className={/[^a-zA-Z\d]/.test(password) ? "text-green-600" : "text-gray-400"} />
								Special character recommended
							</li>
						</ul>
					</div>

					{/* Reset Password Form */}
					<form action={handleSubmit}>
						{/* New Password Field */}
						<div className="mb-4">
							<label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
								New Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="text-gray-400" size={18} />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									autoComplete="new-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none transition-all"
									placeholder="Enter new password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
							{/* Password Strength Indicator */}
							{password && (
								<div className="mt-2">
									<div className="flex gap-1 mb-1">
										{[...Array(5)].map((_, i) => (
											<div
												key={i}
												className={`h-1 flex-1 rounded ${
													i < passwordStrength ? strengthColors[passwordStrength] : "bg-gray-200"
												}`}
											/>
										))}
									</div>
									<p className={`text-xs font-medium ${passwordStrength >= 4 ? "text-green-600" : "text-gray-600"}`}>
										{strengthLabels[passwordStrength]}
									</p>
								</div>
							)}
						</div>

						{/* Confirm Password Field */}
						<div className="mb-6">
							<label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
								Confirm New Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="text-gray-400" size={18} />
								</div>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									required
									autoComplete="new-password"
									className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none transition-all"
									placeholder="Confirm new password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
								>
									{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
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
									Resetting password...
								</span>
							) : (
								"Reset Password"
							)}
						</button>
					</form>
				</div>

				{/* Help Section */}
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Remember your password?{" "}
						<Link
							href={`/${channel}/login`}
							className="font-bold text-temu-600 hover:text-temu-700 hover:underline"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
