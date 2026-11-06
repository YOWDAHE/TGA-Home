// Pages built from modules: copies of the backend contract's types
// (tga-backend/src/lib/page-modules.ts). Keep the two in step.

export type PageKey = "home" | "about";

export type Tone = "auto" | "plain" | "muted" | "navy";

export interface ModuleSettings {
	/** Section id for links, e.g. "services" makes /#services scroll here */
	anchor?: string;
	/** Background band; "auto" keeps the module's own look */
	tone?: Tone;
	/** Show on every screen, or only on wide (lg and up) / narrow ones */
	visibleOn?: "all" | "desktop" | "mobile";
	/** ISO dates; outside this window the module is left out */
	showFrom?: string | null;
	showUntil?: string | null;
	/** Admin-only note, never shown publicly */
	note?: string;
}

export interface PageModule<C = any> {
	/** Stable id, unique within the page */
	id: string;
	type: ModuleType;
	/** Name shown on the admin tab; the catalogue name when empty */
	name?: string;
	hidden?: boolean;
	settings: ModuleSettings;
	content: C;
}

/** Any list item may carry `hidden: true` */
export type Hideable = { hidden?: boolean };
/** One of the backend's moduleIcons (lucide names, kebab-case) */
export type ModuleIcon = string;

export interface HeroContent {
	label: string;
	slides: Array<{ title: string; text: string } & Hideable>;
	highlight: { value: string; word: string; caption: string };
	/** The consultation link: text link on wide screens, a button on phones. Older content has none. */
	cta?: { label: string; text: string; href: string };
}

export interface AboutContent {
	label: string;
	title: string;
	description: string;
	lists: Array<{ title: string; html: string } & Hideable>;
	milestones: { label: string; slides: Array<{ html: string; images: string[] } & Hideable> };
	partners: PartnerProfileContent[];
	/** Content saved before partners became a list */
	partner?: PartnerProfileContent;
	hiddenParts?: Array<"intro" | "lists" | "milestones" | "partner">;
}

/** A portrait beside a name and biography; the portrait sits on `imageSide` (left by default) */
export type PartnerProfileContent = { label: string; name: string; photo: string; bio: string; imageSide?: "left" | "right" } & Hideable;

/** The about module with linked cards in place of the two lists */
export interface AboutCardsContent extends Omit<AboutContent, "lists" | "hiddenParts"> {
	cards: Array<{ title: string; html: string; href: string; linkLabel: string } & Hideable>;
	hiddenParts?: Array<"intro" | "cards" | "milestones" | "partner">;
}

export interface ServicesContent {
	label: string;
	title: string;
	description: string;
	items: Array<{ title: string; html: string } & Hideable>;
}

export interface ModuleContent {
	// The original home page sections
	hero: HeroContent;
	statement: { html: string };
	about: AboutContent;
	aboutCards: AboutCardsContent;
	stats: { label: string; title: string; description: string };
	services: ServicesContent;
	practices: { label: string; title: string; description: string };
	partners: { caption: string };
	news: { label: string; title: string; description: string; linkLabel: string; linkHref: string };
	contact: { label: string; title: string; description: string; formTitle: string };

	// The about page's sections, usable anywhere
	pageHero: {
		label: string;
		title: string;
		description: string;
		buttons: Array<{ label: string; href: string; variant: "primary" | "secondary" } & Hideable>;
	};
	imageIntro: { image: string; imageAlt: string; html: string; figures: Array<{ value: string; label: string } & Hideable> };
	gallery: { label: string; title: string; description: string; images: string[]; reverse: boolean };
	rows: { label: string; title: string; description: string; items: Array<{ title: string; html: string } & Hideable> };
	checklist: { label: string; title: string; description: string; intro: string; items: Array<{ text: string } & Hideable> };
	cards: { label: string; title: string; description: string; items: Array<{ icon: ModuleIcon; title: string; html: string } & Hideable> };
	iconGrid: { label: string; title: string; description: string; items: Array<{ icon: ModuleIcon; title: string } & Hideable> };
	columns: { items: Array<{ icon: ModuleIcon; title: string; html: string } & Hideable> };
	/** "{year}" in html becomes the current year */
	disclosure: { title: string; html: string };

	// General building blocks
	richText: { label: string; title: string; html: string; align: "left" | "center" };
	cta: { title: string; html: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
	imageText: {
		label: string;
		title: string;
		html: string;
		image: string;
		imageAlt: string;
		imageSide: "left" | "right";
		buttonLabel: string;
		buttonHref: string;
	};
	quote: { html: string; name: string; role: string; photo: string };
	faq: { label: string; title: string; description: string; items: Array<{ question: string; html: string } & Hideable> };
	video: { label: string; title: string; description: string; url: string };
	figures: { label: string; title: string; description: string; items: Array<{ value: string; label: string } & Hideable> };
	profile: Omit<PartnerProfileContent, "hidden">;
	milestones: { label: string; slides: Array<{ html: string; images: string[] } & Hideable> };
	team: { label: string; title: string; description: string; members: Array<{ name: string; role: string; photo: string } & Hideable> };
	spacer: { size: "sm" | "md" | "lg"; line: boolean };
}

export type ModuleType = keyof ModuleContent;

export type ModuleCategory = "Firm sections" | "Page sections" | "Text" | "Media" | "People" | "Layout";

export interface ModuleDefinition<T extends ModuleType = ModuleType> {
	type: T;
	name: string;
	description: string;
	category: ModuleCategory;
	/** Extra words the admin's search matches */
	keywords: string[];
	/** Uses a list shared across pages */
	shared?: "stats" | "practices" | "partners" | "contactUs" | "news";
	/** Only one per page makes sense */
	single?: boolean;
	/** Belongs at the top of a page; it carries the navigation bar */
	top?: boolean;
	/** Honours settings.tone */
	toneable?: boolean;
	defaults: ModuleContent[T];
}

/** GET /api/landing/modules */
export interface ModuleCatalogue {
	pages: Array<{ key: PageKey; name: string; path: string }>;
	modules: ModuleDefinition[];
	icons: string[];
}

/** GET /api/landing/pages/:key */
export interface PageLayout {
	key: PageKey;
	modules: PageModule[];
	updatedAt: string | null;
}
