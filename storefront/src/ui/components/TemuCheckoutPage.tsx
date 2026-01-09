"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ShoppingBag,
	MapPin,
	CreditCard,
	CheckCircle,
	ArrowLeft,
	Shield,
	Truck,
	Clock,
	Phone,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";
import {
	updateCheckoutShippingAddress,
	updateCheckoutBillingAddress,
	updateCheckoutEmail,
	selectShippingMethod,
	completeCheckout,
} from "@/app/checkout-actions";

interface CheckoutLine {
	id: string;
	quantity: number;
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	variant: {
		id: string;
		name: string;
		product: {
			id: string;
			name: string;
			slug: string;
			thumbnail?: {
				url: string;
				alt?: string;
			};
		};
	};
}

interface TemuCheckoutPageProps {
	channel: string;
	checkoutId: string;
	checkout: {
		id: string;
		email?: string | null;
		lines: CheckoutLine[];
		totalPrice: {
			gross: {
				amount: number;
				currency: string;
			};
		};
		subtotalPrice: {
			gross: {
				amount: number;
				currency: string;
			};
		};
		shippingPrice: {
			gross: {
				amount: number;
				currency: string;
			};
		};
		shippingAddress?: {
			firstName: string;
			lastName: string;
			streetAddress1: string;
			city: string;
			countryArea: string;
			postalCode: string;
			phone?: string;
		} | null;
		availableShippingMethods?: Array<{
			id: string;
			name: string;
			price: {
				amount: number;
				currency: string;
			};
		}>;
		shippingMethod?: {
			id: string;
			name: string;
		} | null;
	};
	user?: {
		email: string;
		firstName?: string | null;
		lastName?: string | null;
	} | null;
}

type Step = "shipping" | "payment" | "review";

export function TemuCheckoutPage({
	channel,
	checkoutId,
	checkout,
	user,
}: TemuCheckoutPageProps) {
	const router = useRouter();
	const [step, setStep] = useState<Step>("shipping");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [shippingInfo, setShippingInfo] = useState({
		email: user?.email || checkout.email || "",
		firstName: user?.firstName || checkout.shippingAddress?.firstName || "",
		lastName: user?.lastName || checkout.shippingAddress?.lastName || "",
		phone: checkout.shippingAddress?.phone || "",
		streetAddress1: checkout.shippingAddress?.streetAddress1 || "",
		city: checkout.shippingAddress?.city || "",
		countryArea: checkout.shippingAddress?.countryArea || "",
		postalCode: checkout.shippingAddress?.postalCode || "",
		country: "UG", // Uganda
	});

	const [paymentInfo, setPaymentInfo] = useState({
		method: "momo" as "momo" | "card" | "cod",
		momoNetwork: "mtn" as "mtn" | "airtel",
		momoPhone: "",
	});

	const [selectedShippingMethod, setSelectedShippingMethod] = useState(
		checkout.shippingMethod?.id || ""
	);

	const subtotal = checkout.subtotalPrice?.gross.amount || checkout.totalPrice.gross.amount;
	const shipping = checkout.shippingPrice?.gross.amount || 0;
	const total = checkout.totalPrice.gross.amount;
	const currency = checkout.totalPrice.gross.currency;

	const handleShippingSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Update email
			if (shippingInfo.email) {
				const emailResult = await updateCheckoutEmail(checkoutId, shippingInfo.email);
				if (emailResult?.errors?.length) {
					throw new Error(emailResult.errors[0]);
				}
			}

			// Update shipping address
			const addressResult = await updateCheckoutShippingAddress(checkoutId, {
				firstName: shippingInfo.firstName,
				lastName: shippingInfo.lastName,
				streetAddress1: shippingInfo.streetAddress1,
				city: shippingInfo.city,
				countryArea: shippingInfo.countryArea,
				postalCode: shippingInfo.postalCode,
				country: shippingInfo.country,
				phone: shippingInfo.phone,
			});

			if (addressResult?.errors?.length) {
				throw new Error(addressResult.errors[0]);
			}

			// Update billing address (same as shipping)
			await updateCheckoutBillingAddress(checkoutId, {
				firstName: shippingInfo.firstName,
				lastName: shippingInfo.lastName,
				streetAddress1: shippingInfo.streetAddress1,
				city: shippingInfo.city,
				countryArea: shippingInfo.countryArea,
				postalCode: shippingInfo.postalCode,
				country: shippingInfo.country,
				phone: shippingInfo.phone,
			});

			// Select shipping method if available
			if (selectedShippingMethod) {
				await selectShippingMethod(checkoutId, selectedShippingMethod);
			}

			setStep("payment");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save shipping info");
		} finally {
			setLoading(false);
		}
	};

	const handlePaymentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStep("review");
	};

	const handlePlaceOrder = async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await completeCheckout(checkoutId);

			if (result?.errors?.length) {
				throw new Error(result.errors[0]);
			}

			if (result?.orderId) {
				router.push(`/${channel}/order-confirmation/${result.orderId}`);
			} else {
				router.push(`/${channel}/order-confirmation?success=true`);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to place order");
			setLoading(false);
		}
	};

	const steps = [
		{ id: "shipping", label: "Shipping", icon: MapPin },
		{ id: "payment", label: "Payment", icon: CreditCard },
		{ id: "review", label: "Review", icon: CheckCircle },
	];

	const currentStepIndex = steps.findIndex((s) => s.id === step);

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						href={`/${channel}/cart`}
						className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
					>
						<ArrowLeft size={20} />
						Back to Cart
					</Link>
					<h1 className="text-3xl font-black text-gray-900">Checkout</h1>
				</div>

				{/* Progress Steps */}
				<div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
					<div className="flex items-center justify-center">
						{steps.map((s, idx) => (
							<div key={s.id} className="flex items-center">
								<div className="flex flex-col items-center">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
											currentStepIndex >= idx
												? "border-temu-500 bg-temu-500 text-white"
												: "border-gray-300 bg-white text-gray-400"
										}`}
									>
										{currentStepIndex > idx ? (
											<CheckCircle size={24} />
										) : (
											<s.icon size={24} />
										)}
									</div>
									<span
										className={`mt-2 text-sm font-medium ${
											currentStepIndex >= idx ? "text-temu-600" : "text-gray-500"
										}`}
									>
										{s.label}
									</span>
								</div>
								{idx < steps.length - 1 && (
									<div
										className={`mx-4 h-0.5 w-16 sm:w-24 ${
											currentStepIndex > idx ? "bg-temu-500" : "bg-gray-300"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						{/* Shipping Step */}
						{step === "shipping" && (
							<form onSubmit={handleShippingSubmit} className="bg-white rounded-xl shadow-sm p-6">
								<h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>

								<div className="space-y-4">
									{/* Email */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email Address *
										</label>
										<input
											type="email"
											required
											value={shippingInfo.email}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, email: e.target.value })
											}
											className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											placeholder="your@email.com"
										/>
									</div>

									{/* Name */}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												First Name *
											</label>
											<input
												type="text"
												required
												value={shippingInfo.firstName}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, firstName: e.target.value })
												}
												className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Last Name *
											</label>
											<input
												type="text"
												required
												value={shippingInfo.lastName}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, lastName: e.target.value })
												}
												className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											/>
										</div>
									</div>

									{/* Phone */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone Number *
										</label>
										<input
											type="tel"
											required
											value={shippingInfo.phone}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, phone: e.target.value })
											}
											className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											placeholder="+256 XXX XXX XXX"
										/>
									</div>

									{/* Address */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Street Address *
										</label>
										<input
											type="text"
											required
											value={shippingInfo.streetAddress1}
											onChange={(e) =>
												setShippingInfo({ ...shippingInfo, streetAddress1: e.target.value })
											}
											className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
										/>
									</div>

									{/* City, Region, Postal */}
									<div className="grid grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												City *
											</label>
											<input
												type="text"
												required
												value={shippingInfo.city}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, city: e.target.value })
												}
												className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Region *
											</label>
											<input
												type="text"
												required
												value={shippingInfo.countryArea}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, countryArea: e.target.value })
												}
												className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Postal Code
											</label>
											<input
												type="text"
												value={shippingInfo.postalCode}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
												}
												className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temu-500 focus:border-temu-500"
											/>
										</div>
									</div>

									{/* Shipping Method Selection */}
									{checkout.availableShippingMethods && checkout.availableShippingMethods.length > 0 && (
										<div className="mt-6">
											<label className="block text-sm font-medium text-gray-700 mb-3">
												Shipping Method *
											</label>
											<div className="space-y-3">
												{checkout.availableShippingMethods.map((method) => (
													<label
														key={method.id}
														className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
															selectedShippingMethod === method.id
																? "border-temu-500 bg-temu-50"
																: "border-gray-200 hover:border-gray-300"
														}`}
													>
														<div className="flex items-center gap-3">
															<input
																type="radio"
																name="shippingMethod"
																value={method.id}
																checked={selectedShippingMethod === method.id}
																onChange={(e) => setSelectedShippingMethod(e.target.value)}
																className="w-4 h-4 text-temu-500"
															/>
															<div className="flex items-center gap-2">
																<Truck size={20} className="text-gray-500" />
																<span className="font-medium">{method.name}</span>
															</div>
														</div>
														<span className="font-semibold">
															{method.price.amount === 0
																? "FREE"
																: formatMoney(method.price.amount, method.price.currency)}
														</span>
													</label>
												))}
											</div>
										</div>
									)}
								</div>

								<div className="mt-8 flex justify-end">
									<button
										type="submit"
										disabled={loading}
										className="px-8 py-3 bg-temu-500 text-white font-bold rounded-lg hover:bg-temu-600 transition-colors disabled:opacity-50"
									>
										{loading ? "Saving..." : "Continue to Payment"}
									</button>
								</div>
							</form>
						)}

						{/* Payment Step */}
						{step === "payment" && (
							<form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow-sm p-6">
								<h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

								<div className="space-y-4">
									{/* Mobile Money */}
									<label
										className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
											paymentInfo.method === "momo"
												? "border-temu-500 bg-temu-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<input
											type="radio"
											name="paymentMethod"
											value="momo"
											checked={paymentInfo.method === "momo"}
											onChange={() => setPaymentInfo({ ...paymentInfo, method: "momo" })}
											className="w-4 h-4 mt-1 text-temu-500"
										/>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<Phone size={20} className="text-yellow-500" />
												<span className="font-bold">Mobile Money</span>
											</div>
											<p className="text-sm text-gray-600 mb-3">
												Pay with MTN or Airtel Mobile Money
											</p>

											{paymentInfo.method === "momo" && (
												<div className="space-y-3">
													<select
														value={paymentInfo.momoNetwork}
														onChange={(e) =>
															setPaymentInfo({
																...paymentInfo,
																momoNetwork: e.target.value as "mtn" | "airtel",
															})
														}
														className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
													>
														<option value="mtn">MTN Mobile Money</option>
														<option value="airtel">Airtel Money</option>
													</select>
													<input
														type="tel"
														placeholder="Mobile Money Number"
														value={paymentInfo.momoPhone}
														onChange={(e) =>
															setPaymentInfo({ ...paymentInfo, momoPhone: e.target.value })
														}
														className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
													/>
												</div>
											)}
										</div>
									</label>

									{/* Cash on Delivery */}
									<label
										className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
											paymentInfo.method === "cod"
												? "border-temu-500 bg-temu-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<input
											type="radio"
											name="paymentMethod"
											value="cod"
											checked={paymentInfo.method === "cod"}
											onChange={() => setPaymentInfo({ ...paymentInfo, method: "cod" })}
											className="w-4 h-4 mt-1 text-temu-500"
										/>
										<div>
											<div className="flex items-center gap-2 mb-2">
												<ShoppingBag size={20} className="text-green-500" />
												<span className="font-bold">Cash on Delivery</span>
											</div>
											<p className="text-sm text-gray-600">Pay when you receive your order</p>
										</div>
									</label>
								</div>

								<div className="mt-8 flex justify-between">
									<button
										type="button"
										onClick={() => setStep("shipping")}
										className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
									>
										Back
									</button>
									<button
										type="submit"
										className="px-8 py-3 bg-temu-500 text-white font-bold rounded-lg hover:bg-temu-600 transition-colors"
									>
										Review Order
									</button>
								</div>
							</form>
						)}

						{/* Review Step */}
						{step === "review" && (
							<div className="space-y-6">
								{/* Shipping Summary */}
								<div className="bg-white rounded-xl shadow-sm p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-bold text-gray-900">Shipping Address</h3>
										<button
											onClick={() => setStep("shipping")}
											className="text-sm text-temu-600 hover:text-temu-700 font-medium"
										>
											Edit
										</button>
									</div>
									<div className="text-gray-600 text-sm space-y-1">
										<p className="font-medium text-gray-900">
											{shippingInfo.firstName} {shippingInfo.lastName}
										</p>
										<p>{shippingInfo.email}</p>
										<p>{shippingInfo.phone}</p>
										<p>{shippingInfo.streetAddress1}</p>
										<p>
											{shippingInfo.city}, {shippingInfo.countryArea} {shippingInfo.postalCode}
										</p>
									</div>
								</div>

								{/* Payment Summary */}
								<div className="bg-white rounded-xl shadow-sm p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-bold text-gray-900">Payment Method</h3>
										<button
											onClick={() => setStep("payment")}
											className="text-sm text-temu-600 hover:text-temu-700 font-medium"
										>
											Edit
										</button>
									</div>
									<div className="flex items-center gap-3">
										{paymentInfo.method === "momo" && (
											<>
												<Phone size={24} className="text-yellow-500" />
												<div>
													<p className="font-medium">
														{paymentInfo.momoNetwork === "mtn" ? "MTN Mobile Money" : "Airtel Money"}
													</p>
													<p className="text-sm text-gray-600">{paymentInfo.momoPhone}</p>
												</div>
											</>
										)}
										{paymentInfo.method === "cod" && (
											<>
												<ShoppingBag size={24} className="text-green-500" />
												<div>
													<p className="font-medium">Cash on Delivery</p>
													<p className="text-sm text-gray-600">Pay when you receive</p>
												</div>
											</>
										)}
									</div>
								</div>

								{/* Order Items */}
								<div className="bg-white rounded-xl shadow-sm p-6">
									<h3 className="font-bold text-gray-900 mb-4">
										Order Items ({checkout.lines.length})
									</h3>
									<div className="space-y-4">
										{checkout.lines.map((item) => (
											<div key={item.id} className="flex gap-4">
												<div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
													{item.variant.product.thumbnail?.url && (
														<Image
															src={item.variant.product.thumbnail.url}
															alt={item.variant.product.name}
															width={64}
															height={64}
															className="w-full h-full object-cover"
														/>
													)}
												</div>
												<div className="flex-1">
													<p className="font-medium text-gray-900">{item.variant.product.name}</p>
													<p className="text-sm text-gray-500">
														{item.variant.name} x {item.quantity}
													</p>
												</div>
												<p className="font-semibold">
													{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
												</p>
											</div>
										))}
									</div>
								</div>

								<div className="flex justify-between">
									<button
										onClick={() => setStep("payment")}
										className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
									>
										Back
									</button>
									<button
										onClick={handlePlaceOrder}
										disabled={loading}
										className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
									>
										{loading ? "Processing..." : `Place Order - ${formatMoney(total, currency)}`}
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Order Summary Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
							<h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

							{/* Items Preview */}
							<div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
								{checkout.lines.slice(0, 3).map((item) => (
									<div key={item.id} className="flex gap-3">
										<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
											{item.variant.product.thumbnail?.url && (
												<Image
													src={item.variant.product.thumbnail.url}
													alt={item.variant.product.name}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 truncate">
												{item.variant.product.name}
											</p>
											<p className="text-xs text-gray-500">Qty: {item.quantity}</p>
										</div>
									</div>
								))}
								{checkout.lines.length > 3 && (
									<p className="text-sm text-gray-500">
										+{checkout.lines.length - 3} more items
									</p>
								)}
							</div>

							<div className="border-t border-gray-200 pt-4 space-y-2">
								<div className="flex justify-between text-sm text-gray-600">
									<span>Subtotal</span>
									<span>{formatMoney(subtotal, currency)}</span>
								</div>
								<div className="flex justify-between text-sm text-gray-600">
									<span>Shipping</span>
									<span>{shipping === 0 ? "FREE" : formatMoney(shipping, currency)}</span>
								</div>
								<div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
									<span>Total</span>
									<span>{formatMoney(total, currency)}</span>
								</div>
							</div>

							{/* Trust Badges */}
							<div className="mt-6 space-y-3 pt-4 border-t border-gray-200">
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Shield size={18} className="text-green-600" />
									<span>Secure checkout</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Truck size={18} className="text-green-600" />
									<span>Fast delivery</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Clock size={18} className="text-green-600" />
									<span>30-day returns</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
