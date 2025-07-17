import LandingPage from "@/components/Sections/HomePage";
import React from "react";
import { getLandingPageData } from "./actions/landing.actions";
import { getNewsByQuery } from "./actions/news.actions";
import { getResources } from "./actions/resources.actions";

export default async function page() {
	try {
		const [landingData, newsResponse, resourcesResponse] = await Promise.all([
			getLandingPageData(),
			getNewsByQuery({ limit: 4, sortBy: 'published_date', order: 'desc' }),
			getResources({ limit: 4 })
		]);

		if (!landingData.data) {
			return <div>Loading...</div>;
		}

		return (
			<LandingPage 
				data={landingData.data} 
				news={newsResponse.data.news}
				resources={resourcesResponse.data.documents}
			/>
		);
	} catch (error) {
		console.error('Error fetching page data:', error);
		return <div>Error loading page data</div>;
	}
}
