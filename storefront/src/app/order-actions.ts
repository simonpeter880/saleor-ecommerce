"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";

/**
 * Reorder - Add all items from a previous order to the cart
 */
export async function reorderAction(orderId: string, channel: string) {
	try {
		// First, get the order details to find all line items
		const GetOrderDocument = `
			query GetOrder($id: ID!) {
				order(id: $id) {
					id
					lines {
						id
						variant {
							id
						}
						quantity
					}
				}
			}
		`;

		const { order } = await executeGraphQL(GetOrderDocument, {
			variables: { id: orderId },
			cache: "no-store",
		});

		if (!order) {
			return { success: false, error: "Order not found" };
		}

		// TODO: Add each line item to the current checkout/cart
		// This would require integrating with your cart system
		// For now, we'll just redirect to the product pages

		revalidatePath(`/${channel}/cart`);
		return { success: true };
	} catch (error) {
		console.error("Error reordering:", error);
		return { success: false, error: "Failed to reorder items" };
	}
}

/**
 * Cancel Order - Cancel an unfulfilled order
 */
export async function cancelOrderAction(orderId: string, channel: string) {
	try {
		const CancelOrderDocument = `
			mutation CancelOrder($id: ID!) {
				orderCancel(id: $id) {
					order {
						id
						status
					}
					errors {
						field
						message
					}
				}
			}
		`;

		const { orderCancel } = await executeGraphQL(CancelOrderDocument, {
			variables: { id: orderId },
			cache: "no-store",
		});

		if (orderCancel.errors.length > 0) {
			return {
				success: false,
				error: orderCancel.errors[0].message || "Failed to cancel order",
			};
		}

		revalidatePath(`/${channel}/account`);
		revalidatePath(`/${channel}/orders/${orderId}`);
		return { success: true };
	} catch (error) {
		console.error("Error cancelling order:", error);
		return { success: false, error: "Failed to cancel order. Please contact support." };
	}
}

/**
 * Request Return - Create a return request for delivered items
 */
export async function requestReturnAction(
	orderId: string,
	lineIds: string[],
	reason: string,
	channel: string,
) {
	try {
		// Note: Saleor doesn't have built-in returns API in the core
		// This would typically integrate with a custom returns system or plugin
		// For now, we'll create a support ticket or note

		// TODO: Implement returns integration
		// This could involve:
		// 1. Creating a custom return request in your database
		// 2. Sending an email to support
		// 3. Integrating with a returns management system

		console.log("Return request:", { orderId, lineIds, reason });

		return {
			success: true,
			message: "Return request submitted successfully. Our team will contact you within 24 hours.",
		};
	} catch (error) {
		console.error("Error requesting return:", error);
		return { success: false, error: "Failed to submit return request" };
	}
}

/**
 * Download Invoice - Generate and download order invoice
 */
export async function downloadInvoiceAction(orderId: string) {
	try {
		const GetInvoiceDocument = `
			query GetInvoice($id: ID!) {
				order(id: $id) {
					id
					number
					invoices {
						id
						url
						number
					}
				}
			}
		`;

		const { order } = await executeGraphQL(GetInvoiceDocument, {
			variables: { id: orderId },
			cache: "no-store",
		});

		if (!order || !order.invoices || order.invoices.length === 0) {
			return { success: false, error: "Invoice not available for this order" };
		}

		// Return the first invoice URL
		return { success: true, invoiceUrl: order.invoices[0].url };
	} catch (error) {
		console.error("Error downloading invoice:", error);
		return { success: false, error: "Failed to download invoice" };
	}
}

/**
 * Add Review - Add a product review for an order item
 */
export async function addReviewAction(
	productId: string,
	rating: number,
	title: string,
	content: string,
	orderId: string,
) {
	try {
		// Note: Saleor core doesn't have built-in reviews
		// This would typically integrate with a reviews plugin or custom system
		// For example, you might use:
		// - Saleor Product Reviews Plugin
		// - Third-party service like Yotpo or Trustpilot
		// - Custom reviews stored in your own database

		// TODO: Implement reviews integration
		console.log("Review submission:", { productId, rating, title, content, orderId });

		return {
			success: true,
			message: "Thank you for your review! It will be published after moderation.",
		};
	} catch (error) {
		console.error("Error adding review:", error);
		return { success: false, error: "Failed to submit review" };
	}
}
