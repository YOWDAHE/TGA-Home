import { Practice } from "@/app/types/landing";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

interface PracticeAreasProps {
	practices: Practice[];
}

export default function PracticeAreas({ practices }: PracticeAreasProps) {
	return (
		<Section pattern>
			<SectionHeading
				title="Practice areas"
				description="We provide a quality legal service with creative solutions."
			/>

			{/* Swipeable row on phones, grid from tablet up */}
			<div className="-mx-4 mt-14 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
				{practices.map((practice, index) => (
					<Reveal
						key={practice.id}
						delay={(index % 3) * 0.08}
						className="w-[82%] shrink-0 snap-start sm:w-auto"
					>
						<article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(11,27,77,0.35)] sm:p-8">
							<span className="mb-8 inline-flex h-8 w-fit items-center rounded-full bg-brand-tint px-3 text-xs font-medium tabular-nums text-brand-green">
								{String(index + 1).padStart(2, "0")}
							</span>
							<h3 className="text-xl font-semibold tracking-tight text-brand-navy">
								{practice.title}
							</h3>
							<div
								className="mt-3 space-y-2 text-sm leading-relaxed text-[#606b80] [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
								dangerouslySetInnerHTML={{ __html: practice.description }}
							/>
						</article>
					</Reveal>
				))}
			</div>
		</Section>
	);
}
