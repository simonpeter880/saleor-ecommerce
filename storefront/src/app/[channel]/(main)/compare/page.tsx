import { ProductComparison } from "@/ui/components/ProductComparison";

export const metadata = {
	title: "Compare Products - TechHub Electronics",
	description: "Compare electronics side-by-side to find the perfect product for your needs.",
};

export default function ComparePage() {
	return (
		<div className="mx-auto max-w-7xl px-8 py-16">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900">Compare Products</h1>
				<p className="mt-2 text-lg text-gray-600">
					See detailed specifications side-by-side to make an informed decision
				</p>
			</div>

			<ProductComparison />

			{/* Helpful Tips */}
			<div className="mt-12 rounded-lg bg-blue-50 p-6">
				<h3 className="mb-3 font-semibold text-blue-900">Comparison Tips</h3>
				<ul className="space-y-2 text-sm text-blue-800">
					<li className="flex items-start gap-2">
						<svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						Compare products in the same category for the most meaningful results
					</li>
					<li className="flex items-start gap-2">
						<svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						Focus on the specs that matter most to your use case
					</li>
					<li className="flex items-start gap-2">
						<svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						Don't just focus on price - consider warranty, reviews, and overall value
					</li>
				</ul>
			</div>
		</div>
	);
}
