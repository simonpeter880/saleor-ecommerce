"use client";

import { Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { TemuProductCard } from "@/ui/components/TemuProductCard";
import { useParams } from "next/navigation";

export default function HistoryPage() {
	const params = useParams();
	const channel = params.channel as string;
	const { products, clearProducts } = useRecentlyViewed();

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<div>
						<Link href={`/${channel}/account`} className="text-temu-500 hover:underline text-sm">
							&larr; Back to Account
						</Link>
						<h1 className="text-3xl font-black text-gray-900 mt-2">Browsing History</h1>
						<p className="text-gray-600">{products.length} items viewed</p>
					</div>
					{products.length > 0 && (
						<button
							onClick={clearProducts}
							className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
						>
							<Trash2 size={18} />
							Clear History
						</button>
					)}
				</div>

				{/* Products Grid */}
				{products.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{products.map((product) => (
							<TemuProductCard
								key={product.id}
								product={product}
								channel={channel}
							/>
						))}
					</div>
				) : (
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
						<div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<Clock className="text-gray-400" size={40} />
						</div>
						<h2 className="text-xl font-bold text-gray-900 mb-2">No browsing history</h2>
						<p className="text-gray-600 mb-6">
							Products you view will appear here
						</p>
						<Link
							href={`/${channel}/`}
							className="inline-block bg-temu-500 text-white px-8 py-3 rounded-full font-bold hover:bg-temu-600 transition-colors"
						>
							Start Shopping
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
