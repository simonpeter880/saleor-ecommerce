"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ShippingInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	region: string;
	postalCode: string;
}

interface MTNMoMoInfo {
	phoneNumber: string;
	network: "mtn" | "airtel" | "vodafone";
}

export default function CheckoutPage() {
	const router = useRouter();
	const { items, getTotalPrice, clearCart } = useCart();
	const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Review
	const [loading, setLoading] = useState(false);

	const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		region: "",
		postalCode: "",
	});

	const [momoInfo, setMomoInfo] = useState<MTNMoMoInfo>({
		phoneNumber: "",
		network: "mtn",
	});

	// Redirect if cart is empty
	if (items.length === 0) {
		router.push("/cart");
		return null;
	}

	const subtotal = getTotalPrice();
	const shipping = subtotal > 100 ? 0 : 10;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax;

	const handleShippingSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep(2);
	};

	const handlePaymentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep(3);
	};

	const handleFinalSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simulate payment processing
		setTimeout(() => {
			// Clear cart and redirect to confirmation
			const orderId = `ORD-${Date.now()}`;
			clearCart();
			router.push(`/order-confirmation?orderId=${orderId}`);
		}, 2000);
	};

	return (
		<div className="mx-auto max-w-7xl px-8 py-16">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
				<p className="mt-1 text-gray-600">Complete your purchase in 3 easy steps</p>
			</div>

			{/* Progress Steps */}
			<div className="mb-12">
				<div className="flex items-center justify-center">
					{[
						{ num: 1, label: "Shipping" },
						{ num: 2, label: "Payment" },
						{ num: 3, label: "Review" },
					].map((s, idx) => (
						<div key={s.num} className="flex items-center">
							<div className="flex flex-col items-center">
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold ${
										step >= s.num
											? "border-blue-600 bg-blue-600 text-white"
											: "border-neutral-300 bg-white text-neutral-400"
									}`}
								>
									{step > s.num ? "✓" : s.num}
								</div>
								<span
									className={`mt-2 text-sm font-medium ${
										step >= s.num ? "text-blue-600" : "text-neutral-500"
									}`}
								>
									{s.label}
								</span>
							</div>
							{idx < 2 && (
								<div
									className={`mx-4 h-0.5 w-24 ${step > s.num ? "bg-blue-600" : "bg-neutral-300"}`}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Main Content */}
				<div className="lg:col-span-2">
					{/* Step 1: Shipping Information */}
					{step === 1 && (
						<form onSubmit={handleShippingSubmit} className="rounded-lg border border-neutral-200 bg-white p-8">
							<h2 className="mb-6 text-2xl font-bold text-gray-900">Shipping Information</h2>

							<div className="space-y-6">
								{/* Name Fields */}
								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<label htmlFor="firstName" className="mb-2 block font-medium text-gray-900">
											First Name *
										</label>
										<input
											type="text"
											id="firstName"
											required
											value={shippingInfo.firstName}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, firstName: e.target.value })
											}
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										/>
									</div>
									<div>
										<label htmlFor="lastName" className="mb-2 block font-medium text-gray-900">
											Last Name *
										</label>
										<input
											type="text"
											id="lastName"
											required
											value={shippingInfo.lastName}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, lastName: e.target.value })
											}
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										/>
									</div>
								</div>

								{/* Contact Info */}
								<div>
									<label htmlFor="email" className="mb-2 block font-medium text-gray-900">
										Email Address *
									</label>
									<input
										type="email"
										id="email"
										required
										value={shippingInfo.email}
										onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
										className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
									/>
								</div>

								<div>
									<label htmlFor="phone" className="mb-2 block font-medium text-gray-900">
										Phone Number *
									</label>
									<input
										type="tel"
										id="phone"
										required
										placeholder="+256 XXX XXX XXX"
										value={shippingInfo.phone}
										onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
										className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
									/>
								</div>

								{/* Address */}
								<div>
									<label htmlFor="address" className="mb-2 block font-medium text-gray-900">
										Street Address *
									</label>
									<input
										type="text"
										id="address"
										required
										value={shippingInfo.address}
										onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
										className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
									/>
								</div>

								<div className="grid gap-6 md:grid-cols-3">
									<div>
										<label htmlFor="city" className="mb-2 block font-medium text-gray-900">
											City *
										</label>
										<input
											type="text"
											id="city"
											required
											value={shippingInfo.city}
											onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										/>
									</div>
									<div>
										<label htmlFor="region" className="mb-2 block font-medium text-gray-900">
											Region *
										</label>
										<input
											type="text"
											id="region"
											required
											value={shippingInfo.region}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, region: e.target.value })
											}
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										/>
									</div>
									<div>
										<label htmlFor="postalCode" className="mb-2 block font-medium text-gray-900">
											Postal Code
										</label>
										<input
											type="text"
											id="postalCode"
											value={shippingInfo.postalCode}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
											}
											className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
										/>
									</div>
								</div>
							</div>

							<div className="mt-8 flex justify-between">
								<Link
									href="/cart"
									className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-neutral-50"
								>
									Back to Cart
								</Link>
								<button
									type="submit"
									className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
								>
									Continue to Payment
								</button>
							</div>
						</form>
					)}

					{/* Step 2: Payment Information */}
					{step === 2 && (
						<form onSubmit={handlePaymentSubmit} className="rounded-lg border border-neutral-200 bg-white p-8">
							<h2 className="mb-6 text-2xl font-bold text-gray-900">Payment Method</h2>

							{/* MTN Mobile Money */}
							<div className="space-y-6">
								<div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-6">
									<div className="mb-4 flex items-center gap-3">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400">
											<span className="font-bold text-gray-900">MoMo</span>
										</div>
										<div>
											<h3 className="font-bold text-gray-900">Mobile Money</h3>
											<p className="text-sm text-gray-600">Pay securely with MTN, Airtel, or Vodafone</p>
										</div>
									</div>

									<div className="space-y-4">
										<div>
											<label htmlFor="network" className="mb-2 block font-medium text-gray-900">
												Select Network *
											</label>
											<select
												id="network"
												required
												value={momoInfo.network}
												onChange={(e) =>
													setMomoInfo({ ...momoInfo, network: e.target.value as any })
												}
												className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
											>
												<option value="mtn">MTN Mobile Money</option>
												<option value="airtel">Airtel Money</option>
												<option value="vodafone">Vodafone Cash</option>
											</select>
										</div>

										<div>
											<label htmlFor="momoPhone" className="mb-2 block font-medium text-gray-900">
												Mobile Money Number *
											</label>
											<input
												type="tel"
												id="momoPhone"
												required
												placeholder="+256 XXX XXX XXX"
												value={momoInfo.phoneNumber}
												onChange={(e) =>
													setMomoInfo({ ...momoInfo, phoneNumber: e.target.value })
												}
												className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
											/>
											<p className="mt-2 text-sm text-gray-500">
												You will receive a prompt on your phone to approve the payment
											</p>
										</div>
									</div>
								</div>

								{/* Payment Instructions */}
								<div className="rounded-lg bg-neutral-50 p-4">
									<h4 className="mb-2 font-semibold text-gray-900">How it works:</h4>
									<ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
										<li>Enter your Mobile Money number</li>
										<li>Click "Review Order" to proceed</li>
										<li>You'll receive a prompt on your phone</li>
										<li>Enter your Mobile Money PIN to complete payment</li>
									</ol>
								</div>
							</div>

							<div className="mt-8 flex justify-between">
								<button
									type="button"
									onClick={() => setStep(1)}
									className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-neutral-50"
								>
									Back
								</button>
								<button
									type="submit"
									className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
								>
									Review Order
								</button>
							</div>
						</form>
					)}

					{/* Step 3: Review & Confirm */}
					{step === 3 && (
						<form onSubmit={handleFinalSubmit} className="space-y-6">
							{/* Shipping Info Review */}
							<div className="rounded-lg border border-neutral-200 bg-white p-6">
								<div className="mb-4 flex items-center justify-between">
									<h3 className="text-lg font-bold text-gray-900">Shipping Information</h3>
									<button
										type="button"
										onClick={() => setStep(1)}
										className="text-sm font-medium text-blue-600 hover:text-blue-700"
									>
										Edit
									</button>
								</div>
								<div className="space-y-1 text-sm text-gray-600">
									<p className="font-medium text-gray-900">
										{shippingInfo.firstName} {shippingInfo.lastName}
									</p>
									<p>{shippingInfo.email}</p>
									<p>{shippingInfo.phone}</p>
									<p>{shippingInfo.address}</p>
									<p>
										{shippingInfo.city}, {shippingInfo.region} {shippingInfo.postalCode}
									</p>
								</div>
							</div>

							{/* Payment Info Review */}
							<div className="rounded-lg border border-neutral-200 bg-white p-6">
								<div className="mb-4 flex items-center justify-between">
									<h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
									<button
										type="button"
										onClick={() => setStep(2)}
										className="text-sm font-medium text-blue-600 hover:text-blue-700"
									>
										Edit
									</button>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400">
										<span className="text-sm font-bold text-gray-900">MoMo</span>
									</div>
									<div>
										<p className="font-medium text-gray-900">
											{momoInfo.network === "mtn" && "MTN Mobile Money"}
											{momoInfo.network === "airtel" && "Airtel Money"}
											{momoInfo.network === "vodafone" && "Vodafone Cash"}
										</p>
										<p className="text-sm text-gray-600">{momoInfo.phoneNumber}</p>
									</div>
								</div>
							</div>

							{/* Order Items Review */}
							<div className="rounded-lg border border-neutral-200 bg-white p-6">
								<h3 className="mb-4 text-lg font-bold text-gray-900">Order Items ({items.length})</h3>
								<div className="space-y-3">
									{items.map((item) => (
										<div key={item.id} className="flex justify-between text-sm">
											<span className="text-gray-700">
												{item.name} × {item.quantity}
											</span>
											<span className="font-medium text-gray-900">
												${(item.price * item.quantity).toFixed(2)}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex justify-between">
								<button
									type="button"
									onClick={() => setStep(2)}
									className="rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-neutral-50"
								>
									Back
								</button>
								<button
									type="submit"
									disabled={loading}
									className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
								>
									{loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
								</button>
							</div>
						</form>
					)}
				</div>

				{/* Order Summary Sidebar */}
				<div className="lg:col-span-1">
					<div className="sticky top-4 rounded-lg border border-neutral-200 bg-white p-6">
						<h3 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h3>

						<div className="space-y-3 border-b border-neutral-200 pb-4">
							<div className="flex justify-between text-sm text-gray-600">
								<span>Subtotal ({items.length} items)</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm text-gray-600">
								<span>Shipping</span>
								<span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
							</div>
							<div className="flex justify-between text-sm text-gray-600">
								<span>Tax (10%)</span>
								<span>${tax.toFixed(2)}</span>
							</div>
						</div>

						<div className="mt-4 flex justify-between">
							<span className="text-lg font-bold text-gray-900">Total</span>
							<span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
						</div>

						{/* Security Badges */}
						<div className="mt-6 space-y-2 border-t border-neutral-200 pt-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Secure Payment
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Money-back Guarantee
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
