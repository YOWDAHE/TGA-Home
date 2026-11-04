"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { easeOut } from "./Reveal";
import TopNav from "./TopNav";
import GlassBackdrop from "./GlassBackdrop";
import type { HomeContent } from "@/app/types/landing";

// Admin HTML: bold phrases stand out in full navy, colours picked in the editor are kept
const slideTextClass =
	"text-pretty leading-relaxed text-brand-navy/75 [&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-brand-navy";

type Slide = HomeContent["hero"]["slides"][number];

export default function Hero({ content }: { content: HomeContent["hero"] }) {
	const slides = content.slides;
	const [slideIndex, setSlideIndex] = useState(0);

	useEffect(() => {
		const slideTimer = setInterval(
			() => setSlideIndex((i) => (i + 1) % slides.length),
			6000
		);
		return () => clearInterval(slideTimer);
	}, [slides.length]);

	// Slides share one grid cell, so each block keeps the tallest slide's height and nothing moves
	const rotating = (render: (slide: Slide) => React.ReactNode, className = "") => (
		<div className={`grid ${className}`}>
			{slides.map((slide, index) => {
				const active = index === slideIndex;
				return (
					<motion.div
						key={index}
						aria-hidden={!active}
						className={`self-end [grid-area:1/1] ${active ? "" : "pointer-events-none"}`}
						initial={false}
						animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
						transition={{ duration: 0.7, ease: easeOut }}
					>
						{render(slide)}
					</motion.div>
				);
			})}
		</div>
	);

	return (
		<>
			{/* Outside the section: the section's own stacking layer (isolate) would keep the fixed
			    bar under the sections that follow */}
			<TopNav currentHref="/" overlay />
			<section id="hero-section" className="relative isolate overflow-hidden bg-white text-brand-navy">
				<GlassBackdrop />

				<div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-4 pb-8 pt-32 sm:px-6">
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
						className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/60"
					>
						{content.label}
					</motion.p>

					{rotating(
						(slide) => (
							<h1 className="text-balance text-[2.75rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-7xl lg:text-[5.5rem]">
								{slide.title}
							</h1>
						),
						"max-w-4xl"
					)}

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
						className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8"
					>
						{rotating(
							(slide) => <div className={slideTextClass} dangerouslySetInnerHTML={{ __html: slide.text }} />,
							"lg:col-span-5"
						)}
						<ArrowRight aria-hidden className="hidden h-6 w-6 text-brand-navy lg:col-span-1 lg:mb-1 lg:block lg:justify-self-center" />
						<Link
							href="#contact"
							className="group leading-relaxed text-brand-navy/75 transition-colors hover:text-brand-navy lg:col-span-3"
						>
							<span className="underline decoration-brand-navy/25 underline-offset-4 group-hover:decoration-brand-navy">
								Get legal consultation
							</span>{" "}
							from partners who know the region
						</Link>
						<div className="lg:col-span-3 lg:text-right">
							<p className="text-lg font-medium text-brand-navy">
								{content.highlight.value} <span className="text-brand-green">{content.highlight.word}</span>
							</p>
							<p className="text-sm text-brand-navy/60">{content.highlight.caption}</p>
						</div>
					</motion.div>

					{/* The rule under the hero doubles as the slide indicator */}
					<div className="mt-10 grid" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
						{slides.map((slide, index) => (
							<button
								key={index}
								type="button"
								aria-label={`Show statement ${index + 1}: ${slide.title}`}
								onClick={() => setSlideIndex(index)}
								className={`h-6 border-t transition-colors ${
									index === slideIndex ? "border-brand-navy" : "border-brand-navy/15 hover:border-brand-navy/40"
								}`}
							/>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
