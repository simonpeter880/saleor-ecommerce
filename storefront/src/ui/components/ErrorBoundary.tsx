"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return <DefaultErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false, error: null })} />;
		}

		return this.props.children;
	}
}

// Default Error Fallback Component
function DefaultErrorFallback({ error, reset }: { error: Error | null; reset: () => void }) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
				<div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
					<AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
				</div>

				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					Oops! Something went wrong
				</h1>

				<p className="text-gray-600 dark:text-gray-400 mb-6">
					We encountered an unexpected error. Don't worry, it's not your fault.
				</p>

				{error && (
					<details className="mb-6 text-left">
						<summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
							Error details
						</summary>
						<pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto max-h-40">
							{error.message}
						</pre>
					</details>
				)}

				<div className="flex gap-3 justify-center">
					<button
						onClick={reset}
						className="flex items-center gap-2 px-6 py-2.5 bg-temu-500 dark:bg-temu-600 text-white rounded-lg font-medium hover:bg-temu-600 dark:hover:bg-temu-700 transition-colors"
					>
						<RefreshCcw size={18} />
						Try Again
					</button>

					<a
						href="/"
						className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<Home size={18} />
						Go Home
					</a>
				</div>
			</div>
		</div>
	);
}

// Specific Error Fallbacks
export function ProductErrorFallback() {
	return (
		<div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
			<AlertTriangle className="mx-auto mb-4 text-red-600 dark:text-red-400" size={48} />
			<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
				Failed to load product
			</h3>
			<p className="text-gray-600 dark:text-gray-400 mb-4">
				We couldn't load this product. Please try refreshing the page.
			</p>
			<button
				onClick={() => window.location.reload()}
				className="px-6 py-2.5 bg-temu-500 dark:bg-temu-600 text-white rounded-lg font-medium hover:bg-temu-600 dark:hover:bg-temu-700 transition-colors"
			>
				Refresh Page
			</button>
		</div>
	);
}

export function CartErrorFallback() {
	return (
		<div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
			<AlertTriangle className="mx-auto mb-4 text-red-600 dark:text-red-400" size={48} />
			<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Cart Error</h3>
			<p className="text-gray-600 dark:text-gray-400">
				We encountered an issue with your cart. Your items are safe.
			</p>
		</div>
	);
}

export function CheckoutErrorFallback() {
	return (
		<div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
			<AlertTriangle className="mx-auto mb-4 text-red-600 dark:text-red-400" size={48} />
			<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
				Checkout Error
			</h3>
			<p className="text-gray-600 dark:text-gray-400 mb-4">
				We're having trouble processing your checkout. Your cart is still saved.
			</p>
			<a
				href="/cart"
				className="inline-block px-6 py-2.5 bg-temu-500 dark:bg-temu-600 text-white rounded-lg font-medium hover:bg-temu-600 dark:hover:bg-temu-700 transition-colors"
			>
				Return to Cart
			</a>
		</div>
	);
}
