import type { MetadataRoute } from "next";
import { getJobSitemap } from "./actions/jobs.actions";
import { jobPath } from "@/lib/jobs";

const baseUrl = "https://tgagloballawfirm.com";

// Rebuilt every 10 minutes so new job openings reach search engines quickly
export const revalidate = 600;

const pages: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
	{ path: "", changeFrequency: "daily", priority: 1 },
	{ path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
	{ path: "/careers", changeFrequency: "daily", priority: 0.8 },
	{ path: "/news", changeFrequency: "daily", priority: 0.8 },
	{ path: "/legal-updates", changeFrequency: "daily", priority: 0.8 },
	{ path: "/resources", changeFrequency: "weekly", priority: 0.7 },
	{ path: "/corporate-law-ethiopia", changeFrequency: "monthly", priority: 0.9 },
	{ path: "/real-estate-law-ethiopia", changeFrequency: "monthly", priority: 0.9 },
	{ path: "/diaspora-legal-services", changeFrequency: "monthly", priority: 0.9 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();
	// Only open jobs are listed; closed ones carry noindex
	const jobs = await getJobSitemap();
	return [
		...pages.map((page) => ({
			url: `${baseUrl}${page.path}`,
			lastModified: now,
			changeFrequency: page.changeFrequency,
			priority: page.priority,
		})),
		...jobs.map((job) => ({
			url: `${baseUrl}${jobPath(job.slug)}`,
			lastModified: new Date(job.updatedAt),
			changeFrequency: "weekly" as const,
			priority: 0.7,
		})),
	];
}
