"use client";

import React, { createContext, useContext } from "react";
import type { Hideable, Tone } from "@/app/types/modules";

/* ---------- preview state ---------- */

interface PreviewState {
	/** Rendered inside the admin's live preview */
	preview: boolean;
	/** Hidden modules and list items render dimmed instead of being left out */
	showHidden: boolean;
}

export const PreviewContext = createContext<PreviewState>({ preview: false, showHidden: false });
export const usePreview = () => useContext(PreviewContext);

/** The list items to render: hidden ones are dropped, or kept (dimmed) when the preview shows them.
 *  The public API already strips them; this is a safety net for previews and stale data. */
export function useShown<T extends Hideable>(list: T[] | undefined | null): T[] {
	const { showHidden } = usePreview();
	return (Array.isArray(list) ? list : []).filter((item) => item && (showHidden || !item.hidden));
}

/** Dims a hidden item the preview shows */
export const hiddenItemClass = (item: Hideable | undefined) =>
	item?.hidden ? " opacity-40 outline-dashed outline-1 outline-offset-4 outline-brand-navy/40" : "";

/* ---------- tones ---------- */

/** Props every module renderer gets */
export interface ToneProps {
	/** From settings.tone; undefined keeps the module's own tone */
	tone?: Exclude<Tone, "auto">;
}

/* ---------- admin HTML ---------- */

/** Body text from the rich-text editor: paragraphs, lists, bold, links; inline colours are kept */
export const richClass =
	"leading-relaxed text-[#5a6377] [&_p+p]:mt-4 [&_p+ul]:mt-3 [&_p+ol]:mt-3 [&_ul+p]:mt-4 [&_ol+p]:mt-4 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mt-1.5 [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline [&_a]:decoration-brand-green/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand-green";

/** SectionHeading puts the description in its own paragraph, so paragraphs become line breaks */
export const inlineHtml = (html: string) =>
	(html ?? "").replace(/<\/p>\s*<p[^>]*>/g, "<br /><br />").replace(/<\/?p[^>]*>/g, "");

/** Heading descriptions may be plain text or editor HTML; either renders inline */
export function InlineHtml({ html, className }: { html: string; className?: string }) {
	if (!html) return null;
	if (!/[<&]/.test(html)) return <span className={className}>{html}</span>;
	return <span className={className} dangerouslySetInnerHTML={{ __html: inlineHtml(html) }} />;
}

/** True when an editor field holds no visible text, e.g. "<p></p>" */
export const isBlankHtml = (html: string | undefined) => !html || !html.replace(/<[^>]*>|&nbsp;|\s/g, "");

/** Button and link targets typed in the admin */
export const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export function ButtonLink({
	href,
	className,
	children,
}: {
	href: string;
	className: string;
	children: React.ReactNode;
}) {
	const external = isExternalHref(href);
	return (
		<a
			href={href}
			className={className}
			target={external ? "_blank" : undefined}
			rel={external ? "noopener noreferrer" : undefined}
		>
			{children}
		</a>
	);
}
