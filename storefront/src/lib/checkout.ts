import { cookies } from "next/headers";
import { CheckoutCreateDocument, CheckoutFindDocument, CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function getIdFromCookies(channel: string) {
	const cookieName = `checkoutId-${channel}`;
	const checkoutId = (await cookies()).get(cookieName)?.value || "";
	return checkoutId;
}

export async function saveIdToCookie(channel: string, checkoutId: string) {
	const shouldUseHttps = process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https");
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function find(checkoutId: string) {
	try {
		const { checkout } = checkoutId
			? await executeGraphQL(CheckoutFindDocument, {
					variables: {
						id: checkoutId,
					},
					cache: "no-cache",
				})
			: { checkout: null };

		return checkout;
	} catch {
		// we ignore invalid ID or checkout not found
	}
}

export async function findOrCreate({ channel, checkoutId }: { checkoutId?: string; channel: string }) {
	if (!checkoutId) {
		return (await create({ channel })).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create({ channel })).checkoutCreate?.checkout;
}

export const create = ({ channel }: { channel: string }) =>
	executeGraphQL(CheckoutCreateDocument, { cache: "no-cache", variables: { channel } });

export async function updateLine(checkoutId: string, lineId: string, quantity: number) {
	return executeGraphQL(CheckoutLinesUpdateDocument, {
		cache: "no-cache",
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
	});
}

export async function removeLine(checkoutId: string, lineId: string) {
	return executeGraphQL(CheckoutDeleteLinesDocument, {
		cache: "no-cache",
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
	});
}
