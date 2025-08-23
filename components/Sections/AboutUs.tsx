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
					globally renowned legal firm
				</span>{" "}
				with a distinct presence and forged partnerships in over{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					52 jurisdictions and nations
				</span>{" "}
				across four continents
			</div>
		),
	},
	{
		images: [image2_1, image2_2],
		description: (
			<div>
				The first and only African law firm chosen to the governing council of the{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					BRILSA/Belt and Road International Legal Services Association
				</span>
				, which is estimated to contribute{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					$7.1 trillion to the global GDP
				</span>{" "}
				annually and has{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					153 member countries worldwide
				</span>
				.
			</div>
		),
	},
	{
		images: [image1_1, image1_2],
		description: (
			<div>
				The managing partner of this{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					premier
				</span>{" "}
				law company holds a number of prestigious positions and has garnered{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					international recognition
				</span>
				, including{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					President
				</span>{" "}
				of the{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					Pan African Lawyers Union (PALU)
				</span>{" "}
				and{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					President of the Ethiopian Federal Bar Association
				</span>
				.
			</div>
		),
	},
	{
		images: [image4_1],
		description: (
			<div>
				The{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					largest and most prominent law firm
				</span>{" "}
				in the world{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					Yingke
				</span>{" "}
				as well as numerous other prestigious firms in their respective countries,
				are{" "}
				<span className="bg-gradient-to-r from-teal-400 to-emerald-400 font-bold bg-clip-text text-transparent">
					strategic partners
				</span>{" "}
				of TGA Global Law Firm.
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
			className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden min-h-[900px] md:max-h-[2000px]"
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
							TGA Global Law Firm LL.P is a premier legal practice committed to excellence in
							serving our clients across Ethiopia and Africa. Our experienced team
							combines deep local knowledge with international expertise to deliver
							comprehensive legal solutions.
						</p>

						<div className="grid md:grid-cols-7 gap-12">
							<div className="space-y-6 md:col-span-4">
								<div className="flex items-center mb-6">
									<div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
										<User className="w-6 h-6 text-white" />
									</div>
									<h3 className="text-xl md:text-2xl font-bold text-gray-900">
										Leadership & International Recognition
									</h3>
								</div>
								<div className="space-y-4">
									{[
										"President of the Pan-African Lawyers Union, the continent’s premier legal organ for lawyers and law Associations of Africa",
										"Council member of the Belt and Road International Legal Services Association (BRILSA), the first African to join this governance structure",
										"President, Ethiopian Federal Bar Association, overseeing thousands of lawyers and law firms",
										"Governing Council member of the East African Law Society (EALS)—a leading regional bloc for leading law firms in the sub-region",
										"Chairman of the Board of the State Infrastructure Transparency Initiative (COST International), which is made up of the top organizations in the construction industry",
										"A member and chair of several domestic and international board structures",
									].map((item, index) => (
										<div key={index} className="flex items-start group">
											<div className=" bg-teal-500 rounded-full mt-2 mr-4 p-1 group-hover:scale-150 transition-transform"></div>
											<span className="text-gray-700 leading-relaxed">{item}</span>
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
										Professional Affiliations
									</h3>
								</div>
								<div className="space-y-4">
									{[
										"Life member of the African Lawyers Union, membership of 54 countries",
										"Member of Belt and Road International Legal Services Association, membership of 153 countries",
										"Member of EALS, Leading Law firms forum, 8 countries",
										"Member of the Ethiopian Federal Bar Association",
										"Affiliated with IBA, ABA, and many other International lawyers associations",
									].map((item, index) => (
										<div key={index} className="flex items-start group">
											<div className="p-1 bg-blue-500 rounded-full mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
											<span className="text-gray-700 leading-relaxed">{item}</span>
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
					<div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col lg:flex-row gap-10 mt-16 lg:h-[450px] h-auto">
						<img
							src="/Images/aboutUs/Tewodros.jpg"
							alt="Tewodros Getachew Tulu"
							className="object-cover rounded-lg h-full w-auto"
						/>
						<p className="lg:text-md text-base text-gray-700 leading-relaxed text-start max-w-4xl mx-auto flex-1">
							Tewodros Getachew Tulu is a prominent Ethiopian lawyer and continental
							legal leader. He is the managing partner and co-founder of TGA Global Law
							Firm, which was formerly known as Tewodros Getachew Tulu and Associates
							Law Group, Tewodros is the first East African to be elected to the most
							prestigious position in Africa,{" "}
							<a
								href="https://www.lawyersofafrica.org/about/executive-committee/"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								President of the Pan African Lawyers Union
							</a>
							. <br />
							He is the Founding President of the Ethiopian Federal Bar Association,
							currently leading Ethiopia's first ever statutory Bar Association.
							Through its managing partner, our law firm is the first African member of
							the{" "}
							<a
								href="http://www.brilanet.org.cn/en"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								Belt and Road International Legal Services Association (BRILSA)
							</a>{" "}
							to be appointed to the Council.
							<br /> Our managing partner is currently joined the governing council of{" "}
							<a
								href="https://ealawsociety.org/council-members/"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								East Africa Law Society.
							</a>{" "}
							He's an advisor to the African Union CISSA on matters of national and
							international laws, and holds various roles in legal reform structures.
							He is an international arbitrator under the auspices of various
							international centers including CIETAC. He chairs various board
							structures, including{" "}
							<a
								href="https://infrastructuretransparency.org/"
								className="text-blue-500 hover:underline"
								target="_blank"
							>
								COST International
							</a>
							, the highest board in the construction sector. Tewodros Getachew is
							reshaping Africa's legal landscape, promoting justice throughout the
							continent, fostering a strong investment climate, and advancing
							cross-border legal practice.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
