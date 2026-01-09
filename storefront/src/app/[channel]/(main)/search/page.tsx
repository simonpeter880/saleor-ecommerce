import { notFound, redirect } from "next/navigation";
import {
	OrderDirection,
	ProductOrderField,
	SearchProductsDocument,
	CategoryListDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { getPaginatedListVariables } from "@/lib/utils";
import { Search } from "lucide-react";
import { type Metadata } from "next";
import { SearchResultsClient } from "@/ui/components/SearchResultsClient";

export async function generateMetadata(props: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
	const searchParams = await props.searchParams;
	const query = Array.isArray(searchParams.query) ? searchParams.query[0] : searchParams.query;
	return {
		title: query ? `Search: ${query} - TechHub Electronics` : "Search - TechHub Electronics",
		description: `Search results for ${query || "products"} at TechHub Electronics`,
	};
}

export default async function Page(props: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const searchValue = searchParams.query;

	if (!searchValue) {
		notFound();
	}

	if (Array.isArray(searchValue)) {
		const firstValidSearchValue = searchValue.find((v) => v.length > 0);
		if (!firstValidSearchValue) {
			notFound();
		}
		redirect(`/search?${new URLSearchParams({ query: firstValidSearchValue }).toString()}`);
	}

	// Parse filter parameters
	const categoryIds = searchParams.categories
		? Array.isArray(searchParams.categories)
			? searchParams.categories
			: [searchParams.categories]
		: undefined;
	const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : undefined;
	const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : undefined;
	const minRating = searchParams.minRating ? parseInt(searchParams.minRating as string, 10) : undefined;
	const inStockOnly = searchParams.inStock === "true";

	// Parse sort parameters
	const sortParam = (searchParams.sort as string) || "relevance";
	let sortBy = ProductOrderField.Rating;
	let sortDirection = OrderDirection.Asc;

	switch (sortParam) {
		case "price-low":
			sortBy = ProductOrderField.MinimalPrice;
			sortDirection = OrderDirection.Asc;
			break;
		case "price-high":
			sortBy = ProductOrderField.MinimalPrice;
			sortDirection = OrderDirection.Desc;
			break;
		case "name-asc":
			sortBy = ProductOrderField.Name;
			sortDirection = OrderDirection.Asc;
			break;
		case "name-desc":
			sortBy = ProductOrderField.Name;
			sortDirection = OrderDirection.Desc;
			break;
		default:
			sortBy = ProductOrderField.Rating;
			sortDirection = OrderDirection.Asc;
	}

	const paginationVariables = getPaginatedListVariables({
		params: searchParams as Record<"cursor" | "direction", string>,
	});

	// Fetch products and categories in parallel
	const [productsData, categoriesData] = await Promise.all([
		executeGraphQL(SearchProductsDocument, {
			variables: {
				search: searchValue,
				channel: params.channel,
				sortBy,
				sortDirection,
				categories: categoryIds,
				minPrice,
				maxPrice,
				...paginationVariables,
			},
			revalidate: 60,
		}),
		executeGraphQL(CategoryListDocument, {
			variables: { first: 50 },
			revalidate: 300,
		}),
	]);

	const { products } = productsData;
	const categories = categoriesData.categories?.edges.map((edge) => edge.node) || [];

	if (!products) {
		notFound();
	}

	const breadcrumbItems = [{ label: `Search: "${searchValue}"` }];

	const activeFiltersCount =
		(categoryIds?.length || 0) +
		(minPrice !== undefined ? 1 : 0) +
		(maxPrice !== undefined ? 1 : 0) +
		(minRating !== undefined ? 1 : 0) +
		(inStockOnly ? 1 : 0);

	return (
		<>
			<Breadcrumb items={breadcrumbItems} channel={params.channel} />
			<div className="min-h-screen bg-gray-50">
				<section className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
					{/* Search Header */}
					<div className="mb-6">
						<h1 className="flex items-center gap-2 text-3xl font-black text-gray-900">
							<Search className="text-temu-500" size={28} />
							Search Results
						</h1>
						<p className="mt-1 text-gray-600">
							{products.totalCount} {products.totalCount === 1 ? "result" : "results"} for &quot;{searchValue}
							&quot;
							{activeFiltersCount > 0 && (
								<span className="ml-2 text-temu-600">
									({activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied)
								</span>
							)}
						</p>
					</div>

					{/* Search Results with Filters */}
					<SearchResultsClient
						products={products.edges.map(({ node }) => node)}
						totalCount={products.totalCount ?? 0}
						pageInfo={products.pageInfo}
						categories={categories}
						selectedCategories={categoryIds || []}
						minPrice={minPrice}
						maxPrice={maxPrice}
						currentSort={sortParam}
						searchQuery={searchValue}
						minRating={minRating}
						inStockOnly={inStockOnly}
						channel={params.channel}
						activeFiltersCount={activeFiltersCount}
					/>
				</section>
			</div>
		</>
	);
}
