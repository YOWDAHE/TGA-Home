"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { convertToApiUrl } from "@/lib/utils";
import { Resource } from "@/app/actions/resources.actions";

// Asks the browser's built-in viewer for the page only: no toolbar, no thumbnail sidebar,
// fitted to the width. Chrome, Edge and Safari honour these; Firefox keeps its own toolbar.
const VIEWER_PARAMS = "#toolbar=0&navpanes=0&scrollbar=0&view=FitH";

interface IframePdfViewerProps {
	resource: Resource;
	className?: string;
}

/** Just the document: a rounded frame around the browser's PDF view. */
export default function IframePdfViewer({ resource, className = "" }: IframePdfViewerProps) {
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	// Same-origin copy of the file, shown by the browser's own PDF viewer
	const pdfUrl = convertToApiUrl(resource.file_url);
	// Browsers without a built-in viewer (mostly Android) get Google's viewer, which
	// has to fetch the file itself, so it needs this site's public URL
	const [viewerSrc, setViewerSrc] = useState(`${pdfUrl}${VIEWER_PARAMS}`);
	useEffect(() => {
		if (navigator.pdfViewerEnabled === false) {
			const absolute = new URL(pdfUrl, window.location.origin).toString();
			setViewerSrc(`https://docs.google.com/gview?url=${encodeURIComponent(absolute)}&embedded=true`);
		}
	}, [pdfUrl]);

	const handleIframeError = () => {
		setIsLoading(false);
		toast({
			title: "PDF Loading Error",
			description: "Unable to load PDF. Please try downloading the file instead.",
			variant: "destructive",
		});
	};

	return (
		<div
			className={`relative overflow-hidden rounded-3xl bg-[#525659] shadow-sm ring-1 ring-black/5 ${className}`}
		>
			{isLoading && (
				<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white text-[#606b80]">
					<Loader2 className="h-6 w-6 animate-spin text-brand-green" />
					<p className="text-sm">Loading document...</p>
				</div>
			)}

			<iframe
				src={viewerSrc}
				className="h-full w-full border-0"
				title={resource.title}
				onLoad={() => setIsLoading(false)}
				onError={handleIframeError}
				allowFullScreen
			/>

			<a
				href={pdfUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="absolute bottom-5 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 ring-1 ring-white/10 transition-colors hover:bg-brand-green"
			>
				Open resource
				<ExternalLink className="h-4 w-4" />
			</a>
		</div>
	);
}
