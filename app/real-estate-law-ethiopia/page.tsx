import { Metadata } from 'next';
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { homeFont } from "@/app/fonts";
import PageHero from "@/components/Sections/PageHero";
import Section from "@/components/Sections/Section";
import SectionHeading from "@/components/Sections/SectionHeading";
import Reveal from "@/components/Sections/Reveal";
import Footer from "@/components/Sections/Footer";

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Real Estate Lawyers Ethiopia | Real Estate Law',
    description:
      'Real estate lawyers in Ethiopia for property transactions, land disputes and real estate legal advice, including for the diaspora.',
    path: '/real-estate-law-ethiopia',
    card: { eyebrow: 'Practice area', title: 'Real estate lawyers in Ethiopia' },
  }),
  keywords: [
    'Real Estate Lawyers Ethiopia',
    'Real Estate Law Ethiopia',
    'Real Estate Lawyers Ethiopia Diaspora',
    'Property Law Ethiopia',
    'Land Law Ethiopia',
    'Real Estate Legal Services Ethiopia',
  ],
};

const services = [
	{
		title: "Property Transactions",
		description: "Complete legal support for property purchases, sales, transfers, and real estate transactions in Ethiopia."
	},
	{
		title: "Land Law Ethiopia",
		description: "Expert land law services including land registration, title verification, and land use regulations."
	},
	{
		title: "Real Estate Lawyers Ethiopia Diaspora",
		description: "Specialized legal services for Ethiopian diaspora including property management and investment in Ethiopia."
	},
	{
		title: "Property Disputes",
		description: "Resolution of property disputes, boundary conflicts, and real estate litigation in Ethiopian courts."
	},
	{
		title: "Real Estate Development",
		description: "Legal advisory for real estate development projects, zoning compliance, and construction law in Ethiopia."
	},
	{
		title: "Property Investment",
		description: "Legal guidance for property investment, rental agreements, and real estate portfolio management in Ethiopia."
	}
];

const serviceLists = [
	{
		title: "Diaspora Property Lawyers Ethiopia",
		items: [
			"Property purchase and sale for diaspora",
			"Property management and maintenance",
			"Rental property legal services",
			"Inheritance and property succession",
			"Cross-border property transactions"
		]
	},
	{
		title: "Ethiopian Diaspora Legal Help",
		items: [
			"Remote legal consultations",
			"Document preparation and review",
			"Power of attorney services",
			"Property investment advisory",
			"Legal representation in Ethiopia"
		]
	}
];

const reasons = [
	{
		title: "#1 Law Firm in Ethiopia",
		description: "Recognized as the leading law firm in Ethiopia with extensive experience in real estate and property law."
	},
	{
		title: "Real Estate Law Ethiopia Experts",
		description: "Deep understanding of Ethiopian real estate laws, regulations, and local property market dynamics."
	},
	{
		title: "Real Estate Lawyers Ethiopia Diaspora",
		description: "Specialized services for Ethiopian diaspora with remote consultation and local representation capabilities."
	},
	{
		title: "International Legal Network",
		description: "Global legal network with presence in 52 jurisdictions, providing cross-border real estate legal services."
	}
];

export default function RealEstateLawEthiopia() {
	return (
		<div className={homeFont.className}>
			<div className="min-h-screen bg-white text-brand-navy antialiased">
				<PageHero
					currentHref="/"
					label="Practice area"
					title="Real Estate Lawyers Ethiopia"
					description="Expert real estate legal services in Ethiopia. Property transactions, land disputes, and real estate law expertise for local and diaspora clients."
				>
					<h2 className="text-sm font-medium text-brand-green sm:text-base">
						Real Estate Law Ethiopia - #1 Law Firm in Ethiopia
					</h2>
				</PageHero>

				{/* Services */}
				<Section id="services">
					<SectionHeading title="Real Estate Law Services Ethiopia" />
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

				{/* Specialized services */}
				<Section tone="muted">
					<SectionHeading title="Real Estate Lawyers Ethiopia Diaspora Services" />
					<div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2 lg:mt-16">
						{serviceLists.map((list, index) => (
							<Reveal key={list.title} delay={(index % 2) * 0.06} className="h-full">
								<div className="h-full rounded-sm bg-white p-6 ring-1 ring-brand-navy/10">
									<h3 className="text-lg font-semibold tracking-tight text-brand-navy">{list.title}</h3>
									<ul className="mt-4 space-y-2.5">
										{list.items.map((item) => (
											<li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-brand-navy/75">
												<Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
												{item}
											</li>
										))}
									</ul>
								</div>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Why choose us */}
				<Section>
					<SectionHeading title="Why Choose TGA Global Law Firm LL.P for Real Estate Law Ethiopia?" />
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
						title="Need Expert Real Estate Lawyers Ethiopia?"
						description="Contact TGA Global Law Firm LL.P for comprehensive real estate legal services in Ethiopia"
						action={
							<Link
								href="/#contact"
								className="group inline-flex items-center gap-2 rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-tint"
							>
								Contact Our Real Estate Lawyers
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
