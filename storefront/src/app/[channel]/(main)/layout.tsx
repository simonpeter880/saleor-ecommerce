import { type ReactNode } from "react";
import { TemuFooter } from "@/ui/components/TemuFooter";
import { TemuHeaderWrapper } from "@/ui/components/TemuHeaderWrapper";
import { SpinWheelTrigger } from "@/ui/components/SpinWheelTrigger";
import { PromoPopup } from "@/ui/components/PromoPopup";
import { SkipToContent } from "@/ui/components/SkipToContent";
import { PWAInstallButton } from "@/ui/components/PWAInstallButton";

export const metadata = {
	title: "TechHub Electronics - Shop Like a Billionaire | Unbeatable Deals",
	description: "Incredible deals on electronics. Save up to 90% on smartphones, laptops, tablets, gaming consoles. Free shipping on orders over $50. Shop now!",
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	const channel = (await props.params).channel;

	return (
		<>
			<SkipToContent />
			<TemuHeaderWrapper channel={channel} />
			<div className="flex min-h-[calc(100dvh-64px)] flex-col">
				<main id="main-content" className="flex-1" tabIndex={-1}>
					{props.children}
				</main>
				<TemuFooter channel={channel} />
			</div>
			<SpinWheelTrigger />
			<PromoPopup channel={channel} />
			<PWAInstallButton />
		</>
	);
}
