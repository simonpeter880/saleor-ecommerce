"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
	question: string;
	answer: string;
	category: string;
}

const faqs: FAQItem[] = [
	// Orders & Shipping
	{
		category: "Orders & Shipping",
		question: "How long does shipping take?",
		answer:
			"Standard shipping typically takes 2-5 business days within the continental US. We also offer expedited shipping options: Next Day (1 business day) and 2-Day shipping. Orders placed before 2 PM EST ship the same day. Free shipping is available on orders over $100.",
	},
	{
		category: "Orders & Shipping",
		question: "Do you ship internationally?",
		answer:
			"Yes! We ship to most countries worldwide. International shipping times vary by destination but typically range from 7-14 business days. Please note that customs fees and import taxes may apply and are the responsibility of the customer.",
	},
	{
		category: "Orders & Shipping",
		question: "Can I track my order?",
		answer:
			"Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history. Tracking information updates within 24 hours of shipment.",
	},
	{
		category: "Orders & Shipping",
		question: "Can I change or cancel my order?",
		answer:
			"You can modify or cancel your order within 1 hour of placing it. After that, our warehouse begins processing and we cannot guarantee changes. Contact our customer service team immediately at support@techhub.com if you need to make changes.",
	},

	// Returns & Refunds
	{
		category: "Returns & Refunds",
		question: "What is your return policy?",
		answer:
			"We offer a 30-day return policy on most items. Products must be in original condition with all accessories and packaging. Some items like opened software, headphones, or personal electronics may have different return policies for hygiene reasons. Restocking fees may apply to certain products.",
	},
	{
		category: "Returns & Refunds",
		question: "How do I initiate a return?",
		answer:
			"Log into your account, go to 'Order History', select the order you want to return, and click 'Request Return'. You'll receive a prepaid return label via email. Pack the item securely and drop it off at any authorized shipping location. Refunds are processed within 5-7 business days of receiving the return.",
	},
	{
		category: "Returns & Refunds",
		question: "Are there any items that can't be returned?",
		answer:
			"Yes, the following items cannot be returned: opened software, downloadable digital products, gift cards, and personalized/customized items. Additionally, items marked as 'Final Sale' or 'Clearance' are non-returnable.",
	},

	// Products & Warranty
	{
		category: "Products & Warranty",
		question: "Are all products genuine and new?",
		answer:
			"Yes, 100%! We are an authorized retailer for all major electronics brands. Every product we sell is brand new, factory sealed, and comes with a full manufacturer warranty. We never sell refurbished items as new (refurbished items are clearly marked).",
	},
	{
		category: "Products & Warranty",
		question: "What warranty comes with my purchase?",
		answer:
			"All products come with the manufacturer's standard warranty (typically 1 year for electronics). We also offer extended warranty plans at checkout. Keep your receipt and proof of purchase for warranty claims. Some products may have longer manufacturer warranties - check the product page for details.",
	},
	{
		category: "Products & Warranty",
		question: "What if I receive a defective product?",
		answer:
			"If you receive a defective product, contact us within 48 hours of delivery. We'll either send a replacement immediately or issue a full refund including return shipping. You can also pursue a warranty claim directly with the manufacturer if preferred.",
	},
	{
		category: "Products & Warranty",
		question: "Do you price match?",
		answer:
			"Yes! We offer price matching on identical products from authorized retailers. The product must be in stock and available for immediate purchase at the competitor's site. Price matching requests must be submitted within 14 days of purchase. Exclusions apply to marketplace sellers, auction sites, and unauthorized dealers.",
	},

	// Payment & Security
	{
		category: "Payment & Security",
		question: "What payment methods do you accept?",
		answer:
			"We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and financing through Affirm or Klarna for qualified purchases. All transactions are encrypted and secure.",
	},
	{
		category: "Payment & Security",
		question: "Is it safe to shop on your website?",
		answer:
			"Absolutely! We use industry-standard SSL encryption to protect your personal and payment information. We're PCI DSS compliant and never store your full credit card details on our servers. Your security and privacy are our top priorities.",
	},
	{
		category: "Payment & Security",
		question: "Do you offer financing options?",
		answer:
			"Yes! We partner with Affirm and Klarna to offer flexible payment plans. You can split your purchase into monthly installments with transparent terms and no hidden fees. Financing options are available at checkout for purchases over $150. Approval is instant and based on credit check.",
	},

	// Account & Support
	{
		category: "Account & Support",
		question: "Do I need an account to make a purchase?",
		answer:
			"No, you can checkout as a guest. However, creating an account allows you to track orders, save items to wishlists, earn rewards points, and speed up future checkouts. Account creation is free and takes less than a minute.",
	},
	{
		category: "Account & Support",
		question: "How can I contact customer support?",
		answer:
			"We offer multiple support channels: Email (support@techhub.com - 24/7), Phone (1-800-555-1234, Mon-Fri 9am-6pm EST), Live Chat (available on our website), and Social Media (@TechHubElectronics). Average response time is under 2 hours for emails and instant for chat.",
	},
	{
		category: "Account & Support",
		question: "Do you have a physical store I can visit?",
		answer:
			"Currently, we operate as an online-only retailer, which allows us to offer lower prices and a wider selection. However, we have partnered pickup locations in major cities where you can collect your online orders. Check our Store Locator for locations near you.",
	},

	// Tech Support
	{
		category: "Tech Support",
		question: "Do you provide technical support for products?",
		answer:
			"Yes! Our tech support team can help with product setup, troubleshooting, and general questions. For warranty repairs or advanced technical issues, we'll connect you with the manufacturer's support team. Tech support is available via email, phone, and live chat.",
	},
	{
		category: "Tech Support",
		question: "Can you help me choose the right product?",
		answer:
			"Absolutely! Check out our comprehensive Buying Guides for expert advice on choosing products. You can also chat with our product specialists via live chat or call us. We'll ask about your needs and budget to recommend the perfect product for you.",
	},
];

export default function FAQPage() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

	const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

	const filteredFAQs = faqs.filter((faq) => {
		const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
		const matchesSearch =
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="mx-auto max-w-7xl px-8 py-16">
			{/* Header */}
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
					Frequently Asked Questions
				</h1>
				<p className="mt-4 text-xl text-gray-600">
					Find answers to common questions about shopping at TechHub Electronics
				</p>
			</div>

			{/* Search Bar */}
			<div className="mb-8">
				<div className="relative mx-auto max-w-2xl">
					<input
						type="text"
						placeholder="Search FAQs..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full rounded-lg border border-neutral-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
					/>
					<svg
						className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>

			{/* Category Filter */}
			<div className="mb-8 flex flex-wrap justify-center gap-2">
				{categories.map((category) => (
					<button
						key={category}
						onClick={() => setSelectedCategory(category)}
						className={`rounded-full px-4 py-2 font-medium transition ${
							selectedCategory === category
								? "bg-blue-600 text-white"
								: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
						}`}
					>
						{category}
					</button>
				))}
			</div>

			{/* FAQ List */}
			<div className="mx-auto max-w-3xl">
				{filteredFAQs.length === 0 ? (
					<div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
						<svg
							className="mx-auto mb-4 h-16 w-16 text-neutral-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-neutral-600">No FAQs found matching your search.</p>
					</div>
				) : (
					<div className="space-y-4">
						{filteredFAQs.map((faq, index) => (
							<div
								key={index}
								className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-blue-500"
							>
								<button
									onClick={() => setOpenIndex(openIndex === index ? null : index)}
									className="flex w-full items-center justify-between p-6 text-left"
								>
									<div className="flex-1">
										<span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
											{faq.category}
										</span>
										<h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
									</div>
									<svg
										className={`ml-4 h-6 w-6 flex-shrink-0 text-gray-500 transition ${
											openIndex === index ? "rotate-180" : ""
										}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								{openIndex === index && (
									<div className="border-t border-neutral-200 bg-neutral-50 p-6">
										<p className="leading-relaxed text-gray-700">{faq.answer}</p>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Still Have Questions CTA */}
			<div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-center text-white">
				<h2 className="mb-4 text-3xl font-bold">Still Have Questions?</h2>
				<p className="mb-8 text-lg text-blue-100">
					Our customer support team is here to help you 24/7
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Link
						href="/contact"
						className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
					>
						Contact Support
					</Link>
					<button className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition hover:bg-white/10">
						Start Live Chat
					</button>
				</div>
				<div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
					<div className="flex items-center gap-2">
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span>1-800-555-1234</span>
					</div>
					<div className="flex items-center gap-2">
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span>support@techhub.com</span>
					</div>
				</div>
			</div>

			{/* Quick Links */}
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				<Link
					href="/guides"
					className="group rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-lg"
				>
					<div className="mb-3 text-4xl">📚</div>
					<h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600">
						Buying Guides
					</h3>
					<p className="text-sm text-gray-600">
						Expert advice to help you choose the right products
					</p>
				</Link>
				<Link
					href="/about"
					className="group rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-lg"
				>
					<div className="mb-3 text-4xl">ℹ️</div>
					<h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600">About Us</h3>
					<p className="text-sm text-gray-600">Learn more about TechHub Electronics</p>
				</Link>
				<Link
					href="/categories/smartphones"
					className="group rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-lg"
				>
					<div className="mb-3 text-4xl">🛍️</div>
					<h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600">
						Shop Products
					</h3>
					<p className="text-sm text-gray-600">Browse our electronics collection</p>
				</Link>
			</div>
		</div>
	);
}
