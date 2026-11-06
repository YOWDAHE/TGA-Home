"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Stat } from "@/app/types/landing";
import SectionHeading from "./SectionHeading";
import Section from "./Section";
import Reveal, { easeOut } from "./Reveal";
import type { ModuleContent } from "@/app/types/modules";

interface StatisticsProps {
	stats: Stat[];
	/** Heading text; the numbers are the shared Statistics list */
	content: ModuleContent["stats"];
}

// Splits "1,200+" into the number to count to and the text around it
function parseStat(value: string) {
	const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
	if (!match) return null;
	const target = Number(match[2].replace(/,/g, ""));
	if (Number.isNaN(target)) return null;
	return { prefix: match[1], target, suffix: match[3], decimals: match[2].split(".")[1]?.length ?? 0 };
}

/** Counts up from zero the first time the number scrolls into view. Until then it shows the
 *  real figure, so the server-rendered page (and search engines) never see a zero. */
function CountUp({ value }: { value: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, amount: 0.6 });
	const reduceMotion = useReducedMotion();
	const parsed = parseStat(value);
	const [shown, setShown] = useState<number | null>(null);

	useEffect(() => {
		if (!parsed || !inView || reduceMotion) return;
		const controls = animate(0, parsed.target, {
			duration: 1.6,
			ease: easeOut,
			onUpdate: (latest) => setShown(latest),
		});
		return () => controls.stop();
		// parsed is rebuilt each render; its target is what matters
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inView, reduceMotion, parsed?.target]);

	if (!parsed || shown === null) return <span ref={ref}>{value}</span>;
	const number = shown.toLocaleString("en-US", {
		minimumFractionDigits: parsed.decimals,
		maximumFractionDigits: parsed.decimals,
	});
	return (
		<span ref={ref} className="tabular-nums">
			{parsed.prefix}
			{number}
			{parsed.suffix}
		</span>
	);
}

/** The firm's numbers as cards on the navy band, over a faint echo of the hero's glass rows. */
export default function Statistics({ stats, content }: StatisticsProps) {
	return (
		<Section tone="navy" className="overflow-hidden">
			<div aria-hidden className="pointer-events-none absolute inset-0">
				{[0, 1, 2].map((row) => (
					<div
						key={row}
						className="absolute -left-[10%] h-[45%] w-[120%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_100%)] [transform:skewY(-12deg)]"
						style={{ top: `${-10 + row * 32}%` }}
					/>
				))}
				<div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl" />
			</div>

			<div className="relative">
				<SectionHeading
					inverted
					label={content.label}
					title={content.title}
					description={content.description || undefined}
				/>

				<dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4">
					{stats.map((stat, index) => (
						<Reveal
							key={stat.id}
							delay={index * 0.08}
							className="group relative flex flex-col-reverse justify-end overflow-hidden rounded-sm bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.1] sm:p-7"
						>
							{/* Green rule that draws in across the top of each card */}
							<motion.span
								aria-hidden
								className="absolute inset-x-0 top-0 h-0.5 origin-left bg-brand-green"
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: true, amount: 0.6 }}
								transition={{ duration: 1, ease: easeOut, delay: 0.2 + index * 0.1 }}
							/>
							<dt className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{stat.description}</dt>
							<dd className="text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
								<CountUp value={stat.stat} />
							</dd>
						</Reveal>
					))}
				</dl>
			</div>
		</Section>
	);
}
