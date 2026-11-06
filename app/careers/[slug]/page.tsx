import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobDetailPage from "@/components/Sections/JobDetailPage";
import { getJob } from "../../actions/jobs.actions";
import { homeFont } from "../../fonts";
import { pageMetadata } from "@/lib/seo";
import {
	breadcrumbSchema,
	employmentLabels,
	jobPath,
	jobPostingSchema,
	jobSeoDescription,
	jobSeoTitle,
	jsonLd,
} from "@/lib/jobs";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	let job;
	try {
		job = await getJob(slug);
	} catch {
		return { title: "Careers" };
	}
	if (!job) return { title: "Position not found", robots: { index: false, follow: true } };

	return {
		...pageMetadata({
			title: `${jobSeoTitle(job)} | Careers`,
			description: jobSeoDescription(job),
			path: jobPath(job.slug),
			card: {
				eyebrow: job.is_open ? `We're hiring · ${employmentLabels[job.employment_type]}` : "Position closed",
				title: job.title,
				date: null,
			},
			keywords: [
				...(job.seo_keywords?.split(",").map((k) => k.trim()).filter(Boolean) ?? []),
				`${job.title} jobs`,
				`${job.title} ${job.location_city}`,
				"law firm jobs Ethiopia",
				"legal jobs Addis Ababa",
				...(job.department ? [`${job.department} lawyer jobs Ethiopia`] : []),
			],
			// A closed position stays reachable for people with the link, but leaves search results
			noIndex: !job.is_open,
		}),
	};
}

export default async function page({ params }: PageProps) {
	const { slug } = await params;
	let job;
	try {
		job = await getJob(slug);
	} catch {
		throw new Error("The careers service is unavailable");
	}
	if (!job) notFound();

	const structured = [
		breadcrumbSchema([
			{ name: "Home", path: "/" },
			{ name: "Careers", path: "/careers" },
			{ name: job.title, path: jobPath(job.slug) },
		]),
		// Google for Jobs reads this; a closed job must not carry it
		...(job.is_open ? [jobPostingSchema(job)] : []),
	];

	return (
		<div className={homeFont.className}>
			{structured.map((entry, index) => (
				<script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(entry) }} />
			))}
			<JobDetailPage job={job} />
		</div>
	);
}
