"use client";

import { TemuCartPage } from "./TemuCartPage";
import { updateCartItemQuantity, removeCartItem } from "@/app/cart-actions";
import { useRouter } from "next/navigation";

export function TemuCartWrapper({
	channel,
	checkoutId,
	checkout,
}: {
	channel: string;
	checkoutId: string;
	checkout: any;
}) {
	const router = useRouter();

	const handleUpdateQuantity = async (lineId: string, quantity: number) => {
		await updateCartItemQuantity(checkoutId, lineId, quantity, channel);
		router.refresh();
	};

	const handleRemoveItem = async (lineId: string) => {
		await removeCartItem(checkoutId, lineId, channel);
		router.refresh();
	};

	return (
		<TemuCartPage
			channel={channel}
			checkoutId={checkoutId}
			lines={checkout.lines}
			totalPrice={checkout.totalPrice}
			onUpdateQuantity={handleUpdateQuantity}
			onRemoveItem={handleRemoveItem}
		/>
	);
}
