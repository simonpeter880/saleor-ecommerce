"use client";

import { useState } from "react";
import { MessageCircle, ThumbsUp, Search, Send, User } from "lucide-react";

interface Question {
	id: string;
	question: string;
	answer?: string;
	askedBy: string;
	askedDate: string;
	helpful: number;
}

interface ProductQASectionProps {
	productId: string;
	channel: string;
}

export default function ProductQASection({ productId, channel }: ProductQASectionProps) {
	const [questions, setQuestions] = useState<Question[]>([
		{
			id: "1",
			question: "What is the warranty period for this product?",
			answer:
				"This product comes with a 1-year manufacturer warranty covering defects in materials and workmanship.",
			askedBy: "John D.",
			askedDate: "2024-01-15",
			helpful: 12,
		},
		{
			id: "2",
			question: "Does this come with all necessary accessories?",
			answer:
				"Yes, it includes all standard accessories as listed in the product description. Additional accessories can be purchased separately.",
			askedBy: "Sarah M.",
			askedDate: "2024-01-10",
			helpful: 8,
		},
		{
			id: "3",
			question: "Is international shipping available?",
			answer:
				"Currently we only ship within Uganda. International shipping options are coming soon!",
			askedBy: "Mike R.",
			askedDate: "2024-01-05",
			helpful: 5,
		},
	]);

	const [newQuestion, setNewQuestion] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set());

	const handleAskQuestion = () => {
		if (newQuestion.trim()) {
			const question: Question = {
				id: Date.now().toString(),
				question: newQuestion,
				askedBy: "You",
				askedDate: new Date().toISOString().split("T")[0],
				helpful: 0,
			};
			setQuestions([question, ...questions]);
			setNewQuestion("");
		}
	};

	const handleVoteHelpful = (questionId: string) => {
		if (votedQuestions.has(questionId)) return;

		setQuestions(
			questions.map((q) =>
				q.id === questionId ? { ...q, helpful: q.helpful + 1 } : q
			)
		);
		setVotedQuestions(new Set([...votedQuestions, questionId]));
	};

	const filteredQuestions = questions.filter(
		(q) =>
			q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			q.answer?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex items-center gap-3">
					<div className="bg-temu-100 p-3 rounded-full">
						<MessageCircle className="text-temu-600" size={24} />
					</div>
					<div>
						<h3 className="text-xl font-bold text-gray-900">
							Questions & Answers
						</h3>
						<p className="text-sm text-gray-600">
							{questions.length} questions answered
						</p>
					</div>
				</div>
			</div>

			{/* Search */}
			<div className="relative">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					size={20}
				/>
				<input
					type="text"
					placeholder="Search questions..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-temu-500 focus:outline-none transition-colors"
				/>
			</div>

			{/* Ask Question Form */}
			<div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
				<h4 className="font-bold text-gray-900 mb-3">Ask a Question</h4>
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Type your question here..."
						value={newQuestion}
						onChange={(e) => setNewQuestion(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
						className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-temu-500 focus:outline-none transition-colors"
					/>
					<button
						onClick={handleAskQuestion}
						disabled={!newQuestion.trim()}
						className="px-6 py-3 bg-temu-500 text-white rounded-lg font-bold hover:bg-temu-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
					>
						<Send size={18} />
						<span className="hidden sm:inline">Ask</span>
					</button>
				</div>
				<p className="text-xs text-gray-500 mt-2">
					Get answers from the seller or other customers
				</p>
			</div>

			{/* Questions List */}
			<div className="space-y-4">
				{filteredQuestions.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 rounded-lg">
						<MessageCircle
							className="mx-auto text-gray-300 mb-3"
							size={48}
						/>
						<p className="text-gray-600 font-medium">
							{searchTerm
								? "No questions match your search"
								: "No questions yet. Be the first to ask!"}
						</p>
					</div>
				) : (
					filteredQuestions.map((q) => (
						<div
							key={q.id}
							className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
						>
							{/* Question */}
							<div className="flex items-start gap-3 mb-4">
								<div className="bg-temu-100 p-2 rounded-full flex-shrink-0">
									<User className="text-temu-600" size={20} />
								</div>
								<div className="flex-1">
									<div className="flex items-start justify-between gap-2 flex-wrap">
										<p className="font-semibold text-gray-900 flex-1">
											{q.question}
										</p>
										<button
											onClick={() => handleVoteHelpful(q.id)}
											disabled={votedQuestions.has(q.id)}
											className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
												votedQuestions.has(q.id)
													? "bg-green-100 text-green-700"
													: "bg-gray-100 text-gray-700 hover:bg-gray-200"
											}`}
										>
											<ThumbsUp size={14} />
											<span>{q.helpful}</span>
										</button>
									</div>
									<div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
										<span>{q.askedBy}</span>
										<span>•</span>
										<span>{new Date(q.askedDate).toLocaleDateString()}</span>
									</div>
								</div>
							</div>

							{/* Answer */}
							{q.answer ? (
								<div className="ml-0 sm:ml-11 pl-4 border-l-4 border-temu-200 bg-temu-50/30 rounded-r-lg p-3">
									<div className="flex items-center gap-2 mb-2">
										<div className="bg-temu-500 text-white text-xs font-bold px-2 py-1 rounded">
											ANSWER
										</div>
										<span className="text-xs text-gray-500">by Seller</span>
									</div>
									<p className="text-gray-700 text-sm sm:text-base">{q.answer}</p>
								</div>
							) : (
								<div className="ml-0 sm:ml-11 pl-4 border-l-4 border-gray-200 bg-gray-50 rounded-r-lg p-3">
									<p className="text-sm text-gray-500 italic">
										Waiting for answer from seller...
									</p>
								</div>
							)}
						</div>
					))
				)}
			</div>

			{/* Load More */}
			{filteredQuestions.length >= 3 && (
				<div className="text-center">
					<button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:border-gray-400 hover:bg-gray-50 transition-colors">
						Load More Questions
					</button>
				</div>
			)}
		</div>
	);
}
