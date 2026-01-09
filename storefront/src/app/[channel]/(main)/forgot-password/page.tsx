import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { TemuForgotPasswordForm } from "@/ui/components/TemuForgotPasswordForm";

export const metadata = {
	title: "Forgot Password - TechHub Electronics",
	description: "Reset your TechHub Electronics account password",
};

export default async function ForgotPasswordPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<TemuForgotPasswordForm channel={params.channel} />
		</Suspense>
	);
}
