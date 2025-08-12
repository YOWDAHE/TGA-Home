"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import AboutUs from "@/components/Sections/AboutUs";
import Hero from "@/components/Sections/Hero";
import Header from "@/components/Sections/Header";
import Statistics from "@/components/Sections/Statistics";
import Services from "@/components/Sections/Services";
import Partners from "@/components/Sections/Partners";
import News from "@/components/Sections/News";
import PracticeAreas from "@/components/Sections/PracticeAreas";
import ContactUs from "@/components/Sections/ContactUs";
import Footer from "@/components/Sections/Footer";
import {
	Stat,
	Partner,
	Practice,
	ContactUs as ContactUsType,
	NewsLink,
	LandingData,
} from "@/app/types/landing";
import type { News as NewsType } from "@/app/types/news";
import type { Resource } from "@/app/actions/resources.actions";
import { usePathname } from "next/navigation";

interface LandingPageProps {
	data: {
		landing: LandingData;
		stats: Stat[];
		partners: Partner[];
		practices: Practice[];
		contactUs: ContactUsType[];
		newsLinks: NewsLink[];
	};
	news: NewsType[];
	resources: Resource[];
}

export default function LandingPage({
	data,
	news,
	resources,
}: LandingPageProps) {
	const [showScrollTop, setShowScrollTop] = useState(false);

	const [currentSection, setCurrentSection] = useState<
		"news" | "resources" | "home" | "services" | "about-us" | undefined
	>("home");

	const aboutRef = React.useRef<HTMLDivElement>(null);
	const servicesRef = React.useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const [hash, setHash] = useState("");

	useEffect(() => {

		setHash(window.location.hash);

		// Scroll handler for hash links
		
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

		// Also handle hash changes
		window.addEventListener("hashchange", handleHashScroll);

		return () => {
			window.removeEventListener("hashchange", handleHashScroll);
		};
	}, [hash]);

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 400);

			const viewportHeight = window.innerHeight;
			const viewportCenter = window.scrollY + viewportHeight / 2;

			const aboutRect = aboutRef.current?.getBoundingClientRect();
			const aboutTop = aboutRef.current
				? window.scrollY + aboutRect!.top
				: null;
			const aboutBottom = aboutRef.current
				? window.scrollY + aboutRect!.bottom
				: null;

			const servicesRect = servicesRef.current?.getBoundingClientRect();
			const servicesTop = servicesRef.current
				? window.scrollY + servicesRect!.top
				: null;
			const servicesBottom = servicesRef.current
				? window.scrollY + servicesRect!.bottom
				: null;

			if (
				servicesTop !== null &&
				servicesBottom !== null &&
				viewportCenter >= servicesTop &&
				viewportCenter <= servicesBottom
			) {
				setCurrentSection("services");
			} else {
				setCurrentSection("home");
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="min-h-screen bg-white relative">
			<Header showHeader={false} currentPage={currentSection} />
			<Hero />
			<div ref={aboutRef}>
				<AboutUs />
			</div>
			<Statistics stats={data.stats} />
			<div ref={servicesRef} id="services">
				<Services />
			</div>
			<PracticeAreas practices={data.practices} />
			<News news={news} resources={resources} />
			<Partners partners={data.partners} />
			<ContactUs contactUs={data.contactUs} />
			<Footer contactUs={data.contactUs} />

			{/* Scroll to Top Button */}
			{showScrollTop && (
				<Button
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white shadow-lg z-50"
					size="icon"
				>
					<ArrowUp className="w-5 h-5" />
				</Button>
			)}
		</div>
	);
}
