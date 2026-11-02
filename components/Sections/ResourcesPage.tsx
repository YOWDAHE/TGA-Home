"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
	FileText,
	Search,
	Folder,
	Download,
	Eye,
	TrendingUp,
	ExternalLink,
	Loader2,
	Share2,
	ChevronLeft,
	ChevronRight,
	X,
} from "lucide-react";
import { Resource, incrementDocumentView } from "@/app/actions/resources.actions";
import { Category } from "@/app/types/news";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import Footer from "./Footer";
import TopNav from "./TopNav";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";
import { FrostedColors } from "./Backdrop";
import { Highlight, MatchBadges, excerptAround, matchedFields } from "./SearchMatch";
import { MotionConfig, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useCopyLink } from "./useCopyLink";

interface ResourcesPageProps {
	resources: Resource[];
	topViewedResources: Resource[];
	categories: Category[];
	categoryCounts?: Record<number, number>;
	pagination?: {
		currentPage: number;
		totalPages: number;
		totalItems: string;
		itemsPerPage: number;
	};
	isLoading?: boolean;
}

const cardClass = "rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl";
const tagClass = "rounded-full bg-[#f2f4f8] px-2.5 py-0.5 text-xs text-[#4b5468]";
const pagerClass =
	"inline-flex items-center rounded-full bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-brand-tint disabled:pointer-events-none disabled:opacity-40";

// Category filters are pills with a count; the selected one is filled navy
const chipClass = (active: boolean) =>
	`inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-4 pr-2 text-sm transition-colors ${
		active
			? "bg-brand-navy text-white"
			: "bg-white/80 text-[#4b5468] ring-1 ring-black/5 hover:bg-white hover:text-brand-navy"
	}`;
const countClass = (active: boolean) =>
	`rounded-full px-2 py-0.5 text-xs tabular-nums ${active ? "bg-white/15 text-white" : "bg-[#f2f4f8] text-[#7a8397]"}`;

const iconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand-green ring-1 ring-black/10 transition-colors hover:bg-brand-tint disabled:opacity-50";

// "Open" goes to the resource page, share copies that page's link, and the last button
// opens the file in a new tab (sign-in required)
function ResourceActions({
	resource,
	onOpenInNewTab,
	busy,
}: {
	resource: Resource;
	onOpenInNewTab: (resource: Resource) => void;
	busy: boolean;
}) {
	const copyLink = useCopyLink();

	return (
		<div className="mt-auto flex gap-2">
			<Link
				href={`/resources/${resource.id}`}
				className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green"
			>
				<Eye className="h-4 w-4" />
				Open
			</Link>
			<button
				type="button"
				onClick={() => copyLink(`/resources/${resource.id}`)}
				aria-label="Copy link to this resource"
				title="Copy link"
				className={iconButtonClass}
			>
				<Share2 className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => onOpenInNewTab(resource)}
				disabled={busy}
				aria-label="Open file in a new tab"
				title="Open file in a new tab"
				className={iconButtonClass}
			>
				{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
			</button>
		</div>
	);
}

// Skeleton component for resource cards
const ResourceCardSkeleton = () => (
	<div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
		<Skeleton className="m-2 h-36 rounded-2xl bg-[#eef1f5]" />
		<div className="flex flex-col p-5 pt-3">
			<div className="mb-3 flex gap-2">
				<Skeleton className="h-5 w-10 rounded-full bg-[#eef1f5]" />
				<Skeleton className="h-5 w-20 rounded-full bg-[#eef1f5]" />
			</div>
			<Skeleton className="mb-2 h-6 w-full rounded bg-[#eef1f5]" />
			<Skeleton className="mb-4 h-6 w-3/4 rounded bg-[#eef1f5]" />
			<Skeleton className="mb-6 h-4 w-2/3 rounded bg-[#eef1f5]" />
			<div className="flex gap-2">
				<Skeleton className="h-10 flex-1 rounded-full bg-[#eef1f5]" />
				<Skeleton className="h-10 w-10 rounded-full bg-[#eef1f5]" />
				<Skeleton className="h-10 w-10 rounded-full bg-[#eef1f5]" />
			</div>
		</div>
	</div>
);

// Skeleton for most visited section
const MostVisitedSkeleton = () => (
	<div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{Array.from({ length: 6 }).map((_, index) => (
			<div key={index} className={`${cardClass} p-5 sm:p-6`}>
				<Skeleton className="mb-4 h-11 w-11 rounded-2xl bg-[#eef1f5]" />
				<div className="mb-3 flex gap-2">
					<Skeleton className="h-5 w-10 rounded-full bg-[#eef1f5]" />
					<Skeleton className="h-5 w-16 rounded-full bg-[#eef1f5]" />
				</div>
				<Skeleton className="mb-2 h-5 w-full rounded bg-[#eef1f5]" />
				<Skeleton className="mb-5 h-5 w-3/4 rounded bg-[#eef1f5]" />
				<div className="flex gap-2">
					<Skeleton className="h-10 flex-1 rounded-full bg-[#eef1f5]" />
					<Skeleton className="h-10 w-10 rounded-full bg-[#eef1f5]" />
					<Skeleton className="h-10 w-10 rounded-full bg-[#eef1f5]" />
				</div>
			</div>
		))}
	</div>
);

export default function ResourcesPage({ resources, topViewedResources, categories, categoryCounts, pagination, isLoading = false }: ResourcesPageProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useAuth();
	const { toast } = useToast();
	
	// Get search term from URL or default to empty
	const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
	const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isIncrementingView, setIsIncrementingView] = useState(false);
	const [showSearchText, setSHowSearchText] = useState(true);
	const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
	const [isPageChanging, setIsPageChanging] = useState(false);

	const showCountsFromFetched = Boolean(searchTerm) || (selectedCategory !== "All");

	const countsFromFetched = useMemo(() => {
		const counts: Record<number, number> = {};
		for (const resource of resources) {
			counts[resource.category_id] = (counts[resource.category_id] || 0) + 1;
		}
		return counts;
	}, [resources]);

	const countsToShow: Record<number, number> = showCountsFromFetched
		? countsFromFetched
		: (categoryCounts || {});

	// const filteredResources = useMemo(() => {
	// 	if (!resources || resources.length === 0) {
	// 		return [];
	// 	}
		
	// 	return resources.filter((resource) => {
	// 		const matchesSearch =
	// 			resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 			resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 			resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 			resource.filename.toLowerCase().includes(searchTerm.toLowerCase());
			
	// 		// Category filtering
	// 		const matchesCategory = selectedCategory === "All" || 
	// 			(selectedCategory !== "All" && resource.category_id === parseInt(selectedCategory));
			
	// 		return matchesSearch && matchesCategory;
	// 	});
	// }, [searchTerm, selectedCategory, resources]);

	const handleDownload = (resource: Resource) => {
		const link = document.createElement('a');
		link.href = resource.file_url;
		link.download = resource.filename || 'download';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handlePreview = (resource: Resource) => {
		window.open(resource.file_url, "_blank", "noopener,noreferrer");
	};

	const handleOpenResource = async (resource: Resource) => {
		// Check if user is authenticated
		if (!user) {
			setShowAuthModal(true);
			return;
		}

		try {
			setIsIncrementingView(true);

			// Increment view count
			await incrementDocumentView(resource.id.toString());
			
			// Open resource in new tab
			window.open(resource.file_url, "_blank", "noopener,noreferrer");
			
			toast({
				title: "Success",
				description: "Resource opened successfully!",
			});
		} catch (error) {
			console.error('Error opening resource:', error);
			toast({
				title: "Error",
				description: "Failed to open resource. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsIncrementingView(false);
		}
	};

	// Helper function to get category name by ID
	const getCategoryName = (categoryId: number) => {
		const category = categories.find(cat => cat.id === categoryId);
		return category ? category.name : 'Unknown Category';
	};

	// Function to update URL with search parameters
	const updateURL = (search: string, category: string, page: number = 1) => {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (category && category !== 'All') params.set('category', category);
		if (page > 1) params.set('page', page.toString());
		
		const newURL = params.toString() ? `?${params.toString()}` : '';
		router.push(`/resources${newURL}`);
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		setIsPageChanging(true);
		setCurrentPage(page);
		updateURL(searchTerm, selectedCategory, page);
	};

	// Handle search input change
	const handleSearchChange = (value: string) => {
		setSHowSearchText(false);
		setSearchTerm(value);
	};

	// Handle search on Enter key press
	const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsPageChanging(true);
			updateURL(searchTerm, selectedCategory, 1); // Reset to page 1 when searching
		}
	};

	// Turn off page-changing loader once navigation finishes (URL params updated)
	useEffect(() => {
		setIsPageChanging(false);
		const pageFromUrl = Number(searchParams.get('page') || '1');
		if (!Number.isNaN(pageFromUrl) && pageFromUrl !== currentPage) {
			setCurrentPage(pageFromUrl);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams.toString()]);

	// Handle category selection
	const handleCategorySelect = (category: string) => {
		setIsPageChanging(true);
		setSelectedCategory(category);
		if (category === "All") {
			setSearchTerm("");
			updateURL("", category, 1);
		} else {
			updateURL(searchTerm, category, 1); // Reset to page 1 when changing category
		}
	};

	const busy = isLoading || isPageChanging;

	// The submitted phrase lives in the URL; while it is set the page shows only the results
	const activeQuery = (searchParams.get("search") || "").trim();

	const clearSearch = () => {
		setIsPageChanging(true);
		setSearchTerm("");
		updateURL("", selectedCategory, 1);
	};

	const pager = pagination && pagination.totalPages > 1 && (
		<div className="mt-10 flex items-center justify-center gap-3">
			<button
				type="button"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={pagerClass}
			>
				<ChevronLeft className="mr-1 h-4 w-4" />
				Previous
			</button>

			<span className="text-sm text-[#606b80]">
				{isPageChanging && (
					<Loader2 className="mr-2 inline-block h-4 w-4 animate-spin text-[#7a8397]" />
				)}
				Page {pagination.currentPage} of {pagination.totalPages}
			</span>

			<button
				type="button"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === pagination.totalPages}
				className={pagerClass}
			>
				Next
				<ChevronRight className="ml-1 h-4 w-4" />
			</button>
		</div>
	);

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
				<FrostedColors />
				<TopNav currentHref="/resources" />

				{/* Page header with search */}
				<section className="px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
						className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-[#4b5468] shadow-sm ring-1 ring-black/5 sm:px-4"
					>
						<span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
						TGA Global Law Firm LL.P
					</motion.p>
					<motion.h1
						initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
						className="text-[2.75rem] font-semibold leading-none tracking-tight sm:text-7xl"
					>
						Resources
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
						className="mx-auto mt-5 max-w-[19rem] text-pretty text-base leading-relaxed text-[#606b80] min-[400px]:max-w-[21rem] sm:max-w-xl sm:text-lg"
					>
						Legal guides, documents and materials from our team
					</motion.p>

					{/* Search */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
						className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-left shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brand-green/40"
					>
						<Search className="h-4 w-4 shrink-0 text-[#9aa3b5]" />
						<input
							type="text"
							placeholder="Search resources..."
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							onKeyPress={handleSearchKeyPress}
							className="min-w-0 flex-1 bg-transparent py-2 text-brand-navy placeholder:text-[#9aa3b5] focus:outline-none"
						/>
						<button
							type="button"
							onClick={() => {
								setIsPageChanging(true);
								updateURL(searchTerm, selectedCategory);
							}}
							className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green sm:px-6"
						>
							Search
						</button>
					</motion.div>

					{/* Categories */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
						className="mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 sm:max-w-4xl"
						aria-label="Categories"
					>
						{/* All Categories Option */}
						<button
							type="button"
							onClick={() => handleCategorySelect("All")}
							className={chipClass(selectedCategory === "All")}
						>
							<Folder className="h-4 w-4 shrink-0" />
							All Categories
							<span className={countClass(selectedCategory === "All")}>
								{isLoading ? "..." : pagination?.totalItems}
							</span>
						</button>

						{/* Individual Categories */}
						{categories.map((category) => {
							const active = selectedCategory === category.id.toString();
							return (
								<button
									key={category.id}
									type="button"
									onClick={() => handleCategorySelect(category.id.toString())}
									className={chipClass(active)}
								>
									{category.name}
									<span className={countClass(active)}>
										{isLoading ? "..." : (countsToShow[category.id] ?? 0)}
									</span>
								</button>
							);
						})}
					</motion.div>
				</section>

				{/* Most Visited Section (hidden while searching) */}
				{!activeQuery && (
				<Section>
					<SectionHeading
						title="Most Visited"
						description="The documents readers open most often"
					/>
					{busy ? (
						<MostVisitedSkeleton />
					) : (
						<div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{topViewedResources.slice(0, 6).map((resource, index) => (
								<Reveal
									key={resource.id}
									delay={(index % 3) * 0.06}
									className={`${cardClass} group flex flex-col p-5 transition-shadow hover:shadow-md sm:p-6`}
								>
									<div className="mb-4 flex items-center justify-between">
										<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-tint text-brand-green">
											<FileText className="h-5 w-5" strokeWidth={1.75} />
										</span>
										<span className="text-xs font-medium tabular-nums text-brand-green">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
									<div className="mb-2 flex flex-wrap items-center gap-2">
										<span className={tagClass}>PDF</span>
										<span className={tagClass}>{getCategoryName(resource.category_id)}</span>
									</div>

									<Link href={`/resources/${resource.id}`}>
										<h3 className="mb-2 line-clamp-2 font-semibold leading-snug text-brand-navy transition-colors group-hover:text-brand-green">
											{resource.title}
										</h3>
									</Link>

									<div className="mb-5 flex items-center text-sm text-[#7a8397]">
										<Eye className="mr-1 h-4 w-4" />
										<span>
											{resource.view_count.toLocaleString()} views
										</span>
									</div>

									<ResourceActions
										resource={resource}
										onOpenInNewTab={handleOpenResource}
										busy={isIncrementingView}
									/>
								</Reveal>
							))}
						</div>
					)}
				</Section>
				)}

				{/* Results Section */}
				<Section pattern id="results">
					<Reveal className={`flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left ${activeQuery ? "mx-auto max-w-4xl" : ""}`}>
						<h2 className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">
							{activeQuery ? `Results for “${activeQuery}”` : "Results"}
						</h2>
						<div className="flex items-center gap-3 text-sm text-[#7a8397]">
							{busy
								? "Loading..."
								: activeQuery && pagination
								? `${pagination.totalItems} resource${Number(pagination.totalItems) !== 1 ? "s" : ""} found`
								: `${resources.length} resource${
										resources.length !== 1 ? "s" : ""
								  } found`}
							{activeQuery && (
								<button
									type="button"
									onClick={clearSearch}
									className="inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-brand-tint"
								>
									<X className="mr-1 h-4 w-4" />
									Clear search
								</button>
							)}
						</div>
					</Reveal>

					{busy ? (
						<div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, index) => (
								<ResourceCardSkeleton key={index} />
							))}
						</div>
					) : resources.length === 0 ? (
						<Reveal className="py-16 text-center">
							<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
								<FileText className="h-9 w-9 text-[#9aa3b5]" />
							</div>
							<h3 className="mb-2 text-xl font-semibold text-brand-navy">
								No resources found
							</h3>
							<p className="text-[#606b80]">
								Try adjusting your search terms or category filter.
							</p>
						</Reveal>
					) : activeQuery ? (
						/* Search rows: what matched, and the phrase in context */
						<>
						<ul className="mx-auto mt-8 max-w-4xl space-y-3">
							{resources.map((resource, index) => {
								const found = matchedFields(activeQuery, [
									{ label: "Title", value: resource.title },
									{ label: "Description", value: resource.description },
									{ label: "Text", value: resource.content_text },
									{ label: "File name", value: resource.filename },
									{ label: "Author", value: resource.author },
								]);
								// Show the passage where the phrase appears; fall back to the description
								const excerptSource =
									!found.includes("Description") && found.includes("Text")
										? resource.content_text
										: resource.description;
								return (
									<motion.li
										key={resource.id}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.45, ease: easeOut, delay: Math.min(index, 8) * 0.04 }}
										className="group flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:p-5"
									>
										<span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-navy text-white sm:flex">
											<FileText className="h-6 w-6" strokeWidth={1.5} />
										</span>
										<div className="min-w-0 flex-1">
											<div className="flex flex-wrap items-center gap-2">
												<MatchBadges labels={found} />
												<span className={tagClass}>{getCategoryName(resource.category_id)}</span>
											</div>
											<Link href={`/resources/${resource.id}`}>
												<h3 className="mt-2 line-clamp-2 font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green sm:text-lg">
													<Highlight text={resource.title} query={activeQuery} />
												</h3>
											</Link>
											{excerptSource && (
												<p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
													<Highlight text={excerptAround(excerptSource, activeQuery)} query={activeQuery} />
												</p>
											)}
										</div>
										<div className="flex w-full shrink-0 sm:w-56">
											<ResourceActions
												resource={resource}
												onOpenInNewTab={handleOpenResource}
												busy={isIncrementingView}
											/>
										</div>
									</motion.li>
								);
							})}
						</ul>
						{pager}
						</>
					) : (
						<>
							<div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{resources.map((resource, index) => (
									<Reveal
										key={resource.id}
										delay={(index % 3) * 0.06}
										className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
									>
										{/* Document cover */}
										<div className="relative m-2 flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-brand-navy">
											<div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-brand-green/40 blur-2xl" />
											<div className="relative flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 px-5 py-4 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
												<FileText className="h-10 w-10" strokeWidth={1.5} />
												<span className="text-xs font-semibold tracking-wider">PDF</span>
											</div>
										</div>

										<div className="flex flex-1 flex-col p-5 pt-3">
											<div className="mb-3 flex items-center justify-between gap-2">
												<div className="flex flex-wrap items-center gap-2">
													<span className={tagClass}>PDF</span>
													<span className={tagClass}>{getCategoryName(resource.category_id)}</span>
												</div>
												<div className="flex shrink-0 items-center text-xs text-[#7a8397]">
													<Eye className="mr-1 h-3 w-3" />
													{resource.view_count}
												</div>
											</div>

											<Link href={`/resources/${resource.id}`}>
												<h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green">
													{resource.title}
												</h3>
											</Link>

											<p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
												{resource.description}
											</p>

											<div className="mb-5 flex items-center gap-3 text-xs text-[#7a8397]">
												<span className="flex items-center">
													<Download className="mr-1 h-3 w-3" />
													{resource.download_count}
												</span>
												<span className="text-[#c3ccd9]">•</span>
												<span>{new Date(resource.createdAt).toLocaleDateString()}</span>
											</div>

											<ResourceActions
												resource={resource}
												onOpenInNewTab={handleOpenResource}
												busy={isIncrementingView}
											/>
										</div>
									</Reveal>
								))}
							</div>

							{pager}
						</>
					)}
				</Section>

				<Footer />
			</div>
			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				action="access resources"
			/>
		</MotionConfig>
	);
}
