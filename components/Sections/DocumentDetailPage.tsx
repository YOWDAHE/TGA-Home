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
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentDetailPageProps {
	resource: Resource;
}

export default function DocumentDetailPage({
	resource,
}: DocumentDetailPageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
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
						<Card className="shadow-lg rounded-lg overflow-hidden">
							<CardContent className="p-0">
								{/* PDF Viewer Header */}
								<div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
												<FileText className="w-6 h-6" />
											</div>
											<div className="flex-1">
												<h1 className="text-xl font-bold">{resource.title}</h1>
												<p className="text-teal-100 text-sm">PDF Document</p>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button
												onClick={handleDownload}
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
												onClick={handleShare}
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

								{/* PDF Embed */}
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
									<Document
										file={convertToApiUrl(resource.file_url)}
										onLoadSuccess={() => setIsLoading(false)}
										onLoadError={() => setIsLoading(false)}
									>
										<Page pageNumber={1} />
									</Document>
								</div>
							</CardContent>
						</Card>
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
													{resource.author}
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
													{resource.view_count.toLocaleString()}
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

							{/* Additional Actions */}
							<Card className="shadow-lg">
								<CardContent className="p-4">
									<h2 className="text-lg font-bold text-gray-900 mb-3">Actions</h2>
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
