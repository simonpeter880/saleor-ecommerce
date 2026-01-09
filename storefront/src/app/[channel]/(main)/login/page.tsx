import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { TemuLoginForm } from "@/ui/components/TemuLoginForm";

export const metadata = {
	title: "Sign In - TechHub Electronics",
	description: "Sign in to access exclusive deals and manage your account",
};

export default async function LoginPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<TemuLoginForm channel={params.channel} />
		</Suspense>
	);
}
