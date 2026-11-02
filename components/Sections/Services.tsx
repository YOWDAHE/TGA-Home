import React from "react";
import Section from "./Section";
import {
	Briefcase,
	ClipboardList,
	Handshake,
	Scale,
	ShieldCheck,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const services = [
	{
		title: "Representation",
		content:
			"We have the best litigation lawyers in the Ethiopian Legal Landscape in minefield areas of the law including taxation, Contracts, Investment disputes, Construction Issues and Criminal Law.",
		icon: Scale,
	},
	{
		title: "Retention and Ongoing Legal Support",
		content:
			"We have been successful in being able to retain huge national and multi-national corporations as retentions clients by offering a quality ongoing legal support, including International organizations as we combine Seasoned lawyers in various fields of Law.",
		icon: ShieldCheck,
	},
	{
		title: "Consulting and Advisory",
		content:
			"As a trusted advisor and considerable role in transactional matters, we have been helping corporations and business individuals navigate various aspects business transactions including Merger and Acquisitions, Due diligence, Contract Negotiation and Drafting, and Compliance.",
		icon: Briefcase,
	},
	{
		title: "Contract Management and Arbitration",
		content:
			"As a trusted advisor our office has been consulting and representing plentiful number of corporations and business entities in their contractual matters with 3rd Parties with a view to enable them have a robust contract management scheme.",
		icon: ClipboardList,
	},
	{
		title: "ADR and Arbitration",
		content:
			"The Law Firm through its Managing Partner and Senior Associates frequently represents in International Commercial Arbitration under the auspices of various regional and ad hoc centers. We also offer a full scheme ADR mechanisms.",
		icon: Handshake,
	},
];

export default function Services() {
	return (
		<Section id="services">
			<SectionHeading
				title="Our services"
				description="From the courtroom to the boardroom, we support clients at every stage."
			/>

			<div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{services.map((service, index) => (
					<Reveal
						key={service.title}
						delay={(index % 3) * 0.08}
						className={index === 0 ? "lg:col-span-2" : ""}
					>
						<article className="group flex h-full flex-col rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl p-6 transition-colors duration-300 hover:bg-brand-tint sm:p-8">
							<span className="mb-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-green shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
								<service.icon className="h-5 w-5" strokeWidth={1.75} />
							</span>
							<h3 className="text-xl font-semibold tracking-tight text-brand-navy">
								{service.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-[#606b80] sm:text-base">
								{service.content}
							</p>
						</article>
					</Reveal>
				))}
			</div>
		</Section>
	);
}
