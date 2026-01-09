"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	User,
	Package,
	Star,
	UserCircle,
	Ticket,
	Wallet,
	Store,
	Clock,
	MapPin,
	Shield,
	Key,
	Bell,
	Users,
	LogOut,
	ChevronRight,
	Gift,
} from "lucide-react";

interface UserData {
	email: string;
	firstName: string;
	isLoggedIn: boolean;
}

interface AccountDropdownProps {
	user: UserData | null;
	channel: string;
	onSignOut: () => void;
}

interface MenuItem {
	icon: React.ReactNode;
	label: string;
	href?: string;
	onClick?: () => void;
	badge?: string;
	dividerAfter?: boolean;
}

export function AccountDropdown({ user, channel, onSignOut }: AccountDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSignOut = () => {
		setIsOpen(false);
		onSignOut();
	};

	const menuItems: MenuItem[] = [
		{
			icon: <Package size={20} />,
			label: "Your orders",
			href: `/${channel}/orders`,
		},
		{
			icon: <Star size={20} />,
			label: "Your reviews",
			href: `/${channel}/account/reviews`,
		},
		{
			icon: <UserCircle size={20} />,
			label: "Your profile",
			href: `/${channel}/account/profile`,
			dividerAfter: true,
		},
		{
			icon: <Ticket size={20} />,
			label: "Coupon codes",
			href: `/${channel}/account/coupons`,
			badge: "3 available",
		},
		{
			icon: <Wallet size={20} />,
			label: "Credit balance",
			href: `/${channel}/account/credits`,
			badge: "UGX 0",
		},
		{
			icon: <Gift size={20} />,
			label: "Rewards & points",
			href: `/${channel}/account/rewards`,
			dividerAfter: true,
		},
		{
			icon: <Store size={20} />,
			label: "Followed stores",
			href: `/${channel}/account/followed-stores`,
		},
		{
			icon: <Clock size={20} />,
			label: "Browsing history",
			href: `/${channel}/account/history`,
		},
		{
			icon: <MapPin size={20} />,
			label: "Addresses",
			href: `/${channel}/account/addresses`,
			dividerAfter: true,
		},
		{
			icon: <Shield size={20} />,
			label: "Account security",
			href: `/${channel}/account/security`,
		},
		{
			icon: <Key size={20} />,
			label: "Permissions",
			href: `/${channel}/account/permissions`,
		},
		{
			icon: <Bell size={20} />,
			label: "Notifications",
			href: `/${channel}/account/notifications`,
			badge: "5 new",
		},
		{
			icon: <Users size={20} />,
			label: "Switch accounts",
			href: `/${channel}/account/switch`,
			dividerAfter: true,
		},
		{
			icon: <LogOut size={20} />,
			label: "Sign out",
			onClick: handleSignOut,
		},
	];

	if (!user) {
		return (
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex flex-col items-center text-gray-700 hover:text-temu-500 transition-colors"
				>
					<User size={24} />
					<span className="text-xs mt-1">Sign In</span>
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
						{/* Sign In Header */}
						<div className="bg-gradient-to-r from-temu-500 to-temu-600 p-6 text-white text-center">
							<div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
								<User size={32} />
							</div>
							<h3 className="text-lg font-bold mb-1">Welcome to TechHub</h3>
							<p className="text-sm text-white/80">Sign in for the best experience</p>
						</div>

						<div className="p-4 space-y-3">
							<Link
								href={`/${channel}/login`}
								onClick={() => setIsOpen(false)}
								className="block w-full bg-temu-500 text-white text-center py-3 rounded-full font-bold hover:bg-temu-600 transition-colors"
							>
								Sign In
							</Link>
							<Link
								href={`/${channel}/register`}
								onClick={() => setIsOpen(false)}
								className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
							>
								Create Account
							</Link>
						</div>

						{/* Benefits */}
						<div className="border-t border-gray-100 p-4">
							<p className="text-xs text-gray-500 mb-3">Benefits of signing in:</p>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Package size={16} className="text-temu-500" />
									<span>Track your orders easily</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Ticket size={16} className="text-temu-500" />
									<span>Exclusive coupons & deals</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Gift size={16} className="text-temu-500" />
									<span>Earn rewards on purchases</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex flex-col items-center text-gray-700 hover:text-temu-500 transition-colors"
			>
				<div className="w-8 h-8 rounded-full bg-gradient-to-r from-temu-500 to-temu-600 text-white flex items-center justify-center font-bold text-sm">
					{user.firstName.charAt(0).toUpperCase()}
				</div>
				<span className="text-xs mt-1">{user.firstName || "Account"}</span>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
					{/* User Header */}
					<div className="bg-gradient-to-r from-temu-500 to-temu-600 p-4 text-white">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
								{user.firstName.charAt(0).toUpperCase()}
							</div>
							<div>
								<h3 className="font-bold">{user.firstName}</h3>
								<p className="text-sm text-white/80">{user.email}</p>
							</div>
						</div>
						{/* Quick Stats */}
						<div className="grid grid-cols-3 gap-2 mt-4 text-center">
							<Link
								href={`/${channel}/account/coupons`}
								onClick={() => setIsOpen(false)}
								className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"
							>
								<div className="text-lg font-bold">3</div>
								<div className="text-xs text-white/80">Coupons</div>
							</Link>
							<Link
								href={`/${channel}/account/credits`}
								onClick={() => setIsOpen(false)}
								className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"
							>
								<div className="text-lg font-bold">0</div>
								<div className="text-xs text-white/80">Credits</div>
							</Link>
							<Link
								href={`/${channel}/account/rewards`}
								onClick={() => setIsOpen(false)}
								className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"
							>
								<div className="text-lg font-bold">150</div>
								<div className="text-xs text-white/80">Points</div>
							</Link>
						</div>
					</div>

					{/* Menu Items */}
					<div className="max-h-80 overflow-y-auto py-2">
						{menuItems.map((item, index) => (
							<div key={index}>
								{item.href ? (
									<Link
										href={item.href}
										onClick={() => setIsOpen(false)}
										className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<span className="text-gray-500">{item.icon}</span>
											<span className="text-sm font-medium text-gray-700">{item.label}</span>
										</div>
										<div className="flex items-center gap-2">
											{item.badge && (
												<span className="text-xs text-temu-500 font-medium">{item.badge}</span>
											)}
											<ChevronRight size={16} className="text-gray-400" />
										</div>
									</Link>
								) : (
									<button
										onClick={item.onClick}
										className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<span className="text-red-500">{item.icon}</span>
											<span className="text-sm font-medium text-red-500">{item.label}</span>
										</div>
									</button>
								)}
								{item.dividerAfter && <div className="border-t border-gray-100 my-1" />}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
