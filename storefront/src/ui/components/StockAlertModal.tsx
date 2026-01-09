"use client";

import { useState } from "react";
import { X, Bell, Mail, CheckCircle } from "lucide-react";
import { useStockAlerts } from "@/hooks/useStockAlerts";
import { useToast } from "@/contexts/ToastContext";

interface StockAlertModalProps {
	productId: string;
	productName: string;
	productSlug: string;
	isOpen: boolean;
	onClose: () => void;
}

export function StockAlertModal({
	productId,
	productName,
	productSlug,
	isOpen,
	onClose,
}: StockAlertModalProps) {
	const { addStockAlert } = useStockAlerts(productId);
	const { success, error: showError } = useToast();
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !email.includes("@")) {
			setSubmitStatus({ type: "error", message: "Please enter a valid email address" });
			showError("Invalid Email", "Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus(null);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		const result = addStockAlert({
			productId,
			productName,
			productSlug,
			userEmail: email.trim(),
		});

		setSubmitStatus({ type: result.success ? "success" : "error", message: result.message });

		if (result.success) {
			success("Alert Set!", `We'll notify you when ${productName} is back in stock`);
			setTimeout(() => {
				onClose();
				setEmail("");
				setSubmitStatus(null);
			}, 2000);
		} else {
			showError("Alert Failed", result.message);
		}

		setIsSubmitting(false);
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div
					className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
					>
						<X size={20} />
					</button>

					{/* Header */}
					<div className="mb-6">
						<div className="mb-2 flex items-center gap-3">
							<div className="rounded-full bg-temu-100 p-2">
								<Bell className="text-temu-600" size={24} />
							</div>
							<h2 className="text-2xl font-black text-gray-900">Stock Alert</h2>
						</div>
						<p className="text-sm text-gray-600">
							Get notified when <span className="font-semibold text-gray-900">{productName}</span> is
							back in stock
						</p>
					</div>

					{/* Success/Error Message */}
					{submitStatus && (
						<div
							className={`mb-4 flex items-center gap-2 rounded-lg border p-3 ${
								submitStatus.type === "success"
									? "border-green-200 bg-green-50 text-green-700"
									: "border-red-200 bg-red-50 text-red-700"
							}`}
						>
							{submitStatus.type === "success" ? <CheckCircle size={20} /> : <X size={20} />}
							<span className="text-sm font-medium">{submitStatus.message}</span>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit}>
						<div className="mb-6">
							<label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-900">
								Email Address <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Mail
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
									placeholder="your@email.com"
									required
									disabled={isSubmitting}
								/>
							</div>
							<p className="mt-1 text-xs text-gray-500">
								We'll send you a one-time email when this item is back in stock
							</p>
						</div>

						{/* Features */}
						<div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4">
							<h4 className="text-sm font-bold text-gray-900">Why use stock alerts?</h4>
							<ul className="space-y-1.5 text-sm text-gray-600">
								<li className="flex items-start gap-2">
									<CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-green-500" />
									Be the first to know when items are restocked
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-green-500" />
									No spam - only one email per product
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-green-500" />
									Unsubscribe anytime from your account
								</li>
							</ul>
						</div>

						{/* Actions */}
						<div className="flex gap-3">
							<button
								type="submit"
								disabled={isSubmitting || !email.trim()}
								className="flex-1 rounded-full bg-temu-500 py-3 font-bold text-white transition-colors hover:bg-temu-600 disabled:cursor-not-allowed disabled:bg-gray-300"
							>
								{isSubmitting ? "Setting up alert..." : "Notify Me"}
							</button>
							<button
								type="button"
								onClick={onClose}
								className="rounded-full border border-gray-200 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
