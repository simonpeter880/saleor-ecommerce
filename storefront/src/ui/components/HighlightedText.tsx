"use client";

interface HighlightedTextProps {
	text: string;
	highlight: string;
	className?: string;
	highlightClassName?: string;
}

export function HighlightedText({
	text,
	highlight,
	className = "",
	highlightClassName = "bg-yellow-200 text-yellow-900 font-medium rounded px-0.5",
}: HighlightedTextProps) {
	if (!highlight.trim()) {
		return <span className={className}>{text}</span>;
	}

	// Escape special regex characters and create case-insensitive pattern
	const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${escapedHighlight})`, "gi");
	const parts = text.split(regex);

	return (
		<span className={className}>
			{parts.map((part, index) => {
				const isMatch = part.toLowerCase() === highlight.toLowerCase();
				return isMatch ? (
					<mark key={index} className={highlightClassName}>
						{part}
					</mark>
				) : (
					<span key={index}>{part}</span>
				);
			})}
		</span>
	);
}

// Multi-word highlight variant
export function HighlightedTextMulti({
	text,
	highlights,
	className = "",
	highlightClassName = "bg-yellow-200 text-yellow-900 font-medium rounded px-0.5",
}: {
	text: string;
	highlights: string[];
	className?: string;
	highlightClassName?: string;
}) {
	if (!highlights.length) {
		return <span className={className}>{text}</span>;
	}

	// Create pattern for all highlight words
	const escapedHighlights = highlights
		.filter((h) => h.trim())
		.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

	if (!escapedHighlights.length) {
		return <span className={className}>{text}</span>;
	}

	const regex = new RegExp(`(${escapedHighlights.join("|")})`, "gi");
	const parts = text.split(regex);

	return (
		<span className={className}>
			{parts.map((part, index) => {
				const isMatch = escapedHighlights.some(
					(h) => part.toLowerCase() === h.toLowerCase()
				);
				return isMatch ? (
					<mark key={index} className={highlightClassName}>
						{part}
					</mark>
				) : (
					<span key={index}>{part}</span>
				);
			})}
		</span>
	);
}
