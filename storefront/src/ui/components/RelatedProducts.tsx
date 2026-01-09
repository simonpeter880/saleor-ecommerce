import { executeGraphQL } from "@/lib/graphql";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { TemuProductCard } from "./TemuProductCard";

interface RelatedProductsProps {
	categorySlug?: string;
	currentProductId: string;
	channel: string;
}

export async function RelatedProducts({
	categorySlug,
	currentProductId,
	channel,
}: RelatedProductsProps) {
	if (!categorySlug) {
		return null;
	}

	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: categorySlug,
			channel: channel,
		},
		revalidate: 60,
	});

	if (!category?.products?.edges) {
		return null;
	}

	// Filter out current product and limit to 5 items
	const relatedProducts = category.products.edges
		.map(({ node }) => node)
		.filter((product) => product.id !== currentProductId)
		.slice(0, 5);

	if (relatedProducts.length === 0) {
		return null;
	}

	return (
		<section className="mb-8">
			<h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{relatedProducts.map((product) => (
					<TemuProductCard key={product.id} product={product} channel={channel} />
				))}
			</div>
		</section>
	);
}
