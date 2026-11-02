// Shared metadata for every public page: title, description, canonical link and the
// generated link-preview card (app/og/route.tsx) used by WhatsApp, Telegram, LinkedIn, X, etc.
import type { Metadata } from "next";

export const SITE_NAME = "TGA Global Law Firm LL.P";
export const SITE_URL = "https://tgagloballawfirm.com";

interface PreviewCard {
	/** Small green label above the title, e.g. "News" or "Legal update" */
	eyebrow: string;
	/** Defaults to the page title */
	title?: string;
	/** Shown under the title, e.g. a publish date */
	date?: string | Date | null;
	/** Same-site image path (a news photo) shown beside the text */
	image?: string | null;
}

export function previewImageUrl({ eyebrow, title = "", date, image }: PreviewCard) {
	const params = new URLSearchParams({ eyebrow, title });
	const day = formatDate(date);
	if (day) params.set("date", day);
	// Only this site's own paths; the image route refuses anything else
	if (image?.startsWith("/")) params.set("image", image);
	return `/og?${params}`;
}

interface PageMetadataOptions {
	title: string;
	description: string;
	/** Path of the page, used for the canonical link and og:url */
	path: string;
	card: PreviewCard;
	type?: "website" | "article";
	publishedTime?: string | Date | null;
	keywords?: string[];
	/** Pages such as login that shouldn't appear in search results */
	noIndex?: boolean;
	/** Use the title as is instead of adding the site name through the layout's template */
	absoluteTitle?: boolean;
}

export function pageMetadata({
	title,
	description,
	path,
	card,
	type = "website",
	publishedTime,
	keywords,
	noIndex,
	absoluteTitle,
}: PageMetadataOptions): Metadata {
	const shareTitle = `${title} · ${SITE_NAME}`;
	const image = {
		url: previewImageUrl({ ...card, title: card.title ?? title }),
		width: 1200,
		height: 630,
		alt: `${card.eyebrow}: ${card.title ?? title}`,
		type: "image/png",
	};
	const published = publishedTime ? new Date(publishedTime) : null;

	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		keywords,
		alternates: { canonical: path },
		openGraph: {
			type,
			url: path,
			siteName: SITE_NAME,
			locale: "en_US",
			title: shareTitle,
			description,
			images: [image],
			...(type === "article" && published && !Number.isNaN(published.getTime())
				? { publishedTime: published.toISOString(), authors: [SITE_NAME] }
				: {}),
		},
		twitter: {
			card: "summary_large_image",
			title: shareTitle,
			description,
			images: [image],
		},
		...(noIndex ? { robots: { index: false, follow: true } } : {}),
	};
}

/** Plain text for descriptions: tags removed, whitespace collapsed, cut at a word near `max` */
export function plainSummary(html?: string | null, max = 160) {
	const text = (html ?? "")
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/\s+/g, " ")
		.trim();
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

function formatDate(date?: string | Date | null) {
	if (!date) return "";
	const d = new Date(date);
	return Number.isNaN(d.getTime())
		? ""
		: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
