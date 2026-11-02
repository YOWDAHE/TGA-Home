"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Hash, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { News } from "@/app/types/news";
import { convertToApiUrl } from "@/lib/utils";
import { parseHashtags } from "@/lib/hashtags";

export { parseHashtags };

const stripHtml = (html: string) =>
	(html ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (date?: string | Date | null) => {
	if (!date) return "";
	const d = new Date(date);
	return Number.isNaN(d.getTime())
		? ""
		: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

interface HashtagNewsModalProps {
	/** The tag that was clicked, without #; null keeps the modal closed */
	tag: string | null;
	/** The story being read, left out of the list */
	excludeId?: number;
	onClose: () => void;
}

/** Lists other stories carrying the clicked hashtag. */
export default function HashtagNewsModal({ tag, excludeId, onClose }: HashtagNewsModalProps) {
	const [stories, setStories] = useState<News[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!tag) return;
		let cancelled = false;
		setLoading(true);
		setStories([]);

		// The search also matches titles and text, so keep only stories that carry the tag itself
		const params = new URLSearchParams({ page: "1", limit: "30", sortBy: "published_date", order: "desc", q: tag });
		fetch(`/api/news?${params}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((result) => {
				if (cancelled) return;
				const wanted = tag.toLowerCase();
				const items: News[] = (result?.data?.news ?? []).map((item: any) => item?.news ?? item);
				setStories(
					items.filter(
						(item) =>
							item.id !== excludeId &&
							parseHashtags(item.hashtags).some((t) => t.toLowerCase() === wanted)
					)
				);
			})
			.catch((error) => console.error("Error fetching tagged news:", error))
			.finally(() => !cancelled && setLoading(false));

		return () => {
			cancelled = true;
		};
	}, [tag, excludeId]);

	return (
		<Dialog open={Boolean(tag)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="flex max-h-[85svh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-3xl border-0 p-0 text-brand-navy sm:rounded-3xl">
				<div className="border-b border-black/5 p-6 pr-14">
					<span className="mb-3 inline-flex items-center gap-1 rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-brand-green">
						<Hash className="h-3.5 w-3.5" />
						{tag}
					</span>
					<DialogTitle className="text-2xl font-semibold tracking-tight">More news like this</DialogTitle>
					<DialogDescription className="mt-1 text-sm text-[#7a8397]">
						{loading
							? "Finding stories..."
							: `${stories.length} other ${stories.length === 1 ? "story" : "stories"} tagged #${tag}`}
					</DialogDescription>
				</div>

				<div className="flex-1 overflow-y-auto p-3 sm:p-4">
					{loading ? (
						<div className="flex items-center justify-center py-16 text-[#606b80]">
							<Loader2 className="h-6 w-6 animate-spin text-brand-green" />
						</div>
					) : stories.length === 0 ? (
						<p className="py-16 text-center text-[#606b80]">No other stories carry this tag yet.</p>
					) : (
						<ul className="space-y-2">
							{stories.map((story) => (
								<li key={story.id}>
									<Link
										href={`/news/${story.id}`}
										onClick={onClose}
										className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-[#f5f7fa]"
									>
										<div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eef1f5] sm:w-28">
											<img
												src={story.visual_content?.length ? convertToApiUrl(story.visual_content[0]) : "/placeholder.jpg"}
												alt={story.title}
												width={112}
												height={80}
												className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
										</div>
										<div className="min-w-0 flex-1 py-0.5">
											<h3 className="line-clamp-2 font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand-green">
												{story.title}
											</h3>
											<p className="mt-1 line-clamp-1 text-sm text-[#606b80]">{stripHtml(story.content)}</p>
											<span className="mt-1.5 flex items-center text-xs text-[#7a8397]">
												<Calendar className="mr-1 h-3 w-3" />
												{formatDate(story.published_date ?? story.createdAt)}
											</span>
										</div>
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
