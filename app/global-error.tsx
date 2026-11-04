"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import "./globals.css";
import { homeFont } from "./fonts";
import GlassBackdrop from "@/components/Sections/GlassBackdrop";

/** Replaces the root layout when it fails, so it brings its own document and styles and avoids
 *  anything that needs the layout's providers (the nav reads the signed-in user). */
export default function GlobalError({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html lang="en">
			<body className={`${homeFont.className} bg-white text-brand-navy antialiased`}>
				<title>Something went wrong | TGA Global Law Firm LL.P</title>
				<main className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
					<GlassBackdrop />
					<div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
						{/* A plain link, so it reloads the whole app rather than relying on the broken layout */}
						<a href="/" aria-label="TGA Global Law Firm LL.P home">
							<img src="/logo.svg" alt="TGA Global Law Firm LL.P" className="h-10 w-auto" />
						</a>
					</div>
					<div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/60">
							Something went wrong
						</p>
						<h1 className="mt-5 text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl">
							The site didn&apos;t load
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-brand-navy/75 sm:text-lg">
							We hit a problem loading the site. It&apos;s usually temporary, so please try
							again in a moment.
						</p>
						<div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
							<button
								type="button"
								onClick={() => retry()}
								className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green"
							>
								<RotateCw className="h-4 w-4" />
								Try again
							</button>
							<a
								href="/"
								className="inline-flex items-center justify-center rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint"
							>
								Back to home
							</a>
						</div>
						{error.digest && <p className="mt-10 text-xs text-brand-navy/50">Reference: {error.digest}</p>}
					</div>
				</main>
			</body>
		</html>
	);
}
