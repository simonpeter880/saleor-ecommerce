"use client";

import { ShoppingCart, Menu, Heart, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlistContext } from "@/context/WishlistContext";
import { AccountDropdown } from "./AccountDropdown";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { ThemeToggle } from "./ThemeToggle";
import { logout } from "@/app/actions";

interface UserData {
	email: string;
	firstName: string;
	isLoggedIn: boolean;
}

export function TemuHeader({ channel, user }: { channel: string; user: UserData | null }) {
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
			{/* Top Banner - Hidden on mobile */}
			<div className="hidden sm:block bg-gradient-to-r from-temu-500 to-temu-600 dark:from-temu-600 dark:to-temu-700 text-white py-1.5 text-center text-sm font-medium">
				<div className="flex items-center justify-center gap-2">
					<span>⚡</span>
					<span>Free shipping on orders over $50 | Download App for Extra Savings</span>
					<span>⚡</span>
				</div>
			</div>

			{/* Main Header */}
			<div className="mx-auto max-w-7xl px-3 sm:px-4">
				<div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3">
					{/* Logo */}
					<Link href={`/${channel}/`} className="flex items-center shrink-0">
						<div className="bg-temu-500 text-white font-black text-lg sm:text-2xl px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
							TECHHUB
						</div>
					</Link>

					{/* Search Bar with Autocomplete */}
					<SearchAutocomplete
						channel={channel}
						placeholder="Search electronics..."
						className="flex-1 min-w-0"
					/>

					{/* Right Side Icons - Hidden on mobile, shown on desktop */}
					<div className="hidden md:flex items-center gap-4">
						{/* Theme Toggle */}
						<ThemeToggle variant="dropdown" />

						{/* Orders */}
						<Link href={`/${channel}/account/orders`} className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-temu-500 dark:hover:text-temu-400 transition-colors">
							<Package size={24} />
							<span className="text-xs mt-1">Orders</span>
						</Link>

						{/* Account Dropdown */}
						<AccountDropdown user={user} channel={channel} onSignOut={handleSignOut} />

						{/* Wishlist */}
						<Link href={`/${channel}/wishlist`} className="relative flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-temu-500 dark:hover:text-temu-400 transition-colors">
							<Heart size={24} />
							{wishlistCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{wishlistCount}
								</span>
							)}
							<span className="text-xs mt-1">Wishlist</span>
						</Link>

						{/* Cart */}
						<Link href={`/${channel}/cart/`} className="relative flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-temu-500 dark:hover:text-temu-400 transition-colors">
							<ShoppingCart size={24} />
							{cartItemCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{cartItemCount}
								</span>
							)}
							<span className="text-xs mt-1">Cart</span>
						</Link>
					</div>

					{/* Mobile Cart Icon */}
					<Link href={`/${channel}/cart/`} className="md:hidden relative shrink-0">
						<ShoppingCart size={24} className="text-gray-700" />
						{cartItemCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
								{cartItemCount}
							</span>
						)}
					</Link>
				</div>
			</div>

			{/* Category Navigation - Scrollable on mobile */}
			<div className="bg-gray-50 border-t border-gray-200">
				<div className="mx-auto max-w-7xl px-2 sm:px-4">
					<div className="flex items-center gap-3 sm:gap-6 py-2 text-xs sm:text-sm overflow-x-auto scrollbar-hide">
						<Link href={`/${channel}/categories/mobile-phones-mobile-technology`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							📱 Phones
						</Link>
						<Link href={`/${channel}/categories/computers-laptops-workstations`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							💻 Computers
						</Link>
						<Link href={`/${channel}/categories/tablets-e-readers`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							📲 Tablets
						</Link>
						<Link href={`/${channel}/categories/gaming-esports`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							🎮 Gaming
						</Link>
						<Link href={`/${channel}/categories/audio-sound-music-equipment`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							🎧 Audio
						</Link>
						<Link href={`/${channel}/categories/smart-home-iot`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							🏠 Smart Home
						</Link>
						<Link href={`/${channel}/categories/cameras-drones-imaging`} className="whitespace-nowrap text-gray-700 hover:text-temu-500 font-medium">
							📷 Cameras
						</Link>
						<Link href={`/${channel}/categories/refurbished-used-clearance`} className="whitespace-nowrap text-secondary-500 hover:text-secondary-600 font-bold">
							💰 Clearance
						</Link>
					</div>
				</div>
			</div>

			{/* Mobile Bottom Nav - With safe area padding for notched phones */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg pb-safe">
				<div className="grid grid-cols-5 gap-1 py-2 px-2">
					<Link href={`/${channel}/`} className="flex flex-col items-center text-gray-600 hover:text-temu-500">
						<Menu size={22} />
						<span className="text-[10px] mt-0.5">Shop</span>
					</Link>
					<Link href={`/${channel}/account/orders`} className="flex flex-col items-center text-gray-600 hover:text-temu-500">
						<Package size={22} />
						<span className="text-[10px] mt-0.5">Orders</span>
					</Link>
					<Link href={`/${channel}/wishlist`} className="relative flex flex-col items-center text-gray-600 hover:text-temu-500">
						<Heart size={22} />
						{wishlistCount > 0 && (
							<span className="absolute -top-1 left-1/2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
								{wishlistCount > 9 ? "9+" : wishlistCount}
							</span>
						)}
						<span className="text-[10px] mt-0.5">Wishlist</span>
					</Link>
					<Link href={`/${channel}/cart/`} className="relative flex flex-col items-center text-gray-600 hover:text-temu-500">
						<ShoppingCart size={22} />
						{cartItemCount > 0 && (
							<span className="absolute -top-1 left-1/2 bg-secondary-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
								{cartItemCount > 9 ? "9+" : cartItemCount}
							</span>
						)}
						<span className="text-[10px] mt-0.5">Cart</span>
					</Link>
					<Link href={`/${channel}/account/`} className="flex flex-col items-center text-gray-600 hover:text-temu-500">
						{user ? (
							<div className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-temu-500 to-temu-600 text-white flex items-center justify-center font-bold text-[10px]">
								{user.firstName.charAt(0).toUpperCase()}
							</div>
						) : (
							<div className="w-[22px] h-[22px] rounded-full bg-gray-200 flex items-center justify-center">
								<span className="text-gray-500 text-[10px]">?</span>
							</div>
						)}
						<span className="text-[10px] mt-0.5">Account</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
