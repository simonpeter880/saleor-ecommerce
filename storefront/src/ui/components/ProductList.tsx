import { ProductElement } from "./ProductElement";
import { ProductListItem } from "./ProductListItem";
import { type ProductListItemFragment } from "@/gql/graphql";

interface ProductListProps {
	products: readonly ProductListItemFragment[];
	viewMode?: "grid" | "list";
	channel?: string;
}

export const ProductList = ({ products, viewMode = "grid", channel = "default-channel" }: ProductListProps) => {
	if (viewMode === "list") {
		return (
			<ul
				role="list"
				data-testid="ProductList"
				className="flex flex-col gap-4"
			>
				{products.map((product) => (
					<li key={product.id}>
						<ProductListItem
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								thumbnail: product.thumbnail ?? undefined,
								pricing: product.pricing ?? undefined,
								category: product.category ?? undefined,
							}}
							channel={channel}
						/>
					</li>
				))}
			</ul>
		);
	}

	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
		>
			{products.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					priority={index < 2}
					loading={index < 3 ? "eager" : "lazy"}
				/>
			))}
		</ul>
	);
};
