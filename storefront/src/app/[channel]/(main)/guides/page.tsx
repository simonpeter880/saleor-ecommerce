import Link from "next/link";

export const metadata = {
	title: "Buying Guides - TechHub Electronics",
	description: "Expert guides to help you choose the perfect electronics for your needs.",
};

const guides = [
	{
		slug: "smartphone-buying-guide",
		title: "Smartphone Buying Guide 2025",
		description: "Find the perfect smartphone based on your budget, needs, and preferred features.",
		category: "Smartphones",
		readTime: "8 min read",
		image: "📱",
		color: "from-blue-500 to-blue-700",
	},
	{
		slug: "laptop-buying-guide",
		title: "Laptop Buying Guide",
		description: "Choose between MacBooks, Windows laptops, gaming rigs, and Chromebooks.",
		category: "Laptops",
		readTime: "10 min read",
		image: "💻",
		color: "from-purple-500 to-purple-700",
	},
	{
		slug: "gaming-console-guide",
		title: "Gaming Console Comparison",
		description: "PlayStation 5 vs Xbox Series X vs Nintendo Switch - which is right for you?",
		category: "Gaming",
		readTime: "7 min read",
		image: "🎮",
		color: "from-green-500 to-green-700",
	},
	{
		slug: "smart-home-starter-guide",
		title: "Smart Home Starter Guide",
		description: "Build your smart home ecosystem from scratch with compatible devices.",
		category: "Smart Home",
		readTime: "12 min read",
		image: "🏠",
		color: "from-orange-500 to-orange-700",
	},
	{
		slug: "headphones-guide",
		title: "Headphones & Earbuds Guide",
		description: "Over-ear, on-ear, or in-ear? Wired or wireless? Find your perfect audio.",
		category: "Audio",
		readTime: "6 min read",
		image: "🎧",
		color: "from-pink-500 to-pink-700",
	},
	{
		slug: "tablet-buying-guide",
		title: "Tablet Buying Guide",
		description: "iPad vs Android tablets vs Windows tablets - compare features and use cases.",
		category: "Tablets",
		readTime: "7 min read",
		image: "📱",
		color: "from-indigo-500 to-indigo-700",
	},
];

export default function GuidesPage() {
	return (
		<div className="mx-auto max-w-7xl px-8 py-16">
			{/* Header */}
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Buying Guides</h1>
				<p className="mt-4 text-xl text-gray-600">
					Expert advice to help you make informed decisions
				</p>
			</div>

			{/* Guides Grid */}
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{guides.map((guide) => (
					<Link
						key={guide.slug}
						href={`/guides/${guide.slug}`}
						className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-blue-500 hover:shadow-lg"
					>
						{/* Image/Icon Header */}
						<div className={`bg-gradient-to-br ${guide.color} p-12 text-center`}>
							<div className="text-7xl">{guide.image}</div>
						</div>

						{/* Content */}
						<div className="p-6">
							{/* Category Badge */}
							<span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
								{guide.category}
							</span>

							{/* Title */}
							<h3 className="mt-3 text-xl font-bold text-gray-900 group-hover:text-blue-600">
								{guide.title}
							</h3>

							{/* Description */}
							<p className="mt-2 text-sm text-gray-600 line-clamp-2">{guide.description}</p>

							{/* Meta */}
							<div className="mt-4 flex items-center justify-between text-sm text-gray-500">
								<span className="flex items-center gap-1">
									<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{guide.readTime}
								</span>
								<span className="font-medium text-blue-600 group-hover:underline">
									Read Guide →
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Why Use Our Guides Section */}
			<div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="text-3xl font-bold">Why Use Our Buying Guides?</h2>
					<div className="mt-8 grid gap-6 md:grid-cols-3">
						<div>
							<div className="mb-3 text-4xl">✓</div>
							<h3 className="mb-2 font-semibold">Expert Knowledge</h3>
							<p className="text-sm text-blue-100">
								Written by tech experts with years of industry experience
							</p>
						</div>
						<div>
							<div className="mb-3 text-4xl">📊</div>
							<h3 className="mb-2 font-semibold">Data-Driven</h3>
							<p className="text-sm text-blue-100">
								Based on extensive testing and real customer feedback
							</p>
						</div>
						<div>
							<div className="mb-3 text-4xl">💡</div>
							<h3 className="mb-2 font-semibold">Actionable Advice</h3>
							<p className="text-sm text-blue-100">
								Clear recommendations for every budget and use case
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Newsletter CTA */}
			<div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
				<h3 className="mb-2 text-2xl font-bold text-gray-900">Get Expert Tips Delivered</h3>
				<p className="mb-6 text-gray-600">
					Subscribe to our newsletter for the latest guides and tech news
				</p>
				<div className="mx-auto flex max-w-md gap-2">
					<input
						type="email"
						placeholder="Enter your email"
						className="flex-1 rounded-lg border border-neutral-300 px-4 py-2"
					/>
					<button className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">
						Subscribe
					</button>
				</div>
			</div>
		</div>
	);
}
