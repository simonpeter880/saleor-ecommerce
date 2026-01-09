"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";

export interface CartItem {
	id: string;
	productId: string;
	variantId?: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
	slug: string;
	category?: string;
	maxQuantity?: number;
}

interface CartContextType {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
	isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "techhub_cart";

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const { success, error: showError, info } = useToast();

	// Load cart from localStorage on mount
	useEffect(() => {
		const savedCart = localStorage.getItem(CART_STORAGE_KEY);
		if (savedCart) {
			try {
				setItems(JSON.parse(savedCart));
			} catch (error) {
				console.error("Error loading cart:", error);
			}
		}
		setIsLoaded(true);
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
		}
	}, [items, isLoaded]);

	const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
		setItems((prevItems) => {
			const existingItem = prevItems.find((i) => i.id === item.id);

			if (existingItem) {
				// Update quantity if item already exists
				const newQuantity = Math.min(
					existingItem.quantity + (item.quantity || 1),
					item.maxQuantity || 999
				);

				if (newQuantity === existingItem.quantity && item.maxQuantity) {
					info("Maximum quantity reached", `Only ${item.maxQuantity} available`);
				} else {
					success("Updated cart", `Quantity updated to ${newQuantity}`);
				}

				return prevItems.map((i) =>
					i.id === item.id
						? { ...i, quantity: newQuantity }
						: i
				);
			}

			// Add new item
			success("Added to cart!", `${item.name} has been added to your cart`);
			return [
				...prevItems,
				{
					...item,
					quantity: item.quantity || 1,
				},
			];
		});
	};

	const removeItem = (id: string) => {
		const item = items.find((i) => i.id === id);
		if (item) {
			info("Removed from cart", `${item.name} has been removed`);
		}
		setItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		if (quantity <= 0) {
			removeItem(id);
			return;
		}

		setItems((prevItems) =>
			prevItems.map((item) =>
				item.id === id
					? {
							...item,
							quantity: Math.min(quantity, item.maxQuantity || 999),
						}
					: item
			)
		);
	};

	const clearCart = () => {
		if (items.length > 0) {
			success("Cart cleared", "All items have been removed");
		}
		setItems([]);
	};

	const getTotalItems = () => {
		return items.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return items.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	const isInCart = (id: string) => {
		return items.some((item) => item.id === id);
	};

	return (
		<CartContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				getTotalItems,
				getTotalPrice,
				isInCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
