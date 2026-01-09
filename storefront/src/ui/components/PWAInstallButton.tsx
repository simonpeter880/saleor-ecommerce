"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Simple install button for testing
 * Shows immediately when install is available
 */
export function PWAInstallButton() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Check if already installed
		if (window.matchMedia("(display-mode: standalone)").matches) {
			setIsInstalled(true);
			return;
		}

		// Listen for the beforeinstallprompt event
		const handler = (e: Event) => {
			e.preventDefault();
			const promptEvent = e as BeforeInstallPromptEvent;
			setDeferredPrompt(promptEvent);
			console.log("✅ PWA install prompt is available!");
		};

		window.addEventListener("beforeinstallprompt", handler);

		// Log for debugging
		console.log("🔍 Listening for PWA install prompt...");
		console.log("📱 Device:", /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "Mobile" : "Desktop");
		console.log("🌐 Browser:", navigator.userAgent);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) {
			console.log("❌ No install prompt available");
			return;
		}

		console.log("⏳ Showing install prompt...");
		await deferredPrompt.prompt();

		const { outcome } = await deferredPrompt.userChoice;
		console.log(outcome === "accepted" ? "✅ User accepted install" : "❌ User dismissed install");

		setDeferredPrompt(null);
	};

	// Don't show if already installed
	if (isInstalled) {
		return (
			<div className="fixed bottom-4 right-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
				✅ App Installed
			</div>
		);
	}

	// Don't show if no prompt available
	if (!deferredPrompt) {
		return null;
	}

	return (
		<button
			onClick={handleInstall}
			className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FB7701] to-orange-600 px-6 py-3 font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 animate-bounce"
			title="Install TechHub App"
		>
			<Download className="h-5 w-5" />
			Install App
		</button>
	);
}
