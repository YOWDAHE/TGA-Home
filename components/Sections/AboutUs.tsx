"use client";

import { Award, Check, User } from "lucide-react";
import Section from "./Section";
import React, { useEffect, useState, useCallback } from "react";
import { StaticImageData } from "next/image";

import image1_1 from "@/public/Images/aboutUs/image1.1.jpg";
import image1_2 from "@/public/Images/aboutUs/image1.2.jpg";
import image2_1 from "@/public/Images/aboutUs/image2.1.jpg";
import image2_2 from "@/public/Images/aboutUs/image2.2.jpg";
import image3_1 from "@/public/Images/aboutUs/image3.1.jpg";
import image4_1 from "@/public/Images/aboutUs/image4.1.jpg";
import image5_1 from "@/public/Images/aboutUs/image5.1.jpg";
import image5_2 from "@/public/Images/aboutUs/image5.2.jpg";
import image5_3 from "@/public/Images/aboutUs/image5.3.jpg";

import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";

const bioLink =
	"text-brand-green underline decoration-brand-green/30 underline-offset-4 transition-colors hover:decoration-brand-green";

type AboutUsSlide = {
	images: StaticImageData[];
	description: React.ReactNode;
};

const aboutUsSlides: AboutUsSlide[] = [
	{
		images: [image5_3, image5_2, image5_1],
		description: (
			<div>
				A{" "}
				<span className="font-medium text-brand-navy">
					leading, full-service law firm
				</span>{" "}
				with a powerful, active presence across{" "}
				<span className="font-medium text-brand-navy">
					all five regions of Africa
				</span>
				, uniquely bridging the gap between local jurisdictions and international
				commerce.
			</div>
		),
	},
	{
		images: [image2_1, image2_2],
		description: (
			<div>
				The{" "}
				<span className="font-medium text-brand-navy">
					first African law firm
				</span>{" "}
				appointed as a council member of the{" "}
				<span className="font-medium text-brand-navy">
					Belt and Road International Lawyers Association (BRILSA)
				</span>
				.
			</div>
		),
	},
	{
		images: [image1_1, image1_2],
		description: (
			<div>
				Our Managing Partner, Hon. Justice Tewodros Getachew Tulu, is a{" "}
				<span className="font-medium text-brand-navy">
					Judge of the COMESA Court of Justice
				</span>{" "}
				and{" "}
				<span className="font-medium text-brand-navy">
					President of the Pan African Lawyers Union (PALU)
				</span>
				, its first-ever president from East Africa.
			</div>
		),
	},
	{
		images: [image4_1],
		description: (
			<div>
				The official partner for Africa of{" "}
				<span className="font-medium text-brand-navy">
					YINGKE Law Firm
				</span>
				, recognized as the world&apos;s largest law firm, and a{" "}
				<span className="font-medium text-brand-navy">
					strategic partner
				</span>{" "}
				of Tian Yuan Law Firm, one of China&apos;s leading law firms.
			</div>
		),
	},
];

const AboutUs: React.FC = () => {
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const currentSlide = aboutUsSlides[currentSlideIndex];
	const hasMultipleImages = currentSlide?.images?.length > 1;
	const currentImage = currentSlide?.images?.[currentImageIndex];

	// Calculate image interval based on number of images
	const getImageInterval = useCallback(() => {
		const baseInterval = 6000; // 6 seconds base
		const numImages = currentSlide?.images?.length || 1;
		return baseInterval / Math.max(1, numImages - 1);
	}, [currentSlide?.images?.length]);

	useEffect(() => {
		const slideInterval = setInterval(() => {
			setCurrentSlideIndex((prev) => (prev + 1) % aboutUsSlides.length);
			setCurrentImageIndex(0); // Reset to first image when slide changes
		}, 12000);

		return () => clearInterval(slideInterval);
	}, []);

	useEffect(() => {
		if (!hasMultipleImages) {
			setCurrentImageIndex(0);
			return;
		}

		const imageInterval = setInterval(() => {
			setCurrentImageIndex((prev) => {
				const nextIndex = (prev + 1) % currentSlide.images.length;
				return nextIndex;
			});
		}, getImageInterval());

		return () => clearInterval(imageInterval);
	}, [
		currentSlideIndex,
		hasMultipleImages,
		currentSlide?.images.length,
		getImageInterval,
	]);

	// Add safety check for currentImage
	if (!currentImage) {
		return (
			<section className="flex min-h-[600px] items-center justify-center bg-white py-20">
				<div className="text-center text-[#606b80]">Loading...</div>
			</section>
		);
	}

	const strong = "font-medium text-brand-navy";

	return (
		<Section id="about">
			<SectionHeading
				title="Trusted counsel across Africa"
				description="TGA Global Law Firm LLP (formerly Tewodros Getachew Tulu and Associates) is a leading, full-service law firm headquartered in Ethiopia. For nearly two decades, we have served as the trusted advisor and partner to top-tier national and multinational corporations, providing elite legal services, strategic counsel, and innovative solutions across the continent and beyond."
			/>

			{/* Two lists */}
			<div className="mt-16 grid gap-4 md:grid-cols-2">
				{[
					{
						icon: User,
						title: "Continental Leadership & Influence",
						items: [
							<>
								<span className={strong}>Judge of the COMESA Court of Justice (CCJ)</span> –
								First Instance Division of the continent&apos;s largest regional commercial
								court, with jurisdiction across 21 African nations
							</>,
							<>
								<span className={strong}>President</span> of the{" "}
								<span className={strong}>Pan African Lawyers Union (PALU)</span>, the premier
								continental forum for African Bar Associations, and its first-ever president
								from East Africa
							</>,
							<>
								<span className={strong}>Immediate Past President</span> of the{" "}
								<span className={strong}>Ethiopian Federal Advocates Association (EFAA)</span>
								, the first statutory bar in Ethiopia&apos;s legal history
							</>,
							<>
								<span className={strong}>Former Member of the Governing Council</span> of the{" "}
								<span className={strong}>East Africa Law Society (EALS)</span>
							</>,
							<>
								<span className={strong}>Chairman</span> of the{" "}
								<span className={strong}>CoST International Board</span>, uniting key
								infrastructure Ministries, Agencies, and Authorities
							</>,
						],
					},
					{
						icon: Award,
						title: "Global Footprint & Alliances",
						items: [
							<>
								<span className={strong}>Official partner for Africa</span> of{" "}
								<span className={strong}>YINGKE Law Firm</span>, recognized as the
								world&apos;s largest law firm
							</>,
							<>
								<span className={strong}>Strategic partner</span> of{" "}
								<span className={strong}>Tian Yuan Law Firm</span>, one of China&apos;s
								leading law firms
							</>,
							<>
								The only Ethiopian law firm appointed as an international commercial
								arbitrator for both <span className={strong}>CIETAC</span> and{" "}
								<span className={strong}>SHIAC</span>
							</>,
							<>
								The first African law firm appointed as a{" "}
								<span className={strong}>council member of BRILSA</span>
							</>,
							<>
								Manages high-level international legal matters for the{" "}
								<span className={strong}>African Union (AU) CISSA</span>
							</>,
						],
					},
				].map((group, groupIndex) => (
					<Reveal
						key={group.title}
						delay={groupIndex * 0.1}
						className="rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl p-6 sm:p-10"
					>
						<span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-green shadow-sm">
							<group.icon className="h-5 w-5" strokeWidth={1.75} />
						</span>
						<h3 className="text-2xl font-semibold tracking-tight text-brand-navy">
							{group.title}
						</h3>
						<ul className="mt-6 space-y-4">
							{group.items.map((item, index) => (
								<li key={index} className="flex gap-3 leading-relaxed text-[#606b80]">
									<Check className="mt-1 h-4 w-4 shrink-0 text-brand-green" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</Reveal>
				))}
			</div>

			{/* Highlights slideshow */}
			<Reveal className="mt-4 grid overflow-hidden rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl lg:grid-cols-2">
				<div className="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:p-12">
					<div>
						<h3 className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">
							Firsts and milestones
						</h3>
						<div className="mt-4 grid min-h-[7.5rem]">
							{aboutUsSlides.map((slide, index) => {
								const active = index === currentSlideIndex;
								return (
									<motion.div
										key={index}
										aria-hidden={!active}
										className="text-lg leading-relaxed text-[#606b80] [grid-area:1/1]"
										initial={false}
										animate={
											active
												? { opacity: 1, y: 0, filter: "blur(0px)" }
												: { opacity: 0, y: -16, filter: "blur(6px)" }
										}
										transition={{ duration: 0.6, ease: easeOut }}
									>
										{slide.description}
									</motion.div>
								);
							})}
						</div>
					</div>
					<div className="flex gap-2">
						{aboutUsSlides.map((_, index) => (
							<button
								key={index}
								type="button"
								aria-label={`Show highlight ${index + 1}`}
								onClick={() => {
									setCurrentSlideIndex(index);
									setCurrentImageIndex(0);
								}}
								className={`h-1.5 rounded-full transition-all duration-500 ${
									index === currentSlideIndex
										? "w-8 bg-brand-green"
										: "w-1.5 bg-[#c3ccd9] hover:bg-[#9aa5b8]"
								}`}
							/>
						))}
					</div>
				</div>

				<div className="p-2 lg:p-3">
					<div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-brand-navy lg:aspect-auto lg:h-full lg:min-h-[420px]">
						<AnimatePresence mode="popLayout" initial={false}>
							<motion.div
								key={`${currentSlideIndex}-${currentImageIndex}`}
								initial={{ opacity: 0, scale: 1.04 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.98 }}
								transition={{ duration: 0.7, ease: easeOut }}
								className="absolute inset-0"
							>
								<img
									src={currentImage.src}
									alt=""
									aria-hidden
									className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
								/>
								<img
									src={currentImage.src}
									alt={`About Us Slide ${currentSlideIndex + 1} Image ${currentImageIndex + 1}`}
									className="relative h-full w-full object-contain"
								/>
							</motion.div>
						</AnimatePresence>

						{hasMultipleImages && (
							<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2 py-1.5 backdrop-blur">
								{currentSlide.images.map((_, index) => (
									<span
										key={index}
										className={`h-1.5 rounded-full transition-all ${
											index === currentImageIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
										}`}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</Reveal>

			{/* Managing partner */}
			<div className="mt-24 grid items-center gap-10 sm:mt-32 lg:grid-cols-12 lg:gap-16">
				<Reveal className="lg:col-span-5">
					<img
						src="/Images/aboutUs/Tewodros.jpg"
						alt="Tewodros Getachew Tulu"
						className="aspect-[4/5] w-full rounded-3xl object-cover object-top"
					/>
				</Reveal>
				<Reveal delay={0.1} className="lg:col-span-7">
					<h3 className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">
						Hon. Justice Tewodros Getachew Tulu
					</h3>
					<p className="mt-2 text-sm font-medium text-brand-green">Managing Partner</p>
					<div className="mt-6 space-y-4 leading-relaxed text-[#606b80]">
						<p>
							Hon. Justice Tewodros Getachew Tulu is a prominent Ethiopian lawyer and
							continental legal leader. He is the Managing Partner and co-founder of TGA
							Global Law Firm, formerly known as Tewodros Getachew Tulu and Associates. He
							serves as a Judge at the First Instance Division of the COMESA Court of
							Justice, and is the first East African to be elected{" "}
							<a
								href="https://www.lawyersofafrica.org/about/executive-committee/"
								className={bioLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								President of the Pan African Lawyers Union
							</a>
							.
						</p>
						<p>
							He is the Immediate Past President of the Ethiopian Federal Advocates
							Association, Ethiopia&apos;s first statutory bar. Under his leadership, our
							firm became the first African law firm appointed as a council member of the{" "}
							<a
								href="http://www.brilanet.org.cn/en"
								className={bioLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								Belt and Road International Lawyers Association (BRILSA)
							</a>
							.
						</p>
						<p>
							He is a former member of the governing council of the{" "}
							<a
								href="https://ealawsociety.org/council-members/"
								className={bioLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								East Africa Law Society
							</a>{" "}
							and chairs the{" "}
							<a
								href="https://infrastructuretransparency.org/"
								className={bioLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								CoST International
							</a>{" "}
							Board, the premier structure in the construction sector. Tewodros Getachew
							is reshaping Africa&apos;s legal landscape, promoting justice throughout the
							continent, fostering a strong investment climate, and advancing cross-border
							legal practice.
						</p>
					</div>
				</Reveal>
			</div>
		</Section>
	);
};

export default AboutUs;
