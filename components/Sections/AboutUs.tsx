"use client";

import Section from "./Section";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";
import type { HomeContent } from "@/app/types/landing";
import { homeImageUrl } from "@/lib/utils";

// Admin HTML. Lists become hairline-divided rows; bold phrases stand out in full navy.
const listClass =
	"mt-6 [&_ul]:border-b [&_ul]:border-brand-navy/15 [&_ol]:border-b [&_ol]:border-brand-navy/15 [&_li]:border-t [&_li]:border-brand-navy/15 [&_li]:py-4 [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-[#5a6377] [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline";
const bioClass =
	"mt-8 space-y-4 border-t border-brand-navy/15 pt-8 leading-relaxed text-[#5a6377] [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline [&_a]:decoration-brand-green/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand-green";

// SectionHeading puts the description in its own paragraph, so paragraphs become line breaks
const inline = (html: string) => html.replace(/<\/p>\s*<p[^>]*>/g, "<br /><br />").replace(/<\/?p[^>]*>/g, "");

const AboutUs = ({ content }: { content: HomeContent["about"] }) => {
	const aboutUsSlides = content.milestones.slides;
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const currentSlide = aboutUsSlides[currentSlideIndex];
	const hasMultipleImages = currentSlide?.images?.length > 1;
	const currentImage = currentSlide?.images?.[currentImageIndex];

	// Calculate image interval based on number of images
	const getImageInterval = useCallback(() => {
		const baseInterval = 6000; // 6 seconds base
		const numImages = currentSlide?.images?.length || 1;
		return baseInterval / Math.max(1, numImages - 1);
	}, [currentSlide?.images?.length]);

	useEffect(() => {
		const slideInterval = setInterval(() => {
			setCurrentSlideIndex((prev) => (prev + 1) % aboutUsSlides.length);
			setCurrentImageIndex(0); // Reset to first image when slide changes
		}, 12000);

		return () => clearInterval(slideInterval);
	}, [aboutUsSlides.length]);

	useEffect(() => {
		if (!hasMultipleImages) {
			setCurrentImageIndex(0);
			return;
		}

		const imageInterval = setInterval(() => {
			setCurrentImageIndex((prev) => {
				const nextIndex = (prev + 1) % currentSlide.images.length;
				return nextIndex;
			});
		}, getImageInterval());

		return () => clearInterval(imageInterval);
	}, [currentSlideIndex, hasMultipleImages, currentSlide?.images.length, getImageInterval]);

	return (
		<Section id="about">
			<SectionHeading
				label={content.label}
				title={content.title}
				description={<span dangerouslySetInnerHTML={{ __html: inline(content.description) }} />}
			/>

			{/* Lists, set as hairline-divided columns */}
			<div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
				{content.lists.map((group, groupIndex) => (
					<Reveal
						key={groupIndex}
						delay={groupIndex * 0.1}
						className={groupIndex % 2 === 0 ? "lg:col-span-5 lg:col-start-2" : "lg:col-span-5"}
					>
						<h3 className="text-xl font-semibold tracking-tight text-brand-navy sm:text-2xl">{group.title}</h3>
						<div className={listClass} dangerouslySetInnerHTML={{ __html: group.html }} />
					</Reveal>
				))}
			</div>

			{/* Highlights slideshow */}
			<Reveal className="mt-24 grid bg-[#f4f5f7] sm:mt-32 lg:grid-cols-2">
				<div className="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:p-14">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">
							{content.milestones.label}
						</p>
						<div className="mt-6 grid min-h-[9rem]">
							{aboutUsSlides.map((slide, index) => {
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
					<div
						className="grid max-w-sm gap-3"
						style={{ gridTemplateColumns: `repeat(${aboutUsSlides.length}, minmax(0, 1fr))` }}
					>
						{aboutUsSlides.map((_, index) => (
							<button
								key={index}
								type="button"
								aria-label={`Show highlight ${index + 1}`}
								onClick={() => {
									setCurrentSlideIndex(index);
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
									{currentSlide.images.map((_, index) => (
										<span
											key={index}
											className={`h-0.5 transition-all ${
												index === currentImageIndex ? "w-6 bg-white" : "w-3 bg-white/40"
											}`}
										/>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</Reveal>

			{/* Managing partner */}
			<div className="mt-24 grid items-start gap-10 sm:mt-32 lg:grid-cols-12 lg:gap-16">
				{content.partner.photo && (
					<Reveal className="lg:col-span-5">
						<img
							src={homeImageUrl(content.partner.photo)}
							alt={content.partner.name}
							className="aspect-[4/5] w-full object-cover object-top"
						/>
					</Reveal>
				)}
				<Reveal delay={0.1} className={content.partner.photo ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3"}>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">{content.partner.label}</p>
					<h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-brand-navy sm:text-4xl">
						{content.partner.name}
					</h3>
					<div className={bioClass} dangerouslySetInnerHTML={{ __html: content.partner.bio }} />
				</Reveal>
			</div>
		</Section>
	);
};

export default AboutUs;
