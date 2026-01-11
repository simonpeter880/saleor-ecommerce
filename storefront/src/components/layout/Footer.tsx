import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer({ channel }: { channel: string }) {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-gray-300 mt-16">
			{/* Newsletter Section - Clean, professional */}
			<div className="bg-primary-700 dark:bg-primary-800 py-10">
				<div className="mx-auto max-w-7xl px-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="text-white text-center md:text-left">
							<h3 className="text-xl font-bold mb-2">Stay Updated</h3>
							<p className="text-sm opacity-90">Subscribe to our newsletter for updates and exclusive offers</p>
						</div>
						<div className="flex gap-2 w-full md:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="px-4 py-2.5 rounded-md w-full md:w-80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
							/>
							<button className="bg-white text-primary-700 px-6 py-2.5 rounded-md font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
								Subscribe
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer Content */}
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
					{/* Shop */}
					<div>
						<h4 className="text-white font-semibold mb-4">Shop</h4>
						<ul className="space-y-2.5 text-sm">
							<li>
								<Link href={`/${channel}/products`} className="hover:text-primary-400 transition-colors">
									All Products
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/mobile-phones-mobile-technology`} className="hover:text-primary-400 transition-colors">
									Mobile Phones
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/computers-laptops-workstations`} className="hover:text-primary-400 transition-colors">
									Computers & Laptops
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/tablets-e-readers`} className="hover:text-primary-400 transition-colors">
									Tablets
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/gaming-esports`} className="hover:text-primary-400 transition-colors">
									Gaming
								</Link>
							</li>
						</ul>
					</div>

					{/* Customer Service */}
					<div>
						<h4 className="text-white font-semibold mb-4">Customer Service</h4>
						<ul className="space-y-2.5 text-sm">
							<li>
								<Link href={`/${channel}/contact`} className="hover:text-primary-400 transition-colors">
									Contact Us
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/faq`} className="hover:text-primary-400 transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/account/orders`} className="hover:text-primary-400 transition-colors">
									Track Order
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary-400 transition-colors">
									Shipping Info
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary-400 transition-colors">
									Returns
								</Link>
							</li>
						</ul>
					</div>

					{/* My Account */}
					<div>
						<h4 className="text-white font-semibold mb-4">My Account</h4>
						<ul className="space-y-2.5 text-sm">
							<li>
								<Link href={`/${channel}/account`} className="hover:text-primary-400 transition-colors">
									Dashboard
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/account/orders`} className="hover:text-primary-400 transition-colors">
									My Orders
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/wishlist`} className="hover:text-primary-400 transition-colors">
									Wishlist
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/account/addresses`} className="hover:text-primary-400 transition-colors">
									Addresses
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/account/profile`} className="hover:text-primary-400 transition-colors">
									Profile
								</Link>
							</li>
						</ul>
					</div>

					{/* About */}
					<div>
						<h4 className="text-white font-semibold mb-4">About</h4>
						<ul className="space-y-2.5 text-sm">
							<li>
								<Link href={`/${channel}/about`} className="hover:text-primary-400 transition-colors">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary-400 transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary-400 transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary-400 transition-colors">
									Accessibility
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-gray-800 pt-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						{/* Copyright */}
						<p className="text-sm text-gray-400">
							© {currentYear} TechHub Electronics. All rights reserved.
						</p>

						{/* Social Media Links */}
						<div className="flex items-center gap-4">
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors"
								aria-label="Facebook"
							>
								<Facebook size={20} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors"
								aria-label="Twitter"
							>
								<Twitter size={20} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors"
								aria-label="Instagram"
							>
								<Instagram size={20} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors"
								aria-label="YouTube"
							>
								<Youtube size={20} />
							</a>
						</div>

						{/* Payment Methods */}
						<div className="flex items-center gap-2 text-xs text-gray-400">
							<span>We accept:</span>
							<div className="flex gap-2">
								<span className="px-2 py-1 bg-gray-800 rounded">Visa</span>
								<span className="px-2 py-1 bg-gray-800 rounded">Mastercard</span>
								<span className="px-2 py-1 bg-gray-800 rounded">PayPal</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
