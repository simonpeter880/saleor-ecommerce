import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { TemuEmailVerificationPage } from "@/ui/components/TemuEmailVerificationPage";

export const metadata = {
	title: "Verify Email - TechHub Electronics",
	description: "Verify your email address to activate your account",
};

export default async function VerifyEmailPage(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{ token?: string; email?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	const token = searchParams.token || null;
	const email = searchParams.email || null;

	return (
		<Suspense fallback={<Loader />}>
			<TemuEmailVerificationPage channel={params.channel} token={token} email={email} />
		</Suspense>
	);
}
