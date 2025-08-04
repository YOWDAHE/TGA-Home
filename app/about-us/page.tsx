"use client";
import React from "react";
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

const images = Array.from(
	{ length: 11 },
	(_, i) =>
		`/aboutUs/IMG-20250727-WA00${(i + 1).toString().padStart(2, "0")}.jpg`
);

function page() {
	return (
		<>
			<Header currentPage="about" />
			<div className=" mx-auto py-8 px-4 mt-16 overflow-hidden">
				<div className="text-center mb-16">
					<h2 className="text-2xl md:text-4xl font-bold mb-4">ABOUT US</h2>
					<div className="w-24 h-1 bg-black/50 mx-auto rounded-full"></div>
				</div>
				<div className="w-full">
					<div
						className="inline-flex animate-marquee space-x-4"
						style={{ animationDuration: "7s" }}
					>
						{[...images, ...images].map((image, index) => (
							<div
								key={index}
								className={`
                              flex items-center justify-center
                              shadow-lg hover:shadow-2xl
                              transition-all duration-300 transform hover:scale-105
                              border border-gray-100 group
                              flex-shrink-0
                            `}
							>
								<Image
									src={image || "/placeholder.jpg"}
									alt="about us"
									width={60}
									height={40}
									className="max-w-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300 md:w-[220px] md:h-[180px] w-[60px] h-[40px]"
								/>
							</div>
						))}
					</div>
					<div className="mb-8">
						<Carousel
							opts={{
								align: "start",
							}}
							plugins={[
								Autoplay({
									delay: 2000,
								}),
							]}
							className="w-full"
						>
							<CarouselContent>
								{images.map((src, idx) => (
									<CarouselItem
										key={src}
										className="flex justify-center items-center max-h-120 h-[520px] relative md:basis-1/2 lg:basis-1/3"
									>
										<Image
											src={src}
											alt={`About Us ${idx + 1}`}
											fill={true}
											className="object-cover px-1"
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							{/* <CarouselPrevious />
							<CarouselNext /> */}
						</Carousel>
					</div>
					<div className="md:w-[80%] flex flex-col justify-center items-center mx-auto text-lg text-justify">
						Tewodros Getachew Tulu and Associates Law Group (TGA Law Group) is a
						leading law office in Ethiopia specialized in diversified area of
						expertise, providing a quality legal service with creative solutions.
						Prominent practice areas, among others include Cross - border Trade &
						Investment, Corporate Law, Tax laws, Construction Law, Compliance, IP and
						Arbitration. <br />
						Throughout its nearly two - decade of experience the law firm has been
						working with both domestic and foreign clients including leading national
						and multinational corporations as a trusted advisor and partner in various
						board structures, drafting legal documents and contract agreements,
						conducting negotiations, closing deals, regulatory & compliance
						guidelines.
						<br />
						TGA’s with vibrant lawyers both in Ethiopia and throughout the continent,
						has been taking a foremost role in the national and continental legal
						reform process. We were highly involved in the promulgation of various law
						reforms and drafting including the Ethiopian revised commercial code, the
						revised tax-laws, CSO law, the federal courts proclamations, ADR Rules,
						criminal procedure & evidence law, the newly promulgated Immigration Law.
						<br />
						The Law Group represents the African Union AU CISSA on matters of national
						and international law. The Law Group also works in different capacities
						with the continent’s enormous commercial court, the COMESA Court of
						Justice (CCJ) which entertains cases involving national, continental and
						cross border commercial disputes among multi-national corporations and
						individuals. TGA’s involvement in construction law is also paramount,
						currently the managing partner is the Chairman for COST International
						Board which is the premier structure in the construction sector which is
						comprised of various key sector Ministries, Agencies and Authorities.
						<br />
						TGA Law Group boasts a unique and robust presence across all five regions
						of the African continent. The firm has formed partnerships with number of
						the world's leading law firms.
						<br />
						TGA Law Group is the official partner for Africa of YINGKE LAW FIRM, which
						is recognized as the world's biggest law firm.
						<br />
					</div>
				</div>
				<div className="md:p-10 p-4 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 mt-14 w-full rounded-lg flex flex-col gap-4 justify-center items-center">
					<div className="text-center mb-16">
						<h2 className="text-2xl md:text-4xl font-bold mb-4 px-4 md:px-0">
							Memberships and Positions
						</h2>
						<div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-12">
						<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
							<p className="text-xl md:text-2xl font-bold mb-6">
								President for the African Lawyers Union{" "}
							</p>
							<p className="flex-1 flex items-center justify-center leading-relaxed text-white/90">
								Through it’s a managing partner, currently holds the most prestigious
								position of a President for the African Lawyers Union /PALU/, the
								continent’s premier legal body
							</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
							<p className="text-xl md:text-2xl font-bold mb-6">
								President of the Ethiopian Federal Bar Association
							</p>
							<p className="flex-1 flex items-center justify-center leading-relaxed text-white/90">
								Holds the prestigious position of the President of the Ethiopian Federal
								Bar Association leading and overseeing thousands of lawyers
							</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
							<p className="text-xl md:text-2xl font-bold mb-6">
								Governing Council member of East African Law Society
							</p>
							<p className="flex-1 flex items-center justify-center leading-relaxed text-white/90">
								Governing Council member of East African Law Society EALS – a Primary
								regional bloc for leading law firms
							</p>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
							<p className="text-xl md:text-2xl font-bold mb-6">
								Council member for the BRILSA
							</p>
							<p className="flex-1 flex items-center justify-center leading-relaxed text-white/90">
								Council member for the Belt and Road International Lawyers Association
								BRILSA, the first African lawyer to join this board
							</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default page;
