import { ProductListByCollectionDocument, ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { TemuHomepage } from "@/ui/components/TemuHomepage";

export const metadata = {
	title: "TechHub Electronics - Shop Like a Billionaire | Unbeatable Deals",
	description:
		"Incredible deals on electronics. Save up to 90% on smartphones, laptops, tablets, gaming consoles. Free shipping on orders over $50. Shop now!",
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

	return <TemuHomepage products={products} channel={params.channel} />;
}
