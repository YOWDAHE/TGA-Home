"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { EmbeddedContent } from "@/components/ui/embedded-content";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Calendar,
	Clock,
	Eye,
	Play,
	TrendingUp,
	ChevronRight,
	User,
	Share2,
	Bookmark,
	Search,
	ChevronLeft,
	X,
	Check,
	ExternalLink,
	Loader2,
} from "lucide-react";
import {
	NewsResponse,
	News,
	Other,
	NewsQueryResponse,
	CategoryResponse,
} from "@/app/types/news";
import { convertToApiUrl } from "@/lib/utils";
import Footer from "./Footer";
import TopNav from "./TopNav";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";
import { FrostedColors } from "./Backdrop";
import { Highlight, MatchBadges, excerptAround, matchedFields } from "./SearchMatch";
import { MotionConfig, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

interface NewsQueryParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	order?: "asc" | "desc";
	q?: string;
	category?: string;
}

const cardClass = "rounded-3xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-xl";
const columnHeading = "mb-5 text-center text-2xl font-semibold tracking-tight text-brand-navy sm:text-left";
const pagerClass =
	"inline-flex items-center rounded-full bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-brand-tint disabled:pointer-events-none disabled:opacity-40";

// Category filters are pills; the selected one is filled navy
const chipClass = (active: boolean) =>
	`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
		active
			? "bg-brand-navy text-white"
			: "bg-white/80 text-[#4b5468] ring-1 ring-black/5 hover:bg-white hover:text-brand-navy"
	}`;

// Article bodies are HTML; excerpts show plain text
const stripHtml = (html: string) =>
	(html ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

interface NewsPageProps {
	news: NewsResponse;
	newsQuery: NewsQueryResponse;
	categories: CategoryResponse;
}

export default function NewsPage({
	news,
	newsQuery,
	categories: catData,
}: NewsPageProps) {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
	const [currentPage, setCurrentPage] = useState(1);
	const [queryResults, setQueryResults] = useState<NewsQueryResponse | null>(
		null
	);
	// A search in the URL loads its results on mount, so start in the loading state
	const [isLoading, setIsLoading] = useState(Boolean(searchParams.get("q")?.trim()));
	const [carouselApi, setCarouselApi] = useState<any>(null);
	const [isNavigating, setIsNavigating] = useState(false);

	const { featured, latest, trending, hot, others } = news.data;
	const categories = catData.data.categories.map((category) => {
		return {
			name: category.name,
			id: category.id,
		};
	});

	// Helper function to get image URL
	const getImageUrl = (newsItem: News) => {
		if (newsItem.visual_content && newsItem.visual_content.length > 0) {
			return convertToApiUrl(newsItem.visual_content[0]);
		}
		return "/placeholder.jpg";
	};

	// Helper function to format date
	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleDateString();
	};

	/** Browse grid & search: show publication date when set, else created date */
	const formatNewsMetaDate = (article: News) => {
		const primary = article.published_date;
		if (primary != null && String(primary).trim() !== "") {
			const d = new Date(primary as string | Date);
			if (!Number.isNaN(d.getTime())) return d.toLocaleDateString();
		}
		return formatDate(article.createdAt);
	};

	// Helper function to get read time
	const getReadTime = (minutes: number | null) => {
		return minutes ? `${minutes} min read` : "5 min read";
	};

	// Fetch news by query for Browse by Category section (matches SSR: limit 10, pub. date desc)
	const fetchNewsByQuery = async (
		page: number = 1,
		categoryId?: number,
		opts?: { silent?: boolean; q?: string }
	) => {
		if (!opts?.silent) setIsLoading(true);
		try {
			const qVal =
				opts?.q !== undefined ? opts.q.trim() : searchInput.trim();
			const params: Record<string, string> = {
				page: String(page),
				limit: "10",
				sortBy: "published_date",
				order: "desc",
			};

			if (qVal) {
				params.q = qVal;
			}

			if (categoryId !== undefined && categoryId !== null) {
				params.category = String(categoryId);
			}

			const queryString = new URLSearchParams(params).toString();
			const response = await fetch(`/api/news?${queryString}`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			setQueryResults(result);
			setCurrentPage(page);
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			if (!opts?.silent) setIsLoading(false);
		}
	};

	const categoryIdForSelection = () =>
		selectedCategory === "All"
			? undefined
			: categories.find((c) => c.name === selectedCategory)?.id;

	// The submitted phrase lives in the URL; while it is set the page shows only the results
	const activeQuery = (searchParams.get("q") || "").trim();

	// Searching navigates to ?q=, which swaps the page into the results view
	const handleSearch = () => {
		const q = searchInput.trim();
		if (q === activeQuery) {
			fetchNewsByQuery(1, categoryIdForSelection(), { q });
			return;
		}
		router.push(q ? `/news?q=${encodeURIComponent(q)}` : "/news");
	};

	const clearSearch = () => {
		setSearchInput("");
		setSelectedCategory("All");
		router.replace("/news");
	};

	// Handle category change for Browse by Category section
	const handleCategoryChange = (categoryName: string) => {
		setSelectedCategory(categoryName);
		const catId =
			categoryName === "All"
				? undefined
				: categories.find((cat) => cat.name === categoryName)?.id;
		fetchNewsByQuery(1, catId, { q: searchInput });
	};

	// Handle page change for Browse by Category section
	const handlePageChange = (page: number) => {
		fetchNewsByQuery(page, categoryIdForSelection(), { q: searchInput });
	};

	// Handle search input change
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	// Handle search on Enter key
	const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const browseData = queryResults ?? newsQuery;

	// Get current news items to display in Browse by Category section
	const getCurrentNewsItems = () => browseData.data.news;

	// Get pagination info for Browse by Category section
	const getPaginationInfo = () => browseData.data.pagination;

	const showFilterReset =
		searchInput.trim().length > 0 || selectedCategory !== "All";

	// Keep browse list in sync with the URL query and refresh after navigation
	useEffect(() => {
		const q = searchParams.get("q") || "";
		setSearchInput(q);
		void fetchNewsByQuery(1, categoryIdForSelection(), {
			silent: !q.trim(),
			q: q.trim(),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: refetch when URL search changes only
	}, [searchParams]);

	// Auto-play carousel functionality
	useEffect(() => {
		if (!carouselApi) return;

		const interval = setInterval(() => {
			carouselApi.scrollNext();
		}, 5000); // Auto-play every 5 seconds

		return () => clearInterval(interval);
	}, [carouselApi]);

	const handleShare = async (news: News) => {
		try {
			// Copy the file URL to clipboard
			await navigator.clipboard.writeText(
				`${window.location.origin}/news/${news.id}`
			);

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

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
				<FrostedColors />
				<TopNav currentHref="/news" />

				{/* Page header */}
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
						News
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
						className="mx-auto mt-5 max-w-[19rem] text-pretty text-base leading-relaxed text-[#606b80] min-[400px]:max-w-[21rem] sm:max-w-xl sm:text-lg"
					>
						Stay updated with the latest legal insights and industry developments
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
						className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-left shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brand-green/40"
					>
						<Search className="h-4 w-4 shrink-0 text-[#9aa3b5]" />
						<input
							type="search"
							placeholder="Search news..."
							value={searchInput}
							onChange={handleSearchInputChange}
							onKeyDown={handleSearchKeyPress}
							className="min-w-0 flex-1 bg-transparent py-2 text-brand-navy placeholder:text-[#9aa3b5] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
						/>
						<button
							type="button"
							onClick={handleSearch}
							className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green sm:px-6"
						>
							Search
						</button>
					</motion.div>
				</section>

				{activeQuery ? (
					/* Search results only: the curated sections stay hidden while searching */
					<section className="px-4 pb-16 sm:px-6 sm:pb-24">
						<div className="mx-auto max-w-4xl">
							<div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
								<div>
									<h2 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
										Results for “{activeQuery}”
									</h2>
									<p className="mt-1 text-sm text-[#7a8397]">
										{isLoading
											? "Searching..."
											: `${getPaginationInfo()?.totalItems ?? getCurrentNewsItems().length} ${
													(getPaginationInfo()?.totalItems ?? getCurrentNewsItems().length) === 1 ? "story" : "stories"
											  } found`}
									</p>
								</div>
								<button
									type="button"
									onClick={clearSearch}
									className="inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-black/10 transition-colors hover:bg-brand-tint"
								>
									<X className="mr-1 h-4 w-4" />
									Clear search
								</button>
							</div>

							<div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
								{[{ id: "All", name: "All" }, ...categories].map((category) => (
									<button
										key={category.id}
										type="button"
										onClick={() => handleCategoryChange(category.name)}
										className={chipClass(selectedCategory === category.name)}
									>
										{category.name}
									</button>
								))}
							</div>

							{isLoading ? (
								<div className="flex items-center justify-center py-20 text-[#606b80]">
									<Loader2 className="h-6 w-6 animate-spin text-brand-green" />
									<span className="ml-2">Searching...</span>
								</div>
							) : getCurrentNewsItems().length === 0 ? (
								<div className="py-20 text-center">
									<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
										<Search className="h-8 w-8 text-[#9aa3b5]" />
									</div>
									<h3 className="mb-2 text-xl font-semibold text-brand-navy">No stories found</h3>
									<p className="text-[#606b80]">Try a different phrase or another category.</p>
								</div>
							) : (
								<ul className="mt-8 space-y-3">
									{getCurrentNewsItems().map((article, index) => {
										const text = stripHtml(article.content);
										const found = matchedFields(activeQuery, [
											{ label: "Title", value: article.title },
											{ label: "Text", value: text },
											{ label: "Tags", value: article.hashtags },
											{ label: "Source", value: `${article.source ?? ""} ${article.created_by ?? ""}` },
										]);
										return (
											<motion.li
												key={article.id}
												initial={{ opacity: 0, y: 16 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.45, ease: easeOut, delay: Math.min(index, 8) * 0.04 }}
											>
												<Link
													href={`/news/${article.id}`}
													className="group flex gap-4 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg sm:gap-5"
												>
													<div className="min-h-[7.5rem] w-28 shrink-0 self-stretch overflow-hidden bg-[#eef1f5] sm:min-h-[9rem] sm:w-48">
														<img
															src={getImageUrl(article)}
															alt={article.title}
															width={176}
															height={128}
															className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
														/>
													</div>
													<div className="min-w-0 flex-1 py-4 pr-4">
														<MatchBadges labels={found} />
														<h3 className="mt-2 line-clamp-2 font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green sm:text-lg">
															<Highlight text={article.title} query={activeQuery} />
														</h3>
														<p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
															<Highlight text={excerptAround(text, activeQuery)} query={activeQuery} />
														</p>
														<p className="mt-2 text-xs text-[#7a8397]">{formatNewsMetaDate(article)}</p>
													</div>
												</Link>
											</motion.li>
										);
									})}
								</ul>
							)}

							{!isLoading && (getPaginationInfo()?.totalPages ?? 0) > 1 && (
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
										Page {getPaginationInfo()?.currentPage} of {getPaginationInfo()?.totalPages}
									</span>
									<button
										type="button"
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={currentPage === getPaginationInfo()?.totalPages}
										className={pagerClass}
									>
										Next
										<ChevronRight className="ml-1 h-4 w-4" />
									</button>
								</div>
							)}
						</div>
					</section>
				) : (
				<>
				{/* Spotlight: quick list, featured carousel, latest/trending tabs */}
				<section className="px-4 pb-16 sm:px-6 sm:pb-24">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: easeOut, delay: 0.45 }}
						className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12"
					>
						{/* Left - Browse News */}
						<div className={`${cardClass} order-2 p-4 sm:p-5 md:order-1 lg:col-span-3`}>
							<p className="mb-3 px-1 text-sm font-medium text-brand-navy">Just in</p>
							<div className="flex max-h-64 flex-col gap-2 overflow-y-auto md:max-h-96">
								{latest.slice(0, 3).map((article) => (
									<Link
										href={`/news/${article.id}`}
										key={article.id}
										className="rounded-2xl bg-white p-3 ring-1 ring-black/5 transition-shadow hover:shadow-md"
									>
										<h4 className="mb-1.5 line-clamp-2 text-sm font-medium text-brand-navy">
											{article.title}
										</h4>
										<div className="flex items-center gap-3 text-xs text-[#7a8397]">
											<span>{formatDate(article.createdAt)}</span>
											<span className="flex items-center">
												<Eye className="mr-1 h-3 w-3" />
												{article.view_count.toLocaleString()}
											</span>
										</div>
									</Link>
								))}
							</div>
						</div>

						{/* Middle - Featured News Carousel */}
						<div className="order-1 md:col-span-2 md:order-2 lg:col-span-6">
							{featured.length > 0 && (
								<Carousel
									opts={{
										align: "start",
										loop: true,
									}}
									setApi={setCarouselApi}
									className="h-full w-full overflow-hidden rounded-3xl"
								>
									<CarouselContent>
										{featured.map((article) => (
											<CarouselItem key={article.id}>
												<Link
													href={`/news/${article.id}`}
													className="group relative block h-[320px] overflow-hidden rounded-3xl bg-[#eef1f5] md:h-[400px] lg:h-[460px]"
												>
													<img
														src={getImageUrl(article)}
														alt={article.title}
														className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
													<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
														<span className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-md">
															Featured
														</span>
														<h3 className="mb-2 line-clamp-2 text-xl font-semibold tracking-tight sm:text-2xl">
															{article.title}
														</h3>
														<p className="mb-3 line-clamp-2 text-sm text-white/75">
															{stripHtml(article.content)}
														</p>
														<div className="flex items-center justify-between text-xs text-white/60">
															<span>TGA Global Law Firm LL.P</span>
															<span>{formatDate(article.published_date)}</span>
														</div>
													</div>
												</Link>
											</CarouselItem>
										))}
									</CarouselContent>
									{/* <CarouselPrevious />
									<CarouselNext /> */}
								</Carousel>
							)}
						</div>

						{/* Right - Latest & Trending Tabs */}
						<div className={`${cardClass} order-3 p-4 sm:p-5 lg:col-span-3`}>
							<Tabs defaultValue="latest" className="w-full">
								<TabsList className="mb-4 grid h-auto w-full grid-cols-2 rounded-full bg-[#eef1f5] p-1">
									<TabsTrigger
										value="latest"
										className="rounded-full py-1.5 text-xs data-[state=active]:bg-brand-navy data-[state=active]:text-white md:text-sm"
									>
										Latest
									</TabsTrigger>
									<TabsTrigger
										value="trending"
										className="rounded-full py-1.5 text-xs data-[state=active]:bg-brand-navy data-[state=active]:text-white md:text-sm"
									>
										Trending
									</TabsTrigger>
								</TabsList>

								{[
									{ value: "latest", items: latest, date: (a: News) => a.createdAt },
									{ value: "trending", items: trending, date: (a: News) => a.published_date },
								].map((tab) => (
									<TabsContent
										key={tab.value}
										value={tab.value}
										className="mt-0 flex max-h-64 flex-col gap-2 overflow-y-auto md:max-h-96"
									>
										{tab.items.slice(0, 4).map((article) => (
											<Link
												href={`/news/${article.id}`}
												key={article.id}
												className="flex gap-3 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition-shadow hover:shadow-md"
											>
												<div className="min-h-[4.25rem] w-16 shrink-0 self-stretch overflow-hidden bg-[#eef1f5]">
													<img
														src={getImageUrl(article)}
														alt={article.title}
														className="h-full w-full object-cover"
													/>
												</div>
												<div className="min-w-0 flex-1 py-2.5 pr-3">
													<h4 className="mb-1 line-clamp-2 text-sm font-medium text-brand-navy">
														{article.title}
													</h4>
													<div className="flex items-center gap-3 text-xs text-[#7a8397]">
														<span>{formatDate(tab.date(article))}</span>
														<span className="flex items-center">
															<Eye className="mr-1 h-3 w-3" />
															{article.view_count.toLocaleString()}
														</span>
													</div>
												</div>
											</Link>
										))}
									</TabsContent>
								))}
							</Tabs>
						</div>
					</motion.div>
				</section>

				{/* Featured Articles */}
				{featured.length > 0 && (
					<Section pattern>
						<SectionHeading
							title="Featured Stories"
							description="Our pick of the stories worth your time"
						/>
						<div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{featured.slice(0, 3).map((article, index) => (
								<Reveal
									key={article.id}
									delay={index * 0.08}
									className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
								>
									<div className="relative h-60 overflow-hidden bg-[#eef1f5]">
										<img
											src={getImageUrl(article)}
											alt={article.title}
											width={400}
											height={250}
											className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
										/>
										{trending.some((t) => t.id === article.id) && (
											<span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-green backdrop-blur">
												<TrendingUp className="mr-1 h-3 w-3" />
												Trending
											</span>
										)}
									</div>
									<div className="flex flex-1 flex-col p-5">
										<div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7a8397]">
											<span className="flex items-center">
												<Calendar className="mr-1 h-3 w-3" />
												{formatDate(article.published_date)}
											</span>
											<span className="flex items-center">
												<Clock className="mr-1 h-3 w-3" />
												{getReadTime(article.read_minutes)}
											</span>
											<span className="flex items-center">
												<Eye className="mr-1 h-3 w-3" />
												{article.view_count.toLocaleString()}
											</span>
										</div>
										<h3 className="mb-2 line-clamp-2 text-lg font-semibold tracking-tight text-brand-navy">
											{article.title}
										</h3>
										<p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
											{stripHtml(article.content)}
										</p>
										<p className="mb-5 flex items-center text-xs text-[#7a8397]">
											<User className="mr-1 h-3 w-3" />
											TGA Global Law Firm LL.P
										</p>
										<div className="mt-auto flex items-center justify-between">
											<Link
												href={`/news/${article.id}`}
												className="group/btn inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green"
											>
												Read More
												<ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
											</Link>
											<button
												type="button"
												onClick={() => handleShare(article)}
												aria-label="Copy link"
												className="flex h-10 w-10 items-center justify-center rounded-full text-[#7a8397] ring-1 ring-black/10 transition-colors hover:bg-brand-tint hover:text-brand-green"
											>
												<Share2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								</Reveal>
							))}
						</div>
					</Section>
				)}

				{/* Latest, Hot and Trending */}
				<Section>
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
						{/* Latest Articles */}
						<Reveal className="lg:col-span-2">
							<h2 className={columnHeading}>Latest</h2>
							<div className="flex flex-col gap-3">
								{latest.slice(0, 5).map((article) => (
									<Link
										href={`/news/${article.id}`}
										key={article.id}
										className={`${cardClass} group flex gap-4 overflow-hidden transition-shadow hover:shadow-md`}
									>
										<div className="min-h-[7rem] w-28 shrink-0 self-stretch overflow-hidden bg-[#eef1f5] sm:w-36">
											<img
												src={getImageUrl(article)}
												alt={article.title}
												className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
										</div>
										<div className="min-w-0 flex-1 py-3 pr-4">
											<h3 className="mb-2 line-clamp-2 font-medium text-brand-navy">
												{article.title}
											</h3>
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7a8397]">
												<span className="hidden sm:inline">TGA Global Law Firm LL.P</span>
												<span>{formatDate(article.createdAt)}</span>
												<span>{getReadTime(article.read_minutes)}</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						</Reveal>

						{/* Top Articles Sidebar */}
						<Reveal delay={0.08} className="lg:col-span-1">
							<h2 className={columnHeading}>Hot</h2>
							<div className="flex flex-col gap-3">
								{hot.slice(0, 5).map((article, index) => (
									<Link
										href={`/news/${article.id}`}
										key={article.id}
										className={`${cardClass} flex items-start gap-3 p-4 transition-shadow hover:shadow-md`}
									>
										<span className="text-sm font-semibold tabular-nums text-brand-green">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="min-w-0 flex-1">
											<h4 className="mb-1.5 line-clamp-2 text-sm font-medium text-brand-navy">
												{article.title}
											</h4>
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7a8397]">
												<span className="flex items-center">
													<Eye className="mr-1 h-3 w-3" />
													{article.view_count.toLocaleString()}
												</span>
												<span>{getReadTime(article.read_minutes)}</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						</Reveal>

						{/* Trending Articles */}
						<Reveal delay={0.16} className="lg:col-span-1">
							<h2 className={`${columnHeading} flex items-center justify-center gap-2 sm:justify-start`}>
								<TrendingUp className="h-5 w-5 text-brand-green" />
								Trending
							</h2>
							<div className="flex flex-col gap-3">
								{trending.map((article) => (
									<Link
										href={`/news/${article.id}`}
										key={article.id}
										className={`${cardClass} p-4 transition-shadow hover:shadow-md`}
									>
										<h4 className="mb-1.5 line-clamp-2 text-sm font-medium text-brand-navy">
											{article.title}
										</h4>
										<p className="mb-2 line-clamp-2 text-xs leading-relaxed text-[#606b80]">
											{stripHtml(article.content)}
										</p>
										<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7a8397]">
											<span>{formatDate(article.published_date)}</span>
											<span className="flex items-center">
												<Eye className="mr-1 h-3 w-3" />
												{article.view_count.toLocaleString()}
											</span>
										</div>
									</Link>
								))}
							</div>
						</Reveal>
					</div>
				</Section>

				{/* Other News (Videos & External Links) Section */}
				{others.length > 0 && (
					<Section pattern>
						<SectionHeading
							title="External Content & Videos"
							description="Discover curated videos, external articles, and multimedia content from trusted sources"
						/>
						<div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{others.map((other, index) => (
								<Reveal key={other.id} delay={Math.min(index, 6) * 0.06} className="group relative">
									<EmbeddedContent
										title={other.title}
										description={other.description}
										link={other.link}
										createdAt={other.createdAt}
										className="h-full overflow-hidden rounded-3xl transition-all duration-300 group-hover:shadow-xl"
									/>
								</Reveal>
							))}
						</div>
					</Section>
				)}

				{/* Browse by Category Section */}
				<Section id="browse-news-section">
					<SectionHeading
						title="Browse News"
						description="Search every story, or filter by category"
					/>

					{/* Search and Filter Section */}
					<Reveal className="mx-auto mt-10 max-w-3xl">
						<div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brand-green/40">
							<Search className="h-4 w-4 shrink-0 text-[#9aa3b5]" />
							<input
								placeholder="Search news..."
								value={searchInput}
								onChange={handleSearchInputChange}
								onKeyPress={handleSearchKeyPress}
								className="min-w-0 flex-1 bg-transparent py-2 text-brand-navy placeholder:text-[#9aa3b5] focus:outline-none"
							/>
							<button
								type="button"
								onClick={handleSearch}
								className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green sm:px-6"
							>
								Search
							</button>
						</div>

						<div className="mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
							{[{ id: "All", name: "All" }, ...categories].map((category) => (
								<button
									key={category.id}
									type="button"
									onClick={() => handleCategoryChange(category.name)}
									className={chipClass(selectedCategory === category.name)}
								>
									{category.name}
								</button>
							))}
							{showFilterReset && (
								<button
									key="Cancel"
									type="button"
									onClick={() => {
										setSearchInput("");
										setSelectedCategory("All");
										if (searchParams.get("q")) {
											router.replace("/news");
										} else {
											void fetchNewsByQuery(1, undefined, { q: "" });
										}
									}}
									className="inline-flex shrink-0 items-center rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 ring-1 ring-red-100 transition-colors hover:bg-red-100"
								>
									<X className="mr-1 h-4 w-4" />
									Reset filters
								</button>
							)}
						</div>
					</Reveal>

					{/* News Grid */}
					{isLoading ? (
						<div className="flex items-center justify-center py-16 text-[#606b80]">
							<Loader2 className="h-6 w-6 animate-spin text-brand-green" />
							<span className="ml-2">Loading...</span>
						</div>
					) : (
						<div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{getCurrentNewsItems().map((article, index) => (
								<Reveal key={article.id} delay={(index % 3) * 0.06}>
									<Link
										href={`/news/${article.id}`}
										className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
									>
										<div className="h-60 overflow-hidden bg-[#eef1f5]">
											<img
												src={getImageUrl(article)}
												alt={article.title}
												width={400}
												height={250}
												className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
										</div>
										<div className="flex flex-1 flex-col p-5">
											<h3 className="mb-2 line-clamp-2 font-semibold tracking-tight text-brand-navy">
												{article.title}
											</h3>
											<p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#606b80]">
												{stripHtml(article.content)}
											</p>
											<div className="mt-auto flex items-center justify-between gap-3 text-xs text-[#7a8397]">
												<span className="truncate">TGA Global Law Firm LL.P</span>
												<span className="shrink-0">{formatNewsMetaDate(article)}</span>
											</div>
										</div>
									</Link>
								</Reveal>
							))}
						</div>
					)}

					{/* Pagination for Browse by Category */}
					{getPaginationInfo() && (
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
								Page {getPaginationInfo()?.currentPage} of{" "}
								{getPaginationInfo()?.totalPages}
							</span>

							<button
								type="button"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === getPaginationInfo()?.totalPages}
								className={pagerClass}
							>
								Next
								<ChevronRight className="ml-1 h-4 w-4" />
							</button>
						</div>
					)}
				</Section>
				</>
				)}

				<Footer />
			</div>
		</MotionConfig>
	);
}
