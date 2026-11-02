"use client";

import { useState } from "react";
import Link from "next/link";
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
	Loader2,
} from "lucide-react";
import { documentDownload, Resource } from "@/app/actions/resources.actions";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import { MotionConfig, motion } from "framer-motion";
import TopNav from "./TopNav";
import Footer from "./Footer";
import { easeOut } from "./Reveal";
import { FrostedColors } from "./Backdrop";
import IframePdfViewer from "./IframePdfViewer";
import { useCopyLink } from "./useCopyLink";
import RelatedContent from "./RelatedContent";
import { LegalUpdate } from "@/app/types/legal-updates";
import { News } from "@/app/types/news";

interface DocumentDetailPageProps {
	resource: Resource;
	relatedResources?: Resource[];
	relatedUpdates?: LegalUpdate[];
	relatedNews?: News[];
}

export default function DocumentDetailPage({
	resource,
	relatedResources = [],
	relatedUpdates = [],
	relatedNews = [],
}: DocumentDetailPageProps) {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const { user } = useAuth();
	const { toast } = useToast();

	const handleDownload = async () => {
		// Check if user is authenticated
		// if (!user) {
		// 	setShowAuthModal(true);
		// 	return;
		// }

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

	const copyLink = useCopyLink();
	const handleShare = () => copyLink(`/resources/${resource.id}`);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const details = [
		{ icon: User, label: "Author", value: "TGA Global Law Firm LL.P" },
		{ icon: Calendar, label: "Uploaded", value: new Date(resource.createdAt).toLocaleDateString() },
		{ icon: Eye, label: "Views", value: resource.view_count.toLocaleString() },
		{ icon: FileText, label: "File size", value: formatFileSize(resource.file_size) },
	];

	const actionClass =
		"inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-brand-tint";

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
				<FrostedColors />
				<TopNav currentHref="/resources" />

				<header className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
					>
						<Link
							href="/resources"
							className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-brand-navy shadow-sm ring-1 ring-black/5 transition-colors hover:bg-brand-tint"
						>
							<ArrowLeft className="h-4 w-4" />
							Resources
						</Link>
					</motion.div>

					<div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
						<motion.div
							initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
							className="lg:col-span-8"
						>
							<span className="inline-flex rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand-green">
								PDF document
							</span>
							<h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
								{resource.title}
							</h1>
							<p className="mt-4 max-w-2xl text-pretty leading-relaxed text-[#606b80] sm:text-lg">
								{resource.description || "No description available."}
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
							className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end"
						>
							<button
								type="button"
								onClick={handleDownload}
								disabled={isDownloading}
								className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green disabled:opacity-60"
							>
								{isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
								{isDownloading ? "Downloading..." : "Download"}
							</button>
							<button type="button" onClick={handleShare} className={actionClass}>
								<Share2 className="h-4 w-4" />
								Share
							</button>
							<button
								type="button"
								onClick={() => window.open(resource.file_url, "_blank")}
								className={actionClass}
							>
								<ExternalLink className="h-4 w-4" />
								New tab
							</button>
						</motion.div>
					</div>

					<motion.dl
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
						className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4"
					>
						{details.map(({ icon: Icon, label, value }) => (
							<div key={label} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-green">
									<Icon className="h-4 w-4" />
								</span>
								<div className="min-w-0">
									<dt className="text-xs text-[#7a8397]">{label}</dt>
									<dd className="truncate text-sm font-medium text-brand-navy">{value}</dd>
								</div>
							</div>
						))}
					</motion.dl>
				</header>

				{/* The document itself, as large as the screen allows */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: easeOut, delay: 0.35 }}
					className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20"
				>
					<IframePdfViewer resource={resource} className="h-[calc(100svh-6rem)] min-h-[32rem]" />
				</motion.section>

				<RelatedContent
					resources={relatedResources}
					updates={relatedUpdates}
					news={relatedNews}
					order={["resources", "updates", "news"]}
				/>

				<Footer />
			</div>
			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				action="download resources"
			/>
		</MotionConfig>
	);
}
