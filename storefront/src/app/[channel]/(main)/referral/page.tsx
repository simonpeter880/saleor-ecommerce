import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { ReferralPage } from "@/ui/components/ReferralPage";

export const metadata = {
	title: "Refer & Earn - TechHub Electronics",
	description: "Invite friends and earn rewards! Get UGX 5,000 for every successful referral.",
};

export default async function Referral(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<ReferralPage channel={params.channel} />
		</Suspense>
	);
}
