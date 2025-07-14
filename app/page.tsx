import LandingPage from "@/components/Sections/HomePage";
import React from "react";
import { getLandingPageData } from "./actions/landing.actions";

export default async function page() {
	const data = await getLandingPageData();
	{!data.data && <div>Loading...</div>}
	return <LandingPage data={data.data} />;
	// return <div>Hello</div>;
}
