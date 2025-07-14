import Carousel from "../Carousel";
import { Practice } from "@/app/types/landing";

interface PracticeAreasProps {
	practices: Practice[];
}

export default function PracticeAreas({ practices }: PracticeAreasProps) {
	return (
		<section className="py-16 lg:pt-24 bg-[#f6f7f8]">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-4xl font-bold text-gray-900 mb-4">PRACTICE AREAS</h2>

				<Carousel
					items={practices}
					renderItem={(practice) => (
						<div className=" border border-white/20 rounded-2xl shadow-2xl p-10 min-h-[320px] h-[400px] flex flex-col items-center justify-center transition-all duration-300 w-[400px]">
							<h3 className="text-2xl font-bold mb-6 text-white text-center tracking-wide">
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
				<p className="text-xl text-gray-600 mb-12">
					WE PROVIDE A QUALITY LEGAL SERVICE WITH CREATIVE SOLUTIONS
				</p>
			</div>
		</section>
	);
}
