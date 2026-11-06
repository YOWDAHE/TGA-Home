import { notFound } from "next/navigation";
import PreviewClient from "@/components/modules/PreviewClient";
import { getModuleCatalogue, getPageData, getPageLayout } from "@/app/actions/pages.actions";
import { homeFont } from "@/app/fonts";
import { isPageKey } from "@/lib/modules";

export const dynamic = "force-dynamic";

/** A whole page for the admin's live preview: starts with the published layout, then shows
 *  whatever the admin posts. */
export default async function PagePreview({ params }: { params: Promise<{ key: string }> }) {
	const { key } = await params;
	if (!isPageKey(key)) notFound();

	const [layout, catalogue] = await Promise.all([getPageLayout(key), getModuleCatalogue()]);
	// Every shared list, since the admin may add any module while editing
	const data = await getPageData(layout.modules, { landing: true, news: true, preview: true });
	const names = Object.fromEntries(catalogue.modules.map((m) => [m.type, m.name]));

	return (
		<div className={homeFont.className}>
			<PreviewClient mode="page" page={key} initialModules={layout.modules} data={data} names={names} now={Date.now()} />
		</div>
	);
}
