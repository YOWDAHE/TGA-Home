"use client";

import React from "react";
import Section from "./Section";
import { Partner } from "@/app/types/landing";
import { convertToApiUrl } from "@/lib/utils";
import Reveal from "./Reveal";
import { labelClass } from "./SectionHeading";
import type { ModuleContent } from "@/app/types/modules";
import type { ToneProps } from "@/components/modules/shared";

interface PartnersProps {
	partners: Partner[];
}

const logoClass =
	"max-h-14 max-w-[75%] object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0";

const Logo = ({ partner }: { partner: Partner }) => (
	<img
		src={convertToApiUrl(partner.logo_url) || "/office/placeholder.jpg"}
		alt={partner.name}
		width={140}
		height={70}
		loading="lazy"
		className={logoClass}
	/>
);

/** Phones: an endless strip that glides on its own; the logos run twice so the loop never shows a seam.
 *  Touching it pauses the strip. */
function PartnersMarquee({ partners }: PartnersProps) {
	if (!partners.length) return null;
	return (
		<div className="fade-x overflow-hidden [--fade:10%]">
			<div
				className="flex w-max animate-marquee active:[animation-play-state:paused] motion-reduce:animate-none"
				style={{ animationDuration: `${Math.max(partners.length, 4) * 3}s` }}
			>
				{[...partners, ...partners].map((partner, index) => (
					<div
						key={`${partner.id}-${index}`}
						aria-hidden={index >= partners.length}
						className="group flex h-20 w-32 shrink-0 items-center justify-center px-4"
					>
						<Logo partner={partner} />
					</div>
				))}
			</div>
		</div>
	);
}

/** Partner logos in rows, the last row centred, under a one-line caption; an endless strip on phones. */
const Partners = React.memo(function Partners({
	partners,
	content,
	tone,
}: PartnersProps & ToneProps & { content: ModuleContent["partners"] }) {
	return (
		<Section tone={tone} className={tone ? "" : "bg-white"}>
			{content.caption && (
				<Reveal>
					<p className={`${labelClass} text-center ${tone === "navy" ? "text-white/70" : "text-[#4a5368]"}`}>
						{content.caption}
					</p>
				</Reveal>
			)}

			<Reveal className="mt-10 sm:hidden">
				<PartnersMarquee partners={partners} />
			</Reveal>
			{/* Rows wrap and the last one is centred */}
			<Reveal className="mt-16 hidden sm:block">
				<div className="flex flex-wrap justify-center">
					{partners.map((partner) => (
						<div key={partner.id} className="group flex h-36 w-1/3 items-center justify-center p-8 lg:w-1/5">
							<Logo partner={partner} />
						</div>
					))}
				</div>
			</Reveal>
		</Section>
	);
});

export default Partners;
