import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { invariant } from "ts-invariant";
import { type WithContext, type Product } from "schema-dts";
import { TemuProductWrapper } from "@/ui/components/TemuProductWrapper";
import { RelatedProducts } from "@/ui/components/RelatedProducts";
import { RecentlyViewedTracker } from "@/ui/components/RecentlyViewedTracker";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutAddLineDocument, ProductDetailsDocument, ProductListDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

export async function generateMetadata(
	props: {
		params: Promise<{ slug: string; channel: string }>;
		searchParams: Promise<{ variant?: string }>;
	},
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const productNameAndVariant = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${product.name} - TechHub Electronics`,
		description: product.seoDescription || productNameAndVariant,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
		openGraph: product.thumbnail
			? {
					images: [
						{
							url: product.thumbnail.url,
							alt: product.name,
						},
					],
				}
			: null,
	};
}

export async function generateStaticParams({ params }: { params: { channel: string } }) {
	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 60,
		variables: { first: 20, channel: params.channel },
		withAuth: false,
	});

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

export default async function Page(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const variants = product.variants;
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID);

	// Select first variant if none selected
	const activeVariant = selectedVariant || variants?.[0];

	async function addToCart() {
		"use server";

		const checkout = await Checkout.findOrCreate({
			checkoutId: await Checkout.getIdFromCookies(params.channel),
			channel: params.channel,
		});
		invariant(checkout, "This should never happen");

		await Checkout.saveIdToCookie(params.channel, checkout.id);

		const variantToAdd = selectedVariantID || variants?.[0]?.id;

		if (!variantToAdd) {
			return;
		}

		// TODO: error handling
		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkout.id,
				productVariantId: decodeURIComponent(variantToAdd),
			},
			cache: "no-cache",
		});

		revalidatePath(`/${params.channel}/cart`);
	}

	// Prepare product data for the component
	const productData = {
		id: product.id,
		name: product.name,
		slug: product.slug,
		description: product.description,
		thumbnail: product.thumbnail,
		media: product.media,
		variants: product.variants,
		category: product.category,
		pricing: product.pricing,
		rating: product.rating,
		reviews: product.reviews,
	};

	const productJsonLd: WithContext<Product> = {
		"@context": "https://schema.org",
		"@type": "Product",
		image: product.thumbnail?.url,
		...(activeVariant
			? {
					name: `${product.name} - ${activeVariant.name}`,
					description: product.seoDescription || `${product.name} - ${activeVariant.name}`,
					offers: {
						"@type": "Offer",
						availability: activeVariant.quantityAvailable
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: activeVariant.pricing?.price?.gross.currency,
						price: activeVariant.pricing?.price?.gross.amount,
					},
				}
			: {
					name: product.name,
					description: product.seoDescription || product.name,
					offers: {
						"@type": "AggregateOffer",
						availability: product.variants?.some((variant) => variant.quantityAvailable)
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: product.pricing?.priceRange?.start?.gross.currency,
						lowPrice: product.pricing?.priceRange?.start?.gross.amount,
						highPrice: product.pricing?.priceRange?.stop?.gross.amount,
					},
				}),
	};

	// Build breadcrumb items
	const breadcrumbItems = [];
	if (product.category) {
		breadcrumbItems.push({
			label: product.category.name,
			href: `/${params.channel}/categories/${product.category.slug}`,
		});
	}
	breadcrumbItems.push({
		label: product.name,
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd),
				}}
			/>
			<Breadcrumb items={breadcrumbItems} channel={params.channel} />
			<TemuProductWrapper
				product={productData}
				channel={params.channel}
				selectedVariant={activeVariant}
				addToCartAction={addToCart}
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<RelatedProducts
					categorySlug={product.category?.slug}
					currentProductId={product.id}
					channel={params.channel}
				/>
			</div>
			<RecentlyViewedTracker
				product={{
					id: product.id,
					name: product.name,
					slug: product.slug,
					thumbnail: product.thumbnail,
					pricing: product.pricing,
					category: product.category,
				}}
			/>
		</>
	);
}
