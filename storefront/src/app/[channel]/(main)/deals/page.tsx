import { Metadata } from "next";
import { FlashSaleBanner } from "@/ui/components/FlashSaleBanner";
import { ProductList } from "@/ui/components/ProductList";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export const metadata: Metadata = {
	title: "Flash Deals · TechHub",
	description: "Don't miss our limited-time flash sales and special deals!",
};

export default async function DealsPage(props: {
	params: Promise<{ channel: string }>;
}) {
	const params = await props.params;

	// For now, fetch regular products - in production this would use flashSales query
	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: 12,
			channel: params.channel,
		},
		revalidate: 60,
	});

	// Mock flash sale data - in production this would come from flashSales query
	const flashSales = [
		{
			id: "1",
			title: "Lightning Deal",
			subtitle: "Up to 70% off on Electronics",
			endDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
			discountText: "Up to 70% OFF",
		},
		{
			id: "2",
			title: "Weekend Special",
			subtitle: "Extra discounts on smartphones",
			endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
			discountText: "Extra 15% OFF",
		},
	];

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="mb-8 text-3xl font-bold">Flash Deals</h1>

			{/* Flash Sale Banners */}
			<div className="mb-8 space-y-4">
				{flashSales.map((sale) => (
					<FlashSaleBanner
						key={sale.id}
						title={sale.title}
						subtitle={sale.subtitle}
						endDate={sale.endDate}
						discountText={sale.discountText}
						href="/deals"
						channel={params.channel}
						variant="full"
					/>
				))}
			</div>

			{/* Deal Products */}
			<div className="mb-6">
				<h2 className="mb-4 text-xl font-semibold">Today's Deals</h2>
				{products && (
					<ProductList
						products={products.edges.map((e) => e.node)}
						channel={params.channel}
					/>
				)}
			</div>
		</section>
	);
}
