"use client";

import { InputHTMLAttributes, useState, useEffect } from "react";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	success?: string;
	hint?: string;
	showPasswordToggle?: boolean;
	onValidate?: (value: string) => { isValid: boolean; errors: string[] };
}

export function FormInput({
	label,
	error: externalError,
	success,
	hint,
	showPasswordToggle = false,
	onValidate,
	type = "text",
	className = "",
	...props
}: FormInputProps) {
	const [internalError, setInternalError] = useState<string>("");
	const [showPassword, setShowPassword] = useState(false);
	const [isTouched, setIsTouched] = useState(false);

	const error = externalError || internalError;
	const inputType = showPasswordToggle && showPassword ? "text" : type;

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsTouched(true);

		if (onValidate && e.target.value) {
			const result = onValidate(e.target.value);
			if (!result.isValid) {
				setInternalError(result.errors[0] || "Invalid input");
			} else {
				setInternalError("");
			}
		}

		props.onBlur?.(e);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Clear error on change if user is typing
		if (isTouched && internalError) {
			setInternalError("");
		}

		props.onChange?.(e);
	};

	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					{label}
					{props.required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			<div className="relative">
				<input
					{...props}
					type={inputType}
					onBlur={handleBlur}
					onChange={handleChange}
					className={`
						w-full px-4 py-3 rounded-lg border-2 transition-all
						${error
							? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
							: success
							? "border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200"
							: "border-gray-300 focus:border-temu-500 focus:ring-2 focus:ring-temu-200"
						}
						focus:outline-none
						disabled:bg-gray-100 disabled:cursor-not-allowed
						${className}
					`}
				/>

				{/* Success/Error Icons */}
				{success && !error && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2">
						<Check size={20} className="text-green-500" />
					</div>
				)}

				{error && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2">
						<AlertCircle size={20} className="text-red-500" />
					</div>
				)}

				{/* Password Toggle */}
				{showPasswordToggle && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
					<AlertCircle size={14} />
					{error}
				</p>
			)}

			{/* Success Message */}
			{success && !error && (
				<p className="mt-2 text-sm text-green-600 flex items-center gap-1">
					<Check size={14} />
					{success}
				</p>
			)}

			{/* Hint */}
			{hint && !error && !success && (
				<p className="mt-2 text-sm text-gray-600">{hint}</p>
			)}
		</div>
	);
}
