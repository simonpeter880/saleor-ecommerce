import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Addresses - TechHub Electronics",
	description: "Manage your delivery addresses",
};

export default async function AddressesPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	let user = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch {
		// Not logged in
	}

	if (!user) {
		redirect(`/${params.channel}/login?next=/account/addresses`);
	}

	const addresses = user.addresses || [];

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<div>
						<Link href={`/${params.channel}/account`} className="text-temu-500 hover:underline text-sm">
							&larr; Back to Account
						</Link>
						<h1 className="text-3xl font-black text-gray-900 mt-2">Addresses</h1>
					</div>
					<button className="flex items-center gap-2 bg-temu-500 text-white px-4 py-2 rounded-full font-medium hover:bg-temu-600 transition-colors">
						<Plus size={18} />
						Add Address
					</button>
				</div>

				{/* Addresses List */}
				{addresses.length > 0 ? (
					<div className="space-y-4">
						{addresses.map((address: any, index: number) => (
							<div
								key={address.id || index}
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 bg-temu-100 rounded-full flex items-center justify-center">
											{index === 0 ? (
												<Home className="text-temu-500" size={20} />
											) : (
												<Briefcase className="text-temu-500" size={20} />
											)}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<h3 className="font-bold text-gray-900">
													{address.firstName} {address.lastName}
												</h3>
												{index === 0 && (
													<span className="text-xs bg-temu-100 text-temu-600 px-2 py-0.5 rounded-full">
														Default
													</span>
												)}
											</div>
											<p className="text-gray-600 mt-1">
												{address.streetAddress1}
												{address.streetAddress2 && `, ${address.streetAddress2}`}
											</p>
											<p className="text-gray-600">
												{address.city}, {address.countryArea} {address.postalCode}
											</p>
											<p className="text-gray-600">{address.country?.country}</p>
											{address.phone && (
												<p className="text-gray-500 text-sm mt-2">{address.phone}</p>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2">
										<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
											<Edit2 size={18} className="text-gray-500" />
										</button>
										<button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
											<Trash2 size={18} className="text-red-500" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
						<div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<MapPin className="text-gray-400" size={40} />
						</div>
						<h2 className="text-xl font-bold text-gray-900 mb-2">No addresses saved</h2>
						<p className="text-gray-600 mb-6">
							Add a delivery address to speed up checkout
						</p>
						<button className="inline-flex items-center gap-2 bg-temu-500 text-white px-8 py-3 rounded-full font-bold hover:bg-temu-600 transition-colors">
							<Plus size={20} />
							Add Your First Address
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
