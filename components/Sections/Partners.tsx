import React, { useMemo } from "react";
import Section from "./Section";
import { Partner } from "@/app/types/landing";
import { convertToApiUrl } from "@/lib/utils";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

interface PartnersProps {
	partners: Partner[];
}

const Partners = React.memo(function Partners({ partners }: PartnersProps) {
	// Memoize the partners array to prevent unnecessary re-renders
	const memoizedPartners = useMemo(() => partners, [partners]);

	return (
		<Section>
			<SectionHeading
				title="Our partners"
				description="Trusted by leading organizations worldwide"
			/>

			<Reveal className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
				<div
					className="inline-flex animate-marquee gap-4 hover:[animation-play-state:paused]"
					style={{ animationDuration: "30s" }}
				>
					{[...memoizedPartners, ...memoizedPartners].map((partner, index) => (
						<div
							key={index}
							className="group flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl bg-white/70 p-5 backdrop-blur-xl sm:h-28 sm:w-52 sm:p-7"
						>
							<img
								src={convertToApiUrl(partner.logo_url) || "/office/placeholder.jpg"}
								alt={partner.name}
								width={120}
								height={80}
								className="max-h-full max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
							/>
						</div>
					))}
				</div>
			</Reveal>
		</Section>
	);
});

export default Partners;
