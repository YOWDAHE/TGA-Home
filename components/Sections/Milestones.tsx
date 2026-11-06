"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { easeOut } from "./Reveal";
import { homeImageUrl } from "@/lib/utils";
import type { ModuleContent } from "@/app/types/modules";

type MilestonesProps = ModuleContent["milestones"] & {
	/** Spacing above the block, e.g. when it follows other content in a section */
	className?: string;
};

/** Short highlights that rotate every twelve seconds, each with its own photos cycling beside it.
 *  Used by the About module and on its own as the Milestones module. */
export default function Milestones({ label, slides: allSlides, className = "" }: MilestonesProps) {
	// Hidden slides stay out of the rotation, in previews too
	const slides = (allSlides ?? []).filter((slide) => slide && !slide.hidden);
	const [slideIndex, setSlideIndex] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	// The preview can drop slides while one further along is showing
	const currentSlideIndex = slides.length ? slideIndex % slides.length : 0;
	const currentSlide = slides[currentSlideIndex];
	const images = currentSlide?.images ?? [];
	const hasMultipleImages = images.length > 1;
	const currentImage = images[currentImageIndex % Math.max(1, images.length)];

	// Calculate image interval based on number of images
	const getImageInterval = useCallback(() => {
		const baseInterval = 6000; // 6 seconds base
		return baseInterval / Math.max(1, images.length - 1);
	}, [images.length]);

	useEffect(() => {
		if (slides.length < 2) return;
		const slideInterval = setInterval(() => {
			setSlideIndex((prev) => (prev + 1) % slides.length);
			setCurrentImageIndex(0); // Reset to first image when slide changes
		}, 12000);

		return () => clearInterval(slideInterval);
	}, [slides.length]);

	useEffect(() => {
		if (!hasMultipleImages) {
			setCurrentImageIndex(0);
			return;
		}

		const imageInterval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % images.length);
		}, getImageInterval());

		return () => clearInterval(imageInterval);
	}, [currentSlideIndex, hasMultipleImages, images.length, getImageInterval]);

	if (!slides.length) return null;

	return (
		<Reveal className={`tone-light grid bg-[#f4f5f7] lg:grid-cols-2 ${className}`}>
			<div className="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:p-14">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">{label}</p>
					<div className="mt-6 grid min-h-[9rem]">
						{slides.map((slide, index) => {
							const active = index === currentSlideIndex;
							return (
								<motion.div
									key={index}
									aria-hidden={!active}
									className="text-2xl font-semibold leading-snug tracking-tight text-brand-navy [grid-area:1/1] sm:text-[1.75rem] [&_strong]:font-semibold [&_strong]:text-brand-green"
									initial={false}
									animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
									transition={{ duration: 0.6, ease: easeOut }}
									dangerouslySetInnerHTML={{ __html: slide.html }}
								/>
							);
						})}
					</div>
				</div>
				<div className="grid max-w-sm gap-3" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
					{slides.map((_, index) => (
						<button
							key={index}
							type="button"
							aria-label={`Show highlight ${index + 1}`}
							onClick={() => {
								setSlideIndex(index);
								setCurrentImageIndex(0);
							}}
							className={`h-6 border-t-2 transition-colors ${
								index === currentSlideIndex ? "border-brand-navy" : "border-brand-navy/15 hover:border-brand-navy/50"
							}`}
						/>
					))}
				</div>
			</div>

			<div>
				{currentImage && (
					<div className="relative aspect-[4/3] overflow-hidden bg-brand-navy lg:aspect-auto lg:h-full lg:min-h-[460px]">
						<AnimatePresence mode="popLayout" initial={false}>
							<motion.div
								key={`${currentSlideIndex}-${currentImageIndex}`}
								initial={{ opacity: 0, scale: 1.04 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.98 }}
								transition={{ duration: 0.7, ease: easeOut }}
								className="absolute inset-0"
							>
								<img
									src={homeImageUrl(currentImage)}
									alt=""
									aria-hidden
									className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
								/>
								<img
									src={homeImageUrl(currentImage)}
									alt={`About Us Slide ${currentSlideIndex + 1} Image ${currentImageIndex + 1}`}
									className="relative h-full w-full object-contain"
								/>
							</motion.div>
						</AnimatePresence>

						{hasMultipleImages && (
							<div className="absolute bottom-4 left-4 flex gap-1.5">
								{images.map((_, index) => (
									<span
										key={index}
										className={`h-0.5 transition-all ${index === currentImageIndex ? "w-6 bg-white" : "w-3 bg-white/40"}`}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</Reveal>
	);
}
