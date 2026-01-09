import { redirect } from "next/navigation";
import { handleGoogleCallbackAction } from "@/app/auth-actions";

export const metadata = {
	title: "Authenticating... - TechHub Electronics",
	description: "Completing your sign-in",
};

export default async function CallbackPage(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}) {
	const searchParams = await props.searchParams;
	const code = searchParams.code;
	const state = searchParams.state;
	const error = searchParams.error;

	if (error) {
		redirect("/channel-pln/login?error=oauth_failed");
	}

	if (!code || !state) {
		redirect("/channel-pln/login?error=invalid_callback");
	}

	// Handle the OAuth callback
	await handleGoogleCallbackAction(code, state);

	// If we get here without redirect, something went wrong
	redirect("/channel-pln/login?error=auth_failed");
}
