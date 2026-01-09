import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { UserCircle, Mail, Phone, Calendar, Edit2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Your Profile - TechHub Electronics",
	description: "Manage your TechHub profile and personal information",
};

export default async function ProfilePage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/profile`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Your Profile</h1>
				</div>

				{/* Profile Card */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					{/* Avatar Section */}
					<div className="bg-gradient-to-r from-temu-500 to-temu-600 p-8 text-center text-white">
						<div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
							{user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
						</div>
						<h2 className="text-2xl font-bold">
							{user.firstName} {user.lastName}
						</h2>
						<p className="text-white/80">{user.email}</p>
					</div>

					{/* Profile Details */}
					<div className="p-6 space-y-4">
						<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
							<div className="flex items-center gap-3">
								<UserCircle className="text-gray-400" size={24} />
								<div>
									<p className="text-sm text-gray-500">Full Name</p>
									<p className="font-medium">{user.firstName} {user.lastName || "Not set"}</p>
								</div>
							</div>
							<button className="text-temu-500 hover:text-temu-600">
								<Edit2 size={18} />
							</button>
						</div>

						<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
							<div className="flex items-center gap-3">
								<Mail className="text-gray-400" size={24} />
								<div>
									<p className="text-sm text-gray-500">Email Address</p>
									<p className="font-medium">{user.email}</p>
								</div>
							</div>
							<span className={`text-xs px-2 py-1 rounded-full ${user.isConfirmed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
								{user.isConfirmed ? 'Verified' : 'Unverified'}
							</span>
						</div>

						<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
							<div className="flex items-center gap-3">
								<Calendar className="text-gray-400" size={24} />
								<div>
									<p className="text-sm text-gray-500">Member Since</p>
									<p className="font-medium">{new Date(user.dateJoined).toLocaleDateString()}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="border-t border-gray-100 p-6">
						<button className="w-full bg-temu-500 text-white py-3 rounded-full font-bold hover:bg-temu-600 transition-colors">
							Edit Profile
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
