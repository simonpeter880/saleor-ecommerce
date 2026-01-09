import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductSortFilter } from "@/ui/components/ProductSortFilter";
import { Breadcrumb } from "@/ui/components/Breadcrumb";

export const generateMetadata = async (
	props: { params: Promise<{ slug: string; channel: string }> },
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const params = await props.params;
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	return {
		title: `${category?.name || "Category"} | ${category?.seoTitle || (await parent).title?.absolute}`,
		description: category?.seoDescription || category?.description || category?.seoTitle || category?.name,
	};
};

export default async function Page(props: { params: Promise<{ slug: string; channel: string }> }) {
	const params = await props.params;
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	if (!category || !category.products) {
		notFound();
	}

	const { name, products } = category;

	const breadcrumbItems = [
		{ label: "Categories", href: `/${params.channel}/categories` },
		{ label: name },
	];

	return (
		<>
			<Breadcrumb items={breadcrumbItems} channel={params.channel} />
			<div className="bg-gray-50 min-h-screen">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
					{/* Category Header */}
					<div className="mb-6">
						<h1 className="text-3xl font-black text-gray-900">{name}</h1>
						<p className="text-gray-600 mt-1">
							{products.edges.length} {products.edges.length === 1 ? "product" : "products"} available
						</p>
					</div>

					{/* Products with Sort & Filter */}
					<ProductSortFilter
						products={products.edges.map((e) => e.node)}
						channel={params.channel}
					/>
				</div>
			</div>
		</>
	);
}
