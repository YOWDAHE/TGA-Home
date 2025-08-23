"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { convertToApiUrl } from "@/lib/utils";
import { Resource } from "@/app/actions/resources.actions";

interface IframePdfViewerProps {
	resource: Resource;
	onDownload: () => void;
	onShare: () => void;
	isDownloading: boolean;
}

export default function IframePdfViewer({
	resource,
	onDownload,
	onShare,
	isDownloading,
}: IframePdfViewerProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [iframeKey, setIframeKey] = useState(0);
	const { toast } = useToast();

	const handleReload = () => {
		setIsLoading(true);
		setIframeKey(prev => prev + 1);
	};

	const handleIframeError = () => {
		setIsLoading(false);
		toast({
			title: "PDF Loading Error",
			description: "Unable to load PDF. Please try downloading the file instead.",
			variant: "destructive",
		});
	};

	return (
		<Card className="shadow-lg rounded-lg overflow-hidden">
			<CardContent className="p-0">
				{/* PDF Viewer Header */}
				<div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="flex md:items-center items-start space-x-3">
							<div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 gap-4 md:gap-0 hidden md:flex">
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="flex-1">
								<h1 className="text-xl font-bold">{resource.title}</h1>
								<p className="text-teal-100 text-sm hidden md:block">PDF Document</p>
							</div>
						</div>
						<div className="flex md:items-center items-start space-x-2 mt-4 md:mt-0">
							<Button
								onClick={handleReload}
								variant="outline"
								size="sm"
								className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
							>
								<RefreshCw className="w-4 h-4 mr-1" />
								Reload
							</Button>
							<Button
								onClick={onDownload}
								disabled={isDownloading}
								variant="outline"
								size="sm"
								className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
							>
								{isDownloading ? (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								) : (
									<Download className="w-4 h-4 mr-1" />
								)}
								{isDownloading ? "Downloading..." : "Download"}
							</Button>
							<Button
								onClick={onShare}
								variant="outline"
								size="sm"
								className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
							>
								<Share2 className="w-4 h-4 mr-1" />
								Share
							</Button>
						</div>
					</div>
				</div>

				{/* PDF iframe Viewer */}
				<div
					className="relative w-full"
					style={{ height: "calc(100vh - 200px)" }}
				>
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
								<p className="text-gray-600">Loading PDF...</p>
							</div>
						</div>
					)}
					
					<iframe
						key={iframeKey}
						src={`${convertToApiUrl(resource.file_url)}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
						className="w-full h-full border-0"
						title={resource.title}
						onLoad={() => setIsLoading(false)}
						onError={handleIframeError}
						allowFullScreen
					/>
				</div>
			</CardContent>
		</Card>
	);
}
