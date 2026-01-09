import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { MiniGamesPage } from "@/ui/components/MiniGamesPage";

export const metadata = {
	title: "Mini Games - TechHub Electronics",
	description: "Play mini games to win points, coupons, and rewards!",
};

export default async function MiniGames(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<MiniGamesPage channel={params.channel} />
		</Suspense>
	);
}
