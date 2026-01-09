import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<div className="max-w-md w-full text-center">
				{/* 404 Number */}
				<div className="text-9xl font-black text-temu-500 dark:text-temu-400 mb-4">
					404
				</div>

				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					Page Not Found
				</h1>

				<p className="text-gray-600 dark:text-gray-400 mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link
						href="/"
						className="flex items-center justify-center gap-2 px-6 py-3 bg-temu-500 dark:bg-temu-600 text-white rounded-full font-bold hover:bg-temu-600 dark:hover:bg-temu-700 transition-colors"
					>
						<Home size={18} />
						Back to Home
					</Link>

					<Link
						href="/search"
						className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<Search size={18} />
						Search Products
					</Link>
				</div>

				{/* Popular Categories Suggestion */}
				<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
						Try browsing our popular categories:
					</p>
					<div className="flex flex-wrap justify-center gap-2">
						{["Electronics", "Phones", "Laptops", "Gaming", "Audio"].map((category) => (
							<Link
								key={category}
								href={`/categories/${category.toLowerCase()}`}
								className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
							>
								{category}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
