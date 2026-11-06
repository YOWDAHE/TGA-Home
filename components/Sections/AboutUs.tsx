"use client";

import Section from "./Section";
import React from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Milestones from "./Milestones";
import PartnerProfile from "./PartnerProfile";
import { ArrowRight } from "lucide-react";
import type { AboutCardsContent, AboutContent } from "@/app/types/modules";
import { ButtonLink, hiddenItemClass, inlineHtml, useShown, type ToneProps } from "@/components/modules/shared";

// Admin HTML. Lists become hairline-divided rows; bold phrases stand out in full navy.
const listClass =
	"mt-6 [&_ul]:border-b [&_ul]:border-brand-navy/15 [&_ol]:border-b [&_ol]:border-brand-navy/15 [&_li]:border-t [&_li]:border-brand-navy/15 [&_li]:py-4 [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-[#5a6377] [&_strong]:font-medium [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline";

// Card text is cut to two lines; the full story is behind the card's link
const cardTextClass =
	"mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-[#5a6377] [&_p]:inline [&_ul]:inline [&_ol]:inline [&_li]:inline [&_li]:after:content-['_·_'] [&_li:last-child]:after:content-none [&_strong]:font-medium [&_strong]:text-brand-navy";
// Four cards fill a row on wide screens; fewer share it
const cardColumns = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

/** Linked cards: a title, two lines of text and a View more link, the whole card clickable. */
function AboutCards({ cards, className }: { cards: AboutCardsContent["cards"]; className: string }) {
	return (
		<div className={`grid gap-4 sm:grid-cols-2 ${cardColumns[Math.min(cards.length, 4)]} ${className}`}>
			{cards.map((card, index) => (
				<Reveal key={index} delay={(index % 4) * 0.06} className={`h-full${hiddenItemClass(card)}`}>
					<ButtonLink
						href={card.href || "#"}
						className="group flex h-full flex-col rounded-sm bg-white p-6 ring-1 ring-brand-navy/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:ring-brand-navy/25 sm:p-7"
					>
						<h3 className="text-lg font-semibold leading-snug tracking-tight text-brand-navy sm:text-xl">{card.title}</h3>
						<div className={cardTextClass} dangerouslySetInnerHTML={{ __html: card.html }} />
						<span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-brand-green">
							{card.linkLabel || "View more"}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</span>
					</ButtonLink>
				</Reveal>
			))}
		</div>
	);
}

/** Introduction, then two highlighted lists or linked cards, the milestones slideshow and the
 *  partners; `hiddenParts` leaves any of them out. */
const AboutUs = ({ content, tone }: { content: AboutContent | AboutCardsContent } & ToneProps) => {
	const hidden = new Set<string>(content.hiddenParts ?? []);
	const lists = useShown("lists" in content ? content.lists : []);
	const cards = useShown("cards" in content ? content.cards : []);
	// Each part after the first visible one keeps the gap above it
	const showIntro = !hidden.has("intro");
	const showCards = !hidden.has("cards") && cards.length > 0;
	const showLists = (!hidden.has("lists") && lists.length > 0) || showCards;
	const showMilestones = !hidden.has("milestones") && !!content.milestones;
	const partners = useShown(content.partners ?? (content.partner ? [content.partner] : []));
	const showPartner = !hidden.has("partner") && partners.length > 0;

	return (
		<Section tone={tone}>
			{showIntro && (
				<SectionHeading
					inverted={tone === "navy"}
					label={content.label}
					title={content.title}
					description={<span dangerouslySetInnerHTML={{ __html: inlineHtml(content.description) }} />}
				/>
			)}

			{/* Lists, set as hairline-divided columns */}
			{showCards && <AboutCards cards={cards} className={showIntro ? "mt-12 lg:mt-16" : ""} />}

			{showLists && !showCards && (
				<div className={`grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-12 ${showIntro ? "mt-16 lg:mt-20" : ""}`}>
					{lists.map((group, groupIndex) => (
						<Reveal
							key={groupIndex}
							delay={groupIndex * 0.1}
							className={`${groupIndex % 2 === 0 ? "lg:col-span-5 lg:col-start-2" : "lg:col-span-5"}${hiddenItemClass(group)}`}
						>
							<h3 className="text-xl font-semibold tracking-tight text-brand-navy sm:text-2xl">{group.title}</h3>
							<div className={listClass} dangerouslySetInnerHTML={{ __html: group.html }} />
						</Reveal>
					))}
				</div>
			)}

			{/* Highlights slideshow */}
			{showMilestones && (
				<Milestones
					label={content.milestones.label}
					slides={content.milestones.slides}
					className={showIntro || showLists ? "mt-24 sm:mt-32" : ""}
				/>
			)}

			{/* Partners, one profile after another */}
			{showPartner && (
				<div className={`space-y-24 sm:space-y-32 ${showIntro || showLists || showMilestones ? "mt-24 sm:mt-32" : ""}`}>
					{partners.map((partner, index) => (
						<PartnerProfile key={index} {...partner} className={hiddenItemClass(partner).trim()} />
					))}
				</div>
			)}
		</Section>
	);
};

export default AboutUs;
