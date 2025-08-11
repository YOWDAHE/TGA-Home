import React, { Component } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";

type HeroState = {
	currentTextIndex: number;
};

export class Hero extends Component<{}, HeroState> {
	interval?: ReturnType<typeof setInterval>;

	state: HeroState = {
		currentTextIndex: 0,
	};

	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState(({ currentTextIndex }) => ({
				currentTextIndex: (currentTextIndex + 1) % this.texts.length,
			}));
		}, 6000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	texts = [
		<div>
			COMMITTED TO A{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				ROBUST BUSINESS AND INVESTMENT
			</span>{" "}
			ENVIRONMENT
			<br />
			IN ETHIOPIA AND AFRICA
		</div>,
		<div>
			A{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				globally renowned legal firm
			</span>{" "}
			with a distinct presence and forged partnerships in over{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				52 jurisdictions and nations
			</span>{" "}
			across four continents
		</div>,
		<div>
			The first and only African law firm chosen to the governing council of the{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				{" "}
				BRILSA/Belt and Road International Legal Services Association
			</span>
			, which is estimated to contribute{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				{" "}
				$7.1 trillion to the global GDP
			</span>{" "}
			annually and has{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				{" "}
				153 member countries worldwide
			</span>
			.
		</div>,
		<div className="">
			The managing partner of this{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				premier
			</span>{" "}
			law company holds a number of prestigious positions and has garnered{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				international recognition
			</span>
			, including{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				President
			</span>{" "}
			of the{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				Pan African Lawyers Union (PALU)
			</span>{" "}
			and{" "}
			<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
				President of the Ethiopian Federal Bar Association
			</span>
			.
		</div>,
	];
	images = [
		{ src: "/loader/loader-1.svg", alt: "Hero", width: 350, height: 350 },
		{ src: "/loader/loader-1.svg", alt: "Hero 2", width: 350, height: 350 },
		{ src: "/loader/loader-1.svg", alt: "Hero 3", width: 350, height: 350 },
		{ src: "/loader/loader-1.svg", alt: "Hero 3", width: 350, height: 350 },
	];

	render() {
		const { currentTextIndex } = this.state;
		const heroImages = [
			"/Images/hero/hero-1.jpg",
			"/Images/hero/hero-2.jpg",
			"/Images/hero/hero-3.jpg",
		];

		return (
			<section
				id="hero-section"
				className="relative min-h-[700px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-32 overflow-hidden max-h-[calc(100vh-90px)] flex items-center justify-center"
			>
				<div className="flex justify-evenly absolute top-10 gap-10 z-20 md:hidden">
					<Link
						href="/about-us"
						className={`font-medium hover:text-teal-500`}
					>
						About
					</Link>
					<Link
						href="#services"
						className={`font-medium hover:text-teal-500`}
					>
						service
					</Link>
					<Link
						href="/resources"
						className={`font-medium hover:text-teal-500`}
					>
						Resources
					</Link>
					<Link
						href="/news"
						className={`font-medium hover:text-teal-500`}
					>
						News
					</Link>
				</div>
				{/* Rotating hero images background carousel */}
				<div className="absolute inset-0 overflow-hidden min-h-[700px] h-full">
					<Carousel
						opts={{
							loop: true,
							duration: 20,
						}}
						plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
						className="w-full h-full"
					>
						<CarouselContent className="h-full">
							{heroImages.map((image, index) => (
								<CarouselItem key={index} className="h-full">
									<div className="relative w-full h-full">
										<img
											src={image}
											alt={`Hero background ${index + 1}`}
											className="object-cover opacity-30 w-full min-h-[700px] h-full"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</div>

				<div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				</div>

				<div className="hidden lg:flex items-center justify-center lg:gap-10 gap-4 absolute left-0 w-full top-10 text-sm lg:text-base">
					<Link href="/">Home</Link>
					<Link href="#about">About</Link>
					<Link href="#services">Services</Link>
					<Link href="/resources">Resources</Link>
					<Link href="/news">News</Link>
					<Link href="#contact">Contact</Link>
				</div>
				<div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center gap-10">
					<img
						src="/loader/loader-1.svg"
						alt="Hero"
						width={350}
						height={350}
						className="object-cover rounded-lg bg-white hidden md:block"
					/>
					<img
						src="/loader/loader-1.svg"
						alt="Hero"
						width={150}
						height={150}
						className="object-cover rounded-lg bg-white md:hidden"
					/>
					{/* <AnimatePresence mode="wait">
						<motion.div
							key={currentTextIndex}
							className="..."
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -60 }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						>
							<img
								src={this.images[currentTextIndex].src}
								alt={this.images[currentTextIndex].alt}
								width={this.images[currentTextIndex].width}
								height={this.images[currentTextIndex].height}
								className="object-cover rounded-lg bg-white"
							/>
						</motion.div>
					</AnimatePresence> */}

					<AnimatePresence mode="wait">
						<motion.div
							className="text-xl md:text-3xl mb-8 leading-tight max-w-6xl mx-auto h-[120px] flex flex-col items-center justify-center mt-10 lg:mt-0"
							style={{ minHeight: "5.5rem" }}
							key={currentTextIndex}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -30 }}
							transition={{ duration: 0.8, ease: "easeInOut" }}
						>
							{this.texts[currentTextIndex]}
						</motion.div>
					</AnimatePresence>

					<div></div>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="#contact">
							<Button
								size="lg"
								className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
							>
								Get Legal Consultation
							</Button>
						</Link>
						<Link href="#about">
							<Button
								size="lg"
								variant="outline"
								className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl backdrop-blur-sm bg-transparent hover:text-white"
							>
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</section>
		);
	}
}

export default Hero;
