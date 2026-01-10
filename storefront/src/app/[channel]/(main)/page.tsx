import { ProductListByCollectionDocument, ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Homepage } from "@/components/home/Homepage";

export const metadata = {
	title: "TechHub Electronics - Quality Electronics at Great Prices",
	description:
		"Shop the latest smartphones, laptops, tablets, gaming consoles and more from trusted brands. Free shipping on orders over $50. 30-day returns.",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Try fetching from collection first
	const collectionData = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel: params.channel,
		},
		revalidate: 60,
	});

	let products = collectionData.collection?.products?.edges.map(({ node: product }) => product) || [];

	// Fallback: if collection is empty, fetch products directly
	if (products.length === 0) {
		const productData = await executeGraphQL(ProductListDocument, {
			variables: {
				channel: params.channel,
				first: 20,
			},
			revalidate: 60,
		});
		products = productData.products?.edges.map(({ node: product }) => product) || [];
	}

	if (products.length === 0) {
		return null;
	}

	return <Homepage products={products} channel={params.channel} />;
}
