import React from "react";
import Section from "./Section";
import { Partner } from "@/app/types/landing";
import { convertToApiUrl } from "@/lib/utils";
import Reveal from "./Reveal";
import { labelClass } from "./SectionHeading";

interface PartnersProps {
	partners: Partner[];
}

/** Partner logos in a grid divided by hairlines, under a one-line caption. */
const Partners = React.memo(function Partners({ partners }: PartnersProps) {
	return (
		<Section className="bg-white">
			<Reveal>
				<p className={`${labelClass} text-center text-[#4a5368]`}>
					Trusted by leading organizations worldwide
				</p>
			</Reveal>

			{/* Each cell draws its left and top rule; the negative margin hides the outer edges */}
			<Reveal className="mt-12 overflow-hidden sm:mt-16">
				<div className="-ml-px -mt-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
					{partners.map((partner) => (
						<div
							key={partner.id}
							className="group flex h-28 items-center justify-center border-l border-t border-brand-navy/10 p-6 sm:h-36 sm:p-8"
						>
							<img
								src={convertToApiUrl(partner.logo_url) || "/office/placeholder.jpg"}
								alt={partner.name}
								width={140}
								height={70}
								loading="lazy"
								className="max-h-14 max-w-[75%] object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
							/>
						</div>
					))}
				</div>
			</Reveal>
		</Section>
	);
});

export default Partners;
