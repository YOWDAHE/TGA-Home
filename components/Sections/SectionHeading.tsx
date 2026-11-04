import React from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	/** Small uppercase label in the left column, e.g. "About the firm" */
	label?: string;
	/** Centered by default; "left" uses the label-column layout */
	align?: "left" | "center";
	/** Light text for navy bands */
	inverted?: boolean;
	/** Link or action shown at the end of the heading row, e.g. "All news" */
	action?: React.ReactNode;
	className?: string;
}

export const labelClass = "text-xs font-medium uppercase tracking-[0.18em]";

/** Section heading in the editorial style: a hairline rule, a label column, then a serif headline. */
export default function SectionHeading({
	title,
	description,
	label,
	align = "center",
	inverted = false,
	action,
	className = "",
}: SectionHeadingProps) {
	const muted = inverted ? "text-white/70" : "text-[#5a6377]";
	const titleClass = `text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${
		inverted ? "text-white" : "text-brand-navy"
	}`;

	if (align === "center") {
		return (
			<Reveal className={`mx-auto max-w-3xl text-center ${className}`}>
				{label && <p className={`${labelClass} mb-4 ${inverted ? "text-white/60" : "text-brand-green"}`}>{label}</p>}
				<h2 className={titleClass}>{title}</h2>
				{description && <p className={`mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg ${muted}`}>{description}</p>}
				{action && <div className="mt-6 flex justify-center">{action}</div>}
			</Reveal>
		);
	}

	return (
		<Reveal
			className={`grid gap-x-8 gap-y-4 border-t pt-6 lg:grid-cols-12 ${inverted ? "border-white/20" : "border-brand-navy/15"} ${className}`}
		>
			<p className={`${labelClass} lg:col-span-3 lg:pt-3 ${inverted ? "text-white/60" : "text-brand-green"}`}>
				{label ?? " "}
			</p>
			<div className="lg:col-span-9">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
					<h2 className={`${titleClass} max-w-3xl`}>{title}</h2>
					{action && <div className="shrink-0 sm:pb-2">{action}</div>}
				</div>
				{description && <p className={`mt-5 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg ${muted}`}>{description}</p>}
			</div>
		</Reveal>
	);
}
