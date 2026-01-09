"use client";

import { useState } from "react";

interface NewsletterSignupProps {
	variant?: "default" | "minimal" | "sidebar";
	title?: string;
	description?: string;
}

export function NewsletterSignup({
	variant = "default",
	title = "Stay Updated with TechHub",
	description = "Get the latest tech news, exclusive deals, and product launches delivered to your inbox.",
}: NewsletterSignupProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes("@")) {
			setStatus("error");
			setMessage("Please enter a valid email address");
			return;
		}

		setStatus("loading");

		// Simulate API call
		setTimeout(() => {
			setStatus("success");
			setMessage("Thanks for subscribing! Check your email to confirm.");
			setEmail("");
		}, 1000);
	};

	if (variant === "minimal") {
		return (
			<div className="inline-flex gap-2">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email"
					className="rounded-lg border border-neutral-300 px-4 py-2 text-sm"
					disabled={status === "loading" || status === "success"}
				/>
				<button
					onClick={handleSubmit}
					disabled={status === "loading" || status === "success"}
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
				>
					{status === "loading" ? "..." : status === "success" ? "✓" : "Subscribe"}
				</button>
			</div>
		);
	}

	if (variant === "sidebar") {
		return (
			<div className="rounded-lg border border-neutral-200 bg-white p-6">
				<div className="mb-4 text-center text-4xl">📧</div>
				<h3 className="mb-2 text-center text-lg font-bold text-gray-900">{title}</h3>
				<p className="mb-4 text-center text-sm text-gray-600">{description}</p>

				<form onSubmit={handleSubmit} className="space-y-3">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Your email address"
						className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm"
						disabled={status === "loading" || status === "success"}
					/>
					<button
						type="submit"
						disabled={status === "loading" || status === "success"}
						className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
					>
						{status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
					</button>
				</form>

				{status === "success" && (
					<div className="mt-3 rounded-md bg-green-50 p-3 text-center text-sm text-green-800">
						{message}
					</div>
				)}
				{status === "error" && (
					<div className="mt-3 rounded-md bg-red-50 p-3 text-center text-sm text-red-800">
						{message}
					</div>
				)}

				<p className="mt-4 text-center text-xs text-gray-500">
					We respect your privacy. Unsubscribe anytime.
				</p>
			</div>
		);
	}

	// Default variant - full section
	return (
		<section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-16 text-white">
			<div className="mx-auto max-w-7xl px-8">
				<div className="mx-auto max-w-3xl text-center">
					{/* Icon */}
					<div className="mb-6 flex justify-center">
						<div className="rounded-full bg-white/10 p-4 backdrop-blur">
							<svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>

					{/* Content */}
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
					<p className="mb-8 text-lg text-blue-100">{description}</p>

					{/* Form */}
					<form onSubmit={handleSubmit} className="mx-auto max-w-md">
						<div className="flex flex-col gap-3 sm:flex-row">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email address"
								className="flex-1 rounded-lg border border-blue-400 bg-white/10 px-6 py-3 text-white placeholder-blue-200 backdrop-blur transition focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
								disabled={status === "loading" || status === "success"}
							/>
							<button
								type="submit"
								disabled={status === "loading" || status === "success"}
								className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
							>
								{status === "loading"
									? "Subscribing..."
									: status === "success"
										? "Subscribed!"
										: "Subscribe"}
							</button>
						</div>

						{status === "success" && (
							<div className="mt-4 rounded-lg bg-green-500/20 p-3 text-sm text-green-100">
								{message}
							</div>
						)}
						{status === "error" && (
							<div className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-100">{message}</div>
						)}

						<p className="mt-4 text-sm text-blue-200">
							Join 50,000+ subscribers • No spam • Unsubscribe anytime
						</p>
					</form>

					{/* Benefits */}
					<div className="mt-12 grid gap-6 text-left md:grid-cols-3">
						<div className="flex gap-3">
							<svg className="h-6 w-6 flex-shrink-0 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<div>
								<h4 className="mb-1 font-semibold">Exclusive Deals</h4>
								<p className="text-sm text-blue-100">Early access to sales and promotions</p>
							</div>
						</div>
						<div className="flex gap-3">
							<svg className="h-6 w-6 flex-shrink-0 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<div>
								<h4 className="mb-1 font-semibold">Tech News</h4>
								<p className="text-sm text-blue-100">Latest product launches and reviews</p>
							</div>
						</div>
						<div className="flex gap-3">
							<svg className="h-6 w-6 flex-shrink-0 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<div>
								<h4 className="mb-1 font-semibold">Expert Tips</h4>
								<p className="text-sm text-blue-100">Buying guides and tech tutorials</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
