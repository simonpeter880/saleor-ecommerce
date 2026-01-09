import Link from "next/link";

export const metadata = {
	title: "Smartphone Buying Guide 2025 - TechHub Electronics",
	description:
		"Complete guide to choosing the perfect smartphone based on your budget, needs, and preferred features.",
};

export default function SmartphoneBuyingGuidePage() {
	return (
		<article className="mx-auto max-w-4xl px-8 py-16">
			{/* Breadcrumb */}
			<nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
				<Link href="/" className="hover:text-blue-600">
					Home
				</Link>
				<span>/</span>
				<Link href="/guides" className="hover:text-blue-600">
					Guides
				</Link>
				<span>/</span>
				<span className="text-gray-900">Smartphone Buying Guide</span>
			</nav>

			{/* Header */}
			<header className="mb-12">
				<div className="mb-4 flex items-center gap-3">
					<span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
						Smartphones
					</span>
					<span className="text-sm text-gray-500">8 min read</span>
					<span className="text-sm text-gray-500">Updated Dec 2025</span>
				</div>
				<h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
					Smartphone Buying Guide 2025
				</h1>
				<p className="text-xl leading-relaxed text-gray-600">
					Find the perfect smartphone based on your budget, needs, and preferred features. Our
					comprehensive guide covers everything from budget options to flagship devices.
				</p>
			</header>

			{/* Table of Contents */}
			<div className="mb-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
				<h2 className="mb-4 font-bold text-gray-900">Table of Contents</h2>
				<ol className="space-y-2 text-sm">
					<li>
						<a href="#budget-ranges" className="text-blue-600 hover:underline">
							1. Understanding Budget Ranges
						</a>
					</li>
					<li>
						<a href="#key-features" className="text-blue-600 hover:underline">
							2. Key Features to Consider
						</a>
					</li>
					<li>
						<a href="#operating-systems" className="text-blue-600 hover:underline">
							3. iOS vs Android
						</a>
					</li>
					<li>
						<a href="#recommendations" className="text-blue-600 hover:underline">
							4. Our Top Recommendations
						</a>
					</li>
					<li>
						<a href="#tips" className="text-blue-600 hover:underline">
							5. Pro Tips for Buyers
						</a>
					</li>
				</ol>
			</div>

			{/* Content Sections */}
			<div className="prose prose-lg max-w-none">
				<section id="budget-ranges" className="mb-12">
					<h2 className="mb-4 text-3xl font-bold text-gray-900">Understanding Budget Ranges</h2>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-lg border border-neutral-200 bg-white p-6">
							<h3 className="mb-2 text-xl font-bold text-green-600">Budget ($200-$400)</h3>
							<p className="mb-4 text-sm text-gray-600">
								Great for basic tasks, social media, and casual photography.
							</p>
							<ul className="space-y-2 text-sm text-gray-700">
								<li>✓ Decent camera quality</li>
								<li>✓ All-day battery life</li>
								<li>✓ Reliable performance</li>
								<li>✗ Limited gaming capability</li>
								<li>✗ Basic materials</li>
							</ul>
						</div>
						<div className="rounded-lg border border-neutral-200 bg-white p-6">
							<h3 className="mb-2 text-xl font-bold text-blue-600">Mid-Range ($400-$800)</h3>
							<p className="mb-4 text-sm text-gray-600">
								Best value with flagship-level features at lower prices.
							</p>
							<ul className="space-y-2 text-sm text-gray-700">
								<li>✓ Excellent cameras</li>
								<li>✓ Fast processors</li>
								<li>✓ Premium design</li>
								<li>✓ 5G connectivity</li>
								<li>✓ Good gaming performance</li>
							</ul>
						</div>
						<div className="rounded-lg border border-neutral-200 bg-white p-6">
							<h3 className="mb-2 text-xl font-bold text-purple-600">Flagship ($800+)</h3>
							<p className="mb-4 text-sm text-gray-600">
								Cutting-edge technology and premium materials.
							</p>
							<ul className="space-y-2 text-sm text-gray-700">
								<li>✓ Best cameras available</li>
								<li>✓ Fastest processors</li>
								<li>✓ Premium materials</li>
								<li>✓ Advanced features</li>
								<li>✓ Longest software support</li>
							</ul>
						</div>
					</div>
				</section>

				<section id="key-features" className="mb-12">
					<h2 className="mb-4 text-3xl font-bold text-gray-900">Key Features to Consider</h2>

					<div className="mb-6 rounded-lg bg-blue-50 p-6">
						<h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-blue-900">
							<span>📸</span> Camera Quality
						</h3>
						<p className="text-gray-700">
							Modern smartphones have multiple cameras. Look for:
						</p>
						<ul className="mt-3 space-y-1 text-sm text-gray-700">
							<li>• Main camera: 48MP+ for detailed photos</li>
							<li>• Ultra-wide lens for landscapes and group shots</li>
							<li>• Telephoto lens for zoom capabilities</li>
							<li>• Night mode for low-light photography</li>
						</ul>
					</div>

					<div className="mb-6 rounded-lg bg-green-50 p-6">
						<h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-green-900">
							<span>⚡</span> Battery Life
						</h3>
						<p className="text-gray-700">
							Look for phones with at least 4000mAh battery capacity. Consider:
						</p>
						<ul className="mt-3 space-y-1 text-sm text-gray-700">
							<li>• Fast charging support (30W+)</li>
							<li>• Wireless charging capability</li>
							<li>• All-day battery life (12+ hours)</li>
						</ul>
					</div>

					<div className="mb-6 rounded-lg bg-purple-50 p-6">
						<h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-purple-900">
							<span>🖥️</span> Display
						</h3>
						<p className="text-gray-700">Display quality matters for daily use:</p>
						<ul className="mt-3 space-y-1 text-sm text-gray-700">
							<li>• OLED/AMOLED for vibrant colors and deep blacks</li>
							<li>• 90Hz+ refresh rate for smooth scrolling</li>
							<li>• Full HD+ resolution minimum</li>
							<li>• HDR support for better video viewing</li>
						</ul>
					</div>
				</section>

				<section id="operating-systems" className="mb-12">
					<h2 className="mb-4 text-3xl font-bold text-gray-900">iOS vs Android</h2>
					<div className="overflow-hidden rounded-lg border border-neutral-200">
						<table className="w-full">
							<thead className="bg-neutral-50">
								<tr>
									<th className="p-4 text-left font-semibold text-gray-900">Feature</th>
									<th className="p-4 text-left font-semibold text-gray-900">iOS (iPhone)</th>
									<th className="p-4 text-left font-semibold text-gray-900">Android</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-200">
								<tr>
									<td className="p-4 font-medium text-gray-900">Customization</td>
									<td className="p-4 text-gray-600">Limited</td>
									<td className="p-4 text-gray-600">Extensive</td>
								</tr>
								<tr>
									<td className="p-4 font-medium text-gray-900">App Selection</td>
									<td className="p-4 text-gray-600">High quality, curated</td>
									<td className="p-4 text-gray-600">More variety, open</td>
								</tr>
								<tr>
									<td className="p-4 font-medium text-gray-900">Updates</td>
									<td className="p-4 text-gray-600">5-7 years</td>
									<td className="p-4 text-gray-600">2-5 years (varies)</td>
								</tr>
								<tr>
									<td className="p-4 font-medium text-gray-900">Ecosystem</td>
									<td className="p-4 text-gray-600">Tight integration with Apple devices</td>
									<td className="p-4 text-gray-600">Works with everything</td>
								</tr>
								<tr>
									<td className="p-4 font-medium text-gray-900">Price Range</td>
									<td className="p-4 text-gray-600">$429 - $1,599</td>
									<td className="p-4 text-gray-600">$150 - $1,800</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<section id="recommendations" className="mb-12">
					<h2 className="mb-6 text-3xl font-bold text-gray-900">Our Top Recommendations</h2>

					<div className="space-y-6">
						<div className="rounded-lg border-2 border-blue-500 bg-white p-6">
							<div className="mb-2 flex items-center gap-2">
								<span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
									BEST OVERALL
								</span>
							</div>
							<h3 className="mb-2 text-2xl font-bold text-gray-900">iPhone 15 Pro</h3>
							<p className="mb-4 text-gray-600">
								The perfect blend of performance, camera quality, and ecosystem integration.
							</p>
							<div className="flex items-center justify-between">
								<span className="text-2xl font-bold text-blue-600">$999</span>
								<Link
									href="/products/iphone-15-pro"
									className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
								>
									View Product
								</Link>
							</div>
						</div>

						<div className="rounded-lg border border-neutral-200 bg-white p-6">
							<div className="mb-2 flex items-center gap-2">
								<span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
									BEST VALUE
								</span>
							</div>
							<h3 className="mb-2 text-2xl font-bold text-gray-900">Google Pixel 8</h3>
							<p className="mb-4 text-gray-600">
								Exceptional camera and AI features at a mid-range price point.
							</p>
							<div className="flex items-center justify-between">
								<span className="text-2xl font-bold text-blue-600">$699</span>
								<Link
									href="/products/google-pixel-8"
									className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
								>
									View Product
								</Link>
							</div>
						</div>

						<div className="rounded-lg border border-neutral-200 bg-white p-6">
							<div className="mb-2 flex items-center gap-2">
								<span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
									BEST BUDGET
								</span>
							</div>
							<h3 className="mb-2 text-2xl font-bold text-gray-900">Samsung Galaxy A54</h3>
							<p className="mb-4 text-gray-600">
								Flagship features at a budget-friendly price with great battery life.
							</p>
							<div className="flex items-center justify-between">
								<span className="text-2xl font-bold text-blue-600">$449</span>
								<Link
									href="/products/samsung-galaxy-a54"
									className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
								>
									View Product
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section id="tips" className="mb-12">
					<h2 className="mb-4 text-3xl font-bold text-gray-900">Pro Tips for Buyers</h2>
					<div className="space-y-4 rounded-lg bg-neutral-50 p-6">
						<div className="flex gap-4">
							<span className="text-2xl">💡</span>
							<div>
								<h4 className="mb-1 font-semibold text-gray-900">Wait for New Releases</h4>
								<p className="text-sm text-gray-600">
									Previous generation models drop in price when new ones launch. You can save 20-30%
									by waiting.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<span className="text-2xl">💡</span>
							<div>
								<h4 className="mb-1 font-semibold text-gray-900">Check Trade-In Values</h4>
								<p className="text-sm text-gray-600">
									Your old phone might be worth more than you think. Check our trade-in program
									before buying.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<span className="text-2xl">💡</span>
							<div>
								<h4 className="mb-1 font-semibold text-gray-900">Consider Storage Needs</h4>
								<p className="text-sm text-gray-600">
									Upgrading storage later is impossible. Choose 256GB+ if you take lots of photos or
									videos.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<span className="text-2xl">💡</span>
							<div>
								<h4 className="mb-1 font-semibold text-gray-900">Read Reviews</h4>
								<p className="text-sm text-gray-600">
									Check real user reviews on our site to understand long-term reliability and
									common issues.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* CTA Section */}
			<div className="mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
				<h3 className="mb-2 text-2xl font-bold">Ready to Find Your Perfect Smartphone?</h3>
				<p className="mb-6 text-blue-100">Browse our curated selection of the latest smartphones</p>
				<Link
					href="/categories/smartphones"
					className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
				>
					Shop Smartphones
				</Link>
			</div>

			{/* Related Guides */}
			<div className="mt-12">
				<h3 className="mb-6 text-2xl font-bold text-gray-900">Related Guides</h3>
				<div className="grid gap-4 md:grid-cols-3">
					<Link
						href="/guides/tablet-buying-guide"
						className="rounded-lg border border-neutral-200 p-4 transition hover:border-blue-500 hover:shadow-lg"
					>
						<h4 className="mb-2 font-semibold text-gray-900">Tablet Buying Guide</h4>
						<p className="text-sm text-gray-600">Compare iPads and Android tablets</p>
					</Link>
					<Link
						href="/guides/headphones-guide"
						className="rounded-lg border border-neutral-200 p-4 transition hover:border-blue-500 hover:shadow-lg"
					>
						<h4 className="mb-2 font-semibold text-gray-900">Headphones Guide</h4>
						<p className="text-sm text-gray-600">Find the perfect audio companion</p>
					</Link>
					<Link
						href="/guides/smart-home-starter-guide"
						className="rounded-lg border border-neutral-200 p-4 transition hover:border-blue-500 hover:shadow-lg"
					>
						<h4 className="mb-2 font-semibold text-gray-900">Smart Home Guide</h4>
						<p className="text-sm text-gray-600">Build your connected home</p>
					</Link>
				</div>
			</div>
		</article>
	);
}
