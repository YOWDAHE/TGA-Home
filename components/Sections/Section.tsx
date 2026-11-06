import React from "react";

interface SectionProps {
	id?: string;
	/** "plain" sits on the white page, "muted" is a light grey band, "navy" a solid brand band */
	tone?: "plain" | "muted" | "navy";
	/** Kept for older callers; sections no longer draw a background pattern */
	pattern?: boolean;
	className?: string;
	children: React.ReactNode;
}

const toneClass = {
	plain: "",
	muted: "bg-[#f4f5f7]",
	// tone-navy turns navy text and hairlines inside light (see globals.css)
	navy: "tone-navy bg-brand-navy text-white",
};

/** Full-width page band with the content held to the site's column. */
export default function Section({ id, tone = "plain", className = "", children }: SectionProps) {
	return (
		<section id={id} className={`relative scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 ${toneClass[tone]} ${className}`}>
			<div className="mx-auto max-w-6xl">{children}</div>
		</section>
	);
}
