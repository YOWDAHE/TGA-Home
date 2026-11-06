"use client";

// The about page's sections, driven by module content. Each reproduces the markup the about page
// had when it was hand-written, so the seeded layout looks exactly as before.

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/Sections/PageHero";
import Section from "@/components/Sections/Section";
import SectionHeading from "@/components/Sections/SectionHeading";
import Reveal, { easeOut } from "@/components/Sections/Reveal";
import PhotoMarquee, { isOptimisable } from "@/components/Sections/PhotoMarquee";
import { HairlineRows } from "@/components/Sections/Services";
import { homeImageUrl } from "@/lib/utils";
import type { ModuleContent } from "@/app/types/modules";
import { moduleIcon } from "./icons";
import { InlineHtml, hiddenItemClass, isExternalHref, useShown, type ToneProps } from "./shared";

/** Plain-text heading descriptions stay text; editor HTML keeps its bold names in full navy */
const Description = ({ html }: { html: string }) =>
	html ? <InlineHtml html={html} className="[&_strong]:font-medium [&_strong]:text-brand-navy" /> : undefined;

const primaryButtonClass =
	"group inline-flex items-center justify-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green";
const secondaryButtonClass =
	"group inline-flex items-center justify-center gap-2 rounded-sm bg-white/60 px-5 py-2.5 text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint";

/** A link that stays in the app for site paths and opens a new tab for other sites */
export function SmartLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
	if (isExternalHref(href))
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" className={className}>
				{children}
			</a>
		);
	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

/* ---------- pageHero ---------- */

export function PageHeroModule({ content, currentHref }: { content: ModuleContent["pageHero"]; currentHref: string }) {
	const buttons = useShown(content.buttons).filter((b) => b.label && b.href);
	return (
		<PageHero
			currentHref={currentHref}
			label={content.label || undefined}
			title={content.title}
			description={content.description ? <InlineHtml html={content.description} /> : undefined}
		>
			{buttons.length > 0 && (
				<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
					{buttons.map((button, index) => (
						<SmartLink
							key={index}
							href={button.href}
							className={`${button.variant === "secondary" ? secondaryButtonClass : primaryButtonClass}${hiddenItemClass(button)}`}
						>
							{button.label}
							{button.variant !== "secondary" && (
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							)}
						</SmartLink>
					))}
				</div>
			)}
		</PageHero>
	);
}

/* ---------- imageIntro ---------- */

/** Figures in a two-column hairline grid, label under the value */
function FigureGrid({ items, className = "" }: { items: Array<{ value: string; label: string; hidden?: boolean }>; className?: string }) {
	return (
		<dl className={`grid grid-cols-2 border-b border-brand-navy/15 ${className}`}>
			{items.map((figure, index) => (
				<div key={index} className={`flex flex-col-reverse border-t border-brand-navy/15 py-5 pr-4${hiddenItemClass(figure)}`}>
					<dt className="mt-1 text-sm leading-snug text-brand-navy/60">{figure.label}</dt>
					<dd className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">{figure.value}</dd>
				</div>
			))}
		</dl>
	);
}

export function ImageIntro({ content }: { content: ModuleContent["imageIntro"] }) {
	const figures = useShown(content.figures);
	const src = content.image ? homeImageUrl(content.image) : "";
	return (
		<section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
				className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-16"
			>
				{src && (
					<div className="relative h-[280px] overflow-hidden rounded-sm bg-brand-tint/50 sm:h-[440px] lg:col-span-7">
						<Image
							src={src}
							alt={content.imageAlt}
							fill
							priority
							unoptimized={!isOptimisable(src)}
							sizes="(min-width: 1024px) 640px, 100vw"
							className="object-cover"
						/>
					</div>
				)}
				<div className={`flex flex-col justify-between gap-10 ${src ? "lg:col-span-5" : "lg:col-span-12"}`}>
					<div
						className="text-pretty text-lg leading-relaxed text-brand-navy/75 [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline"
						dangerouslySetInnerHTML={{ __html: content.html }}
					/>
					{figures.length > 0 && <FigureGrid items={figures} />}
				</div>
			</motion.div>
		</section>
	);
}

/* ---------- gallery ---------- */

export function Gallery({ content }: { content: ModuleContent["gallery"] }) {
	const images = (content.images ?? []).filter(Boolean);
	const alt = content.title || content.label || "Photos";
	if (!content.label && !content.title && !content.description) {
		return (
			<section className="pb-8" aria-label="Gallery">
				<PhotoMarquee photos={images} alt={alt} reverse={content.reverse} />
			</section>
		);
	}
	return (
		<section className="relative isolate scroll-mt-20 py-16 sm:py-24">
			<div className="px-4 sm:px-6">
				<SectionHeading
					label={content.label || undefined}
					title={content.title}
					description={Description({ html: content.description })}
					className="sm:max-w-3xl"
				/>
			</div>
			<PhotoMarquee photos={images} alt={alt} reverse={content.reverse} />
		</section>
	);
}

/* ---------- rows ---------- */

export function Rows({ content, tone }: { content: ModuleContent["rows"] } & ToneProps) {
	return (
		<Section tone={tone}>
			<SectionHeading
				inverted={tone === "navy"}
				label={content.label || undefined}
				title={content.title}
				description={Description({ html: content.description })}
				className="sm:max-w-3xl"
			/>
			<HairlineRows items={content.items} variant="rows" />
		</Section>
	);
}

/* ---------- checklist ---------- */

export function Checklist({ content, tone }: { content: ModuleContent["checklist"] } & ToneProps) {
	const items = useShown(content.items);
	return (
		<Section tone={tone}>
			<div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
				<div>
					<SectionHeading
						align="left"
						inverted={tone === "navy"}
						label={content.label || undefined}
						title={content.title}
						description={Description({ html: content.description })}
					/>
					{content.intro && (
						<Reveal delay={0.1}>
							<div
								className="mx-auto mt-4 max-w-[19rem] text-pretty text-center text-base leading-relaxed text-brand-navy/75 min-[400px]:max-w-[21rem] sm:mx-0 sm:max-w-none sm:text-left sm:text-lg [&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-brand-navy"
								dangerouslySetInnerHTML={{ __html: content.intro }}
							/>
						</Reveal>
					)}
				</div>
				<ul className="border-b border-brand-navy/15">
					{items.map((item, index) => (
						<Reveal key={index} delay={index * 0.06}>
							<li className={`flex items-center gap-4 border-t border-brand-navy/15 py-5${hiddenItemClass(item)}`}>
								<Check className="h-4 w-4 shrink-0 text-brand-green" />
								<span className="text-lg font-medium tracking-tight text-brand-navy">{item.text}</span>
							</li>
						</Reveal>
					))}
				</ul>
			</div>
		</Section>
	);
}

/* ---------- cards ---------- */

/** Feature cards; their own tone is the navy band */
export function Cards({ content, tone = "navy" }: { content: ModuleContent["cards"] } & ToneProps) {
	const items = useShown(content.items);
	const navy = tone === "navy";
	const cardClass = navy
		? "bg-white/[0.06] ring-white/10 hover:bg-white/[0.1]"
		: `tone-light ring-brand-navy/10 hover:ring-brand-navy/25 ${tone === "muted" ? "bg-white" : "bg-[#f4f5f7]"}`;
	return (
		<Section tone={tone}>
			<div>
				<SectionHeading
					inverted={navy}
					label={content.label || undefined}
					title={content.title}
					description={Description({ html: content.description })}
					className="sm:max-w-3xl"
				/>
				<div className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
					{items.map((item, index) => {
						const Icon = moduleIcon(item.icon);
						return (
							<Reveal
								key={index}
								delay={index * 0.08}
								className={`relative overflow-hidden rounded-sm p-6 ring-1 transition-colors duration-300 sm:p-8 ${cardClass}${hiddenItemClass(item)}`}
							>
								<span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-brand-green" />
								<Icon className={`h-6 w-6 ${navy ? "text-brand-tint" : "text-brand-green"}`} strokeWidth={1.5} />
								<h3 className={`mt-6 text-xl font-semibold tracking-tight ${navy ? "text-white" : "text-brand-navy"}`}>{item.title}</h3>
								<div
									className={`mt-3 leading-relaxed [&_p+p]:mt-3 [&_a]:underline ${
										navy ? "text-white/65 [&_strong]:text-white" : "text-[#5a6377] [&_strong]:text-brand-navy"
									} [&_strong]:font-medium`}
									dangerouslySetInnerHTML={{ __html: item.html }}
								/>
							</Reveal>
						);
					})}
				</div>
			</div>
		</Section>
	);
}

/* ---------- iconGrid ---------- */

export function IconGrid({ content, tone }: { content: ModuleContent["iconGrid"] } & ToneProps) {
	const items = useShown(content.items);
	return (
		<Section tone={tone}>
			<SectionHeading
				inverted={tone === "navy"}
				label={content.label || undefined}
				title={content.title}
				description={Description({ html: content.description })}
				className="sm:max-w-3xl"
			/>
			{/* Each cell draws its left and top rule; the negative margin hides the outer edges */}
			<Reveal className="mt-12 overflow-hidden lg:mt-16">
				<div className="-ml-px -mt-px grid sm:grid-cols-2 lg:grid-cols-4">
					{items.map((item, index) => {
						const Icon = moduleIcon(item.icon);
						return (
							<div
								key={index}
								className={`group flex items-center gap-4 border-l border-t border-brand-navy/10 p-6 sm:block sm:min-h-[11rem] sm:p-8${hiddenItemClass(item)}`}
							>
								<Icon
									className="h-6 w-6 shrink-0 text-brand-green transition-transform duration-300 group-hover:-translate-y-0.5"
									strokeWidth={1.5}
								/>
								<p className="font-medium leading-snug text-brand-navy sm:mt-6 sm:text-lg">{item.title}</p>
							</div>
						);
					})}
				</div>
			</Reveal>
		</Section>
	);
}

/* ---------- columns ---------- */

export function Columns({ content, tone }: { content: ModuleContent["columns"] } & ToneProps) {
	const items = useShown(content.items);
	const columns = items.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2";
	return (
		<Section tone={tone}>
			<div className={`grid gap-x-16 gap-y-12 ${columns}`}>
				{items.map((item, index) => {
					const Icon = moduleIcon(item.icon);
					return (
						<Reveal
							key={index}
							delay={(index % 3) * 0.1}
							className={`border-t border-brand-navy/15 pt-8${hiddenItemClass(item)}`}
						>
							<Icon className="h-6 w-6 text-brand-green" strokeWidth={1.5} />
							<h3 className="mt-6 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">{item.title}</h3>
							{/* Coloured phrases from the editor read as medium weight, as on the hand-written page */}
							<div
								className="mt-4 leading-relaxed text-brand-navy/75 [&_p+p]:mt-3 [&_span[style]]:font-medium [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline"
								dangerouslySetInnerHTML={{ __html: item.html }}
							/>
						</Reveal>
					);
				})}
			</div>
		</Section>
	);
}

/* ---------- disclosure ---------- */

export function Disclosure({ content }: { content: ModuleContent["disclosure"] }) {
	const html = (content.html ?? "").replaceAll("{year}", String(new Date().getFullYear()));
	return (
		<section className="relative isolate px-4 pb-16 sm:px-6">
			<Reveal className="mx-auto max-w-4xl border-t border-brand-navy/15 pt-10 text-center text-sm leading-relaxed text-brand-navy/60">
				{content.title && <h2 className="text-lg font-semibold tracking-tight text-brand-navy">{content.title}</h2>}
				<div
					className={`[&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:underline ${content.title ? "mt-4" : ""}`}
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</Reveal>
		</section>
	);
}
