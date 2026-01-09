"use server";

import * as Checkout from "@/lib/checkout";
import { revalidatePath } from "next/cache";

export async function updateCartItemQuantity(checkoutId: string, lineId: string, quantity: number, channel: string) {
	try {
		await Checkout.updateLine(checkoutId, lineId, quantity);
		revalidatePath(`/${channel}/cart`);
		return { success: true };
	} catch (error) {
		console.error("Error updating cart item:", error);
		return { success: false, error: "Failed to update item quantity" };
	}
}

export async function removeCartItem(checkoutId: string, lineId: string, channel: string) {
	try {
		await Checkout.removeLine(checkoutId, lineId);
		revalidatePath(`/${channel}/cart`);
		return { success: true };
	} catch (error) {
		console.error("Error removing cart item:", error);
		return { success: false, error: "Failed to remove item" };
	}
}

export async function applyCouponCode(checkoutId: string, promoCode: string, channel: string) {
	try {
		// Implement coupon/voucher application
		// This would use Saleor's voucher system
		revalidatePath(`/${channel}/cart`);
		return { success: true };
	} catch (error) {
		console.error("Error applying coupon:", error);
		return { success: false, error: "Invalid coupon code" };
	}
}
