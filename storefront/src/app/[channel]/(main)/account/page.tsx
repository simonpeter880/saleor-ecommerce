import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { AccountPage } from "@/components/account/AccountPage";
import { getUserOrders, getUserWishlist } from "@/app/account-queries";
import { requireAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";
export const revalidate = 30; // Revalidate every 30 seconds instead of every request

export const metadata = {
	title: "My Account - TechHub Electronics",
	description: "Manage your TechHub Electronics account, orders, and settings",
};

export default async function AccountPageRoute(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Require authentication - will redirect to login if not authenticated
	const user = await requireAuth(params.channel, "/account");

	// Fetch only essential data with error handling for faster load
	const [orders, wishlist] = await Promise.all([
		getUserOrders(params.channel).catch(() => []),
		getUserWishlist().catch(() => []),
	]);

	// Format addresses data from the user query
	const addressData = {
		addresses: user.addresses || [],
		defaultShipping: user.defaultShippingAddress?.id || null,
		defaultBilling: user.defaultBillingAddress?.id || null,
	};

	const userData = {
		email: user.email,
		firstName: user.firstName || "",
		lastName: user.lastName || "",
		isEmailVerified: user.isConfirmed || false,
	};

	return (
		<Suspense fallback={<Loader />}>
			<AccountPage
				channel={params.channel}
				user={userData}
				orders={orders}
				wishlist={wishlist}
				addresses={addressData}
			/>
		</Suspense>
	);
}
