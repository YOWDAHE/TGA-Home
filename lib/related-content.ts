// Server-side helpers for the "Related …" rows on the detail pages. News, legal updates and
// resources share one categories table, so the same category id links all three.
import { getLegalUpdates } from "@/app/actions/legal-updates.actions";
import { getNewsByQuery, getRelatedNews as searchNews } from "@/app/actions/news.actions";
import { getResources, Resource } from "@/app/actions/resources.actions";
import type { LegalUpdate } from "@/app/types/legal-updates";
import type { News } from "@/app/types/news";

export const RELATED_COUNT = 3;

/** Takes items from each source in order, skipping duplicates and excluded ids, until there are enough. */
async function pick<T extends { id: number }>(
	sources: Promise<T[]>[],
	excludeId?: number,
	count = RELATED_COUNT
): Promise<T[]> {
	const results = await Promise.allSettled(sources);
	const picked = new Map<number, T>();
	for (const result of results) {
		if (result.status !== "fulfilled") continue;
		for (const item of result.value ?? []) {
			if (picked.size >= count) break;
			if (item && item.id !== excludeId) picked.set(item.id, item);
		}
	}
	return [...picked.values()];
}

interface RelatedOptions {
	categoryId?: number | null;
	excludeId?: number;
}

/** Same practice area first, then the same kind of update, then the latest. */
export function getRelatedUpdates({ categoryId, excludeId, contentType }: RelatedOptions & { contentType?: string }) {
	const query = (extra: { category?: string; content_type?: string }) =>
		getLegalUpdates({ ...extra, limit: RELATED_COUNT + 1, sortBy: "published_date", order: "desc" }).then(
			(res) => res.data.legalUpdates
		);

	return pick<LegalUpdate>(
		[
			categoryId ? query({ category: String(categoryId) }) : Promise.resolve([]),
			contentType ? query({ content_type: contentType }) : Promise.resolve([]),
			query({}),
		],
		excludeId
	);
}

/** Stories sharing the first hashtag, then the same practice area, then the latest. */
export function getRelatedNews({ categoryId, excludeId, hashtags }: RelatedOptions & { hashtags?: string | null }) {
	const query = (extra: { category?: string }) =>
		getNewsByQuery({ ...extra, limit: RELATED_COUNT + 1, sortBy: "published_date", order: "desc" }).then(
			(res) => (res?.data?.news ?? []).map((item: any) => (item?.news ?? item) as News)
		);

	const firstTag = hashtags?.split(/[\s,]+/).map((tag) => tag.replace(/^#/, "")).find(Boolean);
	// The hashtag search wraps each story as { news }
	const byTag = firstTag
		? searchNews(firstTag).then((res) => (res?.data?.news ?? []).map((item: any) => (item?.news ?? item) as News))
		: Promise.resolve([]);

	return pick<News>(
		[byTag, categoryId ? query({ category: String(categoryId) }) : Promise.resolve([]), query({})],
		excludeId
	);
}

/** Documents in the same practice area, then the latest. */
export function getRelatedResources({ categoryId, excludeId }: RelatedOptions) {
	const query = (category_id?: number) =>
		getResources({ limit: RELATED_COUNT + 1, category_id }).then((res) => res.data.documents);

	return pick<Resource>([categoryId ? query(categoryId) : Promise.resolve([]), query()], excludeId);
}
