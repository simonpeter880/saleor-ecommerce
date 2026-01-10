"use client";

import { ShoppingCart, Menu, Heart, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlistContext } from "@/context/WishlistContext";
import { AccountDropdown } from "@/ui/components/AccountDropdown";
import { SearchAutocomplete } from "@/ui/components/SearchAutocomplete";
import { ThemeToggle } from "@/ui/components/ThemeToggle";
import { logout } from "@/app/actions";

interface UserData {
	email: string;
	firstName: string;
	isLoggedIn: boolean;
}

export function Header({ channel, user }: { channel: string; user: UserData | null }) {
	const router = useRouter();
	const { getTotalItems } = useCart();
	const cartItemCount = getTotalItems();
	const { itemCount: wishlistCount } = useWishlistContext();

	const handleSignOut = async () => {
		await logout();
		router.push(`/${channel}/`);
		router.refresh();
	};

	return (
		<header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors">
			{/* Top Banner - Professional, not promotional */}
			<div className="hidden sm:block bg-primary-600 dark:bg-primary-700 text-white py-2 text-center text-sm">
				<div className="flex items-center justify-center gap-2">
					<span>Free shipping on orders over $50</span>
				</div>
			</div>

			{/* Main Header */}
			<div className="mx-auto max-w-7xl px-3 sm:px-4">
				<div className="flex items-center gap-2 sm:gap-4 py-3 sm:py-4">
					{/* Logo - Professional design */}
					<Link href={`/${channel}/`} className="flex items-center shrink-0">
						<div className="flex items-center gap-2">
							<div className="bg-primary-600 dark:bg-primary-500 text-white font-bold text-lg sm:text-xl px-3 sm:px-4 py-2 rounded-md">
								TechHub
							</div>
						</div>
					</Link>

					{/* Search Bar with Autocomplete */}
					<SearchAutocomplete
						channel={channel}
						placeholder="Search for products..."
						className="flex-1 min-w-0"
					/>

					{/* Right Side Icons - Desktop */}
					<div className="hidden md:flex items-center gap-4">
						{/* Theme Toggle */}
						<ThemeToggle variant="dropdown" />

						{/* Orders */}
						<Link
							href={`/${channel}/account/orders`}
							className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
						>
							<Package size={22} />
							<span className="text-xs mt-0.5">Orders</span>
						</Link>

						{/* Account Dropdown */}
						<AccountDropdown user={user} channel={channel} onSignOut={handleSignOut} />

						{/* Wishlist */}
						<Link
							href={`/${channel}/wishlist`}
							className="relative flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
						>
							<Heart size={22} />
							{wishlistCount > 0 && (
								<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{wishlistCount > 99 ? '99+' : wishlistCount}
								</span>
							)}
							<span className="text-xs mt-0.5">Wishlist</span>
						</Link>

						{/* Cart */}
						<Link
							href={`/${channel}/cart/`}
							className="relative flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
						>
							<ShoppingCart size={22} />
							{cartItemCount > 0 && (
								<span className="absolute -top-1.5 -right-1.5 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{cartItemCount > 99 ? '99+' : cartItemCount}
								</span>
							)}
							<span className="text-xs mt-0.5">Cart</span>
						</Link>
					</div>

					{/* Mobile Cart Icon */}
					<Link href={`/${channel}/cart/`} className="md:hidden relative shrink-0">
						<ShoppingCart size={24} className="text-gray-700 dark:text-gray-300" />
						{cartItemCount > 0 && (
							<span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
								{cartItemCount > 99 ? '99+' : cartItemCount}
							</span>
						)}
					</Link>

					{/* Mobile Menu Button - Optional for future mobile menu */}
					<button className="md:hidden text-gray-700 dark:text-gray-300 shrink-0">
						<Menu size={24} />
					</button>
				</div>
			</div>
		</header>
	);
}
