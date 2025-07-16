import React, { Component } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export class Hero extends Component {
	render() {
		return (
			<section
				id="hero-section"
				className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-32 overflow-hidden h-screen max-h-[1200px] flex items-center justify-center"
			>
				<div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				</div>

				<div className="flex items-center justify-center gap-10 absolute left-0 w-full top-10">
					<Link href="/">Home</Link>
					<Link href="#about">About</Link>
					<Link href="#services">Services</Link>
					<Link href="/resources">Resources</Link>
					<Link href="/news">News</Link>
					<Link href="#contact">Contact</Link>
				</div>
				<div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center gap-10">
					<Image
						src="/Images/logo/TGA_LOGO.svg"
						alt="Hero"
						width={350}
						height={350}
						className="object-cover rounded-lg"
					/>
					<div className="text-xl md:text-3xl font-bold mb-8 leading-tight">
						COMMITTED TO A{" "}
						<span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
							ROBUST BUSINESS AND INVESTMENT
						</span>{" "}
						ENVIRONMENT
						<br />
						IN ETHIOPIA AND AFRICA
					</div>
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
								className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl backdrop-blur-sm bg-transparent"
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
