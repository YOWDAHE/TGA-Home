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
import PageHero from "./PageHero";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";
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

const cardClass = "rounded-sm bg-white ring-1 ring-brand-navy/10";
const tagClass = "rounded-sm bg-[#f4f5f7] px-2.5 py-0.5 text-xs text-brand-navy/75";
const secondaryButtonClass =
	"inline-flex items-center rounded-sm bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint";
const pagerClass = `${secondaryButtonClass} disabled:pointer-events-none disabled:opacity-40`;
const skeletonClass = "rounded-sm bg-brand-tint/50";

// Category filters are pills with a count; the selected one is filled navy
const chipClass = (active: boolean) =>
	`inline-flex shrink-0 items-center gap-2 rounded-sm py-2 pl-4 pr-2 text-sm transition-colors ${
		active
			? "bg-brand-navy text-white"
			: "bg-white text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-tint"
	}`;
const countClass = (active: boolean) =>
	`rounded-sm px-2 py-0.5 text-xs tabular-nums ${active ? "bg-white/15 text-white" : "bg-[#f4f5f7] text-brand-navy/60"}`;

const iconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-brand-green ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint disabled:opacity-50";
// The same buttons on the navy most-visited cards
const invertedIconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand-green disabled:opacity-50";

// "Open" goes to the resource page, share copies that page's link, and the last button
// opens the file in a new tab (sign-in required)
function ResourceActions({
	resource,
	onOpenInNewTab,
	busy,
	inverted = false,
}: {
	resource: Resource;
	onOpenInNewTab: (resource: Resource) => void;
	busy: boolean;
	/** Light buttons for the navy cards */
	inverted?: boolean;
}) {
	const copyLink = useCopyLink();
	const iconClass = inverted ? invertedIconButtonClass : iconButtonClass;

	return (
		<div className="mt-auto flex gap-2">
			<Link
				href={`/resources/${resource.id}`}
				className={`inline-flex flex-1 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors ${
					inverted ? "bg-white text-brand-navy hover:bg-brand-green hover:text-white" : "bg-brand-navy text-white hover:bg-brand-green"
				}`}
			>
				<Eye className="h-4 w-4" />
				Open
			</Link>
			<button
				type="button"
				onClick={() => copyLink(`/resources/${resource.id}`)}
				aria-label="Copy link to this resource"
				title="Copy link"
				className={iconClass}
			>
				<Share2 className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => onOpenInNewTab(resource)}
				disabled={busy}
				aria-label="Open file in a new tab"
				title="Open file in a new tab"
				className={iconClass}
			>
				{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
			</button>
		</div>
	);
}

// Skeleton component for resource cards
const ResourceCardSkeleton = () => (
	<div className={`${cardClass} flex flex-col overflow-hidden`}>
		<Skeleton className={`m-2 h-36 ${skeletonClass}`} />
		<div className="flex flex-col p-5 pt-3">
			<div className="mb-3 flex gap-2">
				<Skeleton className={`h-5 w-10 ${skeletonClass}`} />
				<Skeleton className={`h-5 w-20 ${skeletonClass}`} />
			</div>
			<Skeleton className={`mb-2 h-6 w-full ${skeletonClass}`} />
			<Skeleton className={`mb-4 h-6 w-3/4 ${skeletonClass}`} />
			<Skeleton className={`mb-6 h-4 w-2/3 ${skeletonClass}`} />
			<div className="flex gap-2">
				<Skeleton className={`h-10 flex-1 ${skeletonClass}`} />
				<Skeleton className={`h-10 w-10 ${skeletonClass}`} />
				<Skeleton className={`h-10 w-10 ${skeletonClass}`} />
			</div>
		</div>
	</div>
);

// Skeleton for most visited section
const MostVisitedSkeleton = () => (
	<div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{Array.from({ length: 6 }).map((_, index) => (
			<div key={index} className={`${cardClass} p-5 sm:p-6`}>
				<Skeleton className={`mb-4 h-11 w-11 ${skeletonClass}`} />
				<div className="mb-3 flex gap-2">
					<Skeleton className={`h-5 w-10 ${skeletonClass}`} />
					<Skeleton className={`h-5 w-16 ${skeletonClass}`} />
				</div>
				<Skeleton className={`mb-2 h-5 w-full ${skeletonClass}`} />
				<Skeleton className={`mb-5 h-5 w-3/4 ${skeletonClass}`} />
				<div className="flex gap-2">
					<Skeleton className={`h-10 flex-1 ${skeletonClass}`} />
					<Skeleton className={`h-10 w-10 ${skeletonClass}`} />
					<Skeleton className={`h-10 w-10 ${skeletonClass}`} />
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

			<span className="text-sm text-brand-navy/60">
				{isPageChanging && (
					<Loader2 className="mr-2 inline-block h-4 w-4 animate-spin text-brand-navy/50" />
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
				<PageHero
					currentHref="/resources"
					label="TGA Global Law Firm LL.P"
					title="Resources"
					description="Legal guides, documents and materials from our team"
				>
					{/* Search */}
					<div className="mx-auto flex max-w-xl items-center gap-2 rounded-sm bg-white p-1.5 pl-4 text-left ring-1 ring-brand-navy/15 focus-within:ring-2 focus-within:ring-brand-green/40">
						<Search className="h-4 w-4 shrink-0 text-brand-navy/40" />
						<input
							type="text"
							placeholder="Search resources..."
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							onKeyPress={handleSearchKeyPress}
							className="min-w-0 flex-1 bg-transparent py-2 text-brand-navy placeholder:text-brand-navy/40 focus:outline-none"
						/>
						<button
							type="button"
							onClick={() => {
								setIsPageChanging(true);
								updateURL(searchTerm, selectedCategory);
							}}
							className="rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green"
						>
							Search
						</button>
					</div>

					{/* Categories */}
					<div
						className="mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0"
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
					</div>
				</PageHero>

				{/* Most Visited Section (hidden while searching) */}
				{!activeQuery && (
				<Section tone="muted">
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
									className="group flex flex-col rounded-sm bg-brand-navy p-5 text-white transition duration-300 hover:-translate-y-1 sm:p-6"
								>
									<div className="mb-4 flex items-center justify-between">
										<span className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/10 text-brand-tint">
											<FileText className="h-5 w-5" strokeWidth={1.75} />
										</span>
										<span className="text-xs font-medium tabular-nums text-white/55">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
									<div className="mb-2 flex flex-wrap items-center gap-2">
										<span className="rounded-sm bg-white/10 px-2.5 py-0.5 text-xs font-medium text-brand-tint">PDF</span>
										<span className="rounded-sm bg-white/10 px-2.5 py-0.5 text-xs font-medium text-brand-tint">{getCategoryName(resource.category_id)}</span>
									</div>

									<Link href={`/resources/${resource.id}`}>
										<h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-brand-tint">
											{resource.title}
										</h3>
									</Link>

									<div className="mb-5 flex items-center text-sm text-white/55">
										<Eye className="mr-1 h-4 w-4" />
										<span>
											{resource.view_count.toLocaleString()} views
										</span>
									</div>

									<ResourceActions
										resource={resource}
										onOpenInNewTab={handleOpenResource}
										busy={isIncrementingView}
										inverted
									/>
								</Reveal>
							))}
						</div>
					)}
				</Section>
				)}

				{/* Results Section */}
				<Section id="results">
					<SectionHeading
						title={activeQuery ? `Results for “${activeQuery}”` : "Results"}
						description={
							busy
								? "Loading..."
								: activeQuery && pagination
								? `${pagination.totalItems} resource${Number(pagination.totalItems) !== 1 ? "s" : ""} found`
								: `${resources.length} resource${
										resources.length !== 1 ? "s" : ""
								  } found`
						}
						action={
							activeQuery ? (
								<button type="button" onClick={clearSearch} className={secondaryButtonClass}>
									<X className="mr-1 h-4 w-4" />
									Clear search
								</button>
							) : undefined
						}
					/>

					{busy ? (
						<div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, index) => (
								<ResourceCardSkeleton key={index} />
							))}
						</div>
					) : resources.length === 0 ? (
						<Reveal className="py-16 text-center">
							<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-sm bg-white ring-1 ring-brand-navy/10">
								<FileText className="h-9 w-9 text-brand-navy/40" />
							</div>
							<h3 className="mb-2 text-xl font-semibold text-brand-navy">
								No resources found
							</h3>
							<p className="text-brand-navy/60">
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
										className="group flex flex-col gap-4 rounded-sm bg-white p-4 ring-1 ring-brand-navy/10 transition hover:ring-brand-navy/25 sm:flex-row sm:items-center sm:p-5"
									>
										<span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-brand-navy text-white sm:flex">
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
												<p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-brand-navy/75">
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
										className={`${cardClass} group flex flex-col overflow-hidden transition hover:ring-brand-navy/25`}
									>
										{/* Document cover */}
										<div className="relative m-2 flex h-36 items-center justify-center overflow-hidden rounded-sm bg-brand-navy">
											<div className="relative flex flex-col items-center gap-1.5 rounded-sm bg-white/10 px-5 py-4 text-white ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
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
												<div className="flex shrink-0 items-center text-xs text-brand-navy/50">
													<Eye className="mr-1 h-3 w-3" />
													{resource.view_count}
												</div>
											</div>

											<Link href={`/resources/${resource.id}`}>
												<h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green">
													{resource.title}
												</h3>
											</Link>

											<p className="mb-4 line-clamp-2 text-sm leading-relaxed text-brand-navy/75">
												{resource.description}
											</p>

											<div className="mb-5 flex items-center gap-3 text-xs text-brand-navy/50">
												<span className="flex items-center">
													<Download className="mr-1 h-3 w-3" />
													{resource.download_count}
												</span>
												<span className="text-brand-navy/25">•</span>
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
