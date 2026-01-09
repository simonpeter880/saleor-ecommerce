import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Users, Plus, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Switch Accounts - TechHub Electronics",
	description: "Switch between your TechHub accounts",
};

export default async function SwitchAccountsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/switch`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Switch Accounts</h1>
					<p className="text-gray-600">Manage and switch between your accounts</p>
				</div>

				{/* Current Account */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
					<div className="p-4 bg-gray-50 border-b border-gray-100">
						<p className="text-sm font-medium text-gray-500">Currently signed in as</p>
					</div>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full bg-gradient-to-r from-temu-500 to-temu-600 text-white flex items-center justify-center font-bold text-lg">
									{user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
								</div>
								<div>
									<p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
									<p className="text-sm text-gray-500">{user.email}</p>
								</div>
							</div>
							<div className="flex items-center gap-2 text-green-500">
								<Check size={20} />
								<span className="text-sm font-medium">Active</span>
							</div>
						</div>
					</div>
				</div>

				{/* Add Account */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					<Link
						href={`/${params.channel}/login`}
						className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
								<Plus className="text-gray-400" size={24} />
							</div>
							<div>
								<p className="font-bold text-gray-900">Add Another Account</p>
								<p className="text-sm text-gray-500">Sign in with a different email</p>
							</div>
						</div>
						<ChevronRight className="text-gray-400" size={20} />
					</Link>
				</div>

				{/* Info */}
				<div className="mt-6 text-center text-sm text-gray-500">
					<p>You can add multiple accounts and switch between them easily.</p>
					<p className="mt-1">Each account has its own orders, wishlist, and settings.</p>
				</div>
			</div>
		</div>
	);
}
