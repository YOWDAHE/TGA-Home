// Job openings as the backend serves them (tga-backend/src/controllers/jobs.controller.ts)

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN";
export type WorkplaceType = "ON_SITE" | "HYBRID" | "REMOTE";
export type SalaryPeriod = "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";

export interface Job {
	id: number;
	title: string;
	slug: string;
	department: string | null;
	employment_type: EmploymentType;
	workplace_type: WorkplaceType;
	location_city: string;
	location_region: string | null;
	location_country: string;
	experience: string | null;
	education: string | null;
	summary: string | null;
	/** HTML; empty in listings */
	description: string;
	salary_min: number | null;
	salary_max: number | null;
	salary_currency: string;
	salary_period: SalaryPeriod;
	apply_email: string | null;
	apply_url: string | null;
	apply_instructions: string | null;
	openings: number;
	status: "open" | "closed";
	posted_at: string | null;
	closes_at: string | null;
	meta_description: string | null;
	seo_keywords: string | null;
	createdAt: string;
	updatedAt: string;
	/** Open and not past its closing date */
	is_open: boolean;
}

export type JobSummary = Pick<
	Job,
	"id" | "title" | "slug" | "department" | "employment_type" | "workplace_type" | "location_city" | "closes_at"
>;

export interface JobDetail extends Job {
	other_jobs: JobSummary[];
}
