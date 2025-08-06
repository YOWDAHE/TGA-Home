import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Partner } from "@/app/types/landing";
import Image from "next/image";
import { convertToApiUrl } from "@/lib/utils";
import {
	InfiniteCarousel,
	CarouselItem,
} from "@/components/ui/infinite-carousel";

interface PartnersProps {
	partners: Partner[];
}

const Partners = React.memo(function Partners({ partners }: PartnersProps) {
	// Memoize the partners array to prevent unnecessary re-renders
	const memoizedPartners = useMemo(() => partners, [partners]);

	return (
		<section className="py-20 bg-[#f6f7f8] relative overflow-hidden min-h-[500px] flex items-center justify-center">
			<div className="absolute inset-0 bg-[url('/office/placeholder.jpg?height=100&width=100')] opacity-5"></div>
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-16">
					<h2 className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
						OUR PARTNERS
					</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
					<p className="text-gray-600 mt-4 text-lg">
						Trusted by leading organizations worldwide
					</p>
				</div>

				<div className="relative">
					<div className="flex items-center justify-center space-x-8 mb-12">
						{/* Custom Infinite Carousel */}
						<div className="flex-1 max-w-5xl overflow-hidden relative">
							{/* The outer container hides overflow */}
							{/* Left gradient overlay */}
							<div
								className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
								style={{
									background:
										"linear-gradient(to right, #f5f6f7 0%, rgba(245, 246, 247, 0.8) 25%, rgba(245, 246, 247, 0.4) 50%, rgba(245, 246, 247, 0.1) 75%, transparent 100%)",
								}}
							/>

							{/* Right gradient overlay */}
							<div
								className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
								style={{
									background:
										"linear-gradient(to left, #f5f6f7 0%, rgba(245, 246, 247, 0.8) 25%, rgba(245, 246, 247, 0.4) 50%, rgba(245, 246, 247, 0.1) 75%, transparent 100%)",
								}}
							/>
							<div
								className="inline-flex animate-marquee space-x-4"
								style={{ animationDuration: "15s" }}
							>
								{[...memoizedPartners, ...memoizedPartners].map((partner, index) => (
									<div
										key={index}
										className={`
          flex items-center justify-center
          p-4 md:p-8
          bg-white rounded-3xl shadow-lg hover:shadow-2xl
          transition-all duration-300 transform hover:scale-105
          border border-gray-100 group
          h-[100px] w-[100px] md:h-[200px] md:w-[200px]
          my-4 md:my-10 mb-10 md:mb-20
          flex-shrink-0
        `}
									>
										<Image
											src={convertToApiUrl(partner.logo_url) || "//officeplaceholder.jpg"}
											alt={partner.name}
											width={60}
											height={40}
											className="max-w-full h-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 md:w-[120px] md:h-[80px]"
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
});

export default Partners;
