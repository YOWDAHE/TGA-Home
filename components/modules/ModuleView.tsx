"use client";

import React from "react";
import Hero from "@/components/Sections/Hero";
import Statement from "@/components/Sections/Statement";
import AboutUs from "@/components/Sections/AboutUs";
import Statistics from "@/components/Sections/Statistics";
import Services from "@/components/Sections/Services";
import PracticeAreas from "@/components/Sections/PracticeAreas";
import Partners from "@/components/Sections/Partners";
import News from "@/components/Sections/News";
import ContactUs from "@/components/Sections/ContactUs";
import type { PageData } from "@/app/actions/pages.actions";
import type { ModuleContent, ModuleType, PageModule, Tone } from "@/app/types/modules";
import { isKnownModuleType } from "@/lib/modules";
import { Cards, Checklist, Columns, Disclosure, Gallery, IconGrid, ImageIntro, PageHeroModule, Rows } from "./PageSections";
import { Cta, Faq, Figures, ImageText, MilestonesModule, Profile, Quote, RichText, Spacer, Team, Video } from "./Blocks";

interface RenderProps<T extends ModuleType> {
	content: ModuleContent[T];
	/** settings.tone, unless "auto" (the module keeps its own) */
	tone?: Exclude<Tone, "auto">;
	data: PageData;
	/** Path of the page, for the nav in top modules */
	currentHref: string;
}

type Renderers = { [T in ModuleType]: (props: RenderProps<T>) => React.ReactNode };

// One renderer per module type. Modules that aren't toneable ignore `tone`.
const renderers: Renderers = {
	hero: ({ content, currentHref }) => <Hero content={content} currentHref={currentHref} />,
	statement: ({ content }) => <Statement content={content} />,
	about: ({ content, tone }) => <AboutUs content={content} tone={tone} />,
	aboutCards: ({ content, tone }) => <AboutUs content={content} tone={tone} />,
	stats: ({ content, data }) => <Statistics content={content} stats={data.stats ?? []} />,
	services: ({ content, tone }) => <Services content={content} tone={tone} />,
	practices: ({ content, tone, data }) => <PracticeAreas content={content} tone={tone} practices={data.practices ?? []} />,
	partners: ({ content, tone, data }) => <Partners content={content} tone={tone} partners={data.partners ?? []} />,
	news: ({ content, tone, data }) => (
		<News content={content} tone={tone} news={data.news ?? []} resources={data.resources ?? []} />
	),
	contact: ({ content, data }) => <ContactUs content={content} contactUs={data.contactUs ?? []} />,

	pageHero: ({ content, currentHref }) => <PageHeroModule content={content} currentHref={currentHref} />,
	imageIntro: ({ content }) => <ImageIntro content={content} />,
	gallery: ({ content }) => <Gallery content={content} />,
	rows: ({ content, tone }) => <Rows content={content} tone={tone} />,
	checklist: ({ content, tone }) => <Checklist content={content} tone={tone} />,
	cards: ({ content, tone }) => <Cards content={content} tone={tone} />,
	iconGrid: ({ content, tone }) => <IconGrid content={content} tone={tone} />,
	columns: ({ content, tone }) => <Columns content={content} tone={tone} />,
	disclosure: ({ content }) => <Disclosure content={content} />,

	richText: ({ content, tone }) => <RichText content={content} tone={tone} />,
	cta: ({ content }) => <Cta content={content} />,
	imageText: ({ content, tone }) => <ImageText content={content} tone={tone} />,
	quote: ({ content, tone }) => <Quote content={content} tone={tone} />,
	faq: ({ content, tone }) => <Faq content={content} tone={tone} />,
	video: ({ content, tone }) => <Video content={content} tone={tone} />,
	figures: ({ content, tone }) => <Figures content={content} tone={tone} />,
	profile: ({ content, tone }) => <Profile content={content} tone={tone} />,
	milestones: ({ content }) => <MilestonesModule content={content} />,
	team: ({ content, tone }) => <Team content={content} tone={tone} />,
	spacer: ({ content }) => <Spacer content={content} />,
};

/** Renders one module's section. Unknown types (a newer backend) render nothing. */
export default function ModuleView({ module, data, currentHref }: { module: PageModule; data: PageData; currentHref: string }) {
	if (!isKnownModuleType(module.type) || !module.content || typeof module.content !== "object") return null;
	const render = renderers[module.type] as (props: RenderProps<ModuleType>) => React.ReactNode;
	const tone = module.settings?.tone && module.settings.tone !== "auto" ? module.settings.tone : undefined;
	return <>{render({ content: module.content, tone, data, currentHref })}</>;
}
