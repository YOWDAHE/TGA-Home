import React from "react";
import { Stat } from "@/app/types/landing";
import SectionHeading from "./SectionHeading";
import Section from "./Section";
import Reveal from "./Reveal";

interface StatisticsProps {
	stats: Stat[];
}

export default function Statistics({ stats }: StatisticsProps) {
	return (
		<Section pattern>
			<SectionHeading
				title="Our track record"
				description="Numbers that reflect nearly two decades of trusted counsel."
			/>
			<dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:flex">
				{stats.map((stat, index) => (
					<Reveal
						key={stat.id}
						delay={index * 0.08}
						className="flex flex-col-reverse rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5 sm:p-8 lg:flex-1"
					>
						<dt className="mt-2 text-sm text-[#606b80] sm:text-base">{stat.description}</dt>
						<dd className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-5xl">
							{stat.stat}
						</dd>
					</Reveal>
				))}
			</dl>
		</Section>
	);
}
