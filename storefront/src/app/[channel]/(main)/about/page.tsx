import Link from "next/link";

export const metadata = {
	title: "About Us - TechHub Electronics",
	description:
		"Learn about TechHub Electronics, your trusted partner for premium electronics and technology products. Discover our story, mission, and commitment to quality.",
};

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-7xl px-8 py-16">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<h1 className="text-4xl font-bold text-gray-900 md:text-5xl">About TechHub Electronics</h1>
				<p className="mt-4 text-xl text-gray-600">
					Your trusted partner in cutting-edge technology since 2020
				</p>
			</div>

			{/* Mission Section */}
			<section className="mb-16">
				<div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white">
					<h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
					<p className="text-lg text-blue-100">
						At TechHub Electronics, we're dedicated to bringing you the latest and greatest in electronics
						technology. Our mission is to make premium tech accessible, affordable, and backed by
						exceptional service. We believe everyone deserves access to quality electronics that enhance
						their digital lifestyle.
					</p>
				</div>
			</section>

			{/* Story Section */}
			<section className="mb-16">
				<div className="grid gap-12 md:grid-cols-2">
					<div>
						<h2 className="mb-4 text-3xl font-bold text-gray-900">Our Story</h2>
						<div className="space-y-4 text-gray-600">
							<p>
								Founded in 2020, TechHub Electronics started with a simple vision: to create a
								one-stop destination for electronics enthusiasts and everyday consumers alike.
							</p>
							<p>
								What began as a small online store has grown into a comprehensive electronics
								marketplace, serving thousands of customers with premium smartphones, laptops, gaming
								gear, and smart home devices.
							</p>
							<p>
								Today, we're proud to be an authorized retailer for the world's leading electronics
								brands, offering genuine products backed by manufacturer warranties and our own
								commitment to customer satisfaction.
							</p>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<div className="rounded-2xl bg-neutral-100 p-12">
							<svg
								className="h-64 w-64 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="mb-16">
				<h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Our Core Values</h2>
				<div className="grid gap-8 md:grid-cols-3">
					<div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
						<div className="mb-4 flex justify-center">
							<svg
								className="h-12 w-12 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<h3 className="mb-2 text-xl font-semibold text-gray-900">Authenticity</h3>
						<p className="text-gray-600">
							100% genuine products from authorized distributors. We never compromise on quality.
						</p>
					</div>
					<div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
						<div className="mb-4 flex justify-center">
							<svg
								className="h-12 w-12 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 className="mb-2 text-xl font-semibold text-gray-900">Fair Pricing</h3>
						<p className="text-gray-600">
							Competitive prices without hidden fees. Great value for premium electronics.
						</p>
					</div>
					<div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
						<div className="mb-4 flex justify-center">
							<svg
								className="h-12 w-12 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
								/>
							</svg>
						</div>
						<h3 className="mb-2 text-xl font-semibold text-gray-900">Customer First</h3>
						<p className="text-gray-600">
							24/7 support and hassle-free returns. Your satisfaction is our priority.
						</p>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="mb-16">
				<div className="rounded-2xl bg-neutral-50 p-12">
					<h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Our Impact</h2>
					<div className="grid gap-8 md:grid-cols-4">
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-600">50K+</div>
							<div className="mt-2 text-gray-600">Happy Customers</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-600">1000+</div>
							<div className="mt-2 text-gray-600">Products Available</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-600">15+</div>
							<div className="mt-2 text-gray-600">Top Brands</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-600">99%</div>
							<div className="mt-2 text-gray-600">Satisfaction Rate</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="mb-16">
				<h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Why Choose TechHub?</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-6">
						<div className="flex-shrink-0">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className="mb-1 font-semibold text-gray-900">Authorized Retailer</h3>
							<p className="text-sm text-gray-600">
								We're officially authorized by all major electronics brands to sell their products.
							</p>
						</div>
					</div>
					<div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-6">
						<div className="flex-shrink-0">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className="mb-1 font-semibold text-gray-900">Fast Shipping</h3>
							<p className="text-sm text-gray-600">
								Free shipping on orders over $100. Most orders delivered within 2-5 business days.
							</p>
						</div>
					</div>
					<div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-6">
						<div className="flex-shrink-0">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className="mb-1 font-semibold text-gray-900">Warranty Protection</h3>
							<p className="text-sm text-gray-600">
								All products come with manufacturer warranty plus our own satisfaction guarantee.
							</p>
						</div>
					</div>
					<div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-6">
						<div className="flex-shrink-0">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className="mb-1 font-semibold text-gray-900">Expert Support</h3>
							<p className="text-sm text-gray-600">
								Our tech-savvy team is available 24/7 to help with product selection and support.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-12 text-center text-white">
				<h2 className="mb-4 text-3xl font-bold">Ready to upgrade your tech?</h2>
				<p className="mb-8 text-lg text-blue-100">
					Browse our collection of premium electronics and find your perfect device today.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Link
						href="/"
						className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 shadow-lg transition hover:bg-blue-50"
					>
						Shop Now
					</Link>
					<Link
						href="/pages/contact"
						className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition hover:bg-white/10"
					>
						Contact Us
					</Link>
				</div>
			</section>
		</div>
	);
}
