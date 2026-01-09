"use client";

import Link from "next/link";
import { Search, Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
					{/* Animated Error Code */}
					<div className="mb-8 animate-fade-in">
						<h1 className="animate-bounce-slow text-9xl font-bold bg-gradient-to-r from-[#FB7701] to-orange-600 bg-clip-text text-transparent">
							404
						</h1>
						<div className="mt-4 text-6xl animate-pulse">🔍</div>
					</div>

					{/* Error Message */}
					<div className="mb-8 animate-fade-in-up">
						<h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
							Oops! Page Not Found
						</h2>
						<p className="mb-4 max-w-md text-lg text-gray-600 dark:text-gray-300">
							The page you're looking for seems to have wandered off into the digital void.
						</p>
						<p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
							Don't worry though – we've got plenty of amazing products waiting for you!
						</p>
					</div>

					{/* Quick Action Buttons */}
					<div className="mb-12 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-100">
						<Link
							href="/"
							className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FB7701] to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
						>
							<Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
							Back to Home
						</Link>
						<Link
							href="/search"
							className="group inline-flex items-center gap-2 rounded-lg border-2 border-[#FB7701] bg-white px-6 py-3 font-semibold text-[#FB7701] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-orange-400"
						>
							<Search className="h-5 w-5" />
							Search Products
						</Link>
						<Link
							href="/deals"
							className="group inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<ShoppingBag className="h-5 w-5" />
							Browse Deals
						</Link>
					</div>

					{/* Popular Categories */}
					<div className="w-full max-w-6xl animate-fade-in-up delay-200">
						<h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
							Popular Categories
						</h3>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{[
								{
									name: "Mobile Phones",
									icon: "📱",
									href: "/categories/mobile-phones-mobile-technology",
									description: "Latest smartphones",
								},
								{
									name: "Computers",
									icon: "💻",
									href: "/categories/computers-laptops-workstations",
									description: "Laptops & desktops",
								},
								{
									name: "Gaming",
									icon: "🎮",
									href: "/categories/gaming-esports",
									description: "Gaming gear",
								},
								{
									name: "Smart Home",
									icon: "🏠",
									href: "/categories/smart-home-iot",
									description: "IoT devices",
								},
							].map((category, index) => (
								<Link
									key={category.name}
									href={category.href}
									className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#FB7701] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800"
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-orange-900/20" />
									<div className="relative">
										<div className="text-5xl mb-3 transition-transform group-hover:scale-110">
											{category.icon}
										</div>
										<h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#FB7701] dark:text-white dark:group-hover:text-orange-400">
											{category.name}
										</h4>
										<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
											{category.description}
										</p>
										<div className="mt-3 flex items-center text-sm font-medium text-[#FB7701] opacity-0 transition-opacity group-hover:opacity-100">
											Explore now
											<ArrowLeft className="ml-1 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* Help Section */}
					<div className="mt-12 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-8 shadow-sm animate-fade-in-up delay-300 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<div className="text-4xl">💬</div>
							<div className="text-center sm:text-left">
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									Need assistance finding something?
								</p>
								<p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
									Our support team is here to help.{" "}
									<Link
										href="/pages/contact"
										className="font-semibold text-[#FB7701] hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:text-orange-400"
									>
										Contact us
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes bounce-slow {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.6s ease-out;
				}

				.animate-fade-in-up {
					animation: fade-in-up 0.8s ease-out;
				}

				.animate-bounce-slow {
					animation: bounce-slow 2s ease-in-out infinite;
				}

				.delay-100 {
					animation-delay: 100ms;
				}

				.delay-200 {
					animation-delay: 200ms;
				}

				.delay-300 {
					animation-delay: 300ms;
				}
			`}</style>
		</div>
	);
}
