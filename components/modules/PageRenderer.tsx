"use client";

import React, { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopNav from "@/components/Sections/TopNav";
import Footer from "@/components/Sections/Footer";
import { FrostedColors } from "@/components/Sections/Backdrop";
import type { PageData } from "@/app/actions/pages.actions";
import type { PageKey, PageModule } from "@/app/types/modules";
import { isScheduledNow, pagePaths, topModuleTypes } from "@/lib/modules";
import ModuleView from "./ModuleView";
import { PreviewContext } from "./shared";

/** What the admin's live preview adds on top of the public page */
export interface PreviewOptions {
	showHidden: boolean;
	focusId?: string;
	/** Module type → catalogue name, for the hover label */
	names: Record<string, string>;
}

interface PageRendererProps {
	page: PageKey;
	modules: PageModule[];
	data: PageData;
	/** Time the schedule is checked against; the server passes its own so both renders agree */
	now?: number;
	/** false for single-module previews: no nav bar (unless the module carries it), footer or scroll button */
	chrome?: boolean;
	preview?: PreviewOptions;
}

const visibilityClass = { all: "", desktop: "hidden lg:block", mobile: "lg:hidden" };

/** Wraps a module with what its settings ask for: the anchor id, the screens it shows on, and in
 *  the preview the data the admin's hover, focus and hidden styles hang on (see globals.css). */
function ModuleFrame({
	module,
	preview,
	offSchedule,
	children,
}: {
	module: PageModule;
	preview?: PreviewOptions;
	offSchedule: boolean;
	children: React.ReactNode;
}) {
	const anchor = module.settings?.anchor?.trim() || undefined;
	const visibility = visibilityClass[module.settings?.visibleOn ?? "all"] ?? "";

	// Every section can be linked to: by its link name when it has one, else by its module id. A
	// module given a link name later keeps its id as a second target, so older links still land.
	const hidden = !!module.hidden || offSchedule;
	return (
		<div
			id={anchor ?? module.id}
			className={["scroll-mt-20", visibility, preview ? "preview-module" : ""].filter(Boolean).join(" ")}
			data-module-id={preview ? module.id : undefined}
			data-module-name={preview ? module.name || preview.names[module.type] || module.type : undefined}
			data-preview-hidden={preview && hidden ? "" : undefined}
			data-preview-focus={preview && preview.focusId === module.id ? "" : undefined}
		>
			{anchor && anchor !== module.id && <span id={module.id} aria-hidden className="block scroll-mt-20" />}
			{preview && hidden && <span className="preview-tag">{module.hidden ? "Hidden" : "Not scheduled now"}</span>}
			{children}
		</div>
	);
}

/** A page built from modules: the nav bar (unless the first module carries it), each module in
 *  order, the footer, and the scroll-to-top button. */
export default function PageRenderer({ page, modules, data, now, chrome = true, preview }: PageRendererProps) {
	const [showScrollTop, setShowScrollTop] = useState(false);
	const currentHref = pagePaths[page] ?? "/";
	const showHidden = !!preview?.showHidden;
	const time = now ?? Date.now();

	const shown = (Array.isArray(modules) ? modules : [])
		.filter((m) => m && typeof m === "object" && m.type)
		.map((m) => ({ module: m, offSchedule: !isScheduledNow(m.settings, time) }))
		.filter(({ module, offSchedule }) => showHidden || (!module.hidden && !offSchedule));
	const startsWithTop = !!shown[0] && topModuleTypes.includes(shown[0].module.type);

	// Links like /#contact or /about-us#disclosure: scroll once the sections exist
	useEffect(() => {
		const scrollToHash = () => {
			const id = decodeURIComponent(window.location.hash.slice(1));
			const element = id ? document.getElementById(id) : null;
			if (element) setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
		};
		scrollToHash();
		window.addEventListener("hashchange", scrollToHash);
		return () => window.removeEventListener("hashchange", scrollToHash);
	}, []);

	useEffect(() => {
		if (!chrome) return;
		const handleScroll = () => setShowScrollTop(window.scrollY > 400);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [chrome]);

	return (
		<PreviewContext.Provider value={{ preview: !!preview, showHidden }}>
			<MotionConfig reducedMotion="user">
				<div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
					<FrostedColors />
					{/* Pages that don't open with a hero still get the bar, solid, with room under it */}
					{chrome && !startsWithTop && (
						<>
							<TopNav currentHref={currentHref} />
							<div aria-hidden className="h-4 sm:h-6" />
						</>
					)}

					{shown.map(({ module, offSchedule }) => (
						<ModuleFrame key={module.id} module={module} preview={preview} offSchedule={offSchedule}>
							<ModuleView module={module} data={data} currentHref={currentHref} />
						</ModuleFrame>
					))}

					{chrome && <Footer contactUs={data.contactUs} />}

					{chrome && showScrollTop && (
						<Button
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
							aria-label="Scroll to top"
							className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-sm bg-brand-navy text-white hover:bg-brand-green sm:bottom-8 sm:right-8"
							size="icon"
						>
							<ArrowUp className="h-5 w-5" />
						</Button>
					)}
				</div>
			</MotionConfig>
		</PreviewContext.Provider>
	);
}
