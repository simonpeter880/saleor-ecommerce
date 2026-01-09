"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface FocusTrapProps {
	children: ReactNode;
	active: boolean;
	onEscape?: () => void;
}

export function FocusTrap({ children, active, onEscape }: FocusTrapProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!active) return;

		const container = containerRef.current;
		if (!container) return;

		// Get all focusable elements
		const focusableElements = container.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		// Focus first element
		firstElement?.focus();

		// Handle tab key
		const handleKeyDown = (e: KeyboardEvent) => {
			// Handle Escape key
			if (e.key === "Escape" && onEscape) {
				onEscape();
				return;
			}

			// Handle Tab key
			if (e.key === "Tab") {
				if (e.shiftKey) {
					// Shift + Tab: moving backwards
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else {
					// Tab: moving forwards
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [active, onEscape]);

	return (
		<div ref={containerRef} role="dialog" aria-modal={active}>
			{children}
		</div>
	);
}
