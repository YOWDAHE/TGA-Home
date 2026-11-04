import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { homeFont } from "@/app/fonts";
import PageHero from "@/components/Sections/PageHero";
import Section from "@/components/Sections/Section";
import SectionHeading from "@/components/Sections/SectionHeading";
import Reveal from "@/components/Sections/Reveal";
import Footer from "@/components/Sections/Footer";

export const metadata: Metadata = {
	...pageMetadata({
		title: "Corporate Lawyers Ethiopia | Business Law Firm Addis Ababa",
		description:
			"Leading corporate lawyers in Ethiopia. Business law firm in Addis Ababa for corporate law, business registration and commercial legal services.",
		path: "/corporate-law-ethiopia",
		card: { eyebrow: "Practice area", title: "Corporate lawyers in Ethiopia" },
	}),
	keywords: [
		"Corporate Lawyers Ethiopia",
		"Business Law Firm Addis Ababa",
		"Corporate Law Ethiopia",
		"Business Registration Ethiopia",
		"Commercial Lawyers Ethiopia",
		"Commercial Law Ethiopia",
	],
};

const services = [
	{
		title: "Business Registration Ethiopia",
		description: "Complete business registration services including company formation, licensing, and regulatory compliance for Ethiopian businesses."
	},
	{
		title: "Commercial Law Ethiopia",
		description: "Expert commercial law services covering contracts, transactions, mergers & acquisitions, and corporate governance."
	},
	{
		title: "Corporate Governance",
		description: "Comprehensive corporate governance advisory, board structuring, and compliance management for Ethiopian corporations."
	},
	{
		title: "Mergers & Acquisitions",
		description: "Strategic M&A services, due diligence, and transaction structuring for Ethiopian and international businesses."
	},
	{
		title: "International Business Law",
		description: "Cross-border legal services, international trade law, and foreign investment advisory for global businesses in Ethiopia."
	},
	{
		title: "Regulatory Compliance",
		description: "Ethiopian regulatory compliance, licensing, and ongoing legal support for corporate entities."
	}
];

const reasons = [
	{
		title: "#1 Law Firm in Ethiopia",
		description: "Recognized as the leading law firm in Ethiopia with unmatched expertise in corporate and commercial law."
	},
	{
		title: "International Law Firm Ethiopia",
		description: "Global legal network with presence in 52 jurisdictions, providing international business law expertise."
	},
	{
		title: "Top African Lawyers",
		description: "Led by Tewodros Getachew Tulu, President of PALU, representing the highest standards in African legal practice."
	},
	{
		title: "Business Law Firm Addis Ababa",
		description: "Strategic location in Addis Ababa with deep understanding of Ethiopian business environment and regulations."
	}
];

export default function CorporateLawEthiopia() {
	return (
		<div className={homeFont.className}>
			<div className="min-h-screen bg-white text-brand-navy antialiased">
				<PageHero
					currentHref="/"
					label="Practice area"
					title="Corporate Lawyers Ethiopia"
					description="Leading corporate legal services in Ethiopia. Expert business registration, commercial law, and corporate governance for local and international businesses."
				>
					<h2 className="text-sm font-medium text-brand-green sm:text-base">
						Business Law Firm Addis Ababa - #1 Law Firm in Ethiopia
					</h2>
				</PageHero>

				{/* Services */}
				<Section id="services">
					<SectionHeading title="Corporate Law Services Ethiopia" />
					<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
						{services.map((service, index) => (
							<Reveal key={service.title} delay={(index % 3) * 0.06} className="h-full">
								<div className="h-full rounded-sm bg-white p-6 ring-1 ring-brand-navy/10 transition-transform duration-300 hover:-translate-y-1 hover:ring-brand-navy/25">
									<h3 className="text-lg font-semibold leading-snug tracking-tight text-brand-navy sm:text-xl">
										{service.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{service.description}</p>
								</div>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Why choose us */}
				<Section tone="muted">
					<SectionHeading title="Why Choose TGA Global Law Firm LL.P for Corporate Law Ethiopia?" />
					<div className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-8 text-left md:grid-cols-2 lg:mt-16">
						{reasons.map((reason, index) => (
							<Reveal key={reason.title} delay={(index % 2) * 0.06} className="border-t border-brand-navy/15 pt-5">
								<h3 className="text-lg font-semibold tracking-tight text-brand-navy">{reason.title}</h3>
								<p className="mt-2 leading-relaxed text-brand-navy/75">{reason.description}</p>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Call to action */}
				<Section tone="navy">
					<SectionHeading
						inverted
						title="Ready to Work with Leading Corporate Lawyers Ethiopia?"
						description="Contact TGA Global Law Firm LL.P for expert corporate legal services in Ethiopia"
						action={
							<Link
								href="/#contact"
								className="group inline-flex items-center gap-2 rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-tint"
							>
								Contact Our Corporate Lawyers
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
						}
					/>
				</Section>

				<Footer />
			</div>
		</div>
	);
}
