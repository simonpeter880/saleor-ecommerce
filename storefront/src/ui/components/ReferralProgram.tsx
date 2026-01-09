"use client";

import { useState, useEffect } from "react";
import { Users, Gift, Copy, Check, Share2, Mail, MessageCircle, Facebook, Twitter, QrCode } from "lucide-react";

interface ReferralData {
	referralCode: string;
	referralsCount: number;
	pendingReferrals: number;
	earnedCredits: number;
	referralHistory: ReferralEntry[];
}

interface ReferralEntry {
	id: string;
	email: string;
	status: "pending" | "completed" | "expired";
	earnedCredits: number;
	date: string;
}

const REFERRAL_REWARD = 5000; // UGX per successful referral
const REFEREE_BONUS = 2500; // UGX bonus for the person who signs up

export function ReferralProgram({ channel }: { channel: string }) {
	const [referralData, setReferralData] = useState<ReferralData | null>(null);
	const [copied, setCopied] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [emailSent, setEmailSent] = useState(false);

	useEffect(() => {
		loadReferralData();
	}, []);

	const loadReferralData = () => {
		const stored = localStorage.getItem("referralData");

		if (stored) {
			setReferralData(JSON.parse(stored));
		} else {
			// Generate new referral code
			const newData: ReferralData = {
				referralCode: generateReferralCode(),
				referralsCount: 0,
				pendingReferrals: 0,
				earnedCredits: 0,
				referralHistory: [],
			};
			localStorage.setItem("referralData", JSON.stringify(newData));
			setReferralData(newData);
		}
	};

	const generateReferralCode = (): string => {
		const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
		let code = "TH";
		for (let i = 0; i < 6; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	};

	const getReferralLink = (): string => {
		const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
		return `${baseUrl}/${channel}/register?ref=${referralData?.referralCode}`;
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleEmailInvite = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inviteEmail) return;

		// Simulate sending invite
		console.log("Sending invite to:", inviteEmail);

		// Add to pending referrals
		if (referralData) {
			const newEntry: ReferralEntry = {
				id: Date.now().toString(),
				email: inviteEmail,
				status: "pending",
				earnedCredits: 0,
				date: new Date().toISOString(),
			};

			const updatedData = {
				...referralData,
				pendingReferrals: referralData.pendingReferrals + 1,
				referralHistory: [newEntry, ...referralData.referralHistory],
			};

			localStorage.setItem("referralData", JSON.stringify(updatedData));
			setReferralData(updatedData);
		}

		setEmailSent(true);
		setInviteEmail("");
		setTimeout(() => setEmailSent(false), 3000);
	};

	const shareOptions = [
		{
			name: "WhatsApp",
			icon: <MessageCircle size={20} />,
			color: "bg-green-500",
			action: () => {
				window.open(
					`https://wa.me/?text=${encodeURIComponent(`Shop at TechHub and get UGX ${REFEREE_BONUS.toLocaleString()} off your first order! Use my referral link: ${getReferralLink()}`)}`,
					"_blank"
				);
			},
		},
		{
			name: "Facebook",
			icon: <Facebook size={20} />,
			color: "bg-blue-600",
			action: () => {
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getReferralLink())}`,
					"_blank"
				);
			},
		},
		{
			name: "Twitter",
			icon: <Twitter size={20} />,
			color: "bg-sky-500",
			action: () => {
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Shop at TechHub and get amazing deals! Use my referral code: ${referralData?.referralCode}`)}&url=${encodeURIComponent(getReferralLink())}`,
					"_blank"
				);
			},
		},
		{
			name: "Email",
			icon: <Mail size={20} />,
			color: "bg-gray-600",
			action: () => {
				window.open(
					`mailto:?subject=${encodeURIComponent("Join TechHub and get UGX " + REFEREE_BONUS.toLocaleString() + " off!")}&body=${encodeURIComponent(`I've been shopping at TechHub and thought you'd love it! Sign up using my referral link and get UGX ${REFEREE_BONUS.toLocaleString()} off your first order:\n\n${getReferralLink()}`)}`,
					"_blank"
				);
			},
		},
	];

	if (!referralData) return null;

	return (
		<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
						<Users size={32} />
					</div>
					<div>
						<h2 className="text-2xl font-black">Refer & Earn</h2>
						<p className="text-purple-100">Invite friends and earn rewards together!</p>
					</div>
				</div>

				{/* Reward Info */}
				<div className="grid grid-cols-2 gap-4 mt-6">
					<div className="bg-white/10 rounded-xl p-4 text-center">
						<div className="text-3xl font-black">UGX {REFERRAL_REWARD.toLocaleString()}</div>
						<div className="text-sm text-purple-200">You earn per referral</div>
					</div>
					<div className="bg-white/10 rounded-xl p-4 text-center">
						<div className="text-3xl font-black">UGX {REFEREE_BONUS.toLocaleString()}</div>
						<div className="text-sm text-purple-200">Your friend gets</div>
					</div>
				</div>
			</div>

			{/* Referral Code Section */}
			<div className="p-6 border-b">
				<h3 className="font-bold text-gray-800 mb-3">Your Referral Code</h3>

				<div className="flex items-center gap-3">
					<div className="flex-1 bg-gray-100 rounded-xl p-4 flex items-center justify-between">
						<code className="text-2xl font-mono font-bold text-purple-600 tracking-wider">
							{referralData.referralCode}
						</code>
						<button
							onClick={() => copyToClipboard(referralData.referralCode)}
							className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							{copied ? <Check size={20} /> : <Copy size={20} />}
						</button>
					</div>
				</div>

				{/* Referral Link */}
				<div className="mt-4">
					<label className="text-sm text-gray-500 mb-1 block">Your referral link:</label>
					<div className="flex items-center gap-2">
						<input
							type="text"
							readOnly
							value={getReferralLink()}
							className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
						/>
						<button
							onClick={() => copyToClipboard(getReferralLink())}
							className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
						>
							<Copy size={18} />
						</button>
					</div>
				</div>
			</div>

			{/* Share Options */}
			<div className="p-6 border-b">
				<h3 className="font-bold text-gray-800 mb-4">Share with Friends</h3>

				<div className="grid grid-cols-4 gap-3">
					{shareOptions.map((option) => (
						<button
							key={option.name}
							onClick={option.action}
							className={`${option.color} text-white p-3 rounded-xl flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}
						>
							{option.icon}
							<span className="text-xs">{option.name}</span>
						</button>
					))}
				</div>
			</div>

			{/* Email Invite */}
			<div className="p-6 border-b bg-gray-50">
				<h3 className="font-bold text-gray-800 mb-3">Invite by Email</h3>

				<form onSubmit={handleEmailInvite} className="flex gap-2">
					<input
						type="email"
						value={inviteEmail}
						onChange={(e) => setInviteEmail(e.target.value)}
						placeholder="Enter friend's email"
						className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
					/>
					<button
						type="submit"
						className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
					>
						{emailSent ? <Check size={20} /> : "Send"}
					</button>
				</form>

				{emailSent && (
					<p className="text-green-600 text-sm mt-2">Invitation sent successfully!</p>
				)}
			</div>

			{/* Stats */}
			<div className="p-6 border-b">
				<h3 className="font-bold text-gray-800 mb-4">Your Referral Stats</h3>

				<div className="grid grid-cols-3 gap-4">
					<div className="bg-green-50 rounded-xl p-4 text-center">
						<div className="text-2xl font-black text-green-600">{referralData.referralsCount}</div>
						<div className="text-xs text-gray-500">Successful</div>
					</div>
					<div className="bg-yellow-50 rounded-xl p-4 text-center">
						<div className="text-2xl font-black text-yellow-600">{referralData.pendingReferrals}</div>
						<div className="text-xs text-gray-500">Pending</div>
					</div>
					<div className="bg-purple-50 rounded-xl p-4 text-center">
						<div className="text-2xl font-black text-purple-600">
							{referralData.earnedCredits.toLocaleString()}
						</div>
						<div className="text-xs text-gray-500">UGX Earned</div>
					</div>
				</div>
			</div>

			{/* Referral History */}
			{referralData.referralHistory.length > 0 && (
				<div className="p-6">
					<h3 className="font-bold text-gray-800 mb-4">Recent Invites</h3>

					<div className="space-y-3">
						{referralData.referralHistory.slice(0, 5).map((entry) => (
							<div
								key={entry.id}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
							>
								<div>
									<p className="font-medium text-gray-800">{entry.email}</p>
									<p className="text-xs text-gray-500">
										{new Date(entry.date).toLocaleDateString()}
									</p>
								</div>
								<span
									className={`px-2 py-1 text-xs font-semibold rounded-full ${
										entry.status === "completed"
											? "bg-green-100 text-green-700"
											: entry.status === "pending"
												? "bg-yellow-100 text-yellow-700"
												: "bg-gray-100 text-gray-700"
									}`}
								>
									{entry.status}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* How It Works */}
			<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6">
				<h3 className="font-bold text-gray-800 mb-4">How It Works</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
							1
						</div>
						<div>
							<p className="font-semibold text-gray-800">Share your code</p>
							<p className="text-sm text-gray-500">Send your unique code to friends</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
							2
						</div>
						<div>
							<p className="font-semibold text-gray-800">They sign up & shop</p>
							<p className="text-sm text-gray-500">Friend makes their first purchase</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
							3
						</div>
						<div>
							<p className="font-semibold text-gray-800">Both earn rewards!</p>
							<p className="text-sm text-gray-500">Credits added to your accounts</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
