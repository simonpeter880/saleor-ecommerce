"use server";

import { executeGraphQL } from "@/lib/graphql";
import {
	CheckoutEmailUpdateDocument,
	CheckoutShippingAddressUpdateDocument,
	CheckoutBillingAddressUpdateDocument,
	CheckoutDeliveryMethodUpdateDocument,
	CheckoutCompleteDocument,
} from "@/gql/graphql";
import { cookies } from "next/headers";

interface AddressInput {
	firstName: string;
	lastName: string;
	streetAddress1: string;
	city: string;
	countryArea: string;
	postalCode: string;
	country: string;
	phone?: string;
}

export async function updateCheckoutEmail(checkoutId: string, email: string) {
	try {
		const { checkoutEmailUpdate } = await executeGraphQL(CheckoutEmailUpdateDocument, {
			variables: {
				checkoutId,
				email,
			},
			cache: "no-store",
		});

		if (checkoutEmailUpdate?.errors && checkoutEmailUpdate.errors.length > 0) {
			return {
				errors: checkoutEmailUpdate.errors.map((e) => e.message || "Failed to update email"),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Checkout email update error:", error);
		return { errors: ["Failed to update email"] };
	}
}

export async function updateCheckoutShippingAddress(checkoutId: string, address: AddressInput) {
	try {
		const { checkoutShippingAddressUpdate } = await executeGraphQL(
			CheckoutShippingAddressUpdateDocument,
			{
				variables: {
					checkoutId,
					shippingAddress: {
						firstName: address.firstName,
						lastName: address.lastName,
						streetAddress1: address.streetAddress1,
						city: address.city,
						countryArea: address.countryArea,
						postalCode: address.postalCode,
						country: address.country,
						phone: address.phone,
					},
				},
				cache: "no-store",
			}
		);

		if (checkoutShippingAddressUpdate?.errors && checkoutShippingAddressUpdate.errors.length > 0) {
			return {
				errors: checkoutShippingAddressUpdate.errors.map(
					(e) => e.message || "Failed to update shipping address"
				),
			};
		}

		return {
			success: true,
			availableShippingMethods: checkoutShippingAddressUpdate?.checkout?.availableShippingMethods,
		};
	} catch (error) {
		console.error("Checkout shipping address update error:", error);
		return { errors: ["Failed to update shipping address"] };
	}
}

export async function updateCheckoutBillingAddress(checkoutId: string, address: AddressInput) {
	try {
		const { checkoutBillingAddressUpdate } = await executeGraphQL(
			CheckoutBillingAddressUpdateDocument,
			{
				variables: {
					checkoutId,
					billingAddress: {
						firstName: address.firstName,
						lastName: address.lastName,
						streetAddress1: address.streetAddress1,
						city: address.city,
						countryArea: address.countryArea,
						postalCode: address.postalCode,
						country: address.country,
						phone: address.phone,
					},
				},
				cache: "no-store",
			}
		);

		if (checkoutBillingAddressUpdate?.errors && checkoutBillingAddressUpdate.errors.length > 0) {
			return {
				errors: checkoutBillingAddressUpdate.errors.map(
					(e) => e.message || "Failed to update billing address"
				),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Checkout billing address update error:", error);
		return { errors: ["Failed to update billing address"] };
	}
}

export async function selectShippingMethod(checkoutId: string, shippingMethodId: string) {
	try {
		const { checkoutDeliveryMethodUpdate } = await executeGraphQL(
			CheckoutDeliveryMethodUpdateDocument,
			{
				variables: {
					checkoutId,
					deliveryMethodId: shippingMethodId,
				},
				cache: "no-store",
			}
		);

		if (checkoutDeliveryMethodUpdate?.errors && checkoutDeliveryMethodUpdate.errors.length > 0) {
			return {
				errors: checkoutDeliveryMethodUpdate.errors.map(
					(e) => e.message || "Failed to select shipping method"
				),
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Checkout shipping method update error:", error);
		return { errors: ["Failed to select shipping method"] };
	}
}

export async function completeCheckout(checkoutId: string) {
	try {
		const { checkoutComplete } = await executeGraphQL(CheckoutCompleteDocument, {
			variables: {
				checkoutId,
			},
			cache: "no-store",
		});

		if (checkoutComplete?.errors && checkoutComplete.errors.length > 0) {
			return {
				errors: checkoutComplete.errors.map((e) => e.message || "Failed to complete checkout"),
			};
		}

		// Clear checkout cookie on successful order
		if (checkoutComplete?.order) {
			const cookieStore = await cookies();
			// Try to clear checkout cookies for common channels
			cookieStore.delete("checkoutId-channel-pln");
			cookieStore.delete("checkoutId-default-channel");
		}

		return {
			success: true,
			orderId: checkoutComplete?.order?.id,
			orderNumber: checkoutComplete?.order?.number,
			confirmationNeeded: checkoutComplete?.confirmationNeeded,
		};
	} catch (error) {
		console.error("Checkout complete error:", error);
		return { errors: ["Failed to complete checkout. Please try again."] };
	}
}
