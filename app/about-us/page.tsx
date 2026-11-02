import React from "react";
import AboutPage from "@/components/Sections/AboutPage";
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

export default function page() {
	return (
		<div className={homeFont.className}>
			<AboutPage />
		</div>
	);
}
