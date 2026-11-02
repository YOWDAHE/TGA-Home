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
import TopNav from "./TopNav";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";
import { DotPattern, FrostedColors } from "./Backdrop";

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

const cardClass = "rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl";

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
						className="relative h-56 w-72 shrink-0 overflow-hidden rounded-3xl bg-[#eef1f5] sm:h-72 sm:w-[26rem]"
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
				<FrostedColors />
				<TopNav currentHref="/about-us" />

				{/* Intro */}
				<section className="relative px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
					<div className="mx-auto max-w-4xl text-center">
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
							className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-[#4b5468] shadow-sm ring-1 ring-black/5 sm:px-4"
						>
							<span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
							About TGA Global Law Firm LLP
						</motion.p>
						<motion.h1
							initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
							className="text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-tight sm:text-7xl"
						>
							Who We Are
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
							className="mx-auto mt-6 max-w-[21rem] text-pretty text-base leading-relaxed text-[#606b80] sm:max-w-2xl sm:text-lg"
						>
							TGA Global Law Firm LLP (formerly Tewodros Getachew Tulu and Associates) is a
							leading, full-service law firm headquartered in Ethiopia. Officially
							recognized as a leading law firm in the East African region, we provide
							elite legal services, strategic counsel, and innovative solutions to
							complex challenges across the continent and beyond.
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.45 }}
							className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
						>
							<Link
								href="/#contact"
								className="group inline-flex min-w-[15rem] items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(11,27,77,0.45)] transition-colors hover:bg-brand-green sm:min-w-0 sm:px-7"
							>
								Get Legal Consultation
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</motion.div>
					</div>

					{/* Lead photo with the second intro paragraph beside it */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: easeOut, delay: 0.5 }}
						className="mx-auto mt-16 grid max-w-6xl gap-4 lg:grid-cols-5"
					>
						<div className="relative h-[280px] overflow-hidden rounded-3xl shadow-[0_30px_80px_-40px_rgba(11,27,77,0.5)] sm:h-[440px] lg:col-span-3">
							<Image
								src={images[0]}
								alt="TGA Global Law Firm leadership"
								fill
								priority
								sizes="(min-width: 1024px) 690px, 100vw"
								className="object-cover"
							/>
						</div>
						<div className={`${cardClass} flex flex-col justify-between p-6 sm:p-8 lg:col-span-2`}>
							<p className="text-pretty leading-relaxed text-[#4b5468]">
								For nearly two decades, we have served as the trusted advisor and partner
								to top-tier national and multinational corporations. From navigating
								sophisticated transactional matters to managing cross-border investment
								portfolios, we deliver the precision and foresight needed to thrive in
								today&apos;s interconnected global economy.
							</p>
							<div className="mt-8 grid grid-cols-2 gap-3">
								{stats.map((stat) => (
									<div key={stat.label} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
										<p className="text-3xl font-semibold tracking-tight text-brand-navy">{stat.value}</p>
										<p className="mt-1 text-xs leading-snug text-[#606b80]">{stat.label}</p>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</section>

				{/* Gallery */}
				<section className="pb-8" aria-label="Gallery">
					<PhotoMarquee photos={images.slice(1)} alt="About Us" />
				</section>

				{/* Continental Leadership & Influence */}
				<Section>
					<SectionHeading
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
					<div className="mt-14 grid gap-4 md:grid-cols-2">
						{leadershipRoles.map((role, index) => (
							<Reveal
								key={role.title}
								delay={index * 0.06}
								className={`${cardClass} group p-6 transition-shadow hover:shadow-md sm:p-8 ${
									index === 0 ? "md:col-span-2" : ""
								}`}
							>
								<span className="text-sm font-medium tabular-nums text-brand-green">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="mt-3 text-xl font-semibold tracking-tight text-brand-navy">{role.title}</h3>
								<p className="mt-2 leading-relaxed text-[#606b80]">{role.description}</p>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Shaping the Legal Landscape */}
				<Section pattern>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						<div>
							<SectionHeading
								align="left"
								title="Shaping the Legal Landscape"
								description="TGA Global is more than a legal representative; we are active drivers of legislative evolution. Powered by a vibrant network of elite lawyers both in Ethiopia and abroad, our team plays a definitive role in national and continental legal reforms."
							/>
							<Reveal delay={0.1}>
								<p className="mx-auto mt-4 max-w-[19rem] text-pretty text-center text-base leading-relaxed text-[#606b80] min-[400px]:max-w-[21rem] sm:mx-0 sm:max-w-none sm:text-left sm:text-lg">
									Our lawyers have been deeply involved in drafting, revising, and
									promulgating landmark legislation that defines modern business in the
									region, including:
								</p>
							</Reveal>
						</div>
						<ul className="space-y-3">
							{landmarkLegislation.map((law, index) => (
								<Reveal key={law} delay={index * 0.08}>
									<li className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
										<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-green">
											<Check className="h-4 w-4" />
										</span>
										<span className="font-medium text-brand-navy">{law}</span>
									</li>
								</Reveal>
							))}
						</ul>
					</div>
				</Section>

				{/* Global Footprint & Alliances */}
				<section className="px-3 py-8 sm:px-6 sm:py-12">
					<Reveal className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-brand-navy px-5 py-16 text-white sm:rounded-[36px] sm:px-10 sm:py-24">
						<div aria-hidden className="absolute -left-24 -top-32 -z-10 h-80 w-80 rounded-full bg-brand-green/35 blur-3xl" />
						<div aria-hidden className="absolute -bottom-40 -right-20 -z-10 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl" />
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="mx-auto max-w-[16rem] text-balance text-3xl font-semibold tracking-tight min-[400px]:max-w-[18rem] sm:max-w-none sm:text-5xl">
								A Distinctive Global Footprint & Elite Alliances
							</h2>
							<p className="mx-auto mt-4 max-w-[19rem] text-pretty text-base leading-relaxed text-white/70 min-[400px]:max-w-[21rem] sm:max-w-none sm:text-lg">
								We maintain a powerful, active presence across all five regions of Africa,
								uniquely bridging the gap between local jurisdictions and international
								commerce. Our global reach is reinforced by unparalleled milestones and
								strategic partnerships:
							</p>
						</div>
						<div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
							{alliances.map(({ icon: Icon, title, description }, index) => (
								<Reveal
									key={title}
									delay={0.1 + index * 0.08}
									className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.09] sm:p-8"
								>
									<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-tint">
										<Icon className="h-6 w-6" strokeWidth={1.75} />
									</span>
									<h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
									<p className="mt-3 leading-relaxed text-white/65">{description}</p>
								</Reveal>
							))}
						</div>
					</Reveal>
				</section>

				{/* Practice Areas */}
				<Section>
					<SectionHeading
						title="Our Practice Areas"
						description="We offer comprehensive legal counsel across a diversified spectrum of practice areas, ensuring our clients are protected at every stage of their operations:"
						className="sm:max-w-3xl"
					/>
					<div className="mt-14 flex flex-wrap justify-center gap-4">
						{practiceAreas.map(({ icon: Icon, name }, index) => (
							<Reveal
								key={name}
								delay={index * 0.05}
								className={`${cardClass} group flex w-full items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md sm:block sm:w-[calc(50%-0.5rem)] sm:p-6 lg:w-[calc(25%-0.75rem)]`}
							>
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand-green transition-colors duration-300 group-hover:bg-brand-green group-hover:text-white sm:mb-5">
									<Icon className="h-5 w-5" strokeWidth={1.75} />
								</span>
								<p className="font-medium leading-snug text-brand-navy">{name}</p>
							</Reveal>
						))}
					</div>
				</Section>

				{/* Commitment & What Sets Us Apart */}
				<Section pattern>
					<div className="grid gap-4 md:grid-cols-2">
						<Reveal className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-10">
							<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy text-white">
								<ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
							</span>
							<h3 className="mt-6 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">Our Commitment</h3>
							<p className="mt-4 leading-relaxed text-[#606b80]">
								At TGA Global, we blend deep local insight with a sophisticated global
								perspective to protect your interests with absolute integrity, excellence,
								and premium legal service. Our expertise spans structuring complex
								corporate boards, drafting airtight international agreements, and closing
								high-value deals. We also provide elite litigation and reputable
								international arbitration services to successfully resolve complex,
								cross-border investment and trade disputes.
							</p>
						</Reveal>
						<Reveal delay={0.1} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-10">
							<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white">
								<Gem className="h-6 w-6" strokeWidth={1.75} />
							</span>
							<h3 className="mt-6 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">What Sets Us Apart</h3>
							<p className="mt-4 leading-relaxed text-[#606b80]">
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
						<div className="w-24 h-1 bg-black/50 mx-auto rounded-full"></div>
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
								className="bg-white rounded-xl overflow-hidden transition-all duration-300"
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
									<h3 className="text-gray-800 mb-2">
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
							title="Our Offices"
							description="With strategically located offices, we are positioned to serve clients efficiently and effectively. Each location is equipped to deliver the highest standard of legal service, ensuring consistency, confidentiality, and professionalism. Explore our offices to see where we can best support your legal needs."
							className="sm:max-w-3xl"
						/>
					</div>
					<PhotoMarquee photos={office_images} alt="Office" reverse />
				</section>

				{/* Disclosures */}
				<section className="relative isolate scroll-mt-20 px-4 pb-16 sm:px-6" id="disclosure">
					<DotPattern className="-z-10" />
					<Reveal className="mx-auto max-w-4xl rounded-3xl bg-white/70 p-6 text-center text-sm leading-relaxed text-[#606b80] ring-1 ring-black/5 backdrop-blur-xl sm:p-10">
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
