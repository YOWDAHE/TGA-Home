import React from "react";
import PageRenderer from "@/components/modules/PageRenderer";
import { getPageData, getPageLayout } from "../actions/pages.actions";
import { homeFont } from "../fonts";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
	title: "About Us",
	description:
		"Meet TGA Global Law Firm LL.P: our story, our partners and the values behind one of Ethiopia's most reputable law firms.",
	path: "/about-us",
	card: { eyebrow: "About us", title: "The people and story behind TGA Global" },
});

// Rendered per request so a publish in the admin shows right away
export const dynamic = "force-dynamic";

export default async function page() {
	const layout = await getPageLayout("about");
	// Only fetches /landing (which counts a visit) when a module shows stats, partners or practices
	const data = await getPageData(layout.modules);

	return (
		<div className={homeFont.className}>
			<PageRenderer page="about" modules={layout.modules} data={data} now={Date.now()} />
		</div>
	);
}
