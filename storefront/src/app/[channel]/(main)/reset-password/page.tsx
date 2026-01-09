import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { TemuResetPasswordForm } from "@/ui/components/TemuResetPasswordForm";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Reset Password - TechHub Electronics",
	description: "Create a new password for your TechHub Electronics account",
};

export default async function ResetPasswordPage(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{ token?: string; email?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	const token = searchParams.token;
	const email = searchParams.email;

	// Redirect if no token or email provided
	if (!token || !email) {
		redirect(`/${params.channel}/forgot-password`);
	}

	return (
		<Suspense fallback={<Loader />}>
			<TemuResetPasswordForm channel={params.channel} token={token} email={email} />
		</Suspense>
	);
}
