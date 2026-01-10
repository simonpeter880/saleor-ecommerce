import { Header } from "./Header";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { Suspense } from "react";

async function HeaderContent({ channel }: { channel: string }) {
	try {
		// Get authenticated user via GraphQL
		const { me: user } = await executeGraphQL(CurrentUserDocument, {
			cache: "no-store",
		});

		const userData = user
			? {
					email: user.email,
					firstName: user.firstName || "",
					isLoggedIn: true,
			  }
			: null;

		return <Header channel={channel} user={userData} />;
	} catch {
		// Fallback to header without user data (not logged in)
		return <Header channel={channel} user={null} />;
	}
}

export function HeaderWrapper({ channel }: { channel: string }) {
	return (
		<Suspense fallback={<Header channel={channel} user={null} />}>
			<HeaderContent channel={channel} />
		</Suspense>
	);
}
