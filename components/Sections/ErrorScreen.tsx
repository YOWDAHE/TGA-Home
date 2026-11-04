"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeFont } from "@/app/fonts";
import PageHero from "./PageHero";
import Footer from "./Footer";

export const primaryButtonClass =
	"group inline-flex items-center justify-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green";
export const secondaryButtonClass =
	"inline-flex items-center justify-center gap-2 rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint";

// Where people usually want to go when a page is missing or broken
const shortcuts = [
	{ href: "/resources", label: "Resources" },
	{ href: "/legal-updates", label: "Legal Updates" },
	{ href: "/news", label: "News" },
	{ href: "/about-us", label: "About us" },
];

interface ErrorScreenProps {
	/** Small label above the title, e.g. "404" */
	label: string;
	title: string;
	description: string;
	/** Buttons under the description; defaults to a link home */
	actions?: React.ReactNode;
	/** Small print under the shortcuts, e.g. an error reference */
	footnote?: React.ReactNode;
}

/** Full page for missing and broken pages: the site's glass hero with the message, shortcuts and the footer. */
export default function ErrorScreen({ label, title, description, actions, footnote }: ErrorScreenProps) {
	return (
		<div className={`${homeFont.className} bg-white text-brand-navy`}>
			<PageHero currentHref="" label={label} title={title} description={description}>
				<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
					{actions ?? (
						<Link href="/" className={primaryButtonClass}>
							Back to home
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					)}
				</div>
			</PageHero>

			<section className="px-4 pb-20 sm:px-6 sm:pb-28">
				<div className="mx-auto max-w-3xl">
					<p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-brand-navy/50">
						Or continue to
					</p>
					<ul className="mt-6 grid border-b border-brand-navy/15 sm:grid-cols-2">
						{shortcuts.map((item) => (
							<li key={item.href} className="border-t border-brand-navy/15 sm:odd:pr-6 sm:even:pl-6">
								<Link
									href={item.href}
									className="group flex items-center justify-between py-4 font-medium text-brand-navy transition-colors hover:text-brand-green"
								>
									{item.label}
									<ArrowRight className="h-4 w-4 text-brand-green transition-transform group-hover:translate-x-0.5" />
								</Link>
							</li>
						))}
					</ul>
					{footnote && <p className="mt-8 text-center text-xs text-brand-navy/50">{footnote}</p>}
				</div>
			</section>

			<Footer />
		</div>
	);
}
