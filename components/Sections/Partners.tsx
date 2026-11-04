import React from "react";
import Section from "./Section";
import { Partner } from "@/app/types/landing";
import { convertToApiUrl } from "@/lib/utils";
import Reveal from "./Reveal";
import { labelClass } from "./SectionHeading";

interface PartnersProps {
	partners: Partner[];
}

/** Partner logos in rows divided by hairlines, the last row centred, under a one-line caption. */
const Partners = React.memo(function Partners({ partners }: PartnersProps) {
	return (
		<Section className="bg-white">
			<Reveal>
				<p className={`${labelClass} text-center text-[#4a5368]`}>
					Trusted by leading organizations worldwide
				</p>
			</Reveal>

			{/* Rows wrap and the last one is centred. Each cell draws its side and top rules, overlapping its
			    neighbour's by a pixel; the wrapper's negative margins hide the outer edges of full rows. */}
			<Reveal className="mt-12 overflow-hidden sm:mt-16">
				<div className="-mx-px -mt-px flex flex-wrap justify-center">
					{partners.map((partner) => (
						<div
							key={partner.id}
							className="group -mr-px flex h-24 w-[calc(100%/3+1px)] items-center justify-center border-x border-t border-brand-navy/10 p-4 sm:h-36 sm:p-8 lg:w-[calc(20%+1px)]"
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
