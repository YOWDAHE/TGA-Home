import { cache } from "react";
import type { Job, JobDetail } from "../types/jobs";

const BACKEND_URL = process.env.BACKEND_URL;

// Careers data changes rarely; a minute of caching keeps the pages fast for visitors and crawlers
const REVALIDATE = 60;

async function getJson<T>(path: string): Promise<T | null> {
	const res = await fetch(`${BACKEND_URL}${path}`, { next: { revalidate: REVALIDATE, tags: ["jobs"] } });
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Backend answered ${res.status} for ${path}`);
	return ((await res.json()) as { data: T }).data;
}

/** Open positions and the departments they span. Throws when the backend can't be reached. */
export async function getOpenJobs() {
	return (await getJson<{ jobs: Job[]; departments: string[] }>("/api/jobs/public")) ?? { jobs: [], departments: [] };
}

/** One job (open or closed), or null when there's no such public job. Shared by a page and its metadata. */
export const getJob = cache(async (slug: string) => {
	// view=0: views are counted by the visitor's browser instead, so cached responses don't skew them
	return getJson<JobDetail>(`/api/jobs/public/${encodeURIComponent(slug)}?view=0`);
});

/** Slugs and dates for the sitemap; empty when the backend can't be reached */
export async function getJobSitemap(): Promise<Array<{ slug: string; updatedAt: string }>> {
	try {
		return (await getJson<Array<{ slug: string; updatedAt: string }>>("/api/jobs/public/sitemap")) ?? [];
	} catch {
		return [];
	}
}
