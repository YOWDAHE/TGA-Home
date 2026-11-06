import React from "react";
import Reveal from "./Reveal";
import { homeImageUrl } from "@/lib/utils";
import type { ModuleContent } from "@/app/types/modules";

const bioClass =
	"mt-8 space-y-4 border-t border-brand-navy/15 pt-8 leading-relaxed text-[#5a6377] [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline [&_a]:decoration-brand-green/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand-green";

type PartnerProfileProps = ModuleContent["profile"] & {
	/** Spacing above the block, e.g. when it follows other content in a section */
	className?: string;
};

/** A portrait beside a name and biography: the partners in the About module, and the Profile
 *  module. The portrait sits left or right on wide screens and on top on phones; without a photo the
 *  text takes the centre columns. */
export default function PartnerProfile({ label, name, photo, bio, imageSide = "left", className = "" }: PartnerProfileProps) {
	const right = imageSide === "right";
	return (
		<div className={`grid items-start gap-10 lg:grid-cols-12 lg:gap-16 ${className}`}>
			{photo && (
				<Reveal className={`lg:col-span-5 ${right ? "lg:order-2" : ""}`}>
					<img src={homeImageUrl(photo)} alt={name} className="aspect-[4/5] w-full object-cover object-top" />
				</Reveal>
			)}
			<Reveal delay={0.1} className={photo ? `lg:col-span-7 ${right ? "lg:order-1" : ""}` : "lg:col-span-8 lg:col-start-3"}>
				{label && <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">{label}</p>}
				<h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-brand-navy sm:text-4xl">{name}</h3>
				<div className={bioClass} dangerouslySetInnerHTML={{ __html: bio }} />
			</Reveal>
		</div>
	);
}
