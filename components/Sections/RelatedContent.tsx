"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, Eye, FileText } from "lucide-react";
import type { LegalUpdate } from "@/app/types/legal-updates";
import type { News } from "@/app/types/news";
import type { Resource } from "@/app/actions/resources.actions";
import { convertToApiUrl } from "@/lib/utils";
import { CONTENT_TYPE_LABELS } from "@/lib/content-types";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export { CONTENT_TYPE_LABELS };

export const CONTENT_TYPE_COLORS: Record<string, string> = {
	alert: "bg-red-50 text-red-700",
	analysis: "bg-[#eef1fb] text-brand-navy",
	guide: "bg-amber-50 text-amber-700",
	update: "bg-brand-tint text-brand-green",
};

const cardClass =
	"group flex h-full flex-col rounded-sm bg-white ring-1 ring-brand-navy/10 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:ring-brand-navy/25";
const titleClass =
	"line-clamp-2 font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green";

const formatDate = (date?: string | Date | null) => {
	if (!date) return "";
	const d = new Date(date);
	return Number.isNaN(d.getTime())
		? ""
		: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

function Row({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
	return (
		<section className={`mx-auto max-w-6xl px-4 sm:px-6 ${last ? "pb-20 sm:pb-28" : "pb-16 sm:pb-20"}`}>
			<SectionHeading title={title} />
			<div className="mt-10 grid gap-4 md:grid-cols-3">{children}</div>
		</section>
	);
}

function UpdateCard({ item }: { item: LegalUpdate }) {
	return (
		<Link href={`/legal-updates/${item.slug}`} className={`${cardClass} p-6`}>
			<span
				className={`mb-4 inline-flex self-start rounded-sm px-3 py-1 text-xs font-medium ${
					CONTENT_TYPE_COLORS[item.content_type] || "bg-brand-tint/50 text-brand-navy/60"
				}`}
			>
				{CONTENT_TYPE_LABELS[item.content_type] || item.content_type}
			</span>
			<h3 className={`${titleClass} mb-2 text-lg`}>{item.title}</h3>
			{item.summary && <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-brand-navy/75">{item.summary}</p>}
			<div className="mt-auto flex items-center justify-between text-xs text-brand-navy/50">
				<span className="flex items-center">
					<Calendar className="mr-1 h-3 w-3" />
					{formatDate(item.published_date)}
				</span>
				<ArrowUpRight className="h-4 w-4 text-brand-green transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
			</div>
		</Link>
	);
}

function NewsCard({ item }: { item: News }) {
	return (
		<Link href={`/news/${item.id}`} className={`${cardClass} overflow-hidden`}>
			<div className="h-56 overflow-hidden bg-brand-tint/50">
				<img
					src={item.visual_content?.length ? convertToApiUrl(item.visual_content[0]) : "/placeholder.jpg"}
					alt={item.title}
					width={400}
					height={250}
					className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
			</div>
			<div className="flex flex-1 flex-col p-5">
				<h3 className={`${titleClass} mb-3`}>{item.title}</h3>
				<span className="mt-auto flex items-center text-xs text-brand-navy/50">
					<Calendar className="mr-1 h-3 w-3" />
					{formatDate(item.published_date ?? item.createdAt)}
				</span>
			</div>
		</Link>
	);
}

function ResourceCard({ item }: { item: Resource }) {
	return (
		<Link href={`/resources/${item.id}`} className={`${cardClass} p-6`}>
			<span className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-brand-tint text-brand-green">
				<FileText className="h-5 w-5" strokeWidth={1.75} />
			</span>
			<h3 className={`${titleClass} mb-2 text-lg`}>{item.title}</h3>
			{item.description && (
				<p className="mb-5 line-clamp-2 text-sm leading-relaxed text-brand-navy/75">{item.description}</p>
			)}
			<div className="mt-auto flex items-center justify-between text-xs text-brand-navy/50">
				<span className="flex items-center gap-3">
					<span className="flex items-center">
						<Calendar className="mr-1 h-3 w-3" />
						{formatDate(item.createdAt)}
					</span>
					<span className="flex items-center">
						<Eye className="mr-1 h-3 w-3" />
						{item.view_count.toLocaleString()}
					</span>
				</span>
				<ArrowUpRight className="h-4 w-4 text-brand-green transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
			</div>
		</Link>
	);
}

export type RelatedKind = "updates" | "news" | "resources";

interface RelatedContentProps {
	updates?: LegalUpdate[];
	news?: News[];
	resources?: Resource[];
	/** Which rows to show, top to bottom; empty rows are skipped. */
	order: RelatedKind[];
}

/** "Related …" rows at the bottom of the news, resource and legal update pages. */
export default function RelatedContent({ updates = [], news = [], resources = [], order }: RelatedContentProps) {
	const rows = order.filter(
		(kind) => ({ updates: updates.length, news: news.length, resources: resources.length })[kind] > 0
	);

	return (
		<>
			{rows.map((kind, rowIndex) => {
				const last = rowIndex === rows.length - 1;
				if (kind === "updates") {
					return (
						<Row key={kind} title="Related legal updates" last={last}>
							{updates.map((item, index) => (
								<Reveal key={item.id} delay={index * 0.06}>
									<UpdateCard item={item} />
								</Reveal>
							))}
						</Row>
					);
				}
				if (kind === "news") {
					return (
						<Row key={kind} title="Related news" last={last}>
							{news.map((item, index) => (
								<Reveal key={item.id} delay={index * 0.06}>
									<NewsCard item={item} />
								</Reveal>
							))}
						</Row>
					);
				}
				return (
					<Row key={kind} title="Related resources" last={last}>
						{resources.map((item, index) => (
							<Reveal key={item.id} delay={index * 0.06}>
								<ResourceCard item={item} />
							</Reveal>
						))}
					</Row>
				);
			})}
		</>
	);
}
