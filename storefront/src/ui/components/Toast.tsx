"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
	message: string;
	type?: ToastType;
	duration?: number;
	onClose?: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onClose?.(), 300);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => onClose?.(), 300);
	};

	const icons = {
		success: <CheckCircle size={20} />,
		error: <XCircle size={20} />,
		warning: <AlertCircle size={20} />,
		info: <Info size={20} />,
	};

	const styles = {
		success: "bg-green-50 border-green-200 text-green-800",
		error: "bg-red-50 border-red-200 text-red-800",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
		info: "bg-blue-50 border-blue-200 text-blue-800",
	};

	return (
		<div
			className={`fixed top-20 right-4 z-50 flex items-center gap-3 rounded-lg border-2 px-4 py-3 shadow-lg transition-all duration-300 ${
				styles[type]
			} ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
		>
			{icons[type]}
			<span className="font-semibold">{message}</span>
			<button
				onClick={handleClose}
				className="ml-2 hover:opacity-70 transition-opacity"
			>
				<X size={18} />
			</button>
		</div>
	);
}

// Toast Provider/Manager
interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
}

export function useToast() {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = (message: string, type: ToastType = "info") => {
		const id = Math.random().toString(36).substr(2, 9);
		setToasts((prev) => [...prev, { id, message, type }]);
	};

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	return {
		toasts,
		showToast,
		removeToast,
		success: (message: string) => showToast(message, "success"),
		error: (message: string) => showToast(message, "error"),
		warning: (message: string) => showToast(message, "warning"),
		info: (message: string) => showToast(message, "info"),
	};
}
