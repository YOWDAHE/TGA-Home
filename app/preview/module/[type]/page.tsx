import { notFound } from "next/navigation";
import PreviewClient from "@/components/modules/PreviewClient";
import { getModuleCatalogue, getPageData } from "@/app/actions/pages.actions";
import { homeFont } from "@/app/fonts";
import { isKnownModuleType, isPageKey } from "@/lib/modules";
import type { PageModule } from "@/app/types/modules";

export const dynamic = "force-dynamic";

/** One module with the catalogue's default content, for the admin's "Add module" gallery.
 *  `?page=about` makes a top module's nav underline that page. */
export default async function ModulePreview({
	params,
	searchParams,
}: {
	params: Promise<{ type: string }>;
	searchParams: Promise<{ page?: string | string[] }>;
}) {
	const [{ type }, query] = await Promise.all([params, searchParams]);
	if (!isKnownModuleType(type)) notFound();
	const catalogue = await getModuleCatalogue();
	const definition = catalogue.modules.find((m) => m.type === type);
	if (!definition) notFound();

	const module: PageModule = { id: `preview-${definition.type}`, type: definition.type, settings: {}, content: definition.defaults };
	const page = typeof query.page === "string" && isPageKey(query.page) ? query.page : "home";
	const data = await getPageData([module], { contact: definition.shared === "contactUs", preview: true });

	return (
		<div className={homeFont.className}>
			<PreviewClient
				mode="module"
				page={page}
				initialModules={[module]}
				data={data}
				names={{ [definition.type]: definition.name }}
				now={Date.now()}
			/>
		</div>
	);
}
