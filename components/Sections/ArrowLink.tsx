import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Underlined text link with an arrow, used instead of pill buttons for "see more" style links. */
export default function ArrowLink({
	href,
	children,
	inverted = false,
}: {
	href: string;
	children: React.ReactNode;
	inverted?: boolean;
}) {
	return (
		<Link
			href={href}
			className={`group inline-flex items-center gap-2 text-sm font-medium underline underline-offset-8 transition-colors ${
				inverted
					? "text-white decoration-white/40 hover:decoration-white"
					: "text-brand-navy decoration-brand-navy/25 hover:text-brand-green hover:decoration-brand-green"
			}`}
		>
			{children}
			<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
}
