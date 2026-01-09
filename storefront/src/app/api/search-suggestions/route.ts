import { NextRequest, NextResponse } from "next/server";
import { SearchProductsDocument, ProductOrderField, OrderDirection } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q");
	const channel = searchParams.get("channel") || "default-channel";

	if (!query || query.length < 2) {
		return NextResponse.json({ products: [] });
	}

	try {
		const { products } = await executeGraphQL(SearchProductsDocument, {
			variables: {
				search: query,
				channel,
				first: 6,
				sortBy: ProductOrderField.Rating,
				sortDirection: OrderDirection.Desc,
			},
			revalidate: 30,
			withAuth: false,
		});

		const formattedProducts =
			products?.edges.map(({ node }) => ({
				id: node.id,
				name: node.name,
				slug: node.slug,
				thumbnail: node.thumbnail?.url,
				price: node.pricing?.priceRange?.start?.gross.amount,
				currency: node.pricing?.priceRange?.start?.gross.currency,
				category: node.category?.name,
			})) || [];

		return NextResponse.json({ products: formattedProducts });
	} catch (error) {
		console.error("Search suggestions error:", error);
		return NextResponse.json({ products: [] }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { query, channel } = body as { query: string; channel?: string };

		if (!query || query.length < 2) {
			return NextResponse.json({ products: [] });
		}

		const { products } = await executeGraphQL(SearchProductsDocument, {
			variables: {
				search: query,
				channel: channel || "default-channel",
				first: 6,
				sortBy: ProductOrderField.Rating,
				sortDirection: OrderDirection.Desc,
			},
			revalidate: 30,
			withAuth: false,
		});

		const formattedProducts =
			products?.edges.map(({ node }) => ({
				id: node.id,
				name: node.name,
				slug: node.slug,
				thumbnail: node.thumbnail?.url,
				price: node.pricing?.priceRange?.start?.gross.amount,
				currency: node.pricing?.priceRange?.start?.gross.currency,
				category: node.category?.name,
			})) || [];

		return NextResponse.json({ products: formattedProducts });
	} catch (error) {
		console.error("Search suggestions error:", error);
		return NextResponse.json({ products: [] }, { status: 500 });
	}
}
