"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Header from "@/components/Sections/Header";
import Autoplay from "embla-carousel-autoplay";
import Footer from "@/components/Sections/Footer";
import {
	ArrowLeftRight,
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

function SectionHeading({
	eyebrow,
	title,
	light = false,
	center = false,
}: {
	eyebrow: string;
	title: string;
	light?: boolean;
	center?: boolean;
}) {
	return (
		<div className={`mb-10 ${center ? "text-center" : ""}`}>
			<p
				className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
					light ? "text-teal-100" : "text-teal-600"
				}`}
			>
				{eyebrow}
			</p>
			<h2
				className={`text-3xl md:text-4xl font-bold leading-tight ${
					light ? "text-white" : "text-gray-900"
				}`}
			>
				{title}
			</h2>
			<div
				className={`w-16 h-1 mt-5 rounded-full ${center ? "mx-auto" : ""} ${
					light ? "bg-white/60" : "bg-gradient-to-r from-teal-500 to-emerald-500"
				}`}
			></div>
		</div>
	);
}

function page() {
	const pathname = usePathname();
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
		<>
			<Header currentPage="about-us" />
			<div className="mt-16 overflow-hidden text-gray-700">
				{/* Hero */}
				<section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_55%)]"></div>
					<div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<p className="text-sm font-semibold uppercase tracking-widest text-teal-100 mb-4">
								About TGA Global Law Firm LLP
							</p>
							<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Who We Are</h1>
							<p className="text-lg leading-relaxed text-white/90 mb-4">
								TGA Global Law Firm LLP (formerly Tewodros Getachew Tulu and Associates) is a
								leading, full-service law firm headquartered in Ethiopia. Officially
								recognized as a leading law firm in the East African region, we provide
								elite legal services, strategic counsel, and innovative solutions to
								complex challenges across the continent and beyond.
							</p>
							<p className="leading-relaxed text-white/80">
								For nearly two decades, we have served as the trusted advisor and partner
								to top-tier national and multinational corporations. From navigating
								sophisticated transactional matters to managing cross-border investment
								portfolios, we deliver the precision and foresight needed to thrive in
								today&apos;s interconnected global economy.
							</p>
						</div>
						<div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
							<Image
								src={images[0]}
								alt="TGA Global Law Firm leadership"
								fill={true}
								priority
								className="object-cover"
							/>
						</div>
					</div>
					<div className="relative max-w-6xl mx-auto px-4 pb-12 md:pb-16">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-4"
								>
									<p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
									<p className="text-sm text-white/80 mt-1">{stat.label}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Gallery */}
				<section className="py-12 bg-gray-50">
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						plugins={[
							Autoplay({
								delay: 2500,
							}),
						]}
						className="w-full"
					>
						<CarouselContent>
							{images.map((src, idx) => (
								<CarouselItem
									key={src}
									className="relative h-[300px] md:h-[380px] basis-full sm:basis-1/2 lg:basis-1/3"
								>
									<div className="relative h-full w-full rounded-xl overflow-hidden">
										<Image
											src={src}
											alt={`About Us ${idx + 1}`}
											fill={true}
											className="object-cover"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</section>

				{/* Continental Leadership & Influence */}
				<section className="py-20 px-4">
					<div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
						<div className="lg:col-span-2">
							<SectionHeading eyebrow="Leadership" title="Continental Leadership & Influence" />
							<p className="leading-relaxed">
								Our firm&apos;s influence is anchored by the distinguished leadership of
								our Managing Partner,{" "}
								<span className="font-semibold text-gray-900">
									Hon. Justice Tewodros Getachew Tulu
								</span>{" "}
								and our firm partner{" "}
								<span className="font-semibold text-gray-900">Blain WORKU</span>, who is
								the former senior advisor to the President of the Federal Democratic
								Republic of Ethiopia. The firm&apos;s leadership holds pioneering roles at
								the highest levels of the African legal and regulatory framework.
							</p>
						</div>
						<div className="lg:col-span-3 space-y-4">
							{leadershipRoles.map((role, index) => (
								<div
									key={role.title}
									className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300"
								>
									<span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-bold flex items-center justify-center">
										{index + 1}
									</span>
									<div>
										<h3 className="text-lg font-bold text-gray-900 mb-1">{role.title}</h3>
										<p className="leading-relaxed">{role.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Shaping the Legal Landscape */}
				<section className="py-20 px-4 bg-gray-50">
					<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<SectionHeading eyebrow="Legal Reform" title="Shaping the Legal Landscape" />
							<p className="leading-relaxed mb-4">
								TGA Global is more than a legal representative; we are active drivers of
								legislative evolution. Powered by a vibrant network of elite lawyers both
								in Ethiopia and abroad, our team plays a definitive role in national and
								continental legal reforms.
							</p>
							<p className="leading-relaxed">
								Our lawyers have been deeply involved in drafting, revising, and
								promulgating landmark legislation that defines modern business in the
								region, including:
							</p>
						</div>
						<ul className="rounded-2xl bg-white border border-gray-200 shadow-sm divide-y divide-gray-100">
							{landmarkLegislation.map((law) => (
								<li key={law} className="flex items-center gap-4 p-5">
									<span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
										<Check className="w-4 h-4" />
									</span>
									<span className="font-medium text-gray-900">{law}</span>
								</li>
							))}
						</ul>
					</div>
				</section>

				{/* Global Footprint & Alliances */}
				<section className="py-20 px-4 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
					<div className="max-w-6xl mx-auto">
						<SectionHeading
							eyebrow="Global Reach"
							title="A Distinctive Global Footprint & Elite Alliances"
							light
							center
						/>
						<p className="max-w-3xl mx-auto text-center text-white/90 leading-relaxed mb-12">
							We maintain a powerful, active presence across all five regions of Africa,
							uniquely bridging the gap between local jurisdictions and international
							commerce. Our global reach is reinforced by unparalleled milestones and
							strategic partnerships:
						</p>
						<div className="grid md:grid-cols-3 gap-6">
							{alliances.map(({ icon: Icon, title, description }) => (
								<div
									key={title}
									className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-8 hover:bg-white/15 transition-colors duration-300"
								>
									<span className="w-12 h-12 rounded-xl bg-white text-teal-600 flex items-center justify-center mb-6">
										<Icon className="w-6 h-6" />
									</span>
									<h3 className="text-xl font-bold text-white mb-3">{title}</h3>
									<p className="leading-relaxed text-white/85">{description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Practice Areas */}
				<section className="py-20 px-4">
					<div className="max-w-6xl mx-auto">
						<SectionHeading eyebrow="What We Do" title="Our Practice Areas" center />
						<p className="max-w-3xl mx-auto text-center leading-relaxed mb-12">
							We offer comprehensive legal counsel across a diversified spectrum of
							practice areas, ensuring our clients are protected at every stage of their
							operations:
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							{practiceAreas.map(({ icon: Icon, name }) => (
								<div
									key={name}
									className="group w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex items-center gap-4 sm:block rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 hover:border-teal-300 hover:shadow-md transition-all duration-300"
								>
									<span className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center sm:mb-4">
										<Icon className="w-5 h-5" />
									</span>
									<p className="font-semibold text-gray-900 leading-snug">{name}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Commitment & What Sets Us Apart */}
				<section className="py-20 px-4 bg-gray-50">
					<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
						<div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 md:p-10">
							<span className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center mb-6">
								<ShieldCheck className="w-6 h-6" />
							</span>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h3>
							<p className="leading-relaxed">
								At TGA Global, we blend deep local insight with a sophisticated global
								perspective to protect your interests with absolute integrity, excellence,
								and premium legal service. Our expertise spans structuring complex
								corporate boards, drafting airtight international agreements, and closing
								high-value deals. We also provide elite litigation and reputable
								international arbitration services to successfully resolve complex,
								cross-border investment and trade disputes.
							</p>
						</div>
						<div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8 md:p-10">
							<span className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center mb-6">
								<Gem className="w-6 h-6" />
							</span>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">What Sets Us Apart</h3>
							<p className="leading-relaxed">
								Our firm is built on two foundational pillars:{" "}
								<span className="font-semibold text-teal-700">uncompromising integrity</span>{" "}
								and{" "}
								<span className="font-semibold text-teal-700">bespoke, premium quality</span>.
								We maintain the highest ethical standards, serving as a trusted partner to
								multinational corporations, governments, and international bodies through
								absolute transparency and strict confidentiality. Rejecting
								one-size-fits-all legal advice, we deliver tailor-made strategies and
								creative solutions executed with world-class operational excellence.
							</p>
						</div>
					</div>
				</section>

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
				<section className="py-20">
					<div className="max-w-6xl mx-auto px-4">
						<SectionHeading eyebrow="Where We Work" title="Our Offices" center />
						<p className="max-w-3xl mx-auto text-center leading-relaxed mb-12">
							With strategically located offices, we are positioned to serve clients
							efficiently and effectively. Each location is equipped to deliver the
							highest standard of legal service, ensuring consistency, confidentiality,
							and professionalism. Explore our offices to see where we can best support
							your legal needs.
						</p>
					</div>

					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						plugins={[
							Autoplay({
								delay: 2500,
							}),
						]}
						className="w-full"
					>
						<CarouselContent>
							{office_images.map((src, idx) => (
								<CarouselItem
									key={src}
									className="relative h-[300px] md:h-[380px] basis-full sm:basis-1/2 lg:basis-1/3"
								>
									<div className="relative h-full w-full rounded-xl overflow-hidden">
										<Image
											src={src}
											alt={`Office ${idx + 1}`}
											fill={true}
											className="object-cover"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</section>

				{/* Disclosures */}
				<section className="px-4 pb-16" id="disclosure">
					<div className="max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-sm leading-relaxed">
						<h2 className="text-lg font-bold text-gray-900 mb-4">
							Global Reach & Legal Disclosures
						</h2>
						<p className="mb-3">
							© {new Date().getFullYear()} TGA Global Law Firm LL.P. All rights reserved.{" "}
							<strong>Attorney Advertising.</strong>
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
					</div>
				</section>
			</div>
			<Footer />
		</>
	);
}

export default page;
