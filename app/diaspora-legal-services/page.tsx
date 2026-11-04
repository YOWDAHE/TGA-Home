import { Metadata } from 'next';
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import { homeFont } from "@/app/fonts";
import PageHero from "@/components/Sections/PageHero";
import Section from "@/components/Sections/Section";
import SectionHeading from "@/components/Sections/SectionHeading";
import Reveal from "@/components/Sections/Reveal";
import Footer from "@/components/Sections/Footer";

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Legal Services for Diaspora Ethiopians',
    description:
      'Legal help for the Ethiopian diaspora: property management, investment advice and cross-border legal services from TGA Global Law Firm.',
    path: '/diaspora-legal-services',
    card: { eyebrow: 'Practice area', title: 'Legal services for diaspora Ethiopians' },
  }),
  keywords: [
    'Legal Services for Diaspora Ethiopians',
    'Ethiopian Diaspora Legal Help',
    'Diaspora Property Lawyers Ethiopia',
    'Ethiopian Diaspora Legal Services',
    'Cross-Border Legal Services Ethiopia',
    'Diaspora Legal Help Ethiopia',
  ],
};

const services = [
	{
		title: "Diaspora Property Lawyers Ethiopia",
		description: "Expert property legal services for Ethiopian diaspora including property purchase, sale, management, and investment in Ethiopia."
	},
	{
		title: "Cross-Border Legal Services Ethiopia",
		description: "International legal services for diaspora including business setup, investment advisory, and cross-border transactions."
	},
	{
		title: "Ethiopian Diaspora Legal Help",
		description: "Remote legal consultations, document preparation, and representation services for Ethiopian diaspora worldwide."
	},
	{
		title: "Investment Advisory",
		description: "Legal guidance for diaspora investments in Ethiopia including real estate, business ventures, and financial investments."
	},
	{
		title: "Business Setup Services",
		description: "Complete legal support for diaspora business setup in Ethiopia including registration, licensing, and compliance."
	},
	{
		title: "Inheritance & Succession",
		description: "Legal services for inheritance, property succession, and estate planning for Ethiopian diaspora families."
	}
];

const serviceLists = [
	{
		title: "Property Management for Diaspora",
		items: [
			"Remote property management services",
			"Property maintenance and repairs",
			"Rental property legal support",
			"Property tax and compliance",
			"Property insurance and protection"
		]
	},
	{
		title: "Investment Legal Support",
		items: [
			"Investment legal advisory",
			"Due diligence services",
			"Contract review and negotiation",
			"Regulatory compliance",
			"Risk assessment and mitigation"
		]
	},
	{
		title: "Remote Legal Services",
		items: [
			"Video consultations",
			"Document preparation",
			"Legal opinion services",
			"Power of attorney",
			"Legal representation"
		]
	},
	{
		title: "Family Legal Services",
		items: [
			"Family law matters",
			"Inheritance planning",
			"Property succession",
			"Guardianship services",
			"Family business legal support"
		]
	}
];

const reasons = [
	{
		title: "#1 Law Firm in Ethiopia",
		description: "Recognized as the leading law firm in Ethiopia with extensive experience serving Ethiopian diaspora worldwide."
	},
	{
		title: "International Legal Network",
		description: "Global legal network with presence in 52 jurisdictions, providing seamless cross-border legal services."
	},
	{
		title: "Diaspora Property Lawyers Ethiopia",
		description: "Specialized property legal services for Ethiopian diaspora with deep understanding of local property laws."
	},
	{
		title: "Cross-Border Legal Services Ethiopia",
		description: "Expert cross-border legal services including business setup, investment advisory, and international transactions."
	}
];

const testimonials = [
	{
		quote: "TGA Global Law Firm LL.P provided excellent legal services for my property investment in Ethiopia. Their diaspora legal help was invaluable.",
		author: "Ethiopian Diaspora Client"
	},
	{
		quote: "The cross-border legal services were seamless. They handled everything remotely and kept me informed throughout the process.",
		author: "International Client"
	}
];

export default function DiasporaLegalServices() {
	return (
		<div className={homeFont.className}>
			<div className="min-h-screen bg-white text-brand-navy antialiased">
				<PageHero
					currentHref="/"
					label="Practice area"
					title="Legal Services for Diaspora Ethiopians"
					description="Comprehensive legal services for Ethiopian diaspora worldwide. Property management, investment advisory, and cross-border legal support."
				>
					<h2 className="text-sm font-medium text-brand-green sm:text-base">
						Ethiopian Diaspora Legal Help - #1 Law Firm in Ethiopia
					</h2>
				</PageHero>

				{/* Services */}
				<Section id="services">
					<SectionHeading title="Ethiopian Diaspora Legal Services" />
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
					<SectionHeading title="Specialized Diaspora Legal Services" />
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
					<SectionHeading title="Why Choose TGA Global Law Firm LL.P for Diaspora Legal Services?" />
					<div className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-8 text-left md:grid-cols-2 lg:mt-16">
						{reasons.map((reason, index) => (
							<Reveal key={reason.title} delay={(index % 2) * 0.06} className="border-t border-brand-navy/15 pt-5">
								<h3 className="text-lg font-semibold tracking-tight text-brand-navy">{reason.title}</h3>
								<p className="mt-2 leading-relaxed text-brand-navy/75">{reason.description}</p>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Testimonials */}
				<Section tone="muted">
					<SectionHeading title="What Ethiopian Diaspora Say About Our Services" />
					<div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2 lg:mt-16">
						{testimonials.map((testimonial, index) => (
							<Reveal key={testimonial.author} delay={index * 0.06} className="h-full">
								<figure className="flex h-full flex-col rounded-sm bg-white p-6 ring-1 ring-brand-navy/10">
									<Quote className="h-5 w-5 text-brand-green" />
									<blockquote className="mt-4 flex-1 leading-relaxed text-brand-navy/75">
										&ldquo;{testimonial.quote}&rdquo;
									</blockquote>
									<figcaption className="mt-4 text-sm font-medium text-brand-navy">- {testimonial.author}</figcaption>
								</figure>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Call to action */}
				<Section tone="navy">
					<SectionHeading
						inverted
						title="Need Legal Services for Diaspora Ethiopians?"
						description="Contact TGA Global Law Firm LL.P for comprehensive Ethiopian diaspora legal help"
						action={
							<Link
								href="/#contact"
								className="group inline-flex items-center gap-2 rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-tint"
							>
								Contact Our Diaspora Legal Team
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
