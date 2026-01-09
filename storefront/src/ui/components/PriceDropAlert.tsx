"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, TrendingDown, X, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PriceAlert {
	productId: string;
	productName: string;
	originalPrice: number;
	currentPrice: number;
	targetPrice?: number;
	image?: string;
	createdAt: string;
	notified: boolean;
}

interface PriceDropNotification {
	id: string;
	productId: string;
	productName: string;
	oldPrice: number;
	newPrice: number;
	percentDrop: number;
	timestamp: string;
	read: boolean;
}

// Hook for managing price alerts
export function usePriceAlerts() {
	const [alerts, setAlerts] = useState<PriceAlert[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem("priceAlerts");
		if (stored) {
			setAlerts(JSON.parse(stored));
		}
	}, []);

	const addAlert = (productId: string, productName: string, currentPrice: number, targetPrice?: number) => {
		const newAlert: PriceAlert = {
			productId,
			productName,
			originalPrice: currentPrice,
			currentPrice,
			targetPrice,
			createdAt: new Date().toISOString(),
			notified: false,
		};

		const updated = [...alerts.filter(a => a.productId !== productId), newAlert];
		setAlerts(updated);
		localStorage.setItem("priceAlerts", JSON.stringify(updated));
	};

	const removeAlert = (productId: string) => {
		const updated = alerts.filter(a => a.productId !== productId);
		setAlerts(updated);
		localStorage.setItem("priceAlerts", JSON.stringify(updated));
	};

	const hasAlert = (productId: string) => {
		return alerts.some(a => a.productId === productId);
	};

	return { alerts, addAlert, removeAlert, hasAlert };
}

// Button component to add/remove price alert
interface PriceAlertButtonProps {
	productId: string;
	productName: string;
	currentPrice: number;
	variant?: "icon" | "button";
}

export function PriceAlertButton({
	productId,
	productName,
	currentPrice,
	variant = "button"
}: PriceAlertButtonProps) {
	const { addAlert, removeAlert, hasAlert } = usePriceAlerts();
	const [isActive, setIsActive] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	useEffect(() => {
		setIsActive(hasAlert(productId));
	}, [productId, hasAlert]);

	const toggleAlert = () => {
		if (isActive) {
			removeAlert(productId);
			setIsActive(false);
		} else {
			addAlert(productId, productName, currentPrice);
			setIsActive(true);
			setShowConfirm(true);
			setTimeout(() => setShowConfirm(false), 2000);
		}
	};

	if (variant === "icon") {
		return (
			<button
				onClick={toggleAlert}
				className={`p-2 rounded-full transition-colors ${
					isActive
						? "bg-orange-100 text-orange-600"
						: "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
				}`}
				title={isActive ? "Remove price alert" : "Get price drop alerts"}
			>
				{isActive ? <Bell size={20} className="fill-current" /> : <Bell size={20} />}
			</button>
		);
	}

	return (
		<div className="relative">
			<button
				onClick={toggleAlert}
				className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
					isActive
						? "bg-orange-100 text-orange-600 hover:bg-orange-200"
						: "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
				}`}
			>
				{isActive ? (
					<>
						<Bell size={18} className="fill-current" />
						<span className="text-sm font-medium">Alert Active</span>
					</>
				) : (
					<>
						<Bell size={18} />
						<span className="text-sm font-medium">Price Drop Alert</span>
					</>
				)}
			</button>

			{showConfirm && (
				<div className="absolute left-0 top-full mt-2 bg-green-600 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
					<div className="flex items-center gap-2">
						<Check size={16} />
						<span>We'll notify you when the price drops!</span>
					</div>
				</div>
			)}
		</div>
	);
}

// Notification bell with dropdown
export function PriceDropNotifications({ channel }: { channel: string }) {
	const [notifications, setNotifications] = useState<PriceDropNotification[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		// Load notifications
		const stored = localStorage.getItem("priceDropNotifications");
		if (stored) {
			const notifs = JSON.parse(stored);
			setNotifications(notifs);
			setUnreadCount(notifs.filter((n: PriceDropNotification) => !n.read).length);
		}

		// Simulate a price drop notification (for demo)
		const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]");
		if (alerts.length > 0 && Math.random() > 0.7) {
			const alert = alerts[0];
			const drop = Math.floor(Math.random() * 20) + 5; // 5-25% drop
			const newPrice = Math.floor(alert.currentPrice * (1 - drop / 100));

			const newNotif: PriceDropNotification = {
				id: Date.now().toString(),
				productId: alert.productId,
				productName: alert.productName,
				oldPrice: alert.currentPrice,
				newPrice,
				percentDrop: drop,
				timestamp: new Date().toISOString(),
				read: false,
			};

			const existing = JSON.parse(localStorage.getItem("priceDropNotifications") || "[]");
			if (!existing.some((n: PriceDropNotification) => n.productId === newNotif.productId)) {
				const updated = [newNotif, ...existing].slice(0, 10);
				localStorage.setItem("priceDropNotifications", JSON.stringify(updated));
				setNotifications(updated);
				setUnreadCount(prev => prev + 1);
			}
		}
	}, []);

	const markAllRead = () => {
		const updated = notifications.map(n => ({ ...n, read: true }));
		setNotifications(updated);
		setUnreadCount(0);
		localStorage.setItem("priceDropNotifications", JSON.stringify(updated));
	};

	const clearAll = () => {
		setNotifications([]);
		setUnreadCount(0);
		localStorage.removeItem("priceDropNotifications");
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<button
				onClick={() => {
					setIsOpen(!isOpen);
					if (!isOpen) markAllRead();
				}}
				className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
			>
				<Bell size={22} className="text-gray-600" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
						{unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border w-80 max-h-96 overflow-hidden">
						{/* Header */}
						<div className="p-4 border-b flex items-center justify-between bg-gray-50">
							<h3 className="font-bold text-gray-800">Price Drops</h3>
							{notifications.length > 0 && (
								<button
									onClick={clearAll}
									className="text-xs text-gray-500 hover:text-red-500"
								>
									Clear all
								</button>
							)}
						</div>

						{/* Notifications */}
						<div className="max-h-72 overflow-y-auto">
							{notifications.length === 0 ? (
								<div className="p-8 text-center">
									<BellOff className="mx-auto text-gray-300 mb-3" size={40} />
									<p className="text-gray-500 text-sm">No price drops yet</p>
									<p className="text-gray-400 text-xs mt-1">
										Add items to your wishlist to track prices
									</p>
								</div>
							) : (
								notifications.map((notif) => (
									<Link
										key={notif.id}
										href={`/${channel}/products/${notif.productId}`}
										onClick={() => setIsOpen(false)}
										className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b last:border-0 transition-colors"
									>
										<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
											<TrendingDown className="text-green-600" size={20} />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-800 line-clamp-1">
												{notif.productName}
											</p>
											<div className="flex items-center gap-2 text-xs">
												<span className="text-gray-400 line-through">
													UGX {notif.oldPrice.toLocaleString()}
												</span>
												<span className="text-green-600 font-bold">
													UGX {notif.newPrice.toLocaleString()}
												</span>
												<span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
													-{notif.percentDrop}%
												</span>
											</div>
										</div>
										<ArrowRight size={16} className="text-gray-400" />
									</Link>
								))
							)}
						</div>

						{/* Footer */}
						{notifications.length > 0 && (
							<div className="p-3 border-t bg-gray-50">
								<Link
									href={`/${channel}/wishlist`}
									onClick={() => setIsOpen(false)}
									className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
								>
									View all tracked items
									<ArrowRight size={14} />
								</Link>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
