import { notFound } from "next/navigation";
import { ProductListPaginatedDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductFilters } from "@/ui/components/ProductFilters";
import { ProductsPageClient } from "@/ui/components/ProductsPageClient";
import { getPaginatedListVariables } from "@/lib/utils";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

const getSortVariables = (sortParam?: string | string[]) => {
	const sortValue = Array.isArray(sortParam) ? sortParam[0] : sortParam;

	switch (sortValue) {
		case "price-asc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc };
		case "price-desc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc };
		default:
			return { field: ProductOrderField.Name, direction: OrderDirection.Asc };
	}
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string | string[];
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortVariables = getSortVariables(searchParams.sort);

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy: sortVariables,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<div className="flex gap-8">
				<div className="hidden w-64 flex-shrink-0 lg:block">
					<ProductFilters />
				</div>
				<div className="flex-1">
					<div className="mb-4 lg:hidden">
						<ProductFilters />
					</div>
					<h2 className="sr-only">Product list</h2>
					<ProductsPageClient
						products={products.edges.map((e) => e.node)}
						channel={params.channel}
					/>
					<Pagination pageInfo={products.pageInfo} />
				</div>
			</div>
		</section>
	);
}
