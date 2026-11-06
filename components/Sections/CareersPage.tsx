"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Briefcase, Clock, MapPin, Search, X } from "lucide-react";
import type { EmploymentType, Job } from "@/app/types/jobs";
import { useContactInfo } from "@/contexts/ContactInfoContext";
import { primaryEmail } from "@/lib/contact";
import { careersFaq, closingLabel, employmentLabels, jobPath, postedLabel } from "@/lib/jobs";
import PageHero from "./PageHero";
import Footer from "./Footer";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";

interface CareersPageProps {
	jobs: Job[];
	departments: string[];
	/** The jobs couldn't be loaded; the page still explains how to apply */
	unavailable?: boolean;
}

// Filters are square chips; the selected one is filled navy (as on Legal Updates)
const chipClass = (active: boolean) =>
	`shrink-0 rounded-sm px-4 py-2 text-sm transition-colors ${
		active ? "bg-brand-navy text-white" : "bg-white text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-tint"
	}`;

const reasons = [
	{
		title: "Work that crosses borders",
		text: "Advise national and multinational clients on corporate, commercial, investment and dispute matters across Ethiopia and the wider African continent.",
	},
	{
		title: "Learn from leaders of the profession",
		text: "Work alongside partners who hold leading roles in African legal institutions and take part in shaping new legislation.",
	},
	{
		title: "An international network",
		text: "Collaborate with the firm's international alliances and partner firms on cross-border transactions and arbitration.",
	},
	{
		title: "Grow with the firm",
		text: "Take on real responsibility early, with mentoring, varied practice areas and room to build your own expertise.",
	},
];

const steps = [
	{ title: "Apply", text: "Send your CV and a short cover letter through the link or email on the job's page." },
	{ title: "Review", text: "Our team reads every application and contacts shortlisted candidates." },
	{ title: "Interviews", text: "Meet the partners and the team you would work with; some roles include a written exercise." },
	{ title: "Offer", text: "Successful candidates receive an offer and a plan for their first weeks with us." },
];


/** The careers page: open positions with search and filters, why join, how hiring works and an FAQ. */
export default function CareersPage({ jobs, departments, unavailable }: CareersPageProps) {
	const email = primaryEmail(useContactInfo());
	const [query, setQuery] = useState("");
	const [department, setDepartment] = useState<string | null>(null);
	const [type, setType] = useState<EmploymentType | null>(null);

	const types = useMemo(() => [...new Set(jobs.map((j) => j.employment_type))], [jobs]);
	const shown = useMemo(() => {
		const q = query.trim().toLowerCase();
		return jobs.filter(
			(job) =>
				(!department || job.department === department) &&
				(!type || job.employment_type === type) &&
				(!q || [job.title, job.department, job.summary, job.location_city].some((v) => v?.toLowerCase().includes(q)))
		);
	}, [jobs, query, department, type]);
	const filtered = query || department || type;
	const generalApplication = `mailto:${email}?subject=${encodeURIComponent("General application")}`;

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip bg-white text-brand-navy antialiased">
				<PageHero
					currentHref="/careers"
					label="Careers · Addis Ababa, Ethiopia"
					title="Careers at TGA Global Law Firm"
					description="Open lawyer, associate, paralegal and internship positions at one of Ethiopia's leading law firms, working on corporate, commercial and cross-border matters across Africa."
				>
					<a
						href="#open-positions"
						className="inline-flex items-center gap-2 rounded-sm bg-brand-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-green"
					>
						{jobs.length > 0 ? `See ${jobs.length} open ${jobs.length === 1 ? "position" : "positions"}` : "How to apply"}
						<ArrowRight className="h-4 w-4" />
					</a>
				</PageHero>

				{/* Open positions */}
				<section id="open-positions" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
					<div className="mx-auto max-w-5xl">
						<SectionHeading
							align="left"
							label="Open positions"
							title={jobs.length > 0 ? "Join our team" : "No open positions right now"}
							description={
								jobs.length > 0
									? "Find a role that matches your experience and apply directly from its page."
									: "We are not hiring for a specific role at the moment, but we always welcome talented lawyers and law graduates."
							}
						/>

						{jobs.length > 1 && (
							<div className="mt-10 space-y-4">
								<label className="flex items-center gap-2 rounded-sm bg-white p-1.5 pl-4 ring-1 ring-brand-navy/15 focus-within:ring-2 focus-within:ring-brand-green/40">
									<Search className="h-4 w-4 shrink-0 text-brand-navy/40" />
									<span className="sr-only">Search positions</span>
									<input
										type="search"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Search by title, practice area or city"
										className="min-w-0 flex-1 bg-transparent py-2 text-brand-navy placeholder:text-brand-navy/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
									/>
									{query && (
										<button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="rounded-sm p-2 text-brand-navy/50 hover:text-brand-navy">
											<X className="h-4 w-4" />
										</button>
									)}
								</label>
								{(departments.length > 1 || types.length > 1) && (
									<div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
										<button type="button" className={chipClass(!department && !type)} onClick={() => (setDepartment(null), setType(null))}>
											All
										</button>
										{departments.length > 1 &&
											departments.map((d) => (
												<button key={d} type="button" className={chipClass(department === d)} onClick={() => setDepartment(department === d ? null : d)}>
													{d}
												</button>
											))}
										{types.length > 1 &&
											types.map((t) => (
												<button key={t} type="button" className={chipClass(type === t)} onClick={() => setType(type === t ? null : t)}>
													{employmentLabels[t]}
												</button>
											))}
									</div>
								)}
							</div>
						)}

						{jobs.length > 0 ? (
							<ul className="mt-8 space-y-3">
								{shown.map((job, index) => (
									<motion.li
										key={job.id}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.45, ease: easeOut, delay: Math.min(index, 8) * 0.04 }}
									>
										<JobCard job={job} />
									</motion.li>
								))}
								{shown.length === 0 && filtered && (
									<li className="rounded-sm bg-brand-tint/40 p-8 text-center text-sm text-brand-navy/70">
										No positions match your search.{" "}
										<button
											type="button"
											className="font-medium text-brand-green underline underline-offset-4"
											onClick={() => (setQuery(""), setDepartment(null), setType(null))}
										>
											Show all positions
										</button>
									</li>
								)}
							</ul>
						) : (
							<Reveal className="mt-10 rounded-sm bg-brand-tint/40 p-8 sm:p-10">
								<p className="max-w-2xl leading-relaxed text-brand-navy/75">
									{unavailable
										? "We couldn't load the open positions just now. Please try again in a moment, or send us a general application."
										: "Send us your CV and a short note about the area of law you're interested in, and we'll get in touch when a suitable position opens."}
								</p>
								<a
									href={generalApplication}
									className="mt-6 inline-flex items-center gap-2 rounded-sm bg-brand-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-green"
								>
									Send a general application
									<ArrowRight className="h-4 w-4" />
								</a>
							</Reveal>
						)}
					</div>
				</section>

				{/* Why join */}
				<Section tone="muted">
					<SectionHeading label="Why TGA" title="Why lawyers build their careers here" />
					<div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
						{reasons.map((reason, index) => (
							<Reveal key={reason.title} delay={(index % 2) * 0.08} className="rounded-sm bg-white p-6 ring-1 ring-brand-navy/10 sm:p-8">
								<h3 className="text-lg font-semibold tracking-tight text-brand-navy sm:text-xl">{reason.title}</h3>
								<p className="mt-3 leading-relaxed text-[#5a6377]">{reason.text}</p>
							</Reveal>
						))}
					</div>
				</Section>

				{/* How hiring works */}
				<Section>
					<SectionHeading label="Hiring process" title="How we hire" />
					<ol className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{steps.map((step, index) => (
							<Reveal key={step.title} delay={index * 0.06}>
								<li className="border-t border-brand-navy/15 pt-5">
									<span className="text-sm font-medium tabular-nums text-brand-green">0{index + 1}</span>
									<h3 className="mt-2 text-lg font-semibold tracking-tight text-brand-navy">{step.title}</h3>
									<p className="mt-2 text-sm leading-relaxed text-[#5a6377]">{step.text}</p>
								</li>
							</Reveal>
						))}
					</ol>
				</Section>

				{/* Questions */}
				<Section tone="muted">
					<SectionHeading label="Questions" title="Applying to TGA" />
					<div className="mx-auto mt-12 max-w-3xl divide-y divide-brand-navy/10 border-y border-brand-navy/10">
						{careersFaq.map((item) => (
							<details key={item.question} className="group py-5">
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-brand-navy [&::-webkit-details-marker]:hidden">
									<h3 className="text-base sm:text-lg">{item.question}</h3>
									<span className="text-xl leading-none text-brand-green transition-transform group-open:rotate-45" aria-hidden>
										+
									</span>
								</summary>
								<p className="mt-3 leading-relaxed text-[#5a6377]">{item.answer}</p>
							</details>
						))}
					</div>
					<p className="mt-10 text-center text-sm text-[#5a6377]">
						Other questions? Write to{" "}
						<a href={`mailto:${email}`} className="font-medium text-brand-green underline underline-offset-4">
							{email}
						</a>
						.
					</p>
				</Section>

				<Footer />
			</div>
		</MotionConfig>
	);
}

function JobCard({ job }: { job: Job }) {
	const closing = closingLabel(job.closes_at);
	return (
		<Link
			href={jobPath(job.slug)}
			className="group flex items-center gap-4 rounded-sm bg-white p-5 ring-1 ring-brand-navy/10 transition hover:ring-brand-navy/30 sm:gap-6 sm:p-6"
		>
			<div className="min-w-0 flex-1">
				{job.department && <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-green">{job.department}</p>}
				<h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green sm:text-xl">
					{job.title}
				</h3>
				{job.summary && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5a6377]">{job.summary}</p>}
				<p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-brand-navy/65">
					<span className="inline-flex items-center gap-1.5">
						<MapPin className="h-3.5 w-3.5" />
						{job.workplace_type === "REMOTE" ? "Remote" : job.location_city}
						{job.workplace_type === "HYBRID" && " · Hybrid"}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Briefcase className="h-3.5 w-3.5" />
						{employmentLabels[job.employment_type]}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Clock className="h-3.5 w-3.5" />
						{closing ?? postedLabel(job.posted_at)}
					</span>
				</p>
			</div>
			<span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-brand-green sm:inline-flex">
				View role
				<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
			</span>
		</Link>
	);
}
