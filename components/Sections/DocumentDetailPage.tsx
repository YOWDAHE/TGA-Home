"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
	ArrowLeft,
	Download,
	Eye,
	Calendar,
	User,
	FileText,
	ExternalLink,
	Share2,
	Check,
	Loader2,
} from "lucide-react";
import { documentDownload, Resource } from "@/app/actions/resources.actions";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import Header from "./Header";
import { convertToApiUrl } from "@/lib/utils";
import { Document, Page, pdfjs } from "react-pdf";
import IframePdfViewer from "./IframePdfViewer";
import "@/styles/pdf-viewer.css";

// Set up PDF.js worker with a working CDN URL
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentDetailPageProps {
	resource: Resource;
}

export default function DocumentDetailPage({
	resource,
}: DocumentDetailPageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [pdfError, setPdfError] = useState(false);
	const [viewerType, setViewerType] = useState<
		"react-pdf" | "simple" | "iframe"
	>("react-pdf");
	const { user } = useAuth();
	const { toast } = useToast();

	const handleDownload = async () => {
		// Check if user is authenticated
		if (!user) {
			setShowAuthModal(true);
			return;
		}

		try {
			setIsDownloading(true);

			// Download document
			await documentDownload(resource.id.toString());

			toast({
				title: "Success",
				description: "Document downloaded successfully!",
			});
		} catch (error) {
			console.error("Error downloading document:", error);
			toast({
				title: "Error",
				description: "Failed to download document. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsDownloading(false);
		}
	};

	const handleOpenResource = async (resource: Resource) => {
		// Check if user is authenticated
		if (!user) {
			setShowAuthModal(true);
			return;
		}

		try {
			setIsDownloading(true);

			// Increment view count
			await documentDownload(resource.id.toString());

			// Open resource in new tab
			window.open(resource.file_url, "_blank", "noopener,noreferrer");

			toast({
				title: "Success",
				description: "Resource opened successfully!",
			});
		} catch (error) {
			console.error("Error opening resource:", error);
			toast({
				title: "Error",
				description: "Failed to open resource. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsDownloading(false);
		}
	};

	const handleShare = async () => {
		try {
			// Copy the file URL to clipboard
			await navigator.clipboard.writeText(resource.file_url);

			// Show success toast
			toast({
				title: "File URL copied!",
				description: "The file URL has been copied to your clipboard.",
				action: (
					<div className="flex items-center space-x-2">
						<Check className="w-4 h-4 text-green-500" />
						<span className="text-sm text-green-600">Copied</span>
					</div>
				),
			});
		} catch (error) {
			console.error("Error copying to clipboard:", error);

			// Show error toast
			toast({
				title: "Copy failed",
				description: "Failed to copy file URL to clipboard. Please try again.",
				variant: "destructive",
			});
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<div className="container mx-auto px-4 py-8 mt-16">
				{/* Breadcrumb */}
				<div className="mb-6">
					<Link
						href="/resources"
						className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Resources
					</Link>
				</div>

				<div className="grid lg:grid-cols-4 gap-6">
					{/* Main Content - PDF Viewer */}
					<div className="lg:col-span-3">
						<IframePdfViewer
							resource={resource}
							onDownload={handleDownload}
							onShare={handleShare}
							isDownloading={isDownloading}
						/>
					</div>

					{/* Sidebar - Document Info */}
					<div className="lg:col-span-1">
						<div className="space-y-4">
							{/* Document Description */}
							<Card className="shadow-lg">
								<CardContent className="p-4">
									<h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
									<p className="text-sm text-gray-600 leading-relaxed">
										{resource.description || "No description available."}
									</p>
								</CardContent>
							</Card>

							{/* Document Details */}
							<Card className="shadow-lg">
								<CardContent className="p-4">
									<h2 className="text-lg font-bold text-gray-900 mb-3">
										Document Details
									</h2>

									<div className="space-y-3">
										<div className="flex items-center space-x-3">
											<User className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">Author</p>
												<p className="text-sm font-medium text-gray-900">
													TGA Global Law Firm LL.P
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-3">
											<Calendar className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">Uploaded</p>
												<p className="text-sm font-medium text-gray-900">
													{new Date(resource.createdAt).toLocaleDateString()}
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-3">
											<Eye className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">Views</p>
												<p className="text-sm font-medium text-gray-900">
													{Math.floor(resource.view_count / 2).toLocaleString()}
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-3">
											<FileText className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">File Size</p>
												<p className="text-sm font-medium text-gray-900">
													{formatFileSize(resource.file_size)}
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Viewer Options */}
							<Card className="shadow-lg">
								<CardContent className="p-4">
									<h2 className="text-lg font-bold text-gray-900 mb-3">
										Viewer Options
									</h2>
									<div className="space-y-2">
										<Button
											onClick={() => window.open(resource.file_url, "_blank")}
											variant="outline"
											size="sm"
											className="w-full"
										>
											<ExternalLink className="w-4 h-4 mr-2" />
											Open in New Tab
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				action="download resources"
			/>
		</div>
	);
}
