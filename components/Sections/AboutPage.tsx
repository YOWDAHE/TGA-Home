"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import {
	ArrowLeftRight,
	ArrowRight,
	Briefcase,
	Check,
	Gavel,
	Gem,
	Globe,
	HardHat,
	Landmark,
	Lightbulb,
	Pickaxe,
	Receipt,
	Scale,
	ShieldCheck,
} from "lucide-react";
import Footer from "./Footer";
import PageHero from "./PageHero";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";

const images = Array.from(
	{ length: 11 },
	(_, i) =>
		`/aboutUs/IMG-20250727-WA00${(i + 1).toString().padStart(2, "0")}.jpg`
);

const office_images = Array.from(
	{ length: 15 },
	(_, i) => `/aboutUs/offices/office${(i + 1).toString()}.jpg`
);

const employees = [
	{ name: "Enas Mubarek Sherif", role: "Managing Partner", image: "/aboutUs/employees/enas.jpeg" },
	{ name: "Caleb Mesfin Seleshi", role: "Senior Associate", image: "/aboutUs/employees/caleb.jpeg" },
	{ name: "Mihret Wondimu", role: "Corporate Law Specialist", image: "/aboutUs/employees/mihiret.jpeg" },
	{ name: "Tinbite Ermias", role: "Tax Law Expert", image: "/aboutUs/employees/tinbite.jpeg" },
	// { name: "Yodahe Ketema", role: "Construction Law Attorney", image: "/aboutUs/employees/employee5.jpeg" },
	// { name: "Lisa Anderson", role: "IP & Compliance Lawyer", image: "/aboutUs/employees/employee6.jpeg" },
];

const stats = [
	{ value: "~20", label: "Years of practice" },
	{ value: "5", label: "Regions of Africa" },
	{ value: "7", label: "Practice areas" },
	{ value: "1st", label: "African firm on the BRILSA Council" },
];

const leadershipRoles = [
	{
		title: "Judge of the COMESA Court of Justice (CCJ)",
		description:
			"Appointed to serve as a Judge at the First Instance Division of the COMESA Court of Justice, the African continent's largest regional commercial court, exercising jurisdiction across 21 African nations.",
	},
	{
		title: "President of the Pan African Lawyers Union (PALU)",
		description:
			"Serving as the President of PALU, the premier continental forum for African Bar Associations, making history as its first-ever president from East Africa.",
	},
	{
		title: "Immediate Past President of the Ethiopian Federal Advocates Association (EFAA)",
		description: "Leading the first statutory bar in Ethiopia's legal history.",
	},
	{
		title: "Former Member of the Governing Council of the East Africa Law Society (EALS)",
		description:
			"Shaping cross-border legal frameworks, trade, and alignment across East Africa.",
	},
	{
		title: "Chairman of the CoST International Board",
		description:
			"Heading the premier structure in the construction sector, uniting key infrastructure Ministries, Agencies, and Authorities.",
	},
];

const landmarkLegislation = [
	"The Revised Ethiopian Commercial Code",
	"The Revised Tax Laws and Civil Society Organizations (CSO) Law",
	"Federal Courts Proclamations and ADR Rules",
	"The newly promulgated Immigration Law",
];

const alliances = [
	{
		icon: Globe,
		title: "Global Legal Giants",
		description:
			"We are the official partner for Africa of YINGKE Law Firm—recognized as the world's largest law firm—and a strategic partner of Tian Yuan Law Firm, one of China's leading law firms.",
	},
	{
		icon: Scale,
		title: "International Arbitration",
		description:
			"TGA Global stands as the only Ethiopian law firm appointed to serve as an international commercial arbitrator for both CIETAC (China International Economic and Trade Arbitration Commission) and SHIAC (Shanghai International Arbitration Center).",
	},
	{
		icon: Landmark,
		title: "Continental & Institutional Leadership",
		description:
			"We are honored to be the first African law firm appointed as a council member of the Belt and Road International Lawyers Association (BRILSA). Additionally, we manage high-level international legal matters for the African Union (AU) CISSA, and regularly represent clients before regional judicial mechanisms.",
	},
];

const practiceAreas = [
	{ icon: Briefcase, name: "Corporate & Commercial Law" },
	{ icon: Receipt, name: "Tax Law & Compliance" },
	{ icon: Pickaxe, name: "Energy, Mining & Natural Resources Law" },
	{ icon: HardHat, name: "Construction & Infrastructure Law" },
	{ icon: ArrowLeftRight, name: "Cross-Border Trade & Investment" },
	{ icon: Lightbulb, name: "Intellectual Property (IP)" },
	{ icon: Gavel, name: "Arbitration & Alternative Dispute Resolution (ADR)" },
];

/** Endless, slowly scrolling row of photos; pauses on hover. */
function PhotoMarquee({ photos, alt, reverse = false }: { photos: string[]; alt: string; reverse?: boolean }) {
	return (
		<Reveal className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
			<div
				className="inline-flex animate-marquee gap-4 hover:[animation-play-state:paused]"
				style={{ animationDuration: `${photos.length * 5}s`, animationDirection: reverse ? "reverse" : undefined }}
			>
				{[...photos, ...photos].map((src, idx) => (
					<div
						key={idx}
						aria-hidden={idx >= photos.length}
						className="relative h-56 w-72 shrink-0 overflow-hidden rounded-sm bg-brand-tint/50 sm:h-72 sm:w-[26rem]"
					>
						<Image
							src={src}
							alt={`${alt} ${(idx % photos.length) + 1}`}
							fill
							sizes="(min-width: 640px) 416px, 288px"
							className="object-cover transition-transform duration-700 hover:scale-105"
						/>
					</div>
				))}
			</div>
		</Reveal>
	);
}

export default function AboutPage() {
	const [hash, setHash] = useState("");

	useEffect(() => {
		setHash(window.location.hash);
		const handleHashScroll = () => {
			if (hash) {
				const id = hash.replace("#", "");
				const element = document.getElementById(id);
				if (element) {
					setTimeout(() => {
						element.scrollIntoView({
							behavior: "smooth",
							block: "start",
						});
					}, 100);
				}
			}
		};

		handleHashScroll();

		window.addEventListener("hashchange", handleHashScroll);

		return () => {
			window.removeEventListener("hashchange", handleHashScroll);
		};
	}, [hash]);

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
				<PageHero
					currentHref="/about-us"
					label="About TGA Global Law Firm LLP"
					title="Who We Are"
					description={
						<>
							TGA Global Law Firm LLP (formerly Tewodros Getachew Tulu and Associates) is a
							leading, full-service law firm headquartered in Ethiopia. Officially
							recognized as a leading law firm in the East African region, we provide
							elite legal services, strategic counsel, and innovative solutions to
							complex challenges across the continent and beyond.
						</>
					}
				>
					<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Link
							href="/#contact"
							className="group inline-flex items-center justify-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green"
						>
							Get Legal Consultation
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>
				</PageHero>

				{/* Intro: lead photo with the second paragraph and the firm's numbers beside it */}
				<section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
						className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-16"
					>
						<div className="relative h-[280px] overflow-hidden rounded-sm bg-brand-tint/50 sm:h-[440px] lg:col-span-7">
							<Image
								src={images[0]}
								alt="TGA Global Law Firm leadership"
								fill
								priority
								sizes="(min-width: 1024px) 640px, 100vw"
								className="object-cover"
							/>
						</div>
						<div className="flex flex-col justify-between gap-10 lg:col-span-5">
							<p className="text-pretty text-lg leading-relaxed text-brand-navy/75">
								For nearly two decades, we have served as the trusted advisor and partner
								to top-tier national and multinational corporations. From navigating
								sophisticated transactional matters to managing cross-border investment
								portfolios, we deliver the precision and foresight needed to thrive in
								today&apos;s interconnected global economy.
							</p>
							<dl className="grid grid-cols-2 border-b border-brand-navy/15">
								{stats.map((stat) => (
									<div key={stat.label} className="flex flex-col-reverse border-t border-brand-navy/15 py-5 pr-4">
										<dt className="mt-1 text-sm leading-snug text-brand-navy/60">{stat.label}</dt>
										<dd className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">{stat.value}</dd>
									</div>
								))}
							</dl>
						</div>
					</motion.div>
				</section>

				{/* Gallery */}
				<section className="pb-8" aria-label="Gallery">
					<PhotoMarquee photos={images.slice(1)} alt="About Us" />
				</section>

				{/* Continental Leadership & Influence: hairline rows, title left and detail right */}
				<Section>
					<SectionHeading
						label="Leadership"
						title="Continental Leadership & Influence"
						description={
							<>
								Our firm&apos;s influence is anchored by the distinguished leadership of
								our Managing Partner,{" "}
								<span className="font-medium text-brand-navy">
									Hon. Justice Tewodros Getachew Tulu
								</span>{" "}
								and our firm partner{" "}
								<span className="font-medium text-brand-navy">Blain WORKU</span>, who is
								the former senior advisor to the President of the Federal Democratic
								Republic of Ethiopia. The firm&apos;s leadership holds pioneering roles at
								the highest levels of the African legal and regulatory framework.
							</>
						}
						className="sm:max-w-3xl"
					/>
					<div className="mt-12 border-b border-brand-navy/15 lg:mt-16">
						{leadershipRoles.map((role, index) => (
							<Reveal key={role.title} delay={Math.min(index, 3) * 0.05}>
								<div className="grid gap-x-8 gap-y-3 border-t border-brand-navy/15 py-8 lg:grid-cols-12 lg:py-10">
									<h3 className="text-xl font-semibold leading-snug tracking-tight text-brand-navy sm:text-2xl lg:col-span-5 lg:col-start-2">
										{role.title}
									</h3>
									<p className="leading-relaxed text-brand-navy/75 lg:col-span-5 lg:pt-1">{role.description}</p>
								</div>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Shaping the Legal Landscape */}
				<Section tone="muted">
					<div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
						<div>
							<SectionHeading
								align="left"
								label="Legislation"
								title="Shaping the Legal Landscape"
								description="TGA Global is more than a legal representative; we are active drivers of legislative evolution. Powered by a vibrant network of elite lawyers both in Ethiopia and abroad, our team plays a definitive role in national and continental legal reforms."
							/>
							<Reveal delay={0.1}>
								<p className="mx-auto mt-4 max-w-[19rem] text-pretty text-center text-base leading-relaxed text-brand-navy/75 min-[400px]:max-w-[21rem] sm:mx-0 sm:max-w-none sm:text-left sm:text-lg">
									Our lawyers have been deeply involved in drafting, revising, and
									promulgating landmark legislation that defines modern business in the
									region, including:
								</p>
							</Reveal>
						</div>
						<ul className="border-b border-brand-navy/15">
							{landmarkLegislation.map((law, index) => (
								<Reveal key={law} delay={index * 0.06}>
									<li className="flex items-center gap-4 border-t border-brand-navy/15 py-5">
										<Check className="h-4 w-4 shrink-0 text-brand-green" />
										<span className="text-lg font-medium tracking-tight text-brand-navy">{law}</span>
									</li>
								</Reveal>
							))}
						</ul>
					</div>
				</Section>

				{/* Global Footprint & Alliances: a solid navy band */}
				<Section tone="navy">
					<div>
						<SectionHeading
							inverted
							label="Global reach"
							title="A Distinctive Global Footprint & Elite Alliances"
							description="We maintain a powerful, active presence across all five regions of Africa, uniquely bridging the gap between local jurisdictions and international commerce. Our global reach is reinforced by unparalleled milestones and strategic partnerships:"
							className="sm:max-w-3xl"
						/>
						<div className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
							{alliances.map(({ icon: Icon, title, description }, index) => (
								<Reveal
									key={title}
									delay={index * 0.08}
									className="relative overflow-hidden rounded-sm bg-white/[0.06] p-6 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.1] sm:p-8"
								>
									<span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-brand-green" />
									<Icon className="h-6 w-6 text-brand-tint" strokeWidth={1.5} />
									<h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{title}</h3>
									<p className="mt-3 leading-relaxed text-white/65">{description}</p>
								</Reveal>
							))}
						</div>
					</div>
				</Section>

				{/* Practice Areas: a hairline grid, like the partner logos on the home page */}
				<Section>
					<SectionHeading
						label="Practice areas"
						title="Our Practice Areas"
						description="We offer comprehensive legal counsel across a diversified spectrum of practice areas, ensuring our clients are protected at every stage of their operations:"
						className="sm:max-w-3xl"
					/>
					{/* Each cell draws its left and top rule; the negative margin hides the outer edges */}
					<Reveal className="mt-12 overflow-hidden lg:mt-16">
						<div className="-ml-px -mt-px grid sm:grid-cols-2 lg:grid-cols-4">
							{practiceAreas.map(({ icon: Icon, name }) => (
								<div
									key={name}
									className="group flex items-center gap-4 border-l border-t border-brand-navy/10 p-6 sm:block sm:min-h-[11rem] sm:p-8"
								>
									<Icon
										className="h-6 w-6 shrink-0 text-brand-green transition-transform duration-300 group-hover:-translate-y-0.5"
										strokeWidth={1.5}
									/>
									<p className="font-medium leading-snug text-brand-navy sm:mt-6 sm:text-lg">{name}</p>
								</div>
							))}
						</div>
					</Reveal>
				</Section>

				{/* Commitment & What Sets Us Apart: two columns under a hairline */}
				<Section tone="muted">
					<div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
						<Reveal className="border-t border-brand-navy/15 pt-8">
							<ShieldCheck className="h-6 w-6 text-brand-green" strokeWidth={1.5} />
							<h3 className="mt-6 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">Our Commitment</h3>
							<p className="mt-4 leading-relaxed text-brand-navy/75">
								At TGA Global, we blend deep local insight with a sophisticated global
								perspective to protect your interests with absolute integrity, excellence,
								and premium legal service. Our expertise spans structuring complex
								corporate boards, drafting airtight international agreements, and closing
								high-value deals. We also provide elite litigation and reputable
								international arbitration services to successfully resolve complex,
								cross-border investment and trade disputes.
							</p>
						</Reveal>
						<Reveal delay={0.1} className="border-t border-brand-navy/15 pt-8">
							<Gem className="h-6 w-6 text-brand-green" strokeWidth={1.5} />
							<h3 className="mt-6 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">What Sets Us Apart</h3>
							<p className="mt-4 leading-relaxed text-brand-navy/75">
								Our firm is built on two foundational pillars:{" "}
								<span className="font-medium text-brand-green">uncompromising integrity</span>{" "}
								and{" "}
								<span className="font-medium text-brand-green">bespoke, premium quality</span>.
								We maintain the highest ethical standards, serving as a trusted partner to
								multinational corporations, governments, and international bodies through
								absolute transparency and strict confidentiality. Rejecting
								one-size-fits-all legal advice, we deliver tailor-made strategies and
								creative solutions executed with world-class operational excellence.
							</p>
						</Reveal>
					</div>
				</Section>

				{/* Employees seciton */}
				{/* <div className="mt-16 flex flex-col items-center">
					<div className="text-center mb-16">
						<h2 className="text-2xl md:text-4xl font-bold mb-4">OUR EMPLOYEES</h2>
						<div className="w-24 h-1 bg-black/50 mx-auto rounded-sm"></div>
					</div>

					<div className="max-w-4xl text-center mb-16">
						Our team consists of highly qualified legal professionals with diverse
						expertise and extensive experience. Meet the talented individuals who
						make TGA Global Law Firm LL.P a leader in legal services.
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl">
						{employees.map((employee, index) => (
							<div
								key={index}
								className="bg-white rounded-sm overflow-hidden transition-all duration-300"
							>
								<div className="relative h-64 w-auto bg-blue-200">
									<Image
										src={employee.image}
										alt={employee.name}
										fill={true}
										className="object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src = "/aboutUs/employees/placeholder.jpg";
										}}
									/>
								</div>
								<div className="p-6 text-center">
									<h3 className="text-brand-navy mb-2">
										{employee.name}
									</h3>
								</div>
							</div>
						))}
					</div>
				</div> */}

				{/* Offices */}
				<section className="relative isolate scroll-mt-20 py-16 sm:py-24">
					<div className="px-4 sm:px-6">
						<SectionHeading
							label="Offices"
							title="Our Offices"
							description="With strategically located offices, we are positioned to serve clients efficiently and effectively. Each location is equipped to deliver the highest standard of legal service, ensuring consistency, confidentiality, and professionalism. Explore our offices to see where we can best support your legal needs."
							className="sm:max-w-3xl"
						/>
					</div>
					<PhotoMarquee photos={office_images} alt="Office" reverse />
				</section>

				{/* Disclosures */}
				<section className="relative isolate scroll-mt-20 px-4 pb-16 sm:px-6" id="disclosure">
					<Reveal className="mx-auto max-w-4xl border-t border-brand-navy/15 pt-10 text-center text-sm leading-relaxed text-brand-navy/60">
						<h2 className="text-lg font-semibold tracking-tight text-brand-navy">
							Global Reach & Legal Disclosures
						</h2>
						<p className="mb-3 mt-4">
							© {new Date().getFullYear()} TGA Global Law Firm LL.P. All rights reserved.{" "}
							<strong className="font-medium text-brand-navy">Attorney Advertising.</strong>
						</p>
						<p>
							TGA Global Law Firm LL.P is a global law firm operating through various
							separate and distinct legal entities. Through its affiliates and partner
							companies, TGA Global is an international legal practice offering
							full-fledged client services. With a wealth of diverse experience and
							outstanding expertise, TGA Global Law Firm LL.P is a prominent Ethiopian
							law practice that offers top-notch legal services throughout Ethiopia and
							Africa.
						</p>
					</Reveal>
				</section>

				<Footer />
			</div>
		</MotionConfig>
	);
}
