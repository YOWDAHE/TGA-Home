import React from "react";

export interface SearchField {
	label: string;
	value?: string | null;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Labels of the fields that contain the search phrase (case-insensitive, like the API's ILIKE). */
export function matchedFields(query: string, fields: SearchField[]) {
	const needle = query.trim().toLowerCase();
	if (!needle) return [];
	return fields
		.filter((field) => (field.value ?? "").toLowerCase().includes(needle))
		.map((field) => field.label);
}

/** A short window of text around the first match, so the phrase is visible in the result. */
// A short lead-in keeps the phrase inside the two clamped lines, even on phones
export function excerptAround(text: string, query: string, before = 30, after = 180) {
	const clean = (text ?? "").replace(/\s+/g, " ").trim();
	const index = clean.toLowerCase().indexOf(query.trim().toLowerCase());
	if (!query.trim() || index < 0) return clean.slice(0, before + after);

	const start = Math.max(0, index - before);
	const end = Math.min(clean.length, index + query.trim().length + after);
	return `${start > 0 ? "…" : ""}${clean.slice(start, end).trim()}${end < clean.length ? "…" : ""}`;
}

/** Renders text with every occurrence of the phrase marked. */
export function Highlight({ text, query }: { text: string; query: string }) {
	const phrase = query.trim();
	if (!phrase) return <>{text}</>;

	const parts = (text ?? "").split(new RegExp(`(${escapeRegExp(phrase)})`, "gi"));
	return (
		<>
			{parts.map((part, index) =>
				part.toLowerCase() === phrase.toLowerCase() ? (
					<mark key={index} className="rounded-sm bg-brand-green/15 px-0.5 text-inherit">
						{part}
					</mark>
				) : (
					<React.Fragment key={index}>{part}</React.Fragment>
				)
			)}
		</>
	);
}

/** "Found in Title · Text" pills shown on each search result. */
export function MatchBadges({ labels }: { labels: string[] }) {
	return (
		<div className="flex flex-wrap items-center gap-1.5 text-xs">
			<span className="text-brand-navy/50">Found in</span>
			{labels.length > 0 ? (
				labels.map((label) => (
					<span key={label} className="rounded-sm bg-brand-tint px-2.5 py-0.5 font-medium text-brand-green">
						{label}
					</span>
				))
			) : (
				<span className="rounded-sm bg-[#f4f5f7] px-2.5 py-0.5 text-brand-navy/75">Other details</span>
			)}
		</div>
	);
}
