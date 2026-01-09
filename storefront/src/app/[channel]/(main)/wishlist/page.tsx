"use client";

import { useWishlistContext } from "@/context/WishlistContext";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "urql";
import { ProductsByIdsDocument } from "@/gql/graphql";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

export default function WishlistPage() {
	const { items, isLoading, removeFromWishlist, clearWishlist, itemCount } = useWishlistContext();
	const params = useParams();
	const channel = params.channel as string;

	const productIds = items.map((item) => item.productId);

	const [{ data, fetching }] = useQuery({
		query: ProductsByIdsDocument,
		variables: { ids: productIds, channel },
		pause: productIds.length === 0,
	});

	const products = data?.products?.edges?.map((edge) => edge.node) ?? [];

	if (isLoading || fetching) {
		return (
			<section className="mx-auto max-w-7xl p-8 pb-16">
				<h1 className="mb-8 text-2xl font-bold">My Wishlist</h1>
				<div className="flex h-64 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
				</div>
			</section>
		);
	}

	if (itemCount === 0) {
		return (
			<section className="mx-auto max-w-7xl p-8 pb-16">
				<h1 className="mb-8 text-2xl font-bold">My Wishlist</h1>
				<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16">
					<Heart className="mb-4 h-16 w-16 text-gray-300" />
					<h2 className="mb-2 text-xl font-semibold text-gray-600">
						Your wishlist is empty
					</h2>
					<p className="mb-6 text-gray-500">
						Start adding items you love to your wishlist
					</p>
					<Link
						href={`/${channel}/products`}
						className="rounded-full bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
					>
						Browse Products
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold">
					My Wishlist ({itemCount} {itemCount === 1 ? "item" : "items"})
				</h1>
				<button
					onClick={clearWishlist}
					className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
				>
					<Trash2 size={16} />
					Clear All
				</button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product) => {
					const wishlistItem = items.find((item) => item.productId === product.id);
					const price = product.pricing?.priceRange?.start?.gross.amount ?? 0;

					return (
						<div
							key={product.id}
							className="group rounded-lg border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-lg"
						>
							<Link href={`/${channel}/products/${product.slug}`}>
								<div className="aspect-square overflow-hidden bg-gray-100">
									{product.thumbnail?.url ? (
										<ProductImageWrapper
											src={product.thumbnail.url}
											alt={product.thumbnail.alt || product.name}
											width={400}
											height={400}
											className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<div className="flex h-full items-center justify-center text-gray-400">
											No Image
										</div>
									)}
								</div>
							</Link>

							<div className="p-4">
								<Link href={`/${channel}/products/${product.slug}`}>
									<h3 className="font-medium text-gray-900 line-clamp-2 hover:text-primary-500 transition-colors">
										{product.name}
									</h3>
								</Link>

								{product.category && (
									<p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
								)}

								<p className="mt-2 text-lg font-bold text-primary-500">
									UGX {price.toLocaleString("en-UG", { minimumFractionDigits: 0 })}
								</p>

								{wishlistItem && (
									<p className="mt-1 text-xs text-gray-400">
										Added {new Date(wishlistItem.addedAt).toLocaleDateString()}
									</p>
								)}

								<div className="mt-4 flex gap-2">
									<button
										onClick={() => removeFromWishlist(product.id)}
										className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 size={14} />
										Remove
									</button>
									<Link
										href={`/${channel}/products/${product.slug}`}
										className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-500 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
									>
										<ShoppingCart size={14} />
										View Product
									</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
