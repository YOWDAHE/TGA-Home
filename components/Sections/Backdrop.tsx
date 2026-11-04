import React from "react";

/** Kept for older callers; the redesigned pages no longer draw a dot pattern. */
export function DotPattern(_props: { className?: string }) {
	return null;
}

/** Plain white page background behind the whole page. */
export function FrostedColors() {
	return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white" />;
}
