"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home, Search } from "lucide-react";
import Link from "next/link";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Product page error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
				<div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
					<AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
				</div>

				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					Product Not Available
				</h1>

				<p className="text-gray-600 dark:text-gray-400 mb-6">
					We couldn't load this product. It might be temporarily unavailable or no longer exist.
				</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						onClick={reset}
						className="flex items-center justify-center gap-2 px-6 py-2.5 bg-temu-500 dark:bg-temu-600 text-white rounded-lg font-medium hover:bg-temu-600 dark:hover:bg-temu-700 transition-colors"
					>
						<RefreshCcw size={18} />
						Try Again
					</button>

					<Link
						href="/"
						className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<Search size={18} />
						Browse Products
					</Link>
				</div>

				{process.env.NODE_ENV === "development" && error.message && (
					<details className="mt-6 text-left">
						<summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
							Error details
						</summary>
						<pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto max-h-40 text-gray-700 dark:text-gray-300">
							{error.message}
						</pre>
					</details>
				)}
			</div>
		</div>
	);
}
