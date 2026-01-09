import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { GamesPage } from "@/ui/components/GamesPage";

export const metadata = {
	title: "Games & Rewards - TechHub Electronics",
	description: "Play games to win amazing prizes, coupons, and rewards!",
};

export default async function Games(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<GamesPage channel={params.channel} />
		</Suspense>
	);
}
