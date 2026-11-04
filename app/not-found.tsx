import type { Metadata } from "next";
import ErrorScreen from "@/components/Sections/ErrorScreen";

export const metadata: Metadata = {
	title: "Page not found",
	robots: { index: false },
};

export default function NotFound() {
	return (
		<ErrorScreen
			label="404 · Page not found"
			title="We couldn't find that page"
			description="The page may have moved, or the link may be out of date. Try one of the sections below, or head back to the home page."
		/>
	);
}
