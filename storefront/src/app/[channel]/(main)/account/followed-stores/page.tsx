import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Store, Bell, BellOff } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Followed Stores - TechHub Electronics",
	description: "Stores you follow for updates and deals",
};

export default async function FollowedStoresPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/followed-stores`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Followed Stores</h1>
					<p className="text-gray-600">Get updates from your favorite stores</p>
				</div>

				{/* Empty State */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
					<div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
						<Store className="text-gray-400" size={40} />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">No stores followed yet</h2>
					<p className="text-gray-600 mb-6">
						Follow stores to get notified about new products and deals
					</p>
					<Link
						href={`/${params.channel}/`}
						className="inline-block bg-temu-500 text-white px-8 py-3 rounded-full font-bold hover:bg-temu-600 transition-colors"
					>
						Discover Stores
					</Link>
				</div>

				{/* Info Card */}
				<div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
					<div className="flex items-start gap-3">
						<Bell className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
						<div>
							<p className="font-medium text-blue-900">Stay Updated</p>
							<p className="text-sm text-blue-700">
								When you follow a store, you'll receive notifications about new arrivals, sales, and exclusive deals.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
