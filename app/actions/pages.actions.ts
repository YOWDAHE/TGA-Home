import type { ModuleCatalogue, PageKey, PageLayout, PageModule } from "../types/modules";
import type { ContactUs, LandingPageResponse, Partner, Practice, Stat } from "../types/landing";
import type { News } from "../types/news";
import type { Resource } from "./resources.actions";
import { getLandingPageData } from "./landing.actions";
import { getNewsByQuery } from "./news.actions";
import { getResources } from "./resources.actions";
import { getContactInfo } from "./contact-info";
import { sharedNeeds } from "@/lib/modules";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

/** The shared lists modules read (stats, partners, practices, contact details, news feed) */
export interface PageData {
	stats?: Stat[];
	partners?: Partner[];
	practices?: Practice[];
	contactUs?: ContactUs[];
	news?: News[];
	resources?: Resource[];
}

async function getLandingJson<T>(path: string): Promise<T> {
	// Uncached: a publish in the admin shows on the next visit
	const res = await fetch(`${BACKEND_URL}/api/landing${path}`, { cache: "no-store" });
	if (!res.ok) throw new Error(`GET /api/landing${path} failed with status ${res.status}`);
	const body = await res.json();
	if (!body?.data) throw new Error(`GET /api/landing${path} returned no data`);
	return body.data as T;
}

/** A page's published layout (hidden modules and items already removed by the backend) */
export async function getPageLayout(key: PageKey): Promise<PageLayout> {
	const layout = await getLandingJson<PageLayout>(`/pages/${key}`);
	return { ...layout, modules: Array.isArray(layout.modules) ? layout.modules : [] };
}

/** Module names, descriptions and default content */
export const getModuleCatalogue = () => getLandingJson<ModuleCatalogue>("/modules");

/**
 * Fetches only the shared lists the modules use. GET /landing counts a page view, so it is
 * requested only when asked (the home page, as before) or a module shows stats, partners or
 * practices; otherwise the contact details come from the lighter /landing/contact. Previews pass
 * `preview` so they don't count.
 */
export async function getPageData(
	modules: PageModule[],
	force: { landing?: boolean; news?: boolean; contact?: boolean; preview?: boolean } = {}
): Promise<PageData> {
	const needs = sharedNeeds(modules);
	const wantLanding = force.landing || needs.landing;
	const wantNews = force.news || needs.news;

	const [landing, news, resources, contactUs] = await Promise.all([
		// Admin previews read the lists without counting a visit
		wantLanding ? (force.preview ? getLandingJson<LandingPageResponse["data"]>("?preview=1").then((data) => ({ data })) : getLandingPageData()) : null,
		wantNews ? getNewsByQuery({ limit: 4, sortBy: "published_date", order: "desc" }) : null,
		wantNews ? getResources({ limit: 4 }) : null,
		wantLanding || force.contact === false ? null : getContactInfo(),
	]);

	if (landing && !landing.data) throw new Error("Landing page data is missing");

	return {
		stats: landing?.data.stats ?? [],
		partners: landing?.data.partners ?? [],
		practices: landing?.data.practices ?? [],
		contactUs: landing?.data.contactUs ?? contactUs ?? undefined,
		news: news?.data.news ?? [],
		resources: resources?.data.documents ?? [],
	};
}
