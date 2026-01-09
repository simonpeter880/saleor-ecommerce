import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { TemuRegisterForm } from "@/ui/components/TemuRegisterForm";

export const metadata = {
	title: "Create Account - TechHub Electronics",
	description: "Join TechHub Electronics and get exclusive deals on electronics",
};

export default async function RegisterPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<Suspense fallback={<Loader />}>
			<TemuRegisterForm channel={params.channel} />
		</Suspense>
	);
}
