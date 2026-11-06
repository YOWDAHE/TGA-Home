import React from "react";
import PageRenderer from "@/components/modules/PageRenderer";
import { getPageData, getPageLayout } from "./actions/pages.actions";
import { homeFont } from "./fonts";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
	title: "TGA Global Law Firm LL.P — Ethiopia's Most Reputable and Leading Law Firm",
	absoluteTitle: true,
	description:
		"TGA Global Law Firm LL.P provides corporate, commercial, real estate and dispute resolution services from Addis Ababa, for clients in Ethiopia and abroad.",
	path: "/",
	card: { eyebrow: "Law firm · Addis Ababa", title: "Ethiopia's most reputable and top-ranked legal firm" },
});

export const dynamic = "force-dynamic";

export default async function page() {
	try {
		const layout = await getPageLayout("home");
		// The home page has always loaded the landing data (it also counts the visit)
		const data = await getPageData(layout.modules, { landing: true });

		return (
			<div className={homeFont.className}>
				<PageRenderer page="home" modules={layout.modules} data={data} now={Date.now()} />
			</div>
		);
	} catch (error) {
		console.error('Error fetching page data:', error);
		// Hand over to app/error.tsx, which offers a retry
		throw error;
	}
}
