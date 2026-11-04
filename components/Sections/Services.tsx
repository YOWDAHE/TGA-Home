import React from "react";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { HomeContent } from "@/app/types/landing";

// Admin HTML for each service's detail
const detailClass =
	"leading-relaxed text-[#5a6377] lg:col-span-6 lg:pt-1 [&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-brand-navy [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_a]:text-brand-green [&_a]:underline";

/** Services as rows divided by hairlines: title on the left, the detail on the right. */
export default function Services({ content }: { content: HomeContent["services"] }) {
	return (
		<Section id="services">
			<SectionHeading
				label={content.label}
				title={content.title}
				description={content.description}
			/>

			<div className="mt-12 border-b border-brand-navy/15 lg:mt-16">
				{content.items.map((service, index) => (
					<Reveal key={index} delay={Math.min(index, 3) * 0.05}>
						<div className="grid gap-x-8 gap-y-3 border-t border-brand-navy/15 py-8 lg:grid-cols-12 lg:py-10">
							<h3 className="text-xl font-semibold leading-snug tracking-tight text-brand-navy sm:text-2xl lg:col-span-4 lg:col-start-2">
								{service.title}
							</h3>
							<div className={detailClass} dangerouslySetInnerHTML={{ __html: service.html }} />
						</div>
					</Reveal>
				))}
			</div>
		</Section>
	);
}
