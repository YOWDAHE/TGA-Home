"use client";

import React from "react";
import { motion } from "framer-motion";
import { easeOut } from "./Reveal";
import TopNav from "./TopNav";
import GlassBackdrop from "./GlassBackdrop";

interface PageHeroProps {
	/** Path of the page, so the nav underlines the right link */
	currentHref: string;
	/** Small uppercase line above the title */
	label?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	/** Extra content under the description, e.g. a search bar or buttons */
	children?: React.ReactNode;
}

/** Top of an inner page: the see-through nav over the home hero's glass backdrop, with a centered
 *  title. Renders the nav itself, so pages using it should not add their own TopNav. */
export default function PageHero({ currentHref, label, title, description, children }: PageHeroProps) {
	return (
		<>
			{/* Outside the section: the section's stacking layer (isolate) would keep the fixed bar under later sections */}
			<TopNav currentHref={currentHref} overlay />
			<section className="relative isolate overflow-hidden bg-white px-4 pb-14 pt-36 text-center text-brand-navy sm:px-6 sm:pb-20 sm:pt-44">
				<GlassBackdrop />
				<div className="mx-auto max-w-3xl">
					{label && (
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
							className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/60"
						>
							{label}
						</motion.p>
					)}
					<motion.h1
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
						className="text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
					>
						{title}
					</motion.h1>
					{description && (
						<motion.p
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
							className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-brand-navy/75 sm:text-lg"
						>
							{description}
						</motion.p>
					)}
					{children && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.35 }}
							className="mt-8"
						>
							{children}
						</motion.div>
					)}
				</div>
			</section>
		</>
	);
}
