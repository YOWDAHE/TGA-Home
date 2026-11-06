// Shared wording and formatting for job openings, and the structured data that lets Google show a
// job in its job search (https://developers.google.com/search/docs/appearance/structured-data/job-posting).
import type { EmploymentType, Job, SalaryPeriod, WorkplaceType } from "@/app/types/jobs";
import { SITE_NAME, SITE_URL, plainSummary } from "@/lib/seo";

export const employmentLabels: Record<EmploymentType, string> = {
	FULL_TIME: "Full-time",
	PART_TIME: "Part-time",
	CONTRACTOR: "Contract",
	TEMPORARY: "Temporary",
	INTERN: "Internship",
};

export const workplaceLabels: Record<WorkplaceType, string> = {
	ON_SITE: "On-site",
	HYBRID: "Hybrid",
	REMOTE: "Remote",
};

const periodLabels: Record<SalaryPeriod, string> = {
	HOUR: "per hour",
	DAY: "per day",
	WEEK: "per week",
	MONTH: "per month",
	YEAR: "per year",
};

const countryNames: Record<string, string> = { ET: "Ethiopia", KE: "Kenya", US: "United States", GB: "United Kingdom" };
export const countryName = (code: string) => countryNames[code?.toUpperCase()] ?? code;

/** "Addis Ababa, Ethiopia" */
export const jobPlace = (job: Pick<Job, "location_city" | "location_country">) =>
	[job.location_city, countryName(job.location_country)].filter(Boolean).join(", ");

export const jobPath = (slug: string) => `/careers/${slug}`;

/** "ETB 40,000 – 60,000 per month", or null without a figure */
export function formatSalary(job: Pick<Job, "salary_min" | "salary_max" | "salary_currency" | "salary_period">) {
	const { salary_min: min, salary_max: max } = job;
	if (min == null && max == null) return null;
	const n = (v: number) => v.toLocaleString("en-US");
	const amount = min != null && max != null && min !== max ? `${n(min)} – ${n(max)}` : min != null && max == null ? `from ${n(min)}` : `${n((max ?? min)!)}`;
	return `${job.salary_currency} ${amount} ${periodLabels[job.salary_period] ?? ""}`.trim();
}

export function formatDay(date?: string | null) {
	if (!date) return "";
	const d = new Date(date);
	return Number.isNaN(d.getTime())
		? ""
		: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Africa/Addis_Ababa" });
}

/** "Posted today", "Posted 3 days ago", "Posted on May 2, 2026" */
export function postedLabel(date?: string | null) {
	if (!date) return "";
	const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
	if (days <= 0) return "Posted today";
	if (days === 1) return "Posted yesterday";
	if (days < 30) return `Posted ${days} days ago`;
	return `Posted on ${formatDay(date)}`;
}

/** "Closes in 5 days", "Closes tomorrow", "Closes on …", or null without a closing date */
export function closingLabel(date?: string | null) {
	if (!date) return null;
	const ms = new Date(date).getTime() - Date.now();
	if (ms <= 0) return `Closed on ${formatDay(date)}`;
	const days = Math.ceil(ms / 86_400_000);
	if (days <= 1) return "Closes today";
	if (days === 2) return "Closes tomorrow";
	if (days <= 14) return `Closes in ${days} days`;
	return `Closes on ${formatDay(date)}`;
}

/** mailto: link with a subject that names the role and its reference */
export function applyMailto(job: Pick<Job, "id" | "title" | "apply_email">) {
	if (!job.apply_email) return null;
	const subject = `Application: ${job.title} (Ref. TGA-${job.id})`;
	return `mailto:${job.apply_email}?subject=${encodeURIComponent(subject)}`;
}

/** The page title used in search results, e.g. "Associate Lawyer – Addis Ababa, Ethiopia" */
export const jobSeoTitle = (job: Pick<Job, "title" | "location_city" | "location_country" | "workplace_type">) =>
	`${job.title} – ${job.workplace_type === "REMOTE" ? `Remote, ${countryName(job.location_country)}` : jobPlace(job)}`;

export function jobSeoDescription(job: Job) {
	if (job.meta_description?.trim()) return job.meta_description.trim();
	const facts = [employmentLabels[job.employment_type], job.department, jobPlace(job)].filter(Boolean).join(" · ");
	const lead = job.summary?.trim() || plainSummary(job.description, 120);
	return plainSummary(`${lead} ${facts}. Apply to ${SITE_NAME}.`, 160);
}

/** JSON for a <script type="application/ld+json">, safe inside HTML */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

const iso = (date?: string | null) => {
	if (!date) return undefined;
	const d = new Date(date);
	return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

/** Google's JobPosting markup. Only for open jobs: closed ones must not carry it. */
export function jobPostingSchema(job: Job) {
	const url = `${SITE_URL}${jobPath(job.slug)}`;
	const remote = job.workplace_type === "REMOTE";
	const facts = [
		job.experience && `<li><strong>Experience:</strong> ${escapeHtml(job.experience)}</li>`,
		job.education && `<li><strong>Education:</strong> ${escapeHtml(job.education)}</li>`,
	].filter(Boolean);
	const description = [
		job.summary ? `<p>${escapeHtml(job.summary)}</p>` : "",
		job.description,
		facts.length ? `<ul>${facts.join("")}</ul>` : "",
		job.apply_instructions ? `<p>${escapeHtml(job.apply_instructions)}</p>` : "",
	].join("");

	const salary =
		job.salary_min != null || job.salary_max != null
			? {
					"@type": "MonetaryAmount",
					currency: job.salary_currency,
					value: {
						"@type": "QuantitativeValue",
						...(job.salary_min != null && job.salary_max != null && job.salary_min !== job.salary_max
							? { minValue: job.salary_min, maxValue: job.salary_max }
							: { value: job.salary_min ?? job.salary_max }),
						unitText: job.salary_period,
					},
				}
			: undefined;

	return {
		"@context": "https://schema.org/",
		"@type": "JobPosting",
		title: job.title,
		description,
		url,
		identifier: { "@type": "PropertyValue", name: SITE_NAME, value: `TGA-${job.id}` },
		datePosted: iso(job.posted_at ?? job.createdAt),
		validThrough: iso(job.closes_at),
		employmentType: job.employment_type,
		hiringOrganization: {
			"@type": "Organization",
			name: SITE_NAME,
			sameAs: SITE_URL,
			logo: `${SITE_URL}/Images/logo/TGA_LOGO_IMG.png`,
		},
		industry: "Legal Services",
		...(job.department ? { occupationalCategory: job.department } : {}),
		totalJobOpenings: job.openings,
		directApply: false,
		...(remote
			? {
					jobLocationType: "TELECOMMUTE",
					applicantLocationRequirements: { "@type": "Country", name: countryName(job.location_country) },
				}
			: {
					jobLocation: {
						"@type": "Place",
						address: {
							"@type": "PostalAddress",
							addressLocality: job.location_city,
							...(job.location_region ? { addressRegion: job.location_region } : {}),
							addressCountry: job.location_country,
						},
					},
				}),
		...(salary ? { baseSalary: salary } : {}),
	};
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`,
		})),
	};
}

function escapeHtml(text: string) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** The questions on the careers page, also given to search engines as an FAQ */
export const careersFaq = [
	{
		question: "How do I apply for a job at TGA Global Law Firm?",
		answer:
			"Open the position you are interested in and follow its application instructions: most roles ask for a CV and a cover letter by email or through an online form. Please mention the job title and its reference in your application.",
	},
	{
		question: "Where are the positions based?",
		answer:
			"Most roles are based at our office in Addis Ababa, Ethiopia. Each listing states whether the position is on-site, hybrid or remote.",
	},
	{
		question: "Do you offer internships for law students and graduates?",
		answer:
			"Yes. Internship openings are listed here when available. You can also send a general application with your CV, and we will contact you when a suitable opportunity opens.",
	},
	{
		question: "There is no opening that matches my profile. Can I still apply?",
		answer:
			"Yes. Send your CV and the area of law you are interested in to our email address, and we will keep your application on file for future openings.",
	},
];
