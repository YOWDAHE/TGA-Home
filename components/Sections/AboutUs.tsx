"use client";

import { Award, User } from "lucide-react";
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
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					leading, full-service law firm
				</span>{" "}
				with a powerful, active presence across{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
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
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					first African law firm
				</span>{" "}
				appointed as a council member of the{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
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
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					Judge of the COMESA Court of Justice
				</span>{" "}
				and{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
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
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					YINGKE Law Firm
				</span>
				, recognized as the world&apos;s largest law firm, and a{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
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
	const [isImageTransitioning, setIsImageTransitioning] = useState(false);

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
			setIsImageTransitioning(true);
			setCurrentImageIndex((prev) => {
				const nextIndex = (prev + 1) % currentSlide.images.length;
				return nextIndex;
			});

			// Reset transitioning state after animation completes
			setTimeout(() => setIsImageTransitioning(false), 500);
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
			<section className="py-20 bg-gradient-to-b from-gray-50 to-white min-h-[900px] flex items-center justify-center">
				<div className="text-center">Loading...</div>
			</section>
		);
	}

	return (
		<section
			id="about"
			className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden min-h-[900px] md:max-h-[2400px]"
		>
			{/* Background image */}
			<img
				src="/Images/aboutUs/woman.png"
				alt="About Us"
				width={1000}
				height={1000}
				className="absolute bottom-0 left-0 w-full h-full max-h-[1000px] object-cover blur-[5px] opacity-50"
			/>
			<div className="absolute inset-0 bg-[url('/office/placeholder.jpg?height=100&width=100')] opacity-5"></div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center mb-16">
						<h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
							ABOUT US
						</h2>
						<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
					</div>

					{/* Intro Text */}
					<div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
						<p className="text-base md:text-xl text-gray-700 mb-8 leading-relaxed text-center max-w-4xl mx-auto">
							TGA Global Law Firm LLP (formerly Tewodros Getachew Tulu and Associates) is a
							leading, full-service law firm headquartered in Ethiopia. For nearly two
							decades, we have served as the trusted advisor and partner to top-tier
							national and multinational corporations, providing elite legal services,
							strategic counsel, and innovative solutions across the continent and beyond.
						</p>

						<div className="grid md:grid-cols-7 gap-12">
							<div className="space-y-6 md:col-span-4">
								<div className="flex items-center mb-6">
									<div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
										<User className="w-6 h-6 text-white" />
									</div>
									<h3 className="text-xl md:text-2xl font-bold text-gray-900">
										Continental Leadership & Influence
									</h3>
								</div>
								<div className="space-y-4">
									{[
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold text-emerald-600">
												Judge of the COMESA Court of Justice (CCJ)
											</span>{" "}
											– First Instance Division of the continent&apos;s largest regional
											commercial court, with jurisdiction across 21 African nations
										</div>,
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold text-emerald-600">President</span> of
											the{" "}
											<span className="font-semibold text-emerald-600">
												Pan African Lawyers Union (PALU)
											</span>
											, the premier continental forum for African Bar Associations, and its
											first-ever president from East Africa
										</div>,
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold text-emerald-600">
												Immediate Past President
											</span>{" "}
											of the{" "}
											<span className="font-semibold text-emerald-600">
												Ethiopian Federal Advocates Association (EFAA)
											</span>
											, the first statutory bar in Ethiopia&apos;s legal history
										</div>,
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold text-emerald-600">
												Former Member of the Governing Council
											</span>{" "}
											of the{" "}
											<span className="font-semibold text-emerald-600">
												East Africa Law Society (EALS)
											</span>
										</div>,
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold text-emerald-600">Chairman</span> of
											the{" "}
											<span className="font-semibold text-emerald-600">
												CoST International Board
											</span>
											, uniting key infrastructure Ministries, Agencies, and Authorities
										</div>,
									].map((item, index) => (
										<div key={index} className="flex items-start group">
											<div className=" bg-teal-500 rounded-full mt-2 mr-4 p-1 group-hover:scale-150 transition-transform"></div>
											{item}
										</div>
									))}
								</div>
							</div>

							<div className="space-y-6 md:col-span-3">
								<div className="flex items-center mb-6">
									<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
										<Award className="w-6 h-6 text-white" />
									</div>
									<h3 className="text-xl md:text-2xl font-bold text-gray-900">
										Global Footprint & Alliances
									</h3>
								</div>
								<div className="space-y-4">
									{[
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold ">Official partner for Africa</span> of{" "}
											<span className="font-semibold ">YINGKE Law Firm</span>, recognized as
											the world&apos;s largest law firm
										</div>,
										<div className="text-gray-700 leading-relaxed">
											<span className="font-semibold ">Strategic partner</span> of{" "}
											<span className="font-semibold ">Tian Yuan Law Firm</span>, one of
											China&apos;s leading law firms
										</div>,
										<div className="text-gray-700 leading-relaxed">
											The only Ethiopian law firm appointed as an international commercial
											arbitrator for both <span className="font-semibold ">CIETAC</span>{" "}
											and <span className="font-semibold ">SHIAC</span>
										</div>,
										<div className="text-gray-700 leading-relaxed">
											The first African law firm appointed as a{" "}
											<span className="font-semibold ">council member of BRILSA</span>
										</div>,
										<div className="text-gray-700 leading-relaxed">
											Manages high-level international legal matters for the{" "}
											<span className="font-semibold ">African Union (AU) CISSA</span>
										</div>,
									].map((item, index) => (
										<div key={index} className="flex items-start group">
											<div className="p-1 bg-blue-500 rounded-full mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
											{item}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Sliding Image + Description Section */}
					<div className="flex flex-col lg:flex-row items-center justify-start gap-4 mt-12">
						{/* Image Carousel */}
						<div className="flex-1 flex justify-center">
							<AnimatePresence mode="wait">
								<motion.div
									key={`${currentSlideIndex}-${currentImageIndex}`}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.5 }}
									className="overflow-hidden rounded-lg shadow-lg relative"
								>
									<img
										src={currentImage.src}
										alt={`About Us Slide ${currentSlideIndex + 1} Image ${
											currentImageIndex + 1
										}`}
										className="w-[600px] h-[400px] object-contain z-10 relative"
									/>
									<img
										src={currentImage.src}
										alt={`About Us Slide ${currentSlideIndex + 1} Image ${
											currentImageIndex + 1
										}`}
										className="w-[600px] h-[400px] object-cover absolute inset-0 blur-[40px] opacity-70"
									/>

									{/* Image indicator dots */}
									{hasMultipleImages && (
										<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
											{currentSlide.images.map((_, index) => (
												<div
													key={index}
													className={`w-3 h-3 rounded-full ${
														index === currentImageIndex ? "bg-white" : "bg-white/50"
													}`}
												/>
											))}
										</div>
									)}
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Description */}
						<div className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-10">
							<AnimatePresence mode="wait">
								<motion.div
									key={currentSlideIndex}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.6 }}
								>
									<div className="text-lg text-gray-800 leading-relaxed h-[250px] lg:h-[400px] flex items-center justify-center p-8 md:p-12">
										{currentSlide.description}
									</div>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* Tewodros Bio Section */}
					<div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col lg:flex-row gap-10 mt-16 lg:h-[480px] h-auto">
						<img
							src="/Images/aboutUs/Tewodros.jpg"
							alt="Tewodros Getachew Tulu"
							className="object-cover rounded-lg h-full w-auto"
						/>
						<p className="lg:text-md text-base text-gray-700 leading-relaxed text-start max-w-4xl mx-auto flex-1">
							Hon. Justice Tewodros Getachew Tulu is a prominent Ethiopian lawyer and
							continental legal leader. He is the Managing Partner and co-founder of TGA
							Global Law Firm, formerly known as Tewodros Getachew Tulu and Associates. He
							serves as a Judge at the First Instance Division of the COMESA Court of
							Justice, and is the first East African to be elected{" "}
							<a
								href="https://www.lawyersofafrica.org/about/executive-committee/"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								President of the Pan African Lawyers Union
							</a>
							. <br />
							<br />
							He is the Immediate Past President of the Ethiopian Federal Advocates
							Association, Ethiopia&apos;s first statutory bar. Under his leadership, our
							firm became the first African law firm appointed as a council member of the{" "}
							<a
								href="http://www.brilanet.org.cn/en"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								Belt and Road International Lawyers Association (BRILSA)
							</a>
							.
							<br />
							<br /> He is a former member of the governing council of the{" "}
							<a
								href="https://ealawsociety.org/council-members/"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								East Africa Law Society
							</a>{" "}
							and chairs the{" "}
							<a
								href="https://infrastructuretransparency.org/"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								CoST International
							</a>{" "}
							Board, the premier structure in the construction sector. Tewodros Getachew
							is reshaping Africa&apos;s legal landscape, promoting justice throughout the
							continent, fostering a strong investment climate, and advancing cross-border
							legal practice.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
