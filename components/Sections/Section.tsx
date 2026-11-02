import React from "react";
import { DotPattern } from "./Backdrop";

interface SectionProps {
	id?: string;
	pattern?: boolean;
	children: React.ReactNode;
}

/** Home page section sitting directly on the page-wide colour background. */
export default function Section({ id, pattern = false, children }: SectionProps) {
	return (
		<section id={id} className="relative isolate scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
			{pattern && <DotPattern className="-z-10" />}
			<div className="mx-auto max-w-6xl">{children}</div>
		</section>
	);
}
