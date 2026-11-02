import React from "react";
import AboutPage from "@/components/Sections/AboutPage";
import { homeFont } from "../fonts";

export default function page() {
	return (
		<div className={homeFont.className}>
			<AboutPage />
		</div>
	);
}
