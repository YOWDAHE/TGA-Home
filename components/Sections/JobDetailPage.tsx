"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MotionConfig } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	ArrowUpRight,
	Banknote,
	Briefcase,
	Building2,
	CalendarClock,
	Check,
	GraduationCap,
	Link2,
	Mail,
	MapPin,
	Users,
} from "lucide-react";
import type { JobDetail } from "@/app/types/jobs";
import { SITE_URL } from "@/lib/seo";
import {
	applyMailto,
	closingLabel,
	employmentLabels,
	formatDay,
	formatSalary,
	jobPath,
	jobPlace,
	postedLabel,
	workplaceLabels,
} from "@/lib/jobs";
import PageHero from "./PageHero";
import Footer from "./Footer";
import Reveal from "./Reveal";

const descriptionClass =
	"rich-text-content text-brand-navy/75 [&_h1]:text-brand-navy [&_h2]:text-brand-navy [&_h3]:text-brand-navy [&_h4]:text-brand-navy [&_strong]:text-brand-navy [&_a]:text-brand-green [&_a]:underline";

const primaryButton =
	"inline-flex items-center justify-center gap-2 rounded-sm bg-brand-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-green";
const secondaryButton =
	"inline-flex items-center justify-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint";

/** A job's page: what the role is, the facts beside it, how to apply, and other openings. */
export default function JobDetailPage({ job }: { job: JobDetail }) {
	const url = `${SITE_URL}${jobPath(job.slug)}`;
	const mailto = applyMailto(job);
	const salary = formatSalary(job);
	const closing = closingLabel(job.closes_at);
	const place = job.workplace_type === "REMOTE" ? `Remote · ${jobPlace(job).split(", ").pop()}` : jobPlace(job);

	// One view per visit, counted from the browser (the server's copy of the page is cached)
	useEffect(() => {
		const key = `job-viewed-${job.id}`;
		try {
			if (sessionStorage.getItem(key)) return;
			sessionStorage.setItem(key, "1");
		} catch {
			// Storage blocked: count anyway
		}
		fetch(`/api-backend/jobs/public/${encodeURIComponent(job.slug)}`, { keepalive: true }).catch(() => {});
	}, [job.id, job.slug]);

	const facts = [
		{ icon: Briefcase, label: "Job type", value: employmentLabels[job.employment_type] },
		{ icon: Building2, label: "Workplace", value: workplaceLabels[job.workplace_type] },
		{ icon: MapPin, label: "Location", value: place },
		job.department && { icon: Users, label: "Practice area", value: job.department },
		job.experience && { icon: Check, label: "Experience", value: job.experience },
		job.education && { icon: GraduationCap, label: "Education", value: job.education },
		salary && { icon: Banknote, label: "Salary", value: salary },
		job.openings > 1 && { icon: Users, label: "Openings", value: `${job.openings} positions` },
		job.closes_at && { icon: CalendarClock, label: job.is_open ? "Apply by" : "Closed on", value: formatDay(job.closes_at) },
	].filter(Boolean) as Array<{ icon: typeof Briefcase; label: string; value: string }>;

	const applyButtons = job.is_open && (
		<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
			{job.apply_url && (
				<a href={job.apply_url} target="_blank" rel="noopener" className={primaryButton}>
					Apply now
					<ArrowUpRight className="h-4 w-4" />
				</a>
			)}
			{mailto && (
				<a href={mailto} className={job.apply_url ? secondaryButton : primaryButton}>
					<Mail className="h-4 w-4" />
					Apply by email
				</a>
			)}
		</div>
	);

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip bg-white text-brand-navy antialiased">
				<PageHero
					currentHref="/careers"
					label={job.department ? `Careers · ${job.department}` : "Careers"}
					title={job.title}
					description={job.summary ?? undefined}
				>
					<ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
						{[place, employmentLabels[job.employment_type], workplaceLabels[job.workplace_type]]
							.filter((v, i, all) => all.indexOf(v) === i)
							.map((chip) => (
								<li key={chip} className="rounded-sm bg-white/80 px-3 py-1.5 text-brand-navy ring-1 ring-brand-navy/10 backdrop-blur">
									{chip}
								</li>
							))}
					</ul>
					<p className="mt-4 text-sm text-brand-navy/60">
						{job.is_open ? [postedLabel(job.posted_at), closing].filter(Boolean).join(" · ") : "This position is closed"}
					</p>
					{job.is_open && <div className="mx-auto mt-7 flex max-w-md justify-center [&>div]:w-full sm:[&>div]:w-auto">{applyButtons}</div>}
				</PageHero>

				{!job.is_open && (
					<div className="px-4 sm:px-6">
						<div className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-sm bg-amber-50 p-5 text-amber-900 ring-1 ring-amber-200 sm:flex-row sm:items-center sm:justify-between sm:p-6">
							<p>
								<strong className="font-semibold">Applications for this position have closed.</strong> Take a look at our current openings.
							</p>
							<Link href="/careers" className="inline-flex shrink-0 items-center gap-1.5 font-medium text-amber-900 underline underline-offset-4">
								Open positions
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				)}

				<section className="px-4 py-14 sm:px-6 sm:py-20">
					<div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
						<article>
							<nav aria-label="Breadcrumb" className="mb-8 text-sm text-brand-navy/55">
								<ol className="flex flex-wrap items-center gap-1.5">
									<li>
										<Link href="/" className="hover:text-brand-navy">
											Home
										</Link>
									</li>
									<li aria-hidden>/</li>
									<li>
										<Link href="/careers" className="hover:text-brand-navy">
											Careers
										</Link>
									</li>
									<li aria-hidden>/</li>
									<li className="text-brand-navy" aria-current="page">
										{job.title}
									</li>
								</ol>
							</nav>
							<Reveal>
								<div className={descriptionClass} dangerouslySetInnerHTML={{ __html: job.description }} />
							</Reveal>

							{job.is_open && (
								<Reveal className="mt-14 rounded-sm bg-brand-tint/40 p-6 sm:p-8">
									<h2 className="text-xl font-semibold tracking-tight text-brand-navy sm:text-2xl">How to apply</h2>
									<p className="mt-3 leading-relaxed text-[#5a6377]">
										{job.apply_instructions ||
											`Send your CV and a cover letter${job.apply_email ? ` to ${job.apply_email}` : " through the application form"}, mentioning “${job.title}” and reference TGA-${job.id}.`}
									</p>
									<div className="mt-6">{applyButtons}</div>
								</Reveal>
							)}
						</article>

						<aside className="lg:sticky lg:top-28 lg:self-start">
							<div className="rounded-sm bg-white p-6 ring-1 ring-brand-navy/10">
								<h2 className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">Job details</h2>
								<dl className="mt-5 space-y-4">
									{facts.map((fact) => (
										<div key={fact.label} className="flex gap-3">
											<fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy/40" />
											<div>
												<dt className="text-xs text-brand-navy/55">{fact.label}</dt>
												<dd className="text-sm font-medium text-brand-navy">{fact.value}</dd>
											</div>
										</div>
									))}
								</dl>
								{job.is_open && <div className="mt-6 hidden border-t border-brand-navy/10 pt-6 lg:block">{applyButtons}</div>}
							</div>
							<ShareLinks url={url} title={job.title} />
						</aside>
					</div>
				</section>

				{job.other_jobs.length > 0 && (
					<section className="bg-brand-tint/40 px-4 py-14 sm:px-6 sm:py-20">
						<div className="mx-auto max-w-5xl">
							<div className="flex items-end justify-between gap-4">
								<h2 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">Other open positions</h2>
								<Link href="/careers" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-brand-green sm:inline-flex">
									All positions
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
							<ul className="mt-8 grid gap-3 md:grid-cols-3">
								{job.other_jobs.map((other) => (
									<li key={other.id}>
										<Link
											href={jobPath(other.slug)}
											className="group flex h-full flex-col rounded-sm bg-white p-5 ring-1 ring-brand-navy/10 transition hover:ring-brand-navy/30"
										>
											{other.department && <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand-green">{other.department}</span>}
											<span className="mt-1.5 font-semibold leading-snug text-brand-navy group-hover:text-brand-green">{other.title}</span>
											<span className="mt-auto pt-4 text-sm text-brand-navy/60">
												{other.workplace_type === "REMOTE" ? "Remote" : other.location_city} · {employmentLabels[other.employment_type]}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					</section>
				)}

				<div className="px-4 py-10 text-center sm:px-6">
					<Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy/70 hover:text-brand-navy">
						<ArrowLeft className="h-4 w-4" />
						Back to all positions
					</Link>
				</div>

				<Footer />
			</div>
		</MotionConfig>
	);
}

/** Share on LinkedIn, Telegram, WhatsApp or copy the link: how most legal jobs in Ethiopia travel */
function ShareLinks({ url, title }: { url: string; title: string }) {
	const [copied, setCopied] = useState(false);
	const text = encodeURIComponent(`${title} at TGA Global Law Firm`);
	const link = encodeURIComponent(url);
	const targets = [
		{ name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}` },
		{ name: "Telegram", href: `https://t.me/share/url?url=${link}&text=${text}` },
		{ name: "WhatsApp", href: `https://wa.me/?text=${text}%20${link}` },
	];
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard blocked: nothing to do
		}
	};
	return (
		<div className="mt-4 rounded-sm bg-white p-6 ring-1 ring-brand-navy/10">
			<h2 className="text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/55">Share this job</h2>
			<div className="mt-4 flex flex-wrap gap-2">
				{targets.map((t) => (
					<a
						key={t.name}
						href={t.href}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-sm px-3 py-1.5 text-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint"
					>
						{t.name}
					</a>
				))}
				<button
					type="button"
					onClick={copy}
					className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint"
				>
					{copied ? <Check className="h-3.5 w-3.5 text-brand-green" /> : <Link2 className="h-3.5 w-3.5" />}
					{copied ? "Copied" : "Copy link"}
				</button>
			</div>
		</div>
	);
}
