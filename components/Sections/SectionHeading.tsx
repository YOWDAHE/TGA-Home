import React from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	align?: "left" | "center";
	className?: string;
}

/** Short headline with a smaller line underneath, shared by the home page sections. */
export default function SectionHeading({
	title,
	description,
	align = "center",
	className = "",
}: SectionHeadingProps) {
	const centered = align === "center";

	return (
		<Reveal className={`mx-auto text-center ${centered ? "" : "sm:mx-0 sm:text-left"} max-w-2xl ${className}`}>
			<h2 className={`mx-auto max-w-[16rem] text-balance text-3xl font-semibold tracking-tight text-brand-navy min-[400px]:max-w-[18rem] sm:max-w-none sm:text-5xl ${centered ? "" : "sm:mx-0"}`}>
				{title}
			</h2>
			{description && (
				<p className={`mx-auto mt-4 max-w-[19rem] text-pretty text-base leading-relaxed text-[#606b80] min-[400px]:max-w-[21rem] sm:max-w-none sm:text-lg ${centered ? "" : "sm:mx-0"}`}>
					{description}
				</p>
			)}
		</Reveal>
	);
}
