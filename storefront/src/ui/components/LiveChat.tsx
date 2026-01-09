"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";

interface Message {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
}

const quickReplies = [
	"Track my order",
	"Return policy",
	"Shipping info",
	"Payment methods",
	"Contact support",
];

const botResponses: Record<string, string> = {
	"track my order": "To track your order, please visit the 'My Orders' section in your account. You can also use the tracking number sent to your email. Need more help?",
	"return policy": "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Electronics have a 7-day return window. Would you like to start a return?",
	"shipping info": "We offer free shipping on orders over UGX 50,000. Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for UGX 10,000 extra.",
	"payment methods": "We accept: Mobile Money (MTN, Airtel), VISA/Mastercard, Bank Transfer, and Cash on Delivery. All payments are secure and encrypted.",
	"contact support": "You can reach our support team at:\n📧 support@techhub.com\n📞 +256 700 123 456\nWe're available Mon-Sat, 8am-8pm EAT.",
	"default": "Thanks for reaching out! I'm TechBot, your virtual assistant. How can I help you today? You can ask about orders, shipping, returns, or products.",
};

export function LiveChat() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Initial greeting
		if (isOpen && messages.length === 0) {
			addBotMessage("Hi! 👋 I'm TechBot, your virtual shopping assistant. How can I help you today?");
		}
	}, [isOpen]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const addBotMessage = (text: string) => {
		setIsTyping(true);
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					text,
					sender: "bot",
					timestamp: new Date(),
				},
			]);
			setIsTyping(false);
			if (!isOpen || isMinimized) {
				setUnreadCount((prev) => prev + 1);
			}
		}, 1000);
	};

	const handleSend = () => {
		if (!inputValue.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputValue,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");

		// Find matching response
		const lowerInput = inputValue.toLowerCase();
		let response = botResponses.default;

		for (const [key, value] of Object.entries(botResponses)) {
			if (lowerInput.includes(key)) {
				response = value;
				break;
			}
		}

		addBotMessage(response);
	};

	const handleQuickReply = (reply: string) => {
		setInputValue(reply);
		setTimeout(() => {
			const userMessage: Message = {
				id: Date.now().toString(),
				text: reply,
				sender: "user",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, userMessage]);
			setInputValue("");

			const lowerReply = reply.toLowerCase();
			const response = botResponses[lowerReply] || botResponses.default;
			addBotMessage(response);
		}, 100);
	};

	const handleOpen = () => {
		setIsOpen(true);
		setIsMinimized(false);
		setUnreadCount(0);
	};

	return (
		<>
			{/* Chat Button */}
			{!isOpen && (
				<button
					onClick={handleOpen}
					className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
				>
					<MessageCircle size={28} />
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
							{unreadCount}
						</span>
					)}
				</button>
			)}

			{/* Chat Window */}
			{isOpen && (
				<div
					className={`fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all ${
						isMinimized
							? "bottom-6 right-6 w-72 h-14"
							: "bottom-6 right-6 w-96 h-[500px] max-h-[80vh]"
					}`}
				>
					{/* Header */}
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
								<Bot size={24} />
							</div>
							{!isMinimized && (
								<div>
									<h3 className="font-bold">TechBot</h3>
									<p className="text-xs text-blue-100">Always here to help</p>
								</div>
							)}
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setIsMinimized(!isMinimized)}
								className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
							>
								{isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
							</button>
							<button
								onClick={() => setIsOpen(false)}
								className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
							>
								<X size={18} />
							</button>
						</div>
					</div>

					{!isMinimized && (
						<>
							{/* Messages */}
							<div className="h-[340px] overflow-y-auto p-4 space-y-4 bg-gray-50">
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
												message.sender === "user"
													? "bg-blue-600 text-white rounded-br-none"
													: "bg-white text-gray-800 shadow-sm rounded-bl-none"
											}`}
										>
											<p className="text-sm whitespace-pre-wrap">{message.text}</p>
											<p className={`text-xs mt-1 ${
												message.sender === "user" ? "text-blue-200" : "text-gray-400"
											}`}>
												{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
											</p>
										</div>
									</div>
								))}

								{isTyping && (
									<div className="flex justify-start">
										<div className="bg-white rounded-2xl px-4 py-3 shadow-sm rounded-bl-none">
											<div className="flex gap-1">
												<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
												<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
												<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
											</div>
										</div>
									</div>
								)}

								<div ref={messagesEndRef} />
							</div>

							{/* Quick Replies */}
							{messages.length <= 1 && (
								<div className="px-4 py-2 border-t bg-white">
									<p className="text-xs text-gray-500 mb-2">Quick actions:</p>
									<div className="flex flex-wrap gap-2">
										{quickReplies.map((reply) => (
											<button
												key={reply}
												onClick={() => handleQuickReply(reply)}
												className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1.5 rounded-full transition-colors"
											>
												{reply}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Input */}
							<div className="p-4 border-t bg-white">
								<div className="flex gap-2">
									<input
										type="text"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										onKeyPress={(e) => e.key === "Enter" && handleSend()}
										placeholder="Type a message..."
										className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<button
										onClick={handleSend}
										disabled={!inputValue.trim()}
										className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Send size={18} />
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
}
