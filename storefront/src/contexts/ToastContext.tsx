"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
	success: (title: string, message?: string) => void;
	error: (title: string, message?: string) => void;
	info: (title: string, message?: string) => void;
	warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const addToast = useCallback(
		(toast: Omit<Toast, "id">) => {
			const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
			const newToast = { ...toast, id };

			setToasts((prev) => [...prev, newToast]);

			// Auto remove after duration
			const duration = toast.duration || 5000;
			setTimeout(() => {
				removeToast(id);
			}, duration);
		},
		[removeToast]
	);

	const success = useCallback(
		(title: string, message?: string) => {
			addToast({ type: "success", title, message });
		},
		[addToast]
	);

	const error = useCallback(
		(title: string, message?: string) => {
			addToast({ type: "error", title, message, duration: 7000 });
		},
		[addToast]
	);

	const info = useCallback(
		(title: string, message?: string) => {
			addToast({ type: "info", title, message });
		},
		[addToast]
	);

	const warning = useCallback(
		(title: string, message?: string) => {
			addToast({ type: "warning", title, message, duration: 6000 });
		},
		[addToast]
	);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
}

// Individual Toast Item
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
	const config = {
		success: {
			icon: CheckCircle,
			bgColor: "bg-green-50 dark:bg-green-900/20",
			borderColor: "border-green-200 dark:border-green-800",
			iconColor: "text-green-600 dark:text-green-400",
			textColor: "text-green-900 dark:text-green-100",
		},
		error: {
			icon: AlertCircle,
			bgColor: "bg-red-50 dark:bg-red-900/20",
			borderColor: "border-red-200 dark:border-red-800",
			iconColor: "text-red-600 dark:text-red-400",
			textColor: "text-red-900 dark:text-red-100",
		},
		warning: {
			icon: AlertTriangle,
			bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
			borderColor: "border-yellow-200 dark:border-yellow-800",
			iconColor: "text-yellow-600 dark:text-yellow-400",
			textColor: "text-yellow-900 dark:text-yellow-100",
		},
		info: {
			icon: Info,
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
			borderColor: "border-blue-200 dark:border-blue-800",
			iconColor: "text-blue-600 dark:text-blue-400",
			textColor: "text-blue-900 dark:text-blue-100",
		},
	};

	const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[toast.type];

	return (
		<div
			className={`pointer-events-auto flex items-start gap-3 rounded-lg border ${borderColor} ${bgColor} p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right max-w-md`}
		>
			<Icon className={`${iconColor} flex-shrink-0`} size={20} />
			<div className="flex-1">
				<h4 className={`font-bold ${textColor}`}>{toast.title}</h4>
				{toast.message && <p className={`text-sm ${textColor} opacity-90 mt-1`}>{toast.message}</p>}
			</div>
			<button
				onClick={() => onRemove(toast.id)}
				className={`${textColor} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
			>
				<X size={18} />
			</button>
		</div>
	);
}
