import React from "react";

/** Faint navy dot grid that fades out towards the edges. */
export function DotPattern({ className = "" }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={`pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(11,27,77,0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)] ${className}`}
		/>
	);
}

const blobs = [
	{ className: "-left-24 -top-16 h-72 w-72 sm:-left-32 sm:-top-24 sm:h-[32rem] sm:w-[32rem] bg-brand-green/20" },
	{ className: "-right-28 top-1/3 h-64 w-64 sm:-right-40 sm:top-10 sm:h-[34rem] sm:w-[34rem] bg-brand-navy/12" },
	{ className: "-bottom-24 -left-10 h-72 w-72 sm:bottom-[-12rem] sm:left-1/4 sm:h-[30rem] sm:w-[30rem] bg-brand-green/15" },
	{ className: "-bottom-20 -right-16 h-60 w-60 sm:bottom-[-10rem] sm:right-[10%] sm:h-[24rem] sm:w-[24rem] bg-brand-navy/10" },
];

/** Soft brand-colour blobs under a translucent white wash, fixed behind the whole page.
 *  Kept static and without backdrop-filter so the GPU doesn't re-blur the screen every frame. */
export function FrostedColors() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
			{blobs.map((blob, index) => (
				<div key={index} className={`absolute rounded-full blur-3xl ${blob.className}`} />
			))}
			<div className="absolute inset-0 bg-white/40" />
		</div>
	);
}
