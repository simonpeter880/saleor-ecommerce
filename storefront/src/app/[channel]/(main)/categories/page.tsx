import { executeGraphQL } from "@/lib/graphql";
import { CategoryListDocument } from "@/gql/graphql";
import Link from "next/link";

export const metadata = {
	title: "Categories - TechHub Electronics",
	description: "Browse products by category",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	const { categories } = await executeGraphQL(CategoryListDocument, {
		variables: {
			first: 100,
		},
		revalidate: 60,
	});

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="mb-8 text-3xl font-bold">Categories</h1>

			{!categories?.edges || categories.edges.length === 0 ? (
				<div className="py-16 text-center">
					<p className="text-lg text-gray-600">No categories available yet.</p>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{categories.edges.map(({ node: category }) => (
						<Link
							key={category.id}
							href={`/${params.channel}/categories/${category.slug}`}
							className="group rounded-lg border p-6 transition-all hover:border-blue-500 hover:shadow-lg"
						>
							<h2 className="mb-2 text-xl font-semibold group-hover:text-blue-600">
								{category.name}
							</h2>
							{category.description && (
								<p className="text-sm text-gray-600">{category.description}</p>
							)}
						</Link>
					))}
				</div>
			)}
		</section>
	);
}
