import React from "react";
import Section from "./Section";
import type { News } from "@/app/types/news";
import type { Resource } from "@/app/actions/resources.actions";
import { convertToApiUrl } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Calendar, FileText, User } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ArrowLink from "./ArrowLink";
import type { ModuleContent } from "@/app/types/modules";
import type { ToneProps } from "@/components/modules/shared";

interface NewsProps extends ToneProps {
	news: News[];
	resources: Resource[];
	/** Heading text; the stories come from the news and resources feeds */
	content: ModuleContent["news"];
}

// Helper function to format date
const formatDate = (dateString: string | Date) =>
	new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const formatNewsCardDate = (item: News) => {
	const primary = item.published_date;
	if (primary != null && String(primary).trim() !== "") {
		const d = new Date(primary as string | Date);
		if (!Number.isNaN(d.getTime())) return formatDate(d);
	}
	return formatDate(item.createdAt);
};

// News content may be stored as HTML; the card excerpt only needs the text
const stripHtml = (html: string) =>
	(html ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// Helper function to get image URL
const getImageUrl = (newsItem: News) => {
	if (newsItem.visual_content && newsItem.visual_content.length > 0) {
		return convertToApiUrl(newsItem.visual_content[0]);
	}
	return "/placeholder.jpg";
};

export default function News({ news, resources, content, tone }: NewsProps) {
	const [featured, ...rest] = news.slice(0, 4);

	return (
		<Section tone={tone}>
			<SectionHeading
				inverted={tone === "navy"}
				label={content.label}
				title={content.title}
				description={content.description || undefined}
				action={content.linkLabel && content.linkHref ? <ArrowLink href={content.linkHref}>{content.linkLabel}</ArrowLink> : undefined}
			/>

			{/* One featured story with its photo, then the next three as text rows */}
			{featured && (
				<div className="mt-12 grid gap-x-8 gap-y-10 lg:mt-16 lg:grid-cols-12">
					<Reveal className="lg:col-span-7">
						<Link href={`/news/${featured.id}`} className="group block">
							<div className="relative aspect-[16/10] overflow-hidden bg-[#dfe5ee]">
								<img
									src={getImageUrl(featured)}
									alt={featured.title}
									onError={(e) => {
										e.currentTarget.style.visibility = "hidden";
									}}
									className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								/>
							</div>
							<p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-[#8a93a6]">
								{formatNewsCardDate(featured)}
							</p>
							<h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-brand-navy transition-colors group-hover:text-brand-green sm:text-3xl">
								{featured.title}
							</h3>
							<p className="mt-4 line-clamp-3 max-w-2xl leading-relaxed text-[#5a6377]">
								{stripHtml(featured.content)}
							</p>
						</Link>
					</Reveal>

					<div className="border-b border-brand-navy/15 lg:col-span-5">
						{rest.map((item, index) => (
							<Reveal key={item.id} delay={index * 0.06}>
								<Link href={`/news/${item.id}`} className="group block border-t border-brand-navy/15 py-6 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-6">
									<p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a93a6]">
										{formatNewsCardDate(item)}
									</p>
									<h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green sm:text-xl">
										{item.title}
									</h3>
									<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5a6377]">
										{stripHtml(item.content)}
									</p>
								</Link>
							</Reveal>
						))}
					</div>
				</div>
			)}

			{/* Resources */}
			<div className="mt-24 sm:mt-32">
				<SectionHeading
					inverted={tone === "navy"}
					title="Resources"
					description="Look through our articles and updates here."
				/>
				<div className="mt-14 grid gap-4 md:grid-cols-2">
					{resources.slice(0, 4).map((resource, index) => (
						<Reveal key={resource.id} delay={(index % 2) * 0.08}>
							<Link
								href={`/resources/${resource.id}`}
								className="tone-light group flex h-full items-start gap-4 rounded-sm bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(11,27,77,0.35)] sm:p-6"
							>
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-brand-tint text-brand-green">
									<FileText className="h-5 w-5" strokeWidth={1.75} />
								</span>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-3">
										<h3 className="line-clamp-1 font-semibold tracking-tight text-brand-navy">
											{resource.title}
										</h3>
										<span className="shrink-0 rounded-sm bg-[#f4f6fa] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#606b80]">
											{resource.filename.split(".").pop()?.toUpperCase() || "PDF"}
										</span>
									</div>
									<p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
										{resource.description ||
											"Essential legal resources for your business needs"}
									</p>
									<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a93a6]">
										<span className="flex items-center">
											<User className="mr-1.5 h-3 w-3" />
											TGA Global Law Firm LL.P
										</span>
										<span className="flex items-center">
											<Calendar className="mr-1.5 h-3 w-3" />
											{formatDate(resource.createdAt)}
										</span>
									</div>
								</div>
							</Link>
						</Reveal>
					))}
				</div>
				<Reveal className="mt-8 flex justify-center">
					<SeeMore href="/resources" />
				</Reveal>
			</div>
		</Section>
	);
}

function SeeMore({ href }: { href: string }) {
	return (
		<Link
			href={href}
			className="group inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-medium text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-[#f7f9fc]"
		>
			See more
			<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
}
