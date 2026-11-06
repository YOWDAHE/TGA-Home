"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ChevronLeft, ChevronRight, Images, X } from "lucide-react";

/** All of a strip's photos in a grid; a photo opens full size, with previous / next, arrow keys and swipe. */
export function PhotoGallery({
	photos,
	title,
	open,
	onOpenChange,
}: {
	/** Ready-to-use URLs */
	photos: string[];
	title: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	// null: the grid; a number: that photo full size
	const [viewing, setViewing] = useState<number | null>(null);
	const count = photos.length;

	useEffect(() => {
		if (!open) setViewing(null);
	}, [open]);

	const step = useCallback((by: number) => setViewing((i) => (i === null ? i : (i + by + count) % count)), [count]);

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (viewing === null) return;
		if (e.key === "ArrowRight") step(1);
		else if (e.key === "ArrowLeft") step(-1);
		else if (e.key === "Escape") {
			// Escape goes back to the grid first, then closes
			e.preventDefault();
			e.stopPropagation();
			setViewing(null);
		}
	};

	// Swipe left / right on phones
	const touchX = useRef<number | null>(null);
	const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchX.current === null) return;
		const dx = e.changedTouches[0].clientX - touchX.current;
		touchX.current = null;
		if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
	};

	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-brand-navy/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
				<DialogPrimitive.Content
					onKeyDown={onKeyDown}
					onEscapeKeyDown={(e) => viewing !== null && e.preventDefault()}
					className="fixed inset-0 z-[60] flex flex-col bg-white outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:inset-6 sm:rounded-sm lg:inset-10"
				>
					<div className="flex items-center gap-3 border-b border-brand-navy/10 px-4 py-3 sm:px-6 sm:py-4">
						{viewing !== null && (
							<button
								type="button"
								onClick={() => setViewing(null)}
								className="-ml-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="hidden sm:inline">All photos</span>
							</button>
						)}
						<DialogPrimitive.Title className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-brand-navy sm:text-lg">
							{title}
						</DialogPrimitive.Title>
						<span className="shrink-0 text-sm tabular-nums text-[#5a6377]">
							{viewing === null ? `${count} ${count === 1 ? "photo" : "photos"}` : `${viewing + 1} / ${count}`}
						</span>
						<DialogPrimitive.Close
							aria-label="Close"
							className="-mr-1 rounded-full p-2 text-brand-navy transition-colors hover:bg-brand-navy/5"
						>
							<X className="h-5 w-5" />
						</DialogPrimitive.Close>
					</div>
					<DialogPrimitive.Description className="sr-only">
						{viewing === null ? "Choose a photo to see it full size." : "Use the arrow keys to move between photos."}
					</DialogPrimitive.Description>

					{viewing === null ? (
						<div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
								{photos.map((src, index) => (
									<button
										key={index}
										type="button"
										onClick={() => setViewing(index)}
										aria-label={`Open photo ${index + 1}`}
										className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-brand-tint/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
									>
										<img
											src={src}
											alt={`${title} ${index + 1}`}
											loading="lazy"
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</button>
								))}
							</div>
						</div>
					) : (
						<div
							className="relative flex min-h-0 flex-1 items-center justify-center bg-[#0b1020] p-2 sm:p-6"
							onTouchStart={onTouchStart}
							onTouchEnd={onTouchEnd}
						>
							<img
								key={viewing}
								src={photos[viewing]}
								alt={`${title} ${viewing + 1}`}
								className="max-h-full max-w-full select-none object-contain animate-in fade-in-0 duration-300"
							/>
							{count > 1 && (
								<>
									<ViewerArrow side="left" onClick={() => step(-1)} />
									<ViewerArrow side="right" onClick={() => step(1)} />
								</>
							)}
						</div>
					)}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

function ViewerArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
	const Icon = side === "left" ? ChevronLeft : ChevronRight;
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={side === "left" ? "Previous photo" : "Next photo"}
			className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-brand-navy shadow-lg transition hover:bg-white sm:p-3 ${
				side === "left" ? "left-3 sm:left-6" : "right-3 sm:right-6"
			}`}
		>
			<Icon className="h-5 w-5" />
		</button>
	);
}

/** The "View pictures" button that sits on a photo strip */
export function ViewPicturesButton({
	count,
	onClick,
	className = "",
}: {
	count: number;
	onClick: () => void;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-brand-navy shadow-md ring-1 ring-brand-navy/10 backdrop-blur transition hover:bg-white hover:shadow-lg ${className}`}
		>
			<Images className="h-4 w-4" />
			View pictures
			<span className="text-brand-navy/50 tabular-nums">{count}</span>
		</button>
	);
}
