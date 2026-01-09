import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Key, MapPin, Camera, Bell, Cookie } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Permissions - TechHub Electronics",
	description: "Manage app permissions and data access",
};

export default async function PermissionsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/permissions`);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
						&larr; Back to Account
					</Link>
					<h1 className="text-3xl font-black text-gray-900 mt-2">Permissions</h1>
					<p className="text-gray-600">Control how TechHub accesses your data</p>
				</div>

				{/* Permissions List */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					<div className="p-4 border-b border-gray-100">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
									<MapPin className="text-blue-600" size={20} />
								</div>
								<div>
									<p className="font-medium">Location</p>
									<p className="text-sm text-gray-500">For delivery and store suggestions</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" defaultChecked className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>
					</div>

					<div className="p-4 border-b border-gray-100">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
									<Camera className="text-purple-600" size={20} />
								</div>
								<div>
									<p className="font-medium">Camera</p>
									<p className="text-sm text-gray-500">For scanning barcodes and uploading photos</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>
					</div>

					<div className="p-4 border-b border-gray-100">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
									<Bell className="text-green-600" size={20} />
								</div>
								<div>
									<p className="font-medium">Notifications</p>
									<p className="text-sm text-gray-500">For order updates and deals</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" defaultChecked className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>
					</div>

					<div className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
									<Cookie className="text-yellow-600" size={20} />
								</div>
								<div>
									<p className="font-medium">Cookies & Tracking</p>
									<p className="text-sm text-gray-500">For personalized experience</p>
								</div>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" defaultChecked className="sr-only peer" />
								<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temu-500"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Privacy Link */}
				<div className="mt-6 text-center">
					<Link href={`/${params.channel}/privacy`} className="text-temu-500 hover:underline text-sm">
						Read our Privacy Policy
					</Link>
				</div>
			</div>
		</div>
	);
}
