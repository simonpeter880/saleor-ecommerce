"use client";

import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
	view: "grid" | "list";
	onChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
	return (
		<div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
			<button
				onClick={() => onChange("grid")}
				className={`flex items-center justify-center rounded-md p-2 transition-colors ${
					view === "grid"
						? "bg-primary-100 text-primary-600"
						: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
				}`}
				aria-label="Grid view"
				title="Grid view"
			>
				<LayoutGrid size={18} />
			</button>
			<button
				onClick={() => onChange("list")}
				className={`flex items-center justify-center rounded-md p-2 transition-colors ${
					view === "list"
						? "bg-primary-100 text-primary-600"
						: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
				}`}
				aria-label="List view"
				title="List view"
			>
				<List size={18} />
			</button>
		</div>
	);
}
