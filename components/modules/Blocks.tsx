"use client";

// General building blocks, in the site's style: hairlines, the navy / green palette, SectionHeading.

import React, { useId, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Plus, Quote as QuoteIcon } from "lucide-react";
import Section from "@/components/Sections/Section";
import SectionHeading, { labelClass } from "@/components/Sections/SectionHeading";
import Reveal from "@/components/Sections/Reveal";
import Milestones from "@/components/Sections/Milestones";
import PartnerProfile from "@/components/Sections/PartnerProfile";
import { isOptimisable } from "@/components/Sections/PhotoMarquee";
import { homeImageUrl } from "@/lib/utils";
import type { ModuleContent } from "@/app/types/modules";
import { InlineHtml, hiddenItemClass, isBlankHtml, richClass, useShown, usePreview, type ToneProps } from "./shared";
import { SmartLink } from "./PageSections";

const heading = (
	content: { label?: string; title?: string; description?: string },
	tone: ToneProps["tone"],
	extra: Partial<React.ComponentProps<typeof SectionHeading>> = {}
) =>
	content.label || content.title || content.description ? (
		<SectionHeading
			inverted={tone === "navy"}
			label={content.label || undefined}
			title={content.title}
			description={content.description ? <InlineHtml html={content.description} /> : undefined}
			{...extra}
		/>
	) : null;

/* ---------- richText ---------- */

export function RichText({ content, tone }: { content: ModuleContent["richText"] } & ToneProps) {
	const center = content.align !== "left";
	const hasHeading = !!(content.label || content.title);
	return (
		<Section tone={tone}>
			{hasHeading && heading({ label: content.label, title: content.title }, tone, { align: center ? "center" : "left" })}
			{!isBlankHtml(content.html) && (
				<Reveal
					delay={0.05}
					className={center ? "mx-auto max-w-2xl text-center" : "lg:grid lg:grid-cols-12 lg:gap-x-8"}
				>
					<div
						className={`${richClass} text-base sm:text-lg ${hasHeading ? "mt-6" : ""} ${
							center ? "[&_ol]:inline-block [&_ol]:text-left [&_ul]:inline-block [&_ul]:text-left" : "max-w-2xl lg:col-span-9 lg:col-start-4"
						}`}
						dangerouslySetInnerHTML={{ __html: content.html }}
					/>
				</Reveal>
			)}
		</Section>
	);
}

/* ---------- cta ---------- */

/** A navy banner with a headline, a line of text and up to two buttons, like the footer's closing call */
export function Cta({ content }: { content: ModuleContent["cta"] }) {
	const primary = content.primaryLabel && content.primaryHref;
	const secondary = content.secondaryLabel && content.secondaryHref;
	return (
		<section className="relative px-4 py-12 sm:px-6 sm:py-16">
			<Reveal className="tone-navy relative isolate mx-auto max-w-6xl overflow-hidden rounded-sm bg-brand-navy px-6 py-12 text-white sm:px-12 sm:py-16">
				<div aria-hidden className="absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-brand-green/40 blur-3xl" />
				<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl">
						<h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{content.title}</h2>
						{!isBlankHtml(content.html) && (
							<div
								className="mt-4 text-pretty leading-relaxed text-white/70 sm:text-lg [&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-white [&_a]:underline"
								dangerouslySetInnerHTML={{ __html: content.html }}
							/>
						)}
					</div>
					{(primary || secondary) && (
						<div className="flex shrink-0 flex-col gap-3 sm:flex-row">
							{primary && (
								<SmartLink
									href={content.primaryHref}
									className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-white px-6 py-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-tint"
								>
									{content.primaryLabel}
									<ArrowUpRight className="h-4 w-4" />
								</SmartLink>
							)}
							{secondary && (
								<SmartLink
									href={content.secondaryHref}
									className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-6 py-3 text-sm font-medium text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
								>
									{content.secondaryLabel}
								</SmartLink>
							)}
						</div>
					)}
				</div>
			</Reveal>
		</section>
	);
}

/* ---------- imageText ---------- */

export function ImageText({ content, tone }: { content: ModuleContent["imageText"] } & ToneProps) {
	const src = content.image ? homeImageUrl(content.image) : "";
	const right = content.imageSide === "right";
	const navy = tone === "navy";
	return (
		<Section tone={tone}>
			<div className={`grid items-center gap-10 lg:gap-16 ${src ? "lg:grid-cols-2" : ""}`}>
				{src && (
					<Reveal className={`relative aspect-[4/3] overflow-hidden rounded-sm bg-brand-tint/50 ${right ? "lg:order-2" : ""}`}>
						<Image
							src={src}
							alt={content.imageAlt}
							fill
							unoptimized={!isOptimisable(src)}
							sizes="(min-width: 1024px) 560px, 100vw"
							className="object-cover"
						/>
					</Reveal>
				)}
				<Reveal delay={0.1} className={src ? "" : "mx-auto max-w-3xl"}>
					{content.label && <p className={`${labelClass} mb-4 ${navy ? "text-white/60" : "text-brand-green"}`}>{content.label}</p>}
					{content.title && (
						<h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-brand-navy sm:text-4xl">
							{content.title}
						</h2>
					)}
					{!isBlankHtml(content.html) && (
						<div className={`${richClass} mt-5 text-base sm:text-lg`} dangerouslySetInnerHTML={{ __html: content.html }} />
					)}
					{content.buttonLabel && content.buttonHref && (
						<SmartLink
							href={content.buttonHref}
							className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-colors ${
								navy ? "bg-white text-brand-navy hover:bg-brand-tint" : "bg-brand-navy text-white hover:bg-brand-green"
							}`}
						>
							{content.buttonLabel}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</SmartLink>
					)}
				</Reveal>
			</div>
		</Section>
	);
}

/* ---------- quote ---------- */

export function Quote({ content, tone }: { content: ModuleContent["quote"] } & ToneProps) {
	const photo = content.photo ? homeImageUrl(content.photo) : "";
	return (
		<Section tone={tone}>
			<Reveal className="mx-auto max-w-4xl text-center">
				<QuoteIcon aria-hidden className="mx-auto h-10 w-10 text-brand-green" strokeWidth={1.5} />
				<blockquote
					className="mt-8 text-balance text-2xl font-medium leading-snug tracking-[-0.02em] text-brand-navy sm:text-3xl lg:text-4xl [&_p+p]:mt-4 [&_strong]:font-semibold [&_strong]:text-brand-green"
					dangerouslySetInnerHTML={{ __html: content.html }}
				/>
				{(content.name || content.role || photo) && (
					<figcaption className="mt-10 flex items-center justify-center gap-4">
						{photo && (
							<img src={photo} alt={content.name} className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-brand-navy/10" />
						)}
						<div className={photo ? "text-left" : ""}>
							{content.name && <p className="font-semibold tracking-tight text-brand-navy">{content.name}</p>}
							{content.role && <p className="text-sm text-[#5a6377]">{content.role}</p>}
						</div>
					</figcaption>
				)}
			</Reveal>
		</Section>
	);
}

/* ---------- faq ---------- */

/** Questions that open one at a time. Buttons carry aria-expanded; closed answers are inert. */
export function Faq({ content, tone }: { content: ModuleContent["faq"] } & ToneProps) {
	const items = useShown(content.items);
	const [open, setOpen] = useState<number | null>(null);
	const baseId = useId();
	return (
		<Section tone={tone}>
			{heading(content, tone, { className: "sm:max-w-3xl" })}
			<div className={`mx-auto max-w-3xl border-b border-brand-navy/15 ${content.title || content.label ? "mt-12 lg:mt-16" : ""}`}>
				{items.map((item, index) => {
					const isOpen = open === index;
					const buttonId = `${baseId}-q${index}`;
					const panelId = `${baseId}-a${index}`;
					return (
						<div key={index} className={`border-t border-brand-navy/15${hiddenItemClass(item)}`}>
							<h3>
								<button
									type="button"
									id={buttonId}
									aria-expanded={isOpen}
									aria-controls={panelId}
									onClick={() => setOpen(isOpen ? null : index)}
									className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-tight text-brand-navy transition-colors hover:text-brand-green focus:outline-none focus-visible:text-brand-green sm:text-xl"
								>
									{item.question}
									<Plus
										aria-hidden
										className={`h-5 w-5 shrink-0 text-brand-green transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
									/>
								</button>
							</h3>
							{/* Height animates through the grid row; closed answers leave the tab order */}
							<div
								id={panelId}
								role="region"
								aria-labelledby={buttonId}
								inert={!isOpen}
								className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
							>
								<div className="overflow-hidden">
									<div className={`${richClass} pb-6 pr-10`} dangerouslySetInnerHTML={{ __html: item.html }} />
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</Section>
	);
}

/* ---------- video ---------- */

/** A privacy-friendly embed URL for a YouTube or Vimeo link, or null when it isn't one */
export function videoEmbedUrl(url: string): string | null {
	const value = (url ?? "").trim();
	if (!value) return null;
	let parsed: URL;
	try {
		parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
	} catch {
		return null;
	}
	const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
	const youTubeId = /^[\w-]{11}$/;
	let id: string | null = null;
	if (host === "youtu.be") id = parsed.pathname.slice(1).split("/")[0];
	else if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
		id = parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] ?? null;
	}
	if (id && youTubeId.test(id)) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;

	if (host === "vimeo.com" || host === "player.vimeo.com") {
		const vimeoId = parsed.pathname.match(/(?:^|\/)(\d{6,})(?:\/|$)/)?.[1];
		if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?dnt=1`;
	}
	return null;
}

export function Video({ content, tone }: { content: ModuleContent["video"] } & ToneProps) {
	const { preview } = usePreview();
	const src = videoEmbedUrl(content.url);
	// Visitors see nothing without a usable link; the admin's preview says what is missing
	if (!src && !preview) return null;
	return (
		<Section tone={tone}>
			{heading(content, tone, { className: "sm:max-w-3xl" })}
			<Reveal className={`mx-auto max-w-5xl ${content.title || content.label ? "mt-12 lg:mt-16" : ""}`}>
				<div className="relative aspect-video overflow-hidden rounded-sm bg-brand-navy ring-1 ring-brand-navy/10">
					{src ? (
						<iframe
							src={src}
							title={content.title || "Video"}
							className="absolute inset-0 h-full w-full"
							style={{ border: 0 }}
							loading="lazy"
							referrerPolicy="strict-origin-when-cross-origin"
							allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						/>
					) : (
						<p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/70">
							{content.url ? "This link isn’t a YouTube or Vimeo video." : "Paste a YouTube or Vimeo link to show the video."}
						</p>
					)}
				</div>
			</Reveal>
		</Section>
	);
}

/* ---------- figures ---------- */

export function Figures({ content, tone }: { content: ModuleContent["figures"] } & ToneProps) {
	const items = useShown(content.items);
	return (
		<Section tone={tone}>
			{heading(content, tone, { className: "sm:max-w-3xl" })}
			<Reveal className={content.title || content.label ? "mt-12 lg:mt-16" : ""}>
				<dl className={`grid grid-cols-2 border-b border-brand-navy/15 ${items.length % 3 === 0 && items.length % 4 !== 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
					{items.map((figure, index) => (
						<div key={index} className={`flex flex-col-reverse border-t border-brand-navy/15 py-6 pr-4${hiddenItemClass(figure)}`}>
							<dt className="mt-2 text-sm leading-snug text-brand-navy/60 sm:text-base">{figure.label}</dt>
							<dd className="text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl">{figure.value}</dd>
						</div>
					))}
				</dl>
			</Reveal>
		</Section>
	);
}

/* ---------- profile / milestones ---------- */

export function Profile({ content, tone }: { content: ModuleContent["profile"] } & ToneProps) {
	return (
		<Section tone={tone}>
			<PartnerProfile {...content} />
		</Section>
	);
}

export function MilestonesModule({ content }: { content: ModuleContent["milestones"] }) {
	return (
		<Section>
			<Milestones label={content.label} slides={content.slides} />
		</Section>
	);
}

/* ---------- team ---------- */

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

export function Team({ content, tone }: { content: ModuleContent["team"] } & ToneProps) {
	const members = useShown(content.members);
	return (
		<Section tone={tone}>
			{heading(content, tone, { className: "sm:max-w-3xl" })}
			<div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 ${content.title || content.label ? "mt-12 lg:mt-16" : ""}`}>
				{members.map((member, index) => {
					const photo = member.photo ? homeImageUrl(member.photo) : "";
					return (
						<Reveal key={index} delay={(index % 4) * 0.06} className={hiddenItemClass(member).trim() || undefined}>
							<div className="tone-light relative aspect-[4/5] overflow-hidden rounded-sm bg-brand-tint">
								{photo ? (
									<Image
										src={photo}
										alt={member.name}
										fill
										unoptimized={!isOptimisable(photo)}
										sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw"
										className="object-cover object-top"
									/>
								) : (
									<span aria-hidden className="absolute inset-0 flex items-center justify-center text-4xl font-semibold tracking-tight text-brand-navy/40">
										{initials(member.name)}
									</span>
								)}
							</div>
							<h3 className="mt-4 font-semibold leading-snug tracking-tight text-brand-navy sm:text-lg">{member.name}</h3>
							{member.role && <p className="mt-1 text-sm leading-snug text-[#5a6377]">{member.role}</p>}
						</Reveal>
					);
				})}
			</div>
		</Section>
	);
}

/* ---------- spacer ---------- */

const spacerHeights = { sm: "h-8 sm:h-12", md: "h-16 sm:h-24", lg: "h-24 sm:h-36" };

export function Spacer({ content }: { content: ModuleContent["spacer"] }) {
	const height = spacerHeights[content.size] ?? spacerHeights.md;
	return (
		<div aria-hidden className={`flex items-center px-4 sm:px-6 ${height}`}>
			{content.line && <div className="mx-auto w-full max-w-6xl border-t border-brand-navy/15" />}
		</div>
	);
}
