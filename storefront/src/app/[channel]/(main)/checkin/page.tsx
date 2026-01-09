import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { DailyCheckinPage } from "@/ui/components/DailyCheckinPage";

export const metadata = {
	title: "Daily Check-in - TechHub Electronics",
	description: "Check in daily to earn points, rewards, and exclusive coupons!",
};

export default async function CheckinPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<DailyCheckinPage channel={params.channel} />
		</Suspense>
	);
}
