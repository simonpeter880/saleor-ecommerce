import { getUserOrders } from "@/app/account-queries";
import { TemuOrdersPage } from "@/ui/components/TemuOrdersPage";
import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { requireAuth } from "@/lib/auth-utils";

export const metadata = {
	title: "My Orders - TechHub Electronics",
	description: "View and track your orders",
};

export default async function OrdersPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Require authentication - will redirect to login if not authenticated
	await requireAuth(params.channel, "/orders");

	// Fetch all orders for the user
	const orders = await getUserOrders(params.channel);

	return (
		<Suspense fallback={<Loader />}>
			<TemuOrdersPage channel={params.channel} orders={orders} />
		</Suspense>
	);
}
