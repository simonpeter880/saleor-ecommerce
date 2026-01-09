"use client";

import { useState } from "react";
import { X, Star, Upload, AlertCircle } from "lucide-react";
import { submitReviewAction } from "@/app/review-actions";
import { FormInput } from "./FormInput";

interface ReviewModalProps {
	productId: string;
	productName: string;
	channel: string;
	orderId?: string;
	isOpen: boolean;
	onClose: () => void;
}

export function ReviewModal({
	productId,
	productName,
	channel,
	orderId,
	isOpen,
	onClose,
}: ReviewModalProps) {
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		if (rating === 0) {
			setError("Please select a rating");
			setIsSubmitting(false);
			return;
		}

		const result = await submitReviewAction(
			{
				productId,
				rating,
				title,
				content,
				orderId,
			},
			channel
		);

		if (result.success) {
			setSuccess(true);
			setTimeout(() => {
				onClose();
				// Reset form
				setRating(0);
				setTitle("");
				setContent("");
				setSuccess(false);
			}, 2000);
		} else {
			setError(result.error || "Failed to submit review");
		}

		setIsSubmitting(false);
	};

	const handleClose = () => {
		if (!isSubmitting) {
			onClose();
			setError("");
			setSuccess(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 p-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
						<p className="mt-1 text-sm text-gray-600">{productName}</p>
					</div>
					<button
						onClick={handleClose}
						disabled={isSubmitting}
						className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
					>
						<X size={24} />
					</button>
				</div>

				{/* Success Message */}
				{success && (
					<div className="mx-6 mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-green-500 p-1">
								<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<p className="font-semibold text-green-800">
								Review submitted successfully! Thank you for your feedback.
							</p>
						</div>
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="mx-6 mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
						<div className="flex items-center gap-2">
							<AlertCircle className="text-red-500" size={20} />
							<p className="text-sm font-medium text-red-800">{error}</p>
						</div>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{/* Rating */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-3">
							Your Rating <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
									className="transition-transform hover:scale-110"
								>
									<Star
										size={40}
										className={`${
											star <= (hoverRating || rating)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										} transition-colors`}
									/>
								</button>
							))}
						</div>
						{rating > 0 && (
							<p className="mt-2 text-sm text-gray-600">
								{rating === 1 && "Poor"}
								{rating === 2 && "Fair"}
								{rating === 3 && "Good"}
								{rating === 4 && "Very Good"}
								{rating === 5 && "Excellent"}
							</p>
						)}
					</div>

					{/* Title */}
					<div>
						<FormInput
							label="Review Title"
							name="title"
							type="text"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Sum up your experience in one line"
							onValidate={(value) => {
								if (value.length < 3) {
									return { isValid: false, errors: ["Title must be at least 3 characters"] };
								}
								return { isValid: true, errors: [] };
							}}
							hint="What's most important to know?"
						/>
					</div>

					{/* Content */}
					<div>
						<label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
							Your Review <span className="text-red-500">*</span>
						</label>
						<textarea
							id="content"
							name="content"
							required
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={6}
							className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-temu-500 focus:ring-2 focus:ring-temu-200 focus:outline-none transition-all resize-none"
							placeholder="Tell us about your experience with this product. What did you like or dislike? How does it compare to similar products?"
						/>
						<p className="mt-2 text-sm text-gray-600">
							Minimum 10 characters ({content.length}/10)
						</p>
					</div>

					{/* Verified Purchase Badge */}
					{orderId && (
						<div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
							<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="text-sm font-semibold text-green-700">
								Verified Purchase - You bought this product
							</span>
						</div>
					)}

					{/* Guidelines */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h4 className="text-sm font-semibold text-blue-900 mb-2">Review Guidelines</h4>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• Be honest and specific about your experience</li>
							<li>• Focus on the product features and quality</li>
							<li>• Avoid profanity and personal information</li>
							<li>• Reviews are moderated and may take 24-48 hours to appear</li>
						</ul>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button
							type="submit"
							disabled={isSubmitting || success}
							className="flex-1 bg-gradient-to-r from-temu-500 to-temu-600 text-white font-bold py-3 px-6 rounded-lg hover:from-temu-600 hover:to-temu-700 focus:outline-none focus:ring-2 focus:ring-temu-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
									</svg>
									Submitting...
								</span>
							) : success ? (
								"Review Submitted!"
							) : (
								"Submit Review"
							)}
						</button>
						<button
							type="button"
							onClick={handleClose}
							disabled={isSubmitting}
							className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
