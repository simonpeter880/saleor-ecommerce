import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Your Reviews - TechHub Electronics",
	description: "View and manage your product reviews",
};

export default async function ReviewsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/reviews`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Your Reviews</h1>
					<p className="text-gray-600">Products you've reviewed</p>
				</div>

				{/* Empty State */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
					<div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
						<MessageSquare className="text-gray-400" size={40} />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h2>
					<p className="text-gray-600 mb-6">
						Share your thoughts on products you've purchased to help other shoppers
					</p>
					<Link
						href={`/${params.channel}/orders`}
						className="inline-block bg-temu-500 text-white px-8 py-3 rounded-full font-bold hover:bg-temu-600 transition-colors"
					>
						View Your Orders
					</Link>
				</div>

				{/* Review Stats */}
				<div className="mt-6 grid grid-cols-3 gap-4">
					<div className="bg-white rounded-xl p-4 text-center border border-gray-100">
						<div className="text-2xl font-bold text-gray-900">0</div>
						<div className="text-sm text-gray-500">Total Reviews</div>
					</div>
					<div className="bg-white rounded-xl p-4 text-center border border-gray-100">
						<div className="flex items-center justify-center gap-1">
							<Star className="text-yellow-400 fill-yellow-400" size={20} />
							<span className="text-2xl font-bold text-gray-900">--</span>
						</div>
						<div className="text-sm text-gray-500">Avg Rating</div>
					</div>
					<div className="bg-white rounded-xl p-4 text-center border border-gray-100">
						<div className="text-2xl font-bold text-gray-900">0</div>
						<div className="text-sm text-gray-500">Helpful Votes</div>
					</div>
				</div>
			</div>
		</div>
	);
}
