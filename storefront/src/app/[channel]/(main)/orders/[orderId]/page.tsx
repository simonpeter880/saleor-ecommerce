import { getServerAuthClient } from "@/app/config";
import { getOrderDetails } from "@/app/account-queries";
import { TemuOrderDetailsPage } from "@/ui/components/TemuOrderDetailsPage";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";

export async function generateMetadata(props: { params: Promise<{ orderId: string }> }) {
	const params = await props.params;
	return {
		title: `Order #${params.orderId} - TechHub Electronics`,
		description: "View your order details and tracking information",
	};
}

export default async function OrderDetailsPage(props: {
	params: Promise<{ channel: string; orderId: string }>;
}) {
	const params = await props.params;

	const authClient = await getServerAuthClient();
	const { user } = await authClient.fetchAuth();

	if (!user) {
		redirect(`/${params.channel}/login?redirect=/orders/${params.orderId}`);
	}

	// Fetch order details
	const order = await getOrderDetails(params.orderId);

	return (
		<Suspense fallback={<Loader />}>
			<TemuOrderDetailsPage channel={params.channel} order={order} />
		</Suspense>
	);
}
