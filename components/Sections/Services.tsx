"use client";

import React from "react";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { ServicesContent } from "@/app/types/modules";
import { useShown, hiddenItemClass, type ToneProps } from "@/components/modules/shared";

// Admin HTML for each row's detail
const detailClass =
	"leading-relaxed lg:pt-1 [&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-brand-navy [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_a]:text-brand-green [&_a]:underline";

interface HairlineRowsProps {
	items: Array<{ title: string; html: string; hidden?: boolean }>;
	/** "services": a narrower title column and grey detail; "rows": the about page's even split */
	variant?: "services" | "rows";
}

/** Rows divided by hairlines: a title on the left, its detail on the right. Shared by the Services
 *  and the "Title and detail rows" modules. */
export function HairlineRows({ items, variant = "services" }: HairlineRowsProps) {
	const shown = useShown(items);
	const wide = variant === "rows";
	return (
		<div className="mt-12 border-b border-brand-navy/15 lg:mt-16">
			{shown.map((row, index) => (
				<Reveal key={index} delay={Math.min(index, 3) * 0.05} className={hiddenItemClass(row).trim() || undefined}>
					<div className="grid gap-x-8 gap-y-3 border-t border-brand-navy/15 py-8 lg:grid-cols-12 lg:py-10">
						<h3
							className={`text-xl font-semibold leading-snug tracking-tight text-brand-navy sm:text-2xl lg:col-start-2 ${
								wide ? "lg:col-span-5" : "lg:col-span-4"
							}`}
						>
							{row.title}
						</h3>
						<div
							className={`${detailClass} ${wide ? "text-brand-navy/75 lg:col-span-5" : "text-[#5a6377] lg:col-span-6"}`}
							dangerouslySetInnerHTML={{ __html: row.html }}
						/>
					</div>
				</Reveal>
			))}
		</div>
	);
}

/** Services as rows divided by hairlines: title on the left, the detail on the right. */
export default function Services({ content, tone }: { content: ServicesContent } & ToneProps) {
	return (
		<Section tone={tone}>
			<SectionHeading
				inverted={tone === "navy"}
				label={content.label}
				title={content.title}
				description={content.description || undefined}
			/>
			<HairlineRows items={content.items} />
		</Section>
	);
}
