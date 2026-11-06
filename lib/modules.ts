import type { ModuleSettings, ModuleType, PageKey, PageModule } from "@/app/types/modules";

/** Public path of each page; also what the nav underlines */
export const pagePaths: Record<PageKey, string> = { home: "/", about: "/about-us" };

export const isPageKey = (value: string): value is PageKey => value === "home" || value === "about";

/** Modules that carry the navigation bar themselves */
export const topModuleTypes: ModuleType[] = ["hero", "pageHero"];

/** Inside the module's showFrom / showUntil window (open ends count as always) */
export function isScheduledNow(settings: ModuleSettings | undefined, now: number): boolean {
	const from = settings?.showFrom ? Date.parse(settings.showFrom) : NaN;
	const until = settings?.showUntil ? Date.parse(settings.showUntil) : NaN;
	if (!Number.isNaN(from) && now < from) return false;
	if (!Number.isNaN(until) && now > until) return false;
	return true;
}

/** Which shared lists a layout needs from the backend */
export function sharedNeeds(modules: PageModule[]) {
	const types = new Set(modules.map((m) => m.type));
	return {
		landing: types.has("stats") || types.has("partners") || types.has("practices"),
		news: types.has("news"),
	};
}

// Every type this site renders; the Record makes TypeScript flag a type added to the contract
const knownTypes: Record<ModuleType, true> = {
	hero: true, statement: true, about: true, aboutCards: true, stats: true, services: true, practices: true, partners: true, news: true, contact: true,
	pageHero: true, imageIntro: true, gallery: true, rows: true, checklist: true, cards: true, iconGrid: true, columns: true, disclosure: true,
	richText: true, cta: true, imageText: true, quote: true, faq: true, video: true, figures: true, profile: true, milestones: true, team: true, spacer: true,
};

export const isKnownModuleType = (type: string): type is ModuleType => Object.hasOwn(knownTypes, type);
