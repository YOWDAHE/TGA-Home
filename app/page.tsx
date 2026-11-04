import LandingPage from "@/components/Sections/HomePage";
import React from "react";
import { getLandingPageData } from "./actions/landing.actions";
import { getNewsByQuery } from "./actions/news.actions";
import { getResources } from "./actions/resources.actions";
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
		// const [landingData, newsResponse, resourcesResponse] = await Promise.all([
		// 	getLandingPageData(),
		// 	getNewsByQuery({ limit: 4, sortBy: 'published_date', order: 'desc' }),
		// 	getResources({ limit: 4 })
		// ]);
		const landingData = await getLandingPageData();
		const newsResponse = await getNewsByQuery({ limit: 4, sortBy: 'published_date', order: 'desc' });
		const resourcesResponse = await getResources({ limit: 4 });

		if (!landingData.data?.homeContent) {
			throw new Error("Landing page data is missing");
		}

		return (
			<div className={homeFont.className}>
				<LandingPage
					data={landingData.data}
					news={newsResponse.data.news}
					resources={resourcesResponse.data.documents}
				/>
			</div>
		);
	} catch (error) {
		console.error('Error fetching page data:', error);
		// Hand over to app/error.tsx, which offers a retry
		throw error;
	}
}
