import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

export function TemuFooter({ channel }: { channel: string }) {
	return (
		<footer className="bg-gray-900 text-gray-300 mt-16">
			{/* Newsletter Section */}
			<div className="bg-gradient-to-r from-temu-500 to-temu-600 py-12">
				<div className="mx-auto max-w-7xl px-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="text-white text-center md:text-left">
							<h3 className="text-2xl font-black mb-2">Get Exclusive Deals in Your Inbox!</h3>
							<p className="text-sm opacity-90">Subscribe to our newsletter and save up to 20% on your first order</p>
						</div>
						<div className="flex gap-2 w-full md:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="px-4 py-3 rounded-full w-full md:w-80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
							/>
							<button className="bg-white text-temu-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
								Subscribe
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer Content */}
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
					{/* Shop */}
					<div>
						<h4 className="text-white font-bold mb-4">Shop</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href={`/${channel}/categories/mobile-phones-mobile-technology`} className="hover:text-temu-400 transition-colors">
									Mobile Phones
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/computers-laptops-workstations`} className="hover:text-temu-400 transition-colors">
									Computers & Laptops
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/tablets-e-readers`} className="hover:text-temu-400 transition-colors">
									Tablets & E-Readers
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/gaming-esports`} className="hover:text-temu-400 transition-colors">
									Gaming & Esports
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/categories/audio-sound-music-equipment`} className="hover:text-temu-400 transition-colors">
									Audio & Sound
								</Link>
							</li>
						</ul>
					</div>

					{/* Help & Support */}
					<div>
						<h4 className="text-white font-bold mb-4">Help & Support</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href={`/${channel}/contact`} className="hover:text-temu-400 transition-colors">
									Contact Us
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/faq`} className="hover:text-temu-400 transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/shipping`} className="hover:text-temu-400 transition-colors">
									Shipping Info
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/returns`} className="hover:text-temu-400 transition-colors">
									Returns & Refunds
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/track-order`} className="hover:text-temu-400 transition-colors">
									Track Order
								</Link>
							</li>
						</ul>
					</div>

					{/* About Us */}
					<div>
						<h4 className="text-white font-bold mb-4">About Us</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href={`/${channel}/about`} className="hover:text-temu-400 transition-colors">
									Our Story
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/careers`} className="hover:text-temu-400 transition-colors">
									Careers
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/press`} className="hover:text-temu-400 transition-colors">
									Press
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/blog`} className="hover:text-temu-400 transition-colors">
									Blog
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/sustainability`} className="hover:text-temu-400 transition-colors">
									Sustainability
								</Link>
							</li>
						</ul>
					</div>

					{/* Policies */}
					<div>
						<h4 className="text-white font-bold mb-4">Policies</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href={`/${channel}/privacy`} className="hover:text-temu-400 transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/terms`} className="hover:text-temu-400 transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/cookies`} className="hover:text-temu-400 transition-colors">
									Cookie Policy
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/intellectual-property`} className="hover:text-temu-400 transition-colors">
									Intellectual Property
								</Link>
							</li>
							<li>
								<Link href={`/${channel}/accessibility`} className="hover:text-temu-400 transition-colors">
									Accessibility
								</Link>
							</li>
						</ul>
					</div>

					{/* Download App */}
					<div>
						<h4 className="text-white font-bold mb-4">Download App</h4>
						<div className="space-y-3">
							<Link
								href="#"
								className="block bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-3"
							>
								<div className="flex items-center gap-2">
									<div className="text-2xl">📱</div>
									<div>
										<div className="text-xs">Download on the</div>
										<div className="font-bold text-white">App Store</div>
									</div>
								</div>
							</Link>
							<Link
								href="#"
								className="block bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-3"
							>
								<div className="flex items-center gap-2">
									<div className="text-2xl">🤖</div>
									<div>
										<div className="text-xs">GET IT ON</div>
										<div className="font-bold text-white">Google Play</div>
									</div>
								</div>
							</Link>
						</div>
					</div>
				</div>

				{/* Social Media & Payment Methods */}
				<div className="border-t border-gray-800 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						{/* Social Media */}
						<div>
							<div className="text-sm mb-3 text-center md:text-left">Follow Us</div>
							<div className="flex gap-4">
								<Link
									href="#"
									className="bg-gray-800 p-3 rounded-full hover:bg-temu-500 transition-colors"
								>
									<Facebook size={20} />
								</Link>
								<Link
									href="#"
									className="bg-gray-800 p-3 rounded-full hover:bg-temu-500 transition-colors"
								>
									<Twitter size={20} />
								</Link>
								<Link
									href="#"
									className="bg-gray-800 p-3 rounded-full hover:bg-temu-500 transition-colors"
								>
									<Instagram size={20} />
								</Link>
								<Link
									href="#"
									className="bg-gray-800 p-3 rounded-full hover:bg-temu-500 transition-colors"
								>
									<Youtube size={20} />
								</Link>
								<Link
									href="#"
									className="bg-gray-800 p-3 rounded-full hover:bg-temu-500 transition-colors"
								>
									<Mail size={20} />
								</Link>
							</div>
						</div>

						{/* Payment Methods */}
						<div>
							<div className="text-sm mb-3 text-center md:text-right">We Accept</div>
							<div className="flex gap-2 justify-center md:justify-end flex-wrap">
								<div className="bg-white px-3 py-2 rounded text-xs font-bold text-gray-900">VISA</div>
								<div className="bg-white px-3 py-2 rounded text-xs font-bold text-gray-900">
									MASTERCARD
								</div>
								<div className="bg-white px-3 py-2 rounded text-xs font-bold text-gray-900">PAYPAL</div>
								<div className="bg-white px-3 py-2 rounded text-xs font-bold text-gray-900">
									MTN MOMO
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="bg-gray-950 py-6">
				<div className="mx-auto max-w-7xl px-4">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
						<div className="text-center md:text-left">
							© 2025 TechHub Electronics. All rights reserved.
						</div>
						<div className="flex gap-6 text-xs">
							<Link href={`/${channel}/sitemap`} className="hover:text-temu-400 transition-colors">
								Sitemap
							</Link>
							<Link href={`/${channel}/privacy`} className="hover:text-temu-400 transition-colors">
								Privacy
							</Link>
							<Link href={`/${channel}/terms`} className="hover:text-temu-400 transition-colors">
								Terms
							</Link>
							<Link href={`/${channel}/cookies`} className="hover:text-temu-400 transition-colors">
								Cookies
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
