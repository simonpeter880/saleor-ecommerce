import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata, type Viewport } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { LoadingBar } from "@/ui/components/LoadingBar";
import { PageTransition } from "@/ui/components/PageTransition";
import { GoogleAnalytics } from "@/ui/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "TechHub Electronics - Your Premier Electronics Store",
	description: "Shop the latest smartphones, laptops, tablets, gaming consoles, smart home devices, and electronics accessories at competitive prices.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "TechHub",
	},
	applicationName: "TechHub Electronics",
	icons: {
		icon: [
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico", sizes: "any" },
		],
		apple: [
			{ url: "/icon.svg", type: "image/svg+xml" },
		],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: "#FB7701",
	viewportFit: "cover",
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="en" className="min-h-dvh" suppressHydrationWarning>
			<head>
				<GoogleAnalytics />
			</head>
			<body className={`${inter.className} min-h-dvh bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
				<ThemeProvider>
					<ToastProvider>
						<CartProvider>
							<WishlistProvider>
								<RecentlyViewedProvider>
									<Suspense>
										<LoadingBar />
									</Suspense>
									<PageTransition>{children}</PageTransition>
									<Suspense>
										<DraftModeNotification />
									</Suspense>
								</RecentlyViewedProvider>
							</WishlistProvider>
						</CartProvider>
					</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
