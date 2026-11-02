"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { easeOut } from "./Reveal";
import TopNav from "./TopNav";

const B = ({ children }: { children: React.ReactNode }) => (
	<span className="font-medium text-brand-navy">{children}</span>
);

// Each rotating statement: a short headline, with the full statement underneath
const slides = [
	{
		title: "Built for business in Ethiopia and Africa",
		text: (
			<>
				Committed to a <B>robust business and investment</B> environment in Ethiopia
				and Africa.
			</>
		),
	},
	{
		title: "Trusted across 52 jurisdictions",
		text: (
			<>
				A <B>globally renowned legal firm</B> with a distinct presence and forged
				partnerships in over <B>52 jurisdictions and nations</B> across four
				continents.
			</>
		),
	},
	{
		title: "Africa's seat on the BRILSA council",
		text: (
			<>
				The first and only African law firm chosen to the governing council of the{" "}
				<B>BRILSA/Belt and Road International Legal Services Association</B>, which
				is estimated to contribute <B>$7.1 trillion to the global GDP</B> annually
				and has <B>153 member countries worldwide</B>.
			</>
		),
	},
	{
		title: "Led by continental legal leadership",
		text: (
			<>
				The managing partner of this <B>premier</B> law company holds a number of
				prestigious positions and has garnered <B>international recognition</B>,
				including <B>President</B> of the <B>Pan African Lawyers Union (PALU)</B> and{" "}
				<B>Founding Former President of the Ethiopian Federal Bar Association</B>.
			</>
		),
	},
];

export default function Hero() {
	const [slideIndex, setSlideIndex] = useState(0);

	useEffect(() => {
		const slideTimer = setInterval(
			() => setSlideIndex((i) => (i + 1) % slides.length),
			6000
		);
		return () => clearInterval(slideTimer);
	}, []);

	return (
		<section
			id="hero-section"
			className="relative flex min-h-[100svh] flex-col pb-10 sm:pb-20"
		>

			<TopNav currentHref="/" />

			{/* Copy */}
			<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:px-6 sm:pt-16">
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
					className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-[#4b5468] shadow-sm ring-1 ring-black/5 sm:mb-6 sm:px-4"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
					TGA Global Law Firm LL.P · Addis Ababa
				</motion.p>

				{/* Slides share one grid cell, so the block keeps the tallest slide's height and
				    nothing around it moves; shorter slides sit centered inside it */}
				<div className="grid w-full">
					{slides.map((slide, index) => {
						const active = index === slideIndex;
						return (
							<motion.div
								key={index}
								aria-hidden={!active}
								className={`self-center [grid-area:1/1] ${active ? "" : "pointer-events-none"}`}
								initial={false}
								animate={
									active
										? { opacity: 1, y: 0, filter: "blur(0px)" }
										: { opacity: 0, y: -24, filter: "blur(8px)" }
								}
								transition={{ duration: 0.7, ease: easeOut }}
							>
								<h1 className="text-balance text-[2.375rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:tracking-tight text-brand-navy sm:text-6xl lg:text-7xl">
									{slide.title}
								</h1>
								<p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[#606b80] sm:mt-6 sm:text-lg">
									{slide.text}
								</p>
							</motion.div>
						);
					})}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
					className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row"
				>
					<Link
						href="#contact"
						className="group inline-flex min-w-[15rem] items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(11,27,77,0.45)] transition-colors hover:bg-brand-green sm:min-w-0 sm:px-7"
					>
						Get Legal Consultation
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
					<Link
						href="#about"
						className="inline-flex min-w-[15rem] items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-[#f7f9fc] sm:min-w-0 sm:px-7"
					>
						Learn More
					</Link>
				</motion.div>

				<div className="mt-8 flex justify-center gap-2">
					{slides.map((_, index) => (
						<button
							key={index}
							type="button"
							aria-label={`Show statement ${index + 1}`}
							onClick={() => setSlideIndex(index)}
							className={`h-1.5 rounded-full transition-all duration-500 ${
								index === slideIndex ? "w-8 bg-brand-green" : "w-1.5 bg-[#c3ccd9] hover:bg-[#9aa5b8]"
							}`}
						/>
					))}
				</div>
			</div>

		</section>
	);
}
