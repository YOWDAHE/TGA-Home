import { useState, useEffect } from "react";
import Carousel from "../Carousel";
import {
	Carousel as UICarousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Practice } from "@/app/types/landing";
import Autoplay from "embla-carousel-autoplay";

interface PracticeAreasProps {
	practices: Practice[];
}

export default function PracticeAreas({ practices }: PracticeAreasProps) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768); // md breakpoint
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<section className="py-16 lg:pt-24 bg-[#f6f7f8]">
			<div className="container mx-auto px-4 text-center">
				<h2 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-8">
					PRACTICE AREAS
				</h2>

				{/* Mobile UI Carousel */}
				{isMobile && (
					<UICarousel
						opts={{
							align: "start",
							loop: true,
							duration: 3000,
						}}
						plugins={[Autoplay({ delay: 2000 })]}
						className="w-full max-w-sm mx-auto"
					>
						<CarouselContent>
							{practices.map((practice) => (
								<CarouselItem key={practice.id}>
									<div className="border border-white/20 rounded-2xl shadow-2xl p-6 min-h-[280px] h-[350px] flex flex-col items-center justify-center transition-all duration-300 bg-[#232733]">
										<h3 className="text-xl font-bold mb-4 text-white text-center tracking-wide">
											{practice.title}
										</h3>
										<div
											className="space-y-2 text-teal-200 text-sm"
											dangerouslySetInnerHTML={{ __html: practice.description }}
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{/* <CarouselPrevious />
						<CarouselNext /> */}
					</UICarousel>
				)}

				{/* Desktop Custom Carousel */}
				{!isMobile && (
					<Carousel
						items={practices}
						renderItem={(practice) => (
							<div
								className=" border border-white/20 rounded-2xl shadow-2xl p-10 min-h-
                        [320px] h-[400px] flex flex-col items-center justify-center transition-all 
                        duration-300 w-[400px]"
							>
								<h3
									className="text-2xl font-bold mb-6 text-white text-center 
                            tracking-wide"
								>
									{practice.title}
								</h3>
								<div
									className="space-y-3 text-teal-200 text-base"
									dangerouslySetInnerHTML={{ __html: practice.description }}
								/>
							</div>
						)}
						className="!min-h-0"
					/>
				)}

				<p className="md:text-xl text-gray-600 mb-12 mt-8 md:mt-0">
					WE PROVIDE A QUALITY LEGAL SERVICE WITH CREATIVE SOLUTIONS
				</p>
			</div>
		</section>
	);
}
