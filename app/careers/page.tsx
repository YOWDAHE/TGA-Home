import type { Metadata } from "next";
import CareersPage from "@/components/Sections/CareersPage";
import { getOpenJobs } from "../actions/jobs.actions";
import { homeFont } from "../fonts";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { breadcrumbSchema, careersFaq, jobPath, jsonLd } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let count = 0;
	try {
		count = (await getOpenJobs()).jobs.length;
	} catch {
		// The page still renders; the description just leaves the number out
	}
	const openings = count > 0 ? `${count} open ${count === 1 ? "position" : "positions"}: ` : "";
	return {
		...pageMetadata({
			title: "Careers – Law Firm Jobs in Addis Ababa, Ethiopia",
			description: `${openings}lawyer, associate, paralegal and legal internship jobs at ${SITE_NAME}, a leading law firm in Addis Ababa, Ethiopia. See open positions and apply online.`,
			path: "/careers",
			card: { eyebrow: "Careers", title: count > 0 ? `We're hiring: ${count} open ${count === 1 ? "position" : "positions"}` : "Careers at TGA Global Law Firm" },
		}),
		keywords: [
			"law firm jobs Ethiopia",
			"lawyer jobs Addis Ababa",
			"legal jobs Ethiopia",
			"associate lawyer vacancy Ethiopia",
			"paralegal jobs Addis Ababa",
			"legal internship Ethiopia",
			"law graduate jobs Ethiopia",
			"TGA Global Law Firm careers",
		],
	};
}

export default async function page() {
	let data: Awaited<ReturnType<typeof getOpenJobs>> = { jobs: [], departments: [] };
	let unavailable = false;
	try {
		data = await getOpenJobs();
	} catch {
		unavailable = true;
	}

	// The list of open roles (each role's own page carries the JobPosting markup Google for Jobs reads),
	// the breadcrumb and the questions on the page
	const structured = [
		breadcrumbSchema([
			{ name: "Home", path: "/" },
			{ name: "Careers", path: "/careers" },
		]),
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "Careers at TGA Global Law Firm",
			url: `${SITE_URL}/careers`,
			about: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
			...(data.jobs.length
				? {
						mainEntity: {
							"@type": "ItemList",
							itemListElement: data.jobs.map((job, index) => ({
								"@type": "ListItem",
								position: index + 1,
								url: `${SITE_URL}${jobPath(job.slug)}`,
								name: job.title,
							})),
						},
					}
				: {}),
		},
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: careersFaq.map((item) => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: { "@type": "Answer", text: item.answer },
			})),
		},
	];

	return (
		<div className={homeFont.className}>
			{structured.map((entry, index) => (
				<script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(entry) }} />
			))}
			<CareersPage jobs={data.jobs} departments={data.departments} unavailable={unavailable} />
		</div>
	);
}
