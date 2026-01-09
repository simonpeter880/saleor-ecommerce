"use client";

import { useState } from "react";
import { Package, AlertCircle, Clock, Bell } from "lucide-react";
import { StockAlertModal } from "./StockAlertModal";

interface StockIndicatorProps {
	productId: string;
	productName: string;
	productSlug: string;
	isAvailable?: boolean | null;
	quantityAvailable?: number | null;
	variant?: string;
}

export function StockIndicator({
	productId,
	productName,
	productSlug,
	isAvailable = true,
	quantityAvailable,
	variant,
}: StockIndicatorProps) {
	const [showAlertModal, setShowAlertModal] = useState(false);

	const getStockStatus = () => {
		if (!isAvailable || quantityAvailable === 0) {
			return {
				status: "out-of-stock",
				label: "Out of Stock",
				color: "text-red-600",
				bgColor: "bg-red-50",
				borderColor: "border-red-200",
				icon: AlertCircle,
				showAlert: true,
			};
		}

		if (quantityAvailable === null || quantityAvailable === undefined) {
			return {
				status: "in-stock",
				label: "In Stock",
				color: "text-green-600",
				bgColor: "bg-green-50",
				borderColor: "border-green-200",
				icon: Package,
				showAlert: false,
			};
		}

		if (quantityAvailable <= 3) {
			return {
				status: "low-stock",
				label: `Only ${quantityAvailable} left!`,
				color: "text-orange-600",
				bgColor: "bg-orange-50",
				borderColor: "border-orange-200",
				icon: AlertCircle,
				showAlert: false,
				urgent: true,
			};
		}

		if (quantityAvailable <= 10) {
			return {
				status: "limited",
				label: `${quantityAvailable} in stock`,
				color: "text-yellow-600",
				bgColor: "bg-yellow-50",
				borderColor: "border-yellow-200",
				icon: Package,
				showAlert: false,
			};
		}

		return {
			status: "in-stock",
			label: "In Stock",
			color: "text-green-600",
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
			icon: Package,
			showAlert: false,
		};
	};

	const stockInfo = getStockStatus();
	const Icon = stockInfo.icon;

	return (
		<>
			<div
				className={`flex items-center justify-between rounded-lg border p-3 ${stockInfo.bgColor} ${stockInfo.borderColor}`}
			>
				<div className="flex items-center gap-2">
					<Icon className={stockInfo.color} size={20} />
					<div>
						<p className={`font-bold ${stockInfo.color}`}>{stockInfo.label}</p>
						{stockInfo.urgent && (
							<p className="text-xs text-orange-600">Order soon before it's gone!</p>
						)}
						{stockInfo.showAlert && (
							<p className="text-xs text-gray-600">Expected back in stock soon</p>
						)}
					</div>
				</div>

				{stockInfo.showAlert && (
					<button
						onClick={() => setShowAlertModal(true)}
						className="flex items-center gap-1 rounded-full bg-temu-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-temu-600"
					>
						<Bell size={16} />
						Notify Me
					</button>
				)}
			</div>

			{/* Estimated Delivery */}
			{!stockInfo.showAlert && (
				<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
					<Clock size={16} />
					<span>
						{stockInfo.urgent
							? "Order within 2 hours for delivery by tomorrow"
							: "Free delivery within 3-5 business days"}
					</span>
				</div>
			)}

			{/* Stock Alert Modal */}
			<StockAlertModal
				productId={productId}
				productName={`${productName}${variant ? ` - ${variant}` : ""}`}
				productSlug={productSlug}
				isOpen={showAlertModal}
				onClose={() => setShowAlertModal(false)}
			/>
		</>
	);
}
