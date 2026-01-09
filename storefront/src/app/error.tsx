"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle, ArrowLeft } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		// Log error to console in development
		console.error("Error boundary caught:", error);

		// In production, you could send this to an error tracking service
		// Example: Sentry.captureException(error);
	}, [error]);

	const isNetworkError = error.message.includes("fetch") || error.message.includes("network");
	const errorType = isNetworkError ? "Connection Issue" : "Application Error";

	return (
		<div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
					{/* Error Icon */}
					<div className="mb-8 animate-fade-in">
						<div className="inline-flex rounded-full bg-red-100 p-6 dark:bg-red-900/20">
							<AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400 animate-pulse" />
						</div>
					</div>

					{/* Error Message */}
					<div className="mb-8 animate-fade-in-up">
						<h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
							{errorType}
						</h1>
						<p className="mb-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
							{isNetworkError
								? "We're having trouble connecting to our servers. Please check your internet connection."
								: "Oops! Something unexpected happened. Don't worry, our team has been notified."}
						</p>

						{/* Error Details (collapsible in production) */}
						{process.env.NODE_ENV === "development" && (
							<details className="mt-6 text-left">
								<summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
									Technical Details (Development Only)
								</summary>
								<div className="mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
									<pre className="overflow-x-auto text-xs text-red-600 dark:text-red-400">
										{error.message}
									</pre>
									{error.stack && (
										<pre className="mt-2 overflow-x-auto text-xs text-gray-600 dark:text-gray-400">
											{error.stack}
										</pre>
									)}
								</div>
							</details>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-100">
						<button
							onClick={() => reset()}
							className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FB7701] to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
						>
							<RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180" />
							Try Again
						</button>
						<Link
							href="/"
							className="group inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-600"
						>
							<Home className="h-5 w-5" />
							Go Home
						</Link>
						<button
							onClick={() => window.history.back()}
							className="group inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-600"
						>
							<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
							Go Back
						</button>
					</div>

					{/* Helpful Tips */}
					<div className="mt-12 w-full max-w-2xl animate-fade-in-up delay-200">
						<div className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm dark:border-gray-700 dark:bg-gray-800">
							<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
								What you can do:
							</h3>
							<ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
								<li className="flex items-start gap-3">
									<span className="text-[#FB7701]">•</span>
									<span>Try refreshing the page using the button above</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-[#FB7701]">•</span>
									<span>Check your internet connection</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-[#FB7701]">•</span>
									<span>Clear your browser cache and cookies</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-[#FB7701]">•</span>
									<span>
										If the problem persists,{" "}
										<Link
											href="/pages/contact"
											className="font-semibold text-[#FB7701] hover:underline dark:text-orange-400"
										>
											contact our support team
										</Link>
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.6s ease-out;
				}

				.animate-fade-in-up {
					animation: fade-in-up 0.8s ease-out;
				}

				.delay-100 {
					animation-delay: 100ms;
				}

				.delay-200 {
					animation-delay: 200ms;
				}
			`}</style>
		</div>
	);
}
