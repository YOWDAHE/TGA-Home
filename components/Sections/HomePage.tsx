"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import AboutUs from "@/components/Sections/AboutUs";
import Hero from "@/components/Sections/Hero";
import Statistics from "@/components/Sections/Statistics";
import Services from "@/components/Sections/Services";
import Partners from "@/components/Sections/Partners";
import Statement from "@/components/Sections/Statement";
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
	HomeContent,
} from "@/app/types/landing";
import type { News as NewsType } from "@/app/types/news";
import type { Resource } from "@/app/actions/resources.actions";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { FrostedColors } from "@/components/Sections/Backdrop";

interface LandingPageProps {
	data: {
		landing: LandingData;
		stats: Stat[];
		partners: Partner[];
		practices: Practice[];
		contactUs: ContactUsType[];
		newsLinks: NewsLink[];
		homeContent: HomeContent;
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
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen text-brand-navy antialiased">
				<FrostedColors />
				<Hero content={data.homeContent.hero} />
				<Partners partners={data.partners} />
				<Statement content={data.homeContent.statement} />
				<div ref={aboutRef}>
					<AboutUs content={data.homeContent.about} />
				</div>
				<Statistics stats={data.stats} />
				<div ref={servicesRef} id="services">
					<Services content={data.homeContent.services} />
				</div>
				<PracticeAreas practices={data.practices} />
				<News news={news} resources={resources} />
				<ContactUs contactUs={data.contactUs} />
				<Footer contactUs={data.contactUs} />

				{/* Scroll to Top Button */}
				{showScrollTop && (
					<Button
						onClick={scrollToTop}
						aria-label="Scroll to top"
						className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-sm bg-brand-navy text-white hover:bg-brand-green sm:bottom-8 sm:right-8"
						size="icon"
					>
						<ArrowUp className="w-5 h-5" />
					</Button>
				)}
			</div>
		</MotionConfig>
	);
}
