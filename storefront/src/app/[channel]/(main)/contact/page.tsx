"use client";

import { useState } from "react";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
		category: "general",
	});
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		// Simulate API call
		setTimeout(() => {
			setStatus("success");
			setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
		}, 1000);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="mx-auto max-w-7xl px-8 py-16">
			{/* Header */}
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Contact Us</h1>
				<p className="mt-4 text-xl text-gray-600">
					Have a question? We're here to help
				</p>
			</div>

			<div className="grid gap-12 lg:grid-cols-3">
				{/* Contact Form */}
				<div className="lg:col-span-2">
					<div className="rounded-lg border border-neutral-200 bg-white p-8">
						<h2 className="mb-6 text-2xl font-bold text-gray-900">Send us a Message</h2>

						{status === "success" ? (
							<div className="rounded-lg bg-green-50 p-8 text-center">
								<svg
									className="mx-auto mb-4 h-16 w-16 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<h3 className="mb-2 text-xl font-bold text-green-900">Message Sent!</h3>
								<p className="mb-6 text-green-800">
									Thank you for contacting us. We'll get back to you within 24 hours.
								</p>
								<button
									onClick={() => setStatus("idle")}
									className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
								>
									Send Another Message
								</button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Name and Email */}
								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<label htmlFor="name" className="mb-2 block font-medium text-gray-900">
											Your Name *
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
											placeholder="John Doe"
										/>
									</div>
									<div>
										<label htmlFor="email" className="mb-2 block font-medium text-gray-900">
											Email Address *
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
											placeholder="john@example.com"
										/>
									</div>
								</div>

								{/* Category */}
								<div>
									<label htmlFor="category" className="mb-2 block font-medium text-gray-900">
										Category *
									</label>
									<select
										id="category"
										name="category"
										value={formData.category}
										onChange={handleChange}
										className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
									>
										<option value="general">General Inquiry</option>
										<option value="sales">Sales Question</option>
										<option value="support">Technical Support</option>
										<option value="order">Order Status</option>
										<option value="return">Returns & Refunds</option>
										<option value="partnership">Partnership Opportunity</option>
									</select>
								</div>

								{/* Subject */}
								<div>
									<label htmlFor="subject" className="mb-2 block font-medium text-gray-900">
										Subject *
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										placeholder="How can we help?"
									/>
								</div>

								{/* Message */}
								<div>
									<label htmlFor="message" className="mb-2 block font-medium text-gray-900">
										Message *
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={6}
										className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										placeholder="Tell us more about your inquiry..."
									/>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={status === "loading"}
									className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
								>
									{status === "loading" ? "Sending..." : "Send Message"}
								</button>

								<p className="text-sm text-gray-500">
									* Required fields. We typically respond within 24 hours.
								</p>
							</form>
						)}
					</div>
				</div>

				{/* Contact Info Sidebar */}
				<div className="space-y-6">
					{/* Quick Contact */}
					<div className="rounded-lg border border-neutral-200 bg-white p-6">
						<h3 className="mb-4 text-lg font-bold text-gray-900">Quick Contact</h3>
						<div className="space-y-4">
							<div className="flex gap-3">
								<svg
									className="h-6 w-6 flex-shrink-0 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								<div>
									<div className="font-medium text-gray-900">Phone</div>
									<a href="tel:+18005551234" className="text-sm text-blue-600 hover:underline">
										1-800-555-1234
									</a>
									<div className="text-xs text-gray-500">Mon-Fri, 9am-6pm EST</div>
								</div>
							</div>

							<div className="flex gap-3">
								<svg
									className="h-6 w-6 flex-shrink-0 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<div>
									<div className="font-medium text-gray-900">Email</div>
									<a
										href="mailto:support@techhub.com"
										className="text-sm text-blue-600 hover:underline"
									>
										support@techhub.com
									</a>
									<div className="text-xs text-gray-500">24/7 support</div>
								</div>
							</div>

							<div className="flex gap-3">
								<svg
									className="h-6 w-6 flex-shrink-0 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<div>
									<div className="font-medium text-gray-900">Address</div>
									<div className="text-sm text-gray-600">
										123 Tech Street
										<br />
										San Francisco, CA 94105
										<br />
										United States
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Live Chat CTA */}
					<div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white">
						<h3 className="mb-2 text-lg font-bold">Need Immediate Help?</h3>
						<p className="mb-4 text-sm text-blue-100">
							Chat with our support team for instant assistance
						</p>
						<button className="w-full rounded-lg bg-white px-4 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-50">
							Start Live Chat
						</button>
					</div>

					{/* FAQ Link */}
					<div className="rounded-lg border border-neutral-200 bg-white p-6">
						<h3 className="mb-2 text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
						<p className="mb-4 text-sm text-gray-600">
							Find answers to common questions in our FAQ section
						</p>
						<a
							href="/faq"
							className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
						>
							View FAQs
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div>

					{/* Social Media */}
					<div className="rounded-lg border border-neutral-200 bg-white p-6">
						<h3 className="mb-4 text-lg font-bold text-gray-900">Follow Us</h3>
						<div className="flex gap-3">
							<a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
							>
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
							<a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white transition hover:bg-blue-500"
							>
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</a>
							<a
								href="#"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white transition hover:opacity-90"
							>
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
