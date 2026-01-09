"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function OrderConfirmationPage() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId") || "N/A";
	const email = searchParams.get("email") || "your email";

	useEffect(() => {
		// Here you would trigger email notification
		// sendOrderConfirmationEmail(orderId, email);
	}, [orderId, email]);

	return (
		<div className="mx-auto max-w-4xl px-8 py-16">
			{/* Success Animation */}
			<div className="mb-8 text-center">
				<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
					<svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h1 className="mb-2 text-4xl font-bold text-gray-900">Order Confirmed!</h1>
				<p className="text-xl text-gray-600">
					Thank you for your purchase from TechHub Electronics
				</p>
			</div>

			{/* Order Details */}
			<div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8">
				<div className="mb-6 grid gap-6 md:grid-cols-2">
					<div>
						<h3 className="mb-2 font-semibold text-gray-900">Order Number</h3>
						<p className="text-2xl font-bold text-blue-600">{orderId}</p>
					</div>
					<div>
						<h3 className="mb-2 font-semibold text-gray-900">Confirmation Email</h3>
						<p className="text-gray-600">Sent to {email}</p>
					</div>
				</div>

				<div className="rounded-lg bg-blue-50 p-4">
					<h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						What's Next?
					</h4>
					<ul className="space-y-2 text-sm text-blue-800">
						<li className="flex items-start gap-2">
							<span className="mt-0.5">•</span>
							<span>
								<strong>Payment Confirmation:</strong> Check your mobile phone for the Mobile Money payment prompt
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="mt-0.5">•</span>
							<span>
								<strong>Processing:</strong> Once payment is confirmed, we'll start processing your order
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="mt-0.5">•</span>
							<span>
								<strong>Shipping:</strong> You'll receive tracking information within 24 hours
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="mt-0.5">•</span>
							<span>
								<strong>Delivery:</strong> Expected delivery in 2-5 business days
							</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Order Timeline */}
			<div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8">
				<h2 className="mb-6 text-2xl font-bold text-gray-900">Order Timeline</h2>
				<div className="space-y-6">
					{[
						{
							status: "completed",
							title: "Order Placed",
							description: "Your order has been received",
							date: new Date().toLocaleString(),
						},
						{
							status: "current",
							title: "Payment Processing",
							description: "Waiting for Mobile Money confirmation",
							date: "In progress",
						},
						{
							status: "pending",
							title: "Processing",
							description: "We'll prepare your items for shipping",
							date: "Pending",
						},
						{
							status: "pending",
							title: "Shipped",
							description: "Your order is on the way",
							date: "Pending",
						},
						{
							status: "pending",
							title: "Delivered",
							description: "Order delivered successfully",
							date: "Pending",
						},
					].map((step, idx) => (
						<div key={idx} className="flex gap-4">
							<div className="flex flex-col items-center">
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full ${
										step.status === "completed"
											? "bg-green-600 text-white"
											: step.status === "current"
												? "bg-blue-600 text-white"
												: "bg-neutral-200 text-neutral-400"
									}`}
								>
									{step.status === "completed" ? (
										<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<span className="text-sm font-bold">{idx + 1}</span>
									)}
								</div>
								{idx < 4 && (
									<div
										className={`h-12 w-0.5 ${step.status === "completed" ? "bg-green-600" : "bg-neutral-200"}`}
									/>
								)}
							</div>
							<div className="flex-1 pb-8">
								<h3 className="font-semibold text-gray-900">{step.title}</h3>
								<p className="text-sm text-gray-600">{step.description}</p>
								<p className="mt-1 text-xs text-gray-500">{step.date}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid gap-4 md:grid-cols-3">
				<Link
					href="/account/orders"
					className="rounded-lg border-2 border-blue-600 px-6 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
				>
					View Order Details
				</Link>
				<Link
					href="/"
					className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
				>
					Continue Shopping
				</Link>
				<Link
					href="/contact"
					className="rounded-lg border border-neutral-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-neutral-50"
				>
					Contact Support
				</Link>
			</div>

			{/* Support Section */}
			<div className="mt-12 rounded-lg bg-neutral-50 p-6 text-center">
				<h3 className="mb-2 font-semibold text-gray-900">Need Help?</h3>
				<p className="mb-4 text-sm text-gray-600">
					Our customer support team is here to assist you 24/7
				</p>
				<div className="flex flex-wrap justify-center gap-4 text-sm">
					<a href="tel:+256800555123" className="flex items-center gap-2 text-blue-600 hover:underline">
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						+256 800 555 123
					</a>
					<a href="mailto:support@techhub.com" className="flex items-center gap-2 text-blue-600 hover:underline">
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						support@techhub.com
					</a>
				</div>
			</div>

			{/* Email Confirmation Notice */}
			<div className="mt-8 text-center text-sm text-gray-500">
				<p>
					A confirmation email with your order details has been sent to <strong>{email}</strong>
				</p>
				<p className="mt-1">Please check your spam folder if you don't see it in your inbox</p>
			</div>
		</div>
	);
}
