import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Bell, Mail, Smartphone, Tag, Package, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Notifications - TechHub Electronics",
	description: "Manage your notification preferences",
};

export default async function NotificationsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/notifications`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Notifications</h1>
					<p className="text-gray-600">Choose how you want to be notified</p>
				</div>

				{/* Email Notifications */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<div className="flex items-center gap-3 mb-6">
						<Mail className="text-temu-500" size={24} />
						<h3 className="font-bold text-gray-900 text-lg">Email Notifications</h3>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Package className="text-gray-400" size={20} />
								<div>
									<p className="font-medium">Order Updates</p>
									<p className="text-sm text-gray-500">Shipping and delivery updates</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" defaultChecked className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Tag className="text-gray-400" size={20} />
								<div>
									<p className="font-medium">Deals & Promotions</p>
									<p className="text-sm text-gray-500">Special offers and discounts</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" defaultChecked className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<MessageSquare className="text-gray-400" size={20} />
								<div>
									<p className="font-medium">Product Reviews</p>
									<p className="text-sm text-gray-500">Reminders to review purchased items</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Push Notifications */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-center gap-3 mb-6">
						<Smartphone className="text-temu-500" size={24} />
						<h3 className="font-bold text-gray-900 text-lg">Push Notifications</h3>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Bell className="text-gray-400" size={20} />
								<div>
									<p className="font-medium">All Push Notifications</p>
									<p className="text-sm text-gray-500">Enable or disable all push notifications</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" defaultChecked className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
