"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import {
	NewsResponse,
	News,
	Other,
	NewsQueryResponse,
	CategoryResponse,
} from "@/app/types/news";
import { convertToApiUrl } from "@/lib/utils";
import Header from "./Header";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";

interface NewsQueryParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	order?: "asc" | "desc";
	q?: string;
	category?: string;
}

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
	console.log(news);
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
	const [currentPage, setCurrentPage] = useState(1);
	const [queryResults, setQueryResults] = useState<NewsQueryResponse | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [carouselApi, setCarouselApi] = useState<any>(null);
	const [isNavigating, setIsNavigating] = useState(false);

	// Keep input in sync with URL
	useEffect(() => {
		setSearchInput(searchParams.get("q") || "");
	}, [searchParams]);

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
		return "/office/placeholder.jpg";
	};

	// Helper function to format date
	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleDateString();
	};

	// Helper function to get read time
	const getReadTime = (minutes: number | null) => {
		return minutes ? `${minutes} min read` : "5 min read";
	};

	// Fetch news by query for Browse by Category section
	const fetchNewsByQuery = async (page: number = 1, categoryId?: number) => {
		setIsLoading(true);
		try {
			const params: any = {
				page,
				limit: 6,
				sortBy: "published_date",
				order: "desc",
			};

			if (searchInput.trim()) {
				params.q = searchInput.trim();
			}

			// Use the passed categoryId or fall back to selectedCategory
			if (categoryId) {
				params.category = categoryId;
			}

			// Build query string for API route
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
			setIsLoading(false);
		}
	};

	// Handle search for Browse by Category section
	const handleSearch = () => {
		if (searchInput.trim() || selectedCategory !== "All") {
			setIsSearchMode(true);
			fetchNewsByQuery(1);
		} else {
			setIsSearchMode(false);
			setQueryResults(null);
		}
	};

	// Handle category change for Browse by Category section
	const handleCategoryChange = (categoryName: string) => {
		setSelectedCategory(categoryName);
		let catId = categories.find((cat) => cat.name === categoryName)?.id;
		if (categoryName !== "All" || searchInput.trim()) {
			setIsSearchMode(true);
			fetchNewsByQuery(1, catId);
		} else {
			setIsSearchMode(false);
			setQueryResults(null);
		}
	};

	// Handle page change for Browse by Category section
	const handlePageChange = (page: number) => {
		fetchNewsByQuery(page);
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

	// Search handler for 3-section search bar
	const handleThreeSectionSearchKeyPress = async () => {
		document
			.getElementById("browse-news-section")
			?.scrollIntoView({ behavior: "smooth" });
	};

	// Get current news items to display in Browse by Category section
	const getCurrentNewsItems = () => {
		if (isSearchMode && queryResults) {
			return queryResults.data.news;
		}
		return newsQuery.data.news;
	};

	// Get pagination info for Browse by Category section
	const getPaginationInfo = () => {
		if (isSearchMode && queryResults) {
			return queryResults.data.pagination;
		}
		return newsQuery.data.pagination;
	};

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
		<div className="min-h-screen bg-white">
			{/* Header */}
			<Header currentPage="news" />

			<div className="container mx-auto px-4 mt-16 py-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">NEWS</h1>
					<p className="text-base md:text-lg text-gray-600">
						Stay updated with the latest legal insights and industry developments
					</p>
				</div>

				{/* 3-Section Layout */}
				<section className="mb-16 py-6 bg-gray-100">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
						{/* Left Section - Browse News */}
						<div className="md:col-span-1 lg:col-span-1 order-1 md:order-1 lg:order-1">
							<div className="rounded-lg px-2 md:px-4 h-full">
								{/* Search */}
								<Button
									variant="outline"
									className="w-full mb-4 flex justify-between hover:bg-white text-sm"
									onClick={() => {
										handleThreeSectionSearchKeyPress();
									}}
								>
									Search News
									<Search className="w-4 h-4" />
								</Button>

								{/* News List */}
								<div className="flex flex-col gap-2 max-h-64 md:max-h-96 overflow-y-auto">
									{latest.slice(0, 3).map((article) => (
										<Link href={`/news/${article.id}`} key={article.id}>
											<Card
												key={article.id}
												className="overflow-hidden hover:shadow-md transition-shadow rounded-none"
											>
												<CardContent className="p-2 md:p-3">
													<div className="flex space-x-2 md:space-x-3">
														<div className="flex-1 min-w-0">
															<h4 className="font-medium text-xs md:text-sm text-gray-900 mb-1 line-clamp-2">
																{article.title}
															</h4>
															<div className="flex items-center text-xs text-gray-500 space-x-1 md:space-x-2">
																<span className="text-xs">
																	{formatDate(article.published_date)}
																</span>
																<span className="flex items-center">
																	<Eye className="w-3 h-3 mr-1" />
																	{article.view_count.toLocaleString()}
																</span>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</div>
						</div>

						{/* Middle Section - Featured News Carousel */}
						<div className="md:col-span-2 lg:col-span-2 order-3 md:order-2 lg:order-2">
							<div className="h-full">
								{featured.length > 0 && (
									<Carousel
										opts={{
											align: "start",
											loop: true,
										}}
										setApi={setCarouselApi}
										className="w-full h-full"
									>
										<CarouselContent>
											{featured.map((article) => (
												<CarouselItem key={article.id}>
													<Link href={`/news/${article.id}`} key={article.id}>
														<div className="overflow-hidden">
															<div className="relative h-[200px] md:h-[300px] lg:h-[400px] w-full">
																<Image
																	src={getImageUrl(article)}
																	alt={article.title}
																	fill={true}
																	className="object-cover"
																/>
															</div>
															<CardContent className="p-3 md:p-4 bg-white">
																<h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2">
																	{article.title}
																</h3>
																<p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
																	{article.content}
																</p>
																<div className="flex items-center justify-between text-xs text-gray-500">
																	<span>TGA Law Group</span>
																	<span>{formatDate(article.published_date)}</span>
																</div>
															</CardContent>
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
						</div>

						{/* Right Section - Latest & Trending Tabs */}
						<div className="md:col-span-1 lg:col-span-1 order-2 md:order-3 lg:order-3">
							<div className="rounded-lg px-2 md:px-6 h-full">
								<Tabs defaultValue="latest" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-4">
										<TabsTrigger
											value="latest"
											className="data-[state=active]:text-white data-[state=active]:bg-[#69b2a4] text-xs md:text-sm"
										>
											Latest
										</TabsTrigger>
										<TabsTrigger
											value="trending"
											className="data-[state=active]:text-white data-[state=active]:bg-[#69b2a4] text-xs md:text-sm"
										>
											Trending
										</TabsTrigger>
									</TabsList>

									<TabsContent
										value="latest"
										className="flex flex-col gap-2 max-h-64 md:max-h-96 overflow-y-auto"
									>
										{latest.slice(0, 4).map((article) => (
											<Link href={`/news/${article.id}`} key={article.id}>
												<Card
													key={article.id}
													className="overflow-hidden hover:shadow-md transition-shadow rounded-none"
												>
													<CardContent className="p-2 md:p-3">
														<div className="flex space-x-2 md:space-x-3">
															<div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0 relative bg-gray-200 rounded">
																<Image
																	src={getImageUrl(article)}
																	alt={article.title}
																	fill={true}
																	className="object-cover rounded"
																/>
															</div>
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-xs md:text-sm text-gray-900 mb-1 line-clamp-2">
																	{article.title}
																</h4>
																<div className="flex items-center text-xs text-gray-500 space-x-1 md:space-x-2">
																	<span className="text-xs">
																		{formatDate(article.published_date)}
																	</span>
																	<span className="flex items-center">
																		<Eye className="w-3 h-3 mr-1" />
																		{article.view_count.toLocaleString()}
																	</span>
																</div>
															</div>
														</div>
													</CardContent>
												</Card>
											</Link>
										))}
									</TabsContent>

									<TabsContent
										value="trending"
										className="flex flex-col gap-2 max-h-64 md:max-h-96 overflow-y-auto"
									>
										{trending.slice(0, 4).map((article) => (
											<Link href={`/news/${article.id}`} key={article.id}>
												<Card
													key={article.id}
													className="overflow-hidden hover:shadow-md transition-shadow rounded-none"
												>
													<CardContent className="p-2 md:p-3">
														<div className="flex space-x-2 md:space-x-3">
															<div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0 relative bg-gray-200 rounded">
																<Image
																	src={getImageUrl(article)}
																	alt={article.title}
																	fill={true}
																	className="object-cover rounded"
																/>
															</div>
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-xs md:text-sm text-gray-900 mb-1 line-clamp-2">
																	{article.title}
																</h4>
																<div className="flex items-center text-xs text-gray-500 space-x-1 md:space-x-2">
																	<span className="text-xs">
																		{formatDate(article.published_date)}
																	</span>
																	<span className="flex items-center">
																		<Eye className="w-3 h-3 mr-1" />
																		{article.view_count.toLocaleString()}
																	</span>
																</div>
															</div>
														</div>
													</CardContent>
												</Card>
											</Link>
										))}
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>
				</section>

				{/* Featured Articles */}
				{featured.length > 0 && (
					<section className="mb-12">
						<h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
							Featured Stories
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
							{featured.slice(0, 3).map((article) => (
								<Card
									key={article.id}
									className="overflow-hidden hover:shadow-xl transition-shadow"
								>
									<div className="relative">
										<Image
											src={getImageUrl(article)}
											alt={article.title}
											width={400}
											height={250}
											className="w-full h-40 md:h-48 object-cover"
										/>
										{trending.some((t) => t.id === article.id) && (
											<Badge className="absolute top-2 md:top-4 right-2 md:right-4 bg-red-500 text-xs">
												<TrendingUp className="w-3 h-3 mr-1" />
												Trending
											</Badge>
										)}
									</div>
									<CardContent className="p-3 md:p-4">
										<h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
											{article.title}
										</h3>
										<p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
											{article.content}
										</p>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 mb-3 space-y-1 md:space-y-0">
											<div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
												<span className="flex items-center">
													<User className="w-3 h-3 mr-1" />
													TGA Law Group
												</span>
												<span className="flex items-center">
													<Calendar className="w-3 h-3 mr-1" />
													{formatDate(article.published_date)}
												</span>
											</div>
											<div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
												<span className="flex items-center">
													<Clock className="w-3 h-3 mr-1" />
													{getReadTime(article.read_minutes)}
												</span>
												<span className="flex items-center">
													<Eye className="w-3 h-3 mr-1" />
													{article.view_count.toLocaleString()}
												</span>
											</div>
										</div>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
											<Link href={`/news/${article.id}`}>
												<Button className="bg-teal-500 hover:bg-teal-600 text-xs md:text-sm w-full md:w-auto">
													Read More
													<ChevronRight className="w-3 h-3 ml-1" />
												</Button>
											</Link>
											<div className="flex justify-center md:justify-end space-x-2">
												<Button
													variant="outline"
													size="icon"
													onClick={() => handleShare(article)}
													className="w-8 h-8"
												>
													<Share2 className="w-3 h-3" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</section>
				)}

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
					{/* Latest Articles */}
					<div className="lg:col-span-2">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl md:text-2xl font-semibold text-gray-900">
								LATEST
							</h2>
							{/* <Button
								variant="outline"
								className="text-teal-500 border-teal-500 bg-transparent"
							>
								View All
							</Button> */}
						</div>
						<div className="flex flex-col gap-2">
							{latest.slice(0, 5).map((article) => (
								<Link href={`/news/${article.id}`} key={article.id}>
									<Card
										key={article.id}
										className="overflow-hidden hover:shadow-lg transition-shadow"
									>
										<CardContent className="p-0">
											<div className="flex">
												<div className="w-32 h-26 flex-shrink-0 relative bg-red-500">
													<Image
														src={getImageUrl(article)}
														alt={article.title}
														// width={128}
														// height={96}
														className="w-full h-full object-cover"
														fill={true}
													/>
												</div>
												<div className="p-3 md:p-4 flex-1">
													<h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2">
														{article.title}
													</h3>
													<div className="flex flex-col md:flex-row md:items-center text-xs text-gray-500 space-y-1 md:space-y-0 md:space-x-3">
														<span>TGA Law Group</span>
														<span>{formatDate(article.published_date)}</span>
														<span>{getReadTime(article.read_minutes)}</span>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>

					{/* Top Articles Sidebar */}
					<div className="lg:col-span-1">
						<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">HOT</h2>
						<div className="flex flex-col gap-2">
							{hot.slice(0, 5).map((article, index) => (
								<Link href={`/news/${article.id}`} key={article.id}>
									<Card
										key={article.id}
										className="overflow-hidden hover:shadow-md transition-shadow"
									>
										<CardContent className="p-3 md:p-4">
											<div className="flex items-start space-x-2 md:space-x-3">
												<div className="bg-teal-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
													{index + 1}
												</div>
												<div className="flex-1">
													<h4 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 line-clamp-2">
														{article.title}
													</h4>
													<div className="flex flex-col md:flex-row md:items-center text-xs text-gray-500 space-y-1 md:space-y-0 md:space-x-2">
														<span className="flex items-center">
															<Eye className="w-3 h-3 mr-1" />
															{article.view_count.toLocaleString()}
														</span>
														<span>{getReadTime(article.read_minutes)}</span>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>

					{/* Trending Articles */}
					<div className="lg:col-span-1">
						<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
							<TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-2 text-red-500" />
							TRENDING
						</h2>
						<div className="flex flex-col gap-2">
							{trending.map((article) => (
								<Link href={`/news/${article.id}`} key={article.id}>
									<Card
										key={article.id}
										className="overflow-hidden hover:shadow-md transition-shadow"
									>
										<CardContent className="p-3 md:p-4">
											<h4 className="font-semibold text-xs md:text-sm text-gray-900 mb-2 line-clamp-2">
												{article.title}
											</h4>
											<p className="text-xs text-gray-600 mb-2 line-clamp-2">
												{article.content}
											</p>
											<div className="flex flex-col md:flex-row md:items-center text-xs text-gray-500 space-y-1 md:space-y-0 md:space-x-2">
												<span>{formatDate(article.published_date)}</span>
												<span className="flex items-center">
													<Eye className="w-3 h-3 mr-1" />
													{article.view_count.toLocaleString()}
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* Other News (Videos & External Links) Section */}
				{others.length > 0 && (
					<section className="mt-16 md:mt-20">
						<div className="mx-auto px-0 md:px-4">
							{/* Section Header */}
							<div className="mb-8 md:mb-12">
								<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
									External Content & Videos
								</h2>
								<p className="text-base md:text-lg text-gray-600 max-w-2xl">
									Discover curated videos, external articles, and multimedia content from
									trusted sources
								</p>
							</div>

							{/* Content Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
								{others.map((other, index) => (
									<div
										key={other.id}
										className="group relative"
										style={{
											animationDelay: `${index * 100}ms`,
										}}
									>
										<EmbeddedContent
											title={other.title}
											description={other.description}
											link={other.link}
											createdAt={other.createdAt}
											className="h-full transform transition-all duration-300 group-hover:scale-100 group-hover:shadow-2xl rounded-md"
										/>
									</div>
								))}
							</div>

							{/* Call to Action */}
							{/* <div className="text-center mt-12">
								<Button
									variant="outline"
									size="lg"
									className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:border-teal-700 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
									onClick={() => {
										document.getElementById("browse-news-section")?.scrollIntoView({
											behavior: "smooth",
										});
									}}
								>
									<ChevronRight className="w-5 h-5 mr-2" />
									Explore More Content
								</Button>
							</div> */}
						</div>
					</section>
				)}

				{/* Browse by Category Section */}
				<section id="browse-news-section" className="mt-16">
					<h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
						Browse News
					</h2>

					{/* Search and Filter Section */}
					<div className="mb-8">
						<div className="flex flex-col md:flex-row gap-4 mb-6">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search news..."
									value={searchInput}
									onChange={handleSearchInputChange}
									onKeyPress={handleSearchKeyPress}
									className="pl-10"
								/>
							</div>
							<Button
								onClick={handleSearch}
								className="bg-teal-500 hover:bg-teal-600 w-full md:w-auto"
							>
								Search
							</Button>
						</div>

						<div className="flex flex-wrap gap-2 mb-8">
							<Button
								key="All"
								variant={selectedCategory === "All" ? "default" : "outline"}
								onClick={() => handleCategoryChange("All")}
								className={`text-xs md:text-sm ${
									selectedCategory === "All" ? "bg-teal-500 hover:bg-teal-600" : ""
								}`}
							>
								All
							</Button>
							{categories.map((category) => (
								<Button
									key={category.id}
									variant={selectedCategory === category.name ? "default" : "outline"}
									onClick={() => handleCategoryChange(category.name)}
									className={`text-xs md:text-sm ${
										selectedCategory === category.name
											? "bg-teal-500 hover:bg-teal-600"
											: ""
									}`}
								>
									{category.name}
								</Button>
							))}
							{isSearchMode && (
								<Button
									key="Cancel"
									variant={selectedCategory === "All" ? "default" : "outline"}
									onClick={() => {
										setSearchInput("");
										setIsSearchMode(false);
										setQueryResults(null);
									}}
									className={`text-xs md:text-sm ${
										selectedCategory === "All" ? "bg-red-500 hover:bg-red-600" : ""
									}`}
								>
									<X className="w-4 h-4 mr-1" />
									Cancel Search
								</Button>
							)}
						</div>
					</div>

					{/* News Grid */}
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
							<span className="ml-2 text-gray-600">Loading...</span>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
							{getCurrentNewsItems().map((article) => (
								<Link href={`/news/${article.id}`} key={article.id}>
									<Card
										key={article.id}
										className="overflow-hidden hover:shadow-lg transition-shadow"
									>
										<div className="relative">
											<Image
												src={getImageUrl(article)}
												alt={article.title}
												width={400}
												height={250}
												className="w-full h-40 md:h-48 object-cover"
											/>
										</div>
										<CardContent className="p-3 md:p-4">
											<h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2">
												{article.title}
											</h3>
											<p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
												{article.content}
											</p>
											<div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 space-y-1 md:space-y-0">
												<span>TGA Law Group</span>
												<span>{formatDate(article.published_date)}</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					)}

					{/* Pagination for Browse by Category */}
					{getPaginationInfo() && (
						<div className="flex items-center justify-center space-x-2 mt-8">
							<Button
								variant="outline"
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="flex items-center text-xs md:text-sm"
							>
								<ChevronLeft className="w-4 h-4 mr-1" />
								Previous
							</Button>

							<span className="text-xs md:text-sm text-gray-600">
								Page {getPaginationInfo()?.currentPage} of{" "}
								{getPaginationInfo()?.totalPages}
							</span>

							<Button
								variant="outline"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === getPaginationInfo()?.totalPages}
								className="flex items-center text-xs md:text-sm"
							>
								Next
								<ChevronRight className="w-4 h-4 ml-1" />
							</Button>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
