import { type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { PromoPopup } from "@/ui/components/PromoPopup";
import { SkipToContent } from "@/ui/components/SkipToContent";
import { PWAInstallButton } from "@/ui/components/PWAInstallButton";

export const metadata = {
	title: "TechHub Electronics - Quality Electronics at Great Prices",
	description: "Shop the latest electronics including smartphones, laptops, tablets, gaming consoles and more. Free shipping on orders over $50.",
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	const channel = (await props.params).channel;

	return (
		<>
			<SkipToContent />
			<HeaderWrapper channel={channel} />
			<div className="flex min-h-[calc(100dvh-64px)] flex-col">
				<main id="main-content" className="flex-1" tabIndex={-1}>
					{props.children}
				</main>
				<Footer channel={channel} />
			</div>
			<PWAInstallButton />
		</>
	);
}
