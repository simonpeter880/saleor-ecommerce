// Google Analytics tracking utilities

declare global {
	interface Window {
		gtag?: (
			command: string,
			targetId: string,
			config?: Record<string, unknown>
		) => void;
		dataLayer?: unknown[];
	}
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "";

// Initialize Google Analytics
export const initGA = () => {
	if (!GA_TRACKING_ID) {
		console.warn("Google Analytics tracking ID not found");
		return;
	}

	// Load gtag.js script
	const script1 = document.createElement("script");
	script1.async = true;
	script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
	document.head.appendChild(script1);

	// Initialize dataLayer
	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag() {
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer?.push(arguments);
	};
	window.gtag("js", new Date());
	window.gtag("config", GA_TRACKING_ID, {
		page_path: window.location.pathname,
	});
};

// Track page views
export const trackPageView = (url: string) => {
	if (!GA_TRACKING_ID || !window.gtag) return;

	window.gtag("config", GA_TRACKING_ID, {
		page_path: url,
	});
};

// Track custom events
export const trackEvent = ({
	action,
	category,
	label,
	value,
}: {
	action: string;
	category: string;
	label?: string;
	value?: number;
}) => {
	if (!GA_TRACKING_ID || !window.gtag) return;

	window.gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};

// E-commerce tracking events
export const trackProductView = (product: {
	id: string;
	name: string;
	category?: string;
	price?: number;
}) => {
	trackEvent({
		action: "view_item",
		category: "E-commerce",
		label: product.name,
		value: product.price,
	});

	// Enhanced E-commerce tracking
	if (!window.gtag) return;
	window.gtag("event", "view_item", {
		currency: "USD",
		value: product.price,
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				item_category: product.category,
				price: product.price,
			},
		],
	});
};

export const trackAddToCart = (product: {
	id: string;
	name: string;
	category?: string;
	price?: number;
	quantity?: number;
}) => {
	trackEvent({
		action: "add_to_cart",
		category: "E-commerce",
		label: product.name,
		value: product.price,
	});

	// Enhanced E-commerce tracking
	if (!window.gtag) return;
	window.gtag("event", "add_to_cart", {
		currency: "USD",
		value: (product.price || 0) * (product.quantity || 1),
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				item_category: product.category,
				price: product.price,
				quantity: product.quantity || 1,
			},
		],
	});
};

export const trackRemoveFromCart = (product: {
	id: string;
	name: string;
	price?: number;
	quantity?: number;
}) => {
	if (!window.gtag) return;
	window.gtag("event", "remove_from_cart", {
		currency: "USD",
		value: (product.price || 0) * (product.quantity || 1),
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				price: product.price,
				quantity: product.quantity || 1,
			},
		],
	});
};

export const trackBeginCheckout = (cartValue: number, items: unknown[]) => {
	if (!window.gtag) return;
	window.gtag("event", "begin_checkout", {
		currency: "USD",
		value: cartValue,
		items: items,
	});
};

export const trackPurchase = (
	orderId: string,
	revenue: number,
	tax: number,
	shipping: number,
	items: unknown[]
) => {
	trackEvent({
		action: "purchase",
		category: "E-commerce",
		label: orderId,
		value: revenue,
	});

	// Enhanced E-commerce tracking
	if (!window.gtag) return;
	window.gtag("event", "purchase", {
		transaction_id: orderId,
		value: revenue,
		tax: tax,
		shipping: shipping,
		currency: "USD",
		items: items,
	});
};

export const trackSearch = (searchTerm: string, resultsCount?: number) => {
	trackEvent({
		action: "search",
		category: "Engagement",
		label: searchTerm,
		value: resultsCount,
	});
};

export const trackWishlistAdd = (productName: string) => {
	trackEvent({
		action: "add_to_wishlist",
		category: "Engagement",
		label: productName,
	});
};

export const trackShare = (method: string, contentType: string, itemId: string) => {
	if (!window.gtag) return;
	window.gtag("event", "share", {
		method: method,
		content_type: contentType,
		item_id: itemId,
	});
};

export const trackSignUp = (method: string) => {
	if (!window.gtag) return;
	window.gtag("event", "sign_up", {
		method: method,
	});
};

export const trackLogin = (method: string) => {
	if (!window.gtag) return;
	window.gtag("event", "login", {
		method: method,
	});
};
