"use client";

import { useState, useEffect, useCallback } from "react";

export interface StockAlert {
	id: string;
	productId: string;
	productName: string;
	productSlug: string;
	userEmail: string;
	createdAt: number;
	notified: boolean;
}

const STORAGE_KEY = "techhub_stock_alerts";

function getAllAlerts(): StockAlert[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error("Failed to load stock alerts:", error);
		return [];
	}
}

function saveAlerts(alerts: StockAlert[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
	} catch (error) {
		console.error("Failed to save stock alerts:", error);
	}
}

export function useStockAlerts(productId?: string) {
	const [alerts, setAlerts] = useState<StockAlert[]>([]);
	const [userAlerts, setUserAlerts] = useState<StockAlert[]>([]);

	// Load alerts
	useEffect(() => {
		const allAlerts = getAllAlerts();

		if (productId) {
			const productAlerts = allAlerts.filter((a) => a.productId === productId);
			setAlerts(productAlerts);
		} else {
			setUserAlerts(allAlerts);
		}
	}, [productId]);

	// Add a new stock alert
	const addStockAlert = useCallback(
		(alert: Omit<StockAlert, "id" | "createdAt" | "notified">) => {
			const allAlerts = getAllAlerts();

			// Check if alert already exists for this product and email
			const existing = allAlerts.find(
				(a) => a.productId === alert.productId && a.userEmail === alert.userEmail
			);

			if (existing) {
				return { success: false, message: "You already have an alert for this product" };
			}

			const newAlert: StockAlert = {
				...alert,
				id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				createdAt: Date.now(),
				notified: false,
			};

			allAlerts.push(newAlert);
			saveAlerts(allAlerts);

			if (productId) {
				setAlerts((prev) => [...prev, newAlert]);
			} else {
				setUserAlerts((prev) => [...prev, newAlert]);
			}

			return { success: true, message: "Alert created! We'll notify you when back in stock." };
		},
		[productId]
	);

	// Remove an alert
	const removeStockAlert = useCallback(
		(alertId: string) => {
			const allAlerts = getAllAlerts();
			const updated = allAlerts.filter((a) => a.id !== alertId);
			saveAlerts(updated);

			if (productId) {
				setAlerts((prev) => prev.filter((a) => a.id !== alertId));
			} else {
				setUserAlerts((prev) => prev.filter((a) => a.id !== alertId));
			}
		},
		[productId]
	);

	// Check if user has alert for product
	const hasAlert = useCallback(
		(email: string) => {
			if (!productId) return false;
			const allAlerts = getAllAlerts();
			return allAlerts.some((a) => a.productId === productId && a.userEmail === email);
		},
		[productId]
	);

	// Get all alerts for a user email
	const getUserAlerts = useCallback((email: string) => {
		const allAlerts = getAllAlerts();
		return allAlerts.filter((a) => a.userEmail === email && !a.notified);
	}, []);

	return {
		alerts: productId ? alerts : userAlerts,
		addStockAlert,
		removeStockAlert,
		hasAlert,
		getUserAlerts,
	};
}
