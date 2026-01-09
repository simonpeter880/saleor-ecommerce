"use server";

import { revalidatePath } from "next/cache";
import { addToWishlist, removeFromWishlist } from "./account-queries";
import { getCurrentUser } from "@/lib/auth-utils";

export async function toggleWishlistAction(productId: string, channel: string) {
	try {
		// Try to add to wishlist first
		const result = await addToWishlist(productId);

		if (result.success) {
			revalidatePath(`/${channel}/account`);
			revalidatePath(`/${channel}/products`);
			return { success: true, action: "added", message: "Added to wishlist!" };
		}

		// If add fails, it might already be in wishlist, try removing
		const removeResult = await removeFromWishlist(productId);

		if (removeResult.success) {
			revalidatePath(`/${channel}/account`);
			revalidatePath(`/${channel}/products`);
			return { success: true, action: "removed", message: "Removed from wishlist!" };
		}

		return { success: false, error: "Failed to update wishlist" };
	} catch (error) {
		console.error("Error toggling wishlist:", error);
		return { success: false, error: "An error occurred" };
	}
}

export async function addToWishlistAction(productId: string, channel: string) {
	try {
		const result = await addToWishlist(productId);

		if (result.success) {
			revalidatePath(`/${channel}/account`);
			revalidatePath(`/${channel}/products`);
			return { success: true, message: "Added to wishlist!" };
		}

		return { success: false, errors: result.errors || ["Failed to add to wishlist"] };
	} catch (error) {
		console.error("Error adding to wishlist:", error);
		return { success: false, errors: ["An error occurred"] };
	}
}

export async function removeFromWishlistAction(productId: string, channel: string) {
	try {
		const result = await removeFromWishlist(productId);

		if (result.success) {
			revalidatePath(`/${channel}/account`);
			revalidatePath(`/${channel}/products`);
			return { success: true, message: "Removed from wishlist!" };
		}

		return { success: false, errors: result.errors || ["Failed to remove from wishlist"] };
	} catch (error) {
		console.error("Error removing from wishlist:", error);
		return { success: false, errors: ["An error occurred"] };
	}
}

/**
 * Sync guest wishlist items to authenticated user's account
 * Called after login to migrate localStorage items to backend
 */
export async function syncGuestWishlistAction(guestProductIds: string[], channel: string) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { success: false, errors: ["Not authenticated"] };
		}

		if (!guestProductIds || guestProductIds.length === 0) {
			return { success: true, synced: 0 };
		}

		// Add each product to user's backend wishlist
		const results = await Promise.allSettled(
			guestProductIds.map((productId) => addToWishlist(productId))
		);

		// Count successful syncs
		const syncedCount = results.filter(
			(result) => result.status === "fulfilled" && result.value.success
		).length;

		const failedCount = results.length - syncedCount;

		// Revalidate pages to show updated wishlist
		revalidatePath(`/${channel}/account`);
		revalidatePath(`/${channel}/wishlist`);
		revalidatePath(`/${channel}/products`);

		return {
			success: true,
			synced: syncedCount,
			failed: failedCount,
			total: results.length,
		};
	} catch (error) {
		console.error("Error syncing guest wishlist:", error);
		return { success: false, errors: ["Failed to sync wishlist"] };
	}
}
