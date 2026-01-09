"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Check if already installed
		if (window.matchMedia("(display-mode: standalone)").matches) {
			setIsInstalled(true);
			return;
		}

		// Check if iOS
		const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
		setIsIOS(iOS);

		// Listen for the beforeinstallprompt event
		const handler = (e: Event) => {
			e.preventDefault();
			const promptEvent = e as BeforeInstallPromptEvent;
			setDeferredPrompt(promptEvent);

			// Check if user has dismissed the prompt before
			const dismissed = localStorage.getItem("pwa-install-dismissed");
			if (!dismissed) {
				// Show prompt after 30 seconds on first visit
				setTimeout(() => setShowPrompt(true), 30000);
			}
		};

		window.addEventListener("beforeinstallprompt", handler);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		await deferredPrompt.prompt();

		// Wait for the user's response
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
		}

		// Clear the deferred prompt
		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		// Remember dismissal for 7 days
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + 7);
		localStorage.setItem("pwa-install-dismissed", expiryDate.toISOString());
	};

	// Don't show if already installed
	if (isInstalled) return null;

	// iOS install instructions
	if (isIOS && showPrompt) {
		return (
			<div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:w-96">
				<div className="rounded-xl border border-orange-200 bg-white p-6 shadow-2xl dark:border-orange-800 dark:bg-gray-800">
					<div className="mb-4 flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-gradient-to-br from-[#FB7701] to-orange-600 p-2">
								<Download className="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Install TechHub App
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Add to Home Screen
								</p>
							</div>
						</div>
						<button
							onClick={handleDismiss}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							aria-label="Dismiss"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
						<p>To install this app on your iPhone/iPad:</p>
						<ol className="space-y-2 pl-4">
							<li className="flex items-start gap-2">
								<span className="font-semibold text-[#FB7701]">1.</span>
								<span>
									Tap the <strong>Share</strong> button{" "}
									<span className="inline-block text-blue-500">
										<svg className="inline h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
											<path d="M16 5l-1.42 1.42-1.59-1.59V16h-2V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z" />
										</svg>
									</span>
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="font-semibold text-[#FB7701]">2.</span>
								<span>
									Select <strong>"Add to Home Screen"</strong>
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="font-semibold text-[#FB7701]">3.</span>
								<span>Tap "Add" to confirm</span>
							</li>
						</ol>
					</div>
				</div>
			</div>
		);
	}

	// Android/Desktop install prompt
	if (!isIOS && showPrompt && deferredPrompt) {
		return (
			<div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:w-96">
				<div className="rounded-xl border border-orange-200 bg-white p-6 shadow-2xl dark:border-orange-800 dark:bg-gray-800">
					<div className="mb-4 flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-gradient-to-br from-[#FB7701] to-orange-600 p-2">
								<Download className="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Install TechHub App
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Quick access from your home screen
								</p>
							</div>
						</div>
						<button
							onClick={handleDismiss}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							aria-label="Dismiss"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<ul className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
						<li className="flex items-center gap-2">
							<span className="text-[#FB7701]">✓</span>
							<span>Faster loading times</span>
						</li>
						<li className="flex items-center gap-2">
							<span className="text-[#FB7701]">✓</span>
							<span>Works offline</span>
						</li>
						<li className="flex items-center gap-2">
							<span className="text-[#FB7701]">✓</span>
							<span>Native app experience</span>
						</li>
					</ul>

					<div className="flex gap-2">
						<button
							onClick={handleInstall}
							className="flex-1 rounded-lg bg-gradient-to-r from-[#FB7701] to-orange-600 px-4 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
						>
							Install
						</button>
						<button
							onClick={handleDismiss}
							className="rounded-lg border-2 border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Later
						</button>
					</div>
				</div>

				<style jsx>{`
					@keyframes slide-up {
						from {
							opacity: 0;
							transform: translateY(20px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					.animate-slide-up {
						animation: slide-up 0.4s ease-out;
					}
				`}</style>
			</div>
		);
	}

	return null;
}
