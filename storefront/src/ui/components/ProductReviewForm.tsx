"use client";

import { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface ProductReviewFormProps {
	productId: string;
	productName: string;
	onSubmit: (review: {
		productId: string;
		userId: string;
		userName: string;
		userEmail: string;
		rating: number;
		title: string;
		comment: string;
		images?: string[];
		verified: boolean;
	}) => void;
	onCancel?: () => void;
}

export function ProductReviewForm({
	productId,
	productName,
	onSubmit,
	onCancel,
}: ProductReviewFormProps) {
	const { success, error: showError } = useToast();
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		// Convert to base64 (in production, you'd upload to a CDN)
		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImages((prev) => [...prev, reader.result as string]);
			};
			reader.readAsDataURL(file);
		});
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (rating === 0) {
			showError("Rating Required", "Please select a rating");
			return;
		}

		if (!comment.trim()) {
			showError("Review Required", "Please write a review");
			return;
		}

		if (!userName.trim()) {
			showError("Name Required", "Please enter your name");
			return;
		}

		if (!userEmail.trim() || !userEmail.includes("@")) {
			showError("Invalid Email", "Please enter a valid email");
			return;
		}

		setIsSubmitting(true);

		try {
			onSubmit({
				productId,
				userId: `user_${Date.now()}`,
				userName: userName.trim(),
				userEmail: userEmail.trim(),
				rating,
				title: title.trim(),
				comment: comment.trim(),
				images: images.length > 0 ? images : undefined,
				verified: false, // In production, check if user actually purchased
			});

			success("Review Submitted!", "Thank you for your feedback");

			// Reset form
			setRating(0);
			setTitle("");
			setComment("");
			setUserName("");
			setUserEmail("");
			setImages([]);
		} catch (error) {
			showError("Submission Failed", "Please try again");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
			<h3 className="mb-6 text-xl font-black text-gray-900">Write a Review</h3>

			{/* Product Name */}
			<div className="mb-6">
				<p className="text-sm text-gray-600">
					Reviewing: <span className="font-medium text-gray-900">{productName}</span>
				</p>
			</div>

			{/* Rating */}
			<div className="mb-6">
				<label className="mb-2 block text-sm font-bold text-gray-900">
					Rating <span className="text-red-500">*</span>
				</label>
				<div className="flex items-center gap-2">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onMouseEnter={() => setHoverRating(star)}
							onMouseLeave={() => setHoverRating(0)}
							onClick={() => setRating(star)}
							className="transition-transform hover:scale-110"
						>
							<Star
								size={32}
								className={`${
									star <= (hoverRating || rating)
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-300"
								}`}
							/>
						</button>
					))}
					{rating > 0 && (
						<span className="ml-2 text-sm font-medium text-gray-700">
							{rating} {rating === 1 ? "star" : "stars"}
						</span>
					)}
				</div>
			</div>

			{/* Name */}
			<div className="mb-6">
				<label htmlFor="userName" className="mb-2 block text-sm font-bold text-gray-900">
					Your Name <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="userName"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
					placeholder="John Doe"
					required
				/>
			</div>

			{/* Email */}
			<div className="mb-6">
				<label htmlFor="userEmail" className="mb-2 block text-sm font-bold text-gray-900">
					Email <span className="text-red-500">*</span>
				</label>
				<input
					type="email"
					id="userEmail"
					value={userEmail}
					onChange={(e) => setUserEmail(e.target.value)}
					className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
					placeholder="john@example.com"
					required
				/>
				<p className="mt-1 text-xs text-gray-500">Your email will not be published</p>
			</div>

			{/* Title */}
			<div className="mb-6">
				<label htmlFor="title" className="mb-2 block text-sm font-bold text-gray-900">
					Review Title
				</label>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
					placeholder="What's most important to know?"
					maxLength={100}
				/>
			</div>

			{/* Comment */}
			<div className="mb-6">
				<label htmlFor="comment" className="mb-2 block text-sm font-bold text-gray-900">
					Your Review <span className="text-red-500">*</span>
				</label>
				<textarea
					id="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					rows={5}
					className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-temu-500 focus:outline-none focus:ring-1 focus:ring-temu-500"
					placeholder="Share your experience with this product..."
					required
				/>
				<p className="mt-1 text-xs text-gray-500">
					{comment.length} characters (minimum 50 recommended)
				</p>
			</div>

			{/* Images */}
			<div className="mb-6">
				<label className="mb-2 block text-sm font-bold text-gray-900">Add Photos (Optional)</label>

				{images.length > 0 && (
					<div className="mb-4 flex flex-wrap gap-2">
						{images.map((image, index) => (
							<div key={index} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
								<img src={image} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>
				)}

				{images.length < 5 && (
					<label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-temu-500 hover:bg-temu-50">
						<Upload size={20} className="text-gray-400" />
						<span className="text-sm font-medium text-gray-600">
							Upload photos ({images.length}/5)
						</span>
						<input
							type="file"
							accept="image/*"
							multiple
							onChange={handleImageUpload}
							className="hidden"
						/>
					</label>
				)}
			</div>

			{/* Actions */}
			<div className="flex gap-3">
				<button
					type="submit"
					disabled={isSubmitting || rating === 0 || !comment.trim()}
					className="flex-1 rounded-full bg-temu-500 py-3 font-bold text-white transition-colors hover:bg-temu-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					{isSubmitting ? "Submitting..." : "Submit Review"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="rounded-full border border-gray-200 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
