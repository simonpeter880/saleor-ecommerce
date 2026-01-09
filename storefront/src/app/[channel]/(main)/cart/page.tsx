import * as Checkout from "@/lib/checkout";
import { TemuEmptyCart } from "@/ui/components/TemuCartPage";
import { TemuCartWrapper } from "@/ui/components/TemuCartWrapper";

export const metadata = {
	title: "Shopping Cart - TechHub Electronics",
	description: "Review your items and proceed to checkout",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);

	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return <TemuEmptyCart channel={params.channel} />;
	}

	return <TemuCartWrapper channel={params.channel} checkoutId={checkoutId} checkout={checkout} />;
}
