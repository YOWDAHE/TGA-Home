"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PageData } from "@/app/actions/pages.actions";
import type { PageKey, PageModule } from "@/app/types/modules";
import { isKnownModuleType, isPageKey } from "@/lib/modules";
import PageRenderer from "./PageRenderer";

// Live preview inside the admin's iframe. Protocol (see the shared spec):
//   preview → admin  { source: "tga-preview", kind: "ready", path }            on load
//   admin → preview  { source: "tga-admin", kind: "page", page, modules, showHidden, focusId?, select? }
//   admin → preview  { source: "tga-admin", kind: "module", module }           module previews
//   preview → admin  { source: "tga-preview", kind: "select", id }             click on a module
//   preview → admin  { source: "tga-preview", kind: "height", height }         on every size change
// Only the admin origins in NEXT_PUBLIC_ADMIN_ORIGINS (or this site's own origin) may talk to it.

const PREVIEW = "tga-preview";
const ADMIN = "tga-admin";

const allowedOrigins = () =>
	new Set(
		[
			window.location.origin,
			...(process.env.NEXT_PUBLIC_ADMIN_ORIGINS ?? "").split(/[\s,]+/).map((o) => o.trim().replace(/\/$/, "")),
		].filter(Boolean)
	);

/** The parent page's origin, when the browser tells us and it is one we trust */
function knownParentOrigin(allowed: Set<string>): string | null {
	const ancestors = (window.location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins;
	let candidate = ancestors?.length ? ancestors[0] : null;
	if (!candidate && document.referrer) {
		try {
			candidate = new URL(document.referrer).origin;
		} catch {
			candidate = null;
		}
	}
	return candidate && allowed.has(candidate) ? candidate : null;
}

const isModule = (value: unknown): value is PageModule =>
	!!value &&
	typeof value === "object" &&
	typeof (value as PageModule).id === "string" &&
	typeof (value as PageModule).type === "string" &&
	isKnownModuleType((value as PageModule).type);

interface PreviewClientProps {
	mode: "page" | "module";
	page: PageKey;
	initialModules: PageModule[];
	data: PageData;
	/** Module type → catalogue name, for the hover label */
	names: Record<string, string>;
	now: number;
}

export default function PreviewClient({ mode, page: initialPage, initialModules, data, names, now: initialNow }: PreviewClientProps) {
	const [page, setPage] = useState<PageKey>(initialPage);
	const [modules, setModules] = useState<PageModule[]>(initialModules);
	const [showHidden, setShowHidden] = useState(false);
	const [focusId, setFocusId] = useState<string | undefined>();
	const [now, setNow] = useState(initialNow);
	// Set once a trusted admin has spoken to us; until then the page behaves like the public one
	const [connected, setConnected] = useState(false);
	const [selectMode, setSelectMode] = useState(true);
	const parentOrigin = useRef<string | null>(null);

	const framed = typeof window !== "undefined" && window.parent !== window;
	const selecting = framed && connected && selectMode;

	const post = useCallback((message: Record<string, unknown>) => {
		if (window.parent === window || !parentOrigin.current) return;
		window.parent.postMessage({ source: PREVIEW, ...message }, parentOrigin.current);
	}, []);

	// Listen to the admin, then say we're ready
	useEffect(() => {
		if (window.parent === window) return;
		const allowed = allowedOrigins();
		parentOrigin.current = knownParentOrigin(allowed);

		const onMessage = (event: MessageEvent) => {
			if (event.source !== window.parent || !allowed.has(event.origin)) return;
			const msg = event.data;
			if (!msg || typeof msg !== "object" || msg.source !== ADMIN) return;
			parentOrigin.current = event.origin;

			if (msg.kind === "page" && Array.isArray(msg.modules)) {
				if (typeof msg.page === "string" && isPageKey(msg.page)) setPage(msg.page);
				setModules(msg.modules.filter(isModule));
				setShowHidden(!!msg.showHidden);
				setFocusId(typeof msg.focusId === "string" && msg.focusId ? msg.focusId : undefined);
				setSelectMode(msg.select !== false);
			} else if (msg.kind === "module" && isModule(msg.module)) {
				setModules([msg.module]);
			} else {
				return;
			}
			setNow(Date.now());
			setConnected(true);
		};
		window.addEventListener("message", onMessage);

		const ready = { source: PREVIEW, kind: "ready", path: window.location.pathname };
		if (parentOrigin.current) {
			window.parent.postMessage(ready, parentOrigin.current);
		} else {
			// The browser hid the parent's origin: announce to each trusted admin; the others never see it
			for (const origin of allowed) if (origin !== window.location.origin) window.parent.postMessage(ready, origin);
		}
		return () => window.removeEventListener("message", onMessage);
	}, []);

	// Report the content height so the admin can size the frame
	useEffect(() => {
		if (window.parent === window) return;
		let last = 0;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const report = () => {
			timer = undefined;
			const height = Math.ceil(document.documentElement.scrollHeight);
			if (height === last) return;
			last = height;
			post({ kind: "height", height });
		};
		// A short debounce: images and reveals resize the page in bursts
		const observer = new ResizeObserver(() => {
			if (!timer) timer = setTimeout(report, 100);
		});
		observer.observe(document.body);
		report();
		return () => {
			observer.disconnect();
			if (timer) clearTimeout(timer);
		};
	}, [post, connected]);

	// Keep the preview on this page: links never navigate the frame (in-page anchors still scroll)
	useEffect(() => {
		if (!framed) return;
		const onClick = (event: MouseEvent) => {
			const target = event.target as Element | null;
			if (selecting) {
				const moduleEl = target?.closest<HTMLElement>("[data-module-id]");
				if (moduleEl) {
					event.preventDefault();
					event.stopPropagation();
					post({ kind: "select", id: moduleEl.dataset.moduleId });
					return;
				}
			}
			const link = target?.closest("a");
			const href = link?.getAttribute("href") ?? "";
			if (link && !(href.startsWith("#") && !selecting)) event.preventDefault();
		};
		const onSubmit = (event: SubmitEvent) => event.preventDefault();
		document.addEventListener("click", onClick, true);
		document.addEventListener("submit", onSubmit, true);
		return () => {
			document.removeEventListener("click", onClick, true);
			document.removeEventListener("submit", onSubmit, true);
		};
	}, [framed, selecting, post]);

	// Hover outline with the module's name; set on the element directly so hovering doesn't re-render the page
	useEffect(() => {
		if (!selecting) return;
		let current: HTMLElement | null = null;
		const set = (el: HTMLElement | null) => {
			if (el === current) return;
			current?.removeAttribute("data-preview-hover");
			current = el;
			current?.setAttribute("data-preview-hover", "");
		};
		const onOver = (event: MouseEvent) => set((event.target as Element | null)?.closest<HTMLElement>("[data-module-id]") ?? null);
		const onLeave = () => set(null);
		document.addEventListener("mouseover", onOver);
		document.documentElement.addEventListener("mouseleave", onLeave);
		document.documentElement.classList.add("preview-selecting");
		return () => {
			set(null);
			document.removeEventListener("mouseover", onOver);
			document.documentElement.removeEventListener("mouseleave", onLeave);
			document.documentElement.classList.remove("preview-selecting");
		};
	}, [selecting]);

	// Bring the focused module into view whenever the admin points at a different one
	useEffect(() => {
		if (!focusId) return;
		const el = document.querySelector(`[data-module-id="${CSS.escape(focusId)}"]`);
		el?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [focusId]);

	const preview = useMemo(() => ({ showHidden, focusId, names }), [showHidden, focusId, names]);

	return <PageRenderer page={page} modules={modules} data={data} now={now} chrome={mode === "page"} preview={preview} />;
}
