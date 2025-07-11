"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChevronLeft,
	ChevronRight,
	FileText,
	Play,
	ArrowUp,
	Phone,
	Mail,
	MessageCircle,
	Home,
	User,
	Award,
} from "lucide-react";
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

export default function LandingPage() {
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 400);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="min-h-screen bg-white relative">
			<Header />
			<Hero />
			<AboutUs />
			<Statistics />
			<Services />
			<PracticeAreas />
			<News />
			<Partners />
			<ContactUs />
			<Footer />

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
