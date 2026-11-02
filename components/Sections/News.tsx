import React from "react";
import Section from "./Section";
import { ArrowRight, Calendar, FileText, User } from "lucide-react";
import type { News } from "@/app/types/news";
import type { Resource } from "@/app/actions/resources.actions";
import { convertToApiUrl } from "@/lib/utils";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

interface NewsProps {
	news: News[];
	resources: Resource[];
}

// Helper function to format date
const formatDate = (dateString: string | Date) => {
	return new Date(dateString).toLocaleDateString();
};

const formatNewsCardDate = (item: News) => {
	const primary = item.published_date;
	if (primary != null && String(primary).trim() !== "") {
		const d = new Date(primary as string | Date);
		if (!Number.isNaN(d.getTime())) return d.toLocaleDateString();
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

export default function News({ news, resources }: NewsProps) {
	return (
		<Section id="news">
			{/* Latest News */}
			<SectionHeading
				title="Latest news"
				description="Follow the latest news in the industry here."
			/>
			<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{news.slice(0, 4).map((item, index) => (
					<Reveal key={item.id} delay={index * 0.08}>
						<Link
							href={`/news/${item.id}`}
							className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl transition-colors duration-300 hover:bg-brand-tint"
						>
							<div className="relative aspect-[6/5] overflow-hidden bg-[#dfe5ee]">
								<img
									src={getImageUrl(item)}
									alt={item.title}
									onError={(e) => {
										e.currentTarget.style.visibility = "hidden";
									}}
									className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
								/>
							</div>
							<div className="flex flex-1 flex-col p-5">
								<div className="mb-2 flex items-center gap-3 text-xs text-[#8a93a6]">
									<span className="flex items-center">
										<Calendar className="mr-1.5 h-3 w-3" />
										{formatNewsCardDate(item)}
									</span>
									<span className="flex min-w-0 items-center">
										<User className="mr-1.5 h-3 w-3 shrink-0" />
										<span className="truncate">TGA Global Law Firm LL.P</span>
									</span>
								</div>
								<h3 className="line-clamp-2 font-semibold leading-snug tracking-tight text-brand-navy">
									{item.title}
								</h3>
								<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
									{stripHtml(item.content)}
								</p>
							</div>
						</Link>
					</Reveal>
				))}
			</div>
			<Reveal className="mt-8 flex justify-center">
				<SeeMore href="/news" />
			</Reveal>

			{/* Resources */}
			<div className="mt-24 sm:mt-32">
				<SectionHeading
					title="Resources"
					description="Look through our articles and updates here."
				/>
				<div className="mt-14 grid gap-4 md:grid-cols-2">
					{resources.slice(0, 4).map((resource, index) => (
						<Reveal key={resource.id} delay={(index % 2) * 0.08}>
							<Link
								href={`/resources/${resource.id}`}
								className="group flex h-full items-start gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(11,27,77,0.35)] sm:p-6"
							>
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-green">
									<FileText className="h-5 w-5" strokeWidth={1.75} />
								</span>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-3">
										<h3 className="line-clamp-1 font-semibold tracking-tight text-brand-navy">
											{resource.title}
										</h3>
										<span className="shrink-0 rounded-full bg-[#f4f6fa] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#606b80]">
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
			className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-[#f7f9fc]"
		>
			See more
			<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
}
