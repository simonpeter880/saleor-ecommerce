import { redirect } from "next/navigation";
import * as Checkout from "@/lib/checkout";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { TemuCheckoutPage } from "@/ui/components/TemuCheckoutPage";

export const metadata = {
	title: "Checkout - TechHub Electronics",
	description: "Complete your purchase securely",
};

export default async function CheckoutPage(props: {
	params: Promise<{ channel: string; checkoutId: string }>;
}) {
	const params = await props.params;
	const { channel, checkoutId } = params;

	// Find the checkout
	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		redirect(`/${channel}/cart`);
	}

	// Get current user if authenticated
	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, {
			cache: "no-store",
		});
		user = me;
	} catch {
		// User not logged in
	}

	return (
		<TemuCheckoutPage
			channel={channel}
			checkoutId={checkoutId}
			checkout={checkout}
			user={user}
		/>
	);
}
