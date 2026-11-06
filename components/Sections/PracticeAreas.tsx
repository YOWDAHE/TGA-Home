import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Practice } from "@/app/types/landing";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { ModuleContent } from "@/app/types/modules";
import type { ToneProps } from "@/components/modules/shared";

interface PracticeAreasProps extends ToneProps {
	practices: Practice[];
	/** Heading text; the cards are the shared Practice areas list */
	content: ModuleContent["practices"];
}

const descriptionClass =
	"space-y-2 [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc [&_strong]:font-medium [&_strong]:text-brand-navy";

// Card headers alternate between a green-led and a navy-led version of the hero's brand wash
const washes = [
	"bg-[linear-gradient(110deg,rgba(0,122,94,0.55)_0%,#E6F2EE_60%,rgba(11,27,77,0.25)_100%)]",
	"bg-[linear-gradient(110deg,rgba(11,27,77,0.45)_0%,#E6F2EE_60%,rgba(0,122,94,0.3)_100%)]",
];

/** A small copy of the hero's slanted glass rows, drawn on the top of each card. */
function CardArt({ index }: { index: number }) {
	return (
		<div aria-hidden className={`relative h-24 overflow-hidden bg-white ${washes[index % washes.length]}`}>
			<div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:-translate-y-2">
				{[0, 1].map((row) => (
					<div
						key={row}
						className="absolute -left-[10%] h-[70%] w-[120%] [transform:skewY(14deg)]"
						style={{ top: `${-20 + row * 45}%`, zIndex: 2 - row }}
					>
						{[0, 1, 2, 3].map((panel) => (
							<div
								key={panel}
								className="absolute top-0 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.55)_100%)]"
								style={{ left: `${(panel - (row % 2) / 2) * 36}%`, width: "34%" }}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

/** Every practice area at once, as a grid of cards: three or four across on desktop, two on tablets,
 *  one on phones. */
export default function PracticeAreas({ practices, content, tone }: PracticeAreasProps) {
	// Three columns when the areas split evenly into threes (6, 9) and not into fours, so no row is left short
	const columns = practices.length % 3 === 0 && practices.length % 4 !== 0 ? 3 : 4;

	return (
		<Section tone={tone}>
			<SectionHeading
				inverted={tone === "navy"}
				label={content.label}
				title={content.title}
				description={content.description || undefined}
			/>

			<div className={`mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
				{practices.map((practice, index) => (
					<Reveal key={practice.id} delay={(index % columns) * 0.06} className="h-full">
						<article className="tone-light group flex h-full flex-col overflow-hidden rounded-sm bg-white ring-1 ring-brand-navy/10 transition-[transform] duration-300 hover:-translate-y-1 hover:ring-brand-navy/25">
							<CardArt index={index} />
							<div className="flex flex-1 flex-col p-6">
								<h3 className="text-lg font-semibold leading-snug tracking-tight text-brand-navy sm:text-xl">
									{practice.title}
								</h3>
								<div
									className={`mt-2 text-sm leading-relaxed text-brand-navy/70 ${descriptionClass}`}
									dangerouslySetInnerHTML={{ __html: practice.description }}
								/>
								<Link
									href="#contact"
									className="group/link mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-brand-green"
								>
									Discuss your matter
									<ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
								</Link>
							</div>
						</article>
					</Reveal>
				))}
			</div>
		</Section>
	);
}
