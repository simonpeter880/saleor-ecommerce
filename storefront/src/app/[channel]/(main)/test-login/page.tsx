import { cookies } from "next/headers";
import { getServerAuthClient } from "@/app/config";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";

export default async function TestLoginPage() {
	const cookieStore = await cookies();
	const authClient = await getServerAuthClient();

	// Get all cookies
	const allCookies = cookieStore.getAll();

	// Try to get current user
	let user = null;
	let userError = null;
	try {
		const { me } = await executeGraphQL(CurrentUserDocument, { cache: "no-store" });
		user = me;
	} catch (error) {
		userError = error instanceof Error ? error.message : "Unknown error";
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-2xl font-bold mb-4">🔍 Authentication Debug Page</h1>

				<div className="space-y-6">
					{/* Cookies */}
					<div className="border-b pb-4">
						<h2 className="text-lg font-semibold mb-2">Cookies ({allCookies.length})</h2>
						{allCookies.length === 0 ? (
							<p className="text-gray-500">No cookies found</p>
						) : (
							<ul className="space-y-1 font-mono text-sm">
								{allCookies.map((cookie) => (
									<li key={cookie.name} className="bg-gray-50 p-2 rounded">
										<strong>{cookie.name}:</strong> {cookie.value.substring(0, 50)}...
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Current User */}
					<div className="border-b pb-4">
						<h2 className="text-lg font-semibold mb-2">Current User</h2>
						{user ? (
							<div className="bg-green-50 p-4 rounded">
								<p className="text-green-800">✅ Logged in as: <strong>{user.email}</strong></p>
								<p className="text-sm text-gray-600">
									Name: {user.firstName} {user.lastName}
								</p>
							</div>
						) : (
							<div className="bg-red-50 p-4 rounded">
								<p className="text-red-800">❌ Not logged in</p>
								{userError && (
									<p className="text-sm text-gray-600 mt-2">Error: {userError}</p>
								)}
							</div>
						)}
					</div>

					{/* Test Credentials */}
					<div>
						<h2 className="text-lg font-semibold mb-2">Test Credentials</h2>
						<div className="bg-blue-50 p-4 rounded">
							<p className="font-mono text-sm">
								Email: admin@example.com<br />
								Password: admin
							</p>
							<a
								href="/channel-pln/login"
								className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Go to Login Page
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
