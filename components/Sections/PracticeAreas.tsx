import Carousel from "../Carousel";
import { practiceAreas } from "../practice-area-carousel";

export default function PracticeAreas() {
	return (
		<section className="py-16 bg-[#f6f7f8]">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-4xl font-bold text-gray-900 mb-4">PRACTICE AREAS</h2>
				<p className="text-xl text-gray-600 mb-12">
					WE PROVIDE A QUALITY LEGAL SERVICE WITH CREATIVE SOLUTIONS
				</p>

				<Carousel
					items={practiceAreas}
					renderItem={(area) => (
						<div className=" border border-white/20 rounded-2xl shadow-2xl p-10 min-h-[320px] h-[400px] flex flex-col items-center justify-center transition-all duration-300 w-[400px]">
							<h3 className="text-2xl font-bold mb-6 text-white text-center tracking-wide">
								{area.title}
							</h3>
							<ul className="space-y-3 text-teal-200 text-base">
								{area.items.map((item, i) => (
									<li key={i} className="flex items-center">
										<span className="w-2 h-2 bg-teal-400 rounded-full mr-3 inline-block"></span>
										{item}
									</li>
								))}
							</ul>
						</div>
					)}
					className="!min-h-0"
				/>
			</div>
		</section>
	);
}
