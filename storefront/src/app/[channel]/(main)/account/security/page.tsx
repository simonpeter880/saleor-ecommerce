import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Shield, Key, Smartphone, Mail, ChevronRight, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Account Security - TechHub Electronics",
	description: "Manage your account security settings",
};

export default async function SecurityPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/security`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Account Security</h1>
				</div>

				{/* Security Score */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
							<Shield className="text-yellow-600" size={32} />
						</div>
						<div>
							<h3 className="font-bold text-gray-900 text-lg">Security Score: Good</h3>
							<p className="text-gray-600">Complete the steps below to improve your security</p>
						</div>
					</div>
				</div>

				{/* Security Options */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					{/* Password */}
					<button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
								<Key className="text-blue-600" size={20} />
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900">Password</p>
								<p className="text-sm text-gray-500">Last changed 30 days ago</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Check className="text-green-500" size={18} />
							<ChevronRight className="text-gray-400" size={20} />
						</div>
					</button>

					{/* Email Verification */}
					<button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
								<Mail className="text-purple-600" size={20} />
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900">Email Verification</p>
								<p className="text-sm text-gray-500">{user.email}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{user.isConfirmed ? (
								<Check className="text-green-500" size={18} />
							) : (
								<AlertTriangle className="text-yellow-500" size={18} />
							)}
							<ChevronRight className="text-gray-400" size={20} />
						</div>
					</button>

					{/* Two-Factor Authentication */}
					<button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
								<Smartphone className="text-green-600" size={20} />
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900">Two-Factor Authentication</p>
								<p className="text-sm text-gray-500">Add an extra layer of security</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Recommended</span>
							<ChevronRight className="text-gray-400" size={20} />
						</div>
					</button>

					{/* Login Activity */}
					<button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
								<Shield className="text-gray-600" size={20} />
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-900">Login Activity</p>
								<p className="text-sm text-gray-500">Review recent login sessions</p>
							</div>
						</div>
						<ChevronRight className="text-gray-400" size={20} />
					</button>
				</div>

				{/* Danger Zone */}
				<div className="mt-6 bg-white rounded-2xl shadow-sm border border-red-200 p-6">
					<h3 className="font-bold text-red-600 mb-4">Danger Zone</h3>
					<button className="w-full text-left p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
						<p className="font-medium text-red-600">Delete Account</p>
						<p className="text-sm text-red-400">Permanently delete your account and all data</p>
					</button>
				</div>
			</div>
		</div>
	);
}
