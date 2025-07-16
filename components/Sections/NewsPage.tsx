"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmbeddedContent } from "@/components/ui/embedded-content";
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
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [queryResults, setQueryResults] = useState<NewsQueryResponse | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isSearchMode, setIsSearchMode] = useState(false);

	const { featured, latest, trending, others } = news.data;
	const categories = catData.data.categories.map((category) => {
		return {
			name: category.name,
			id: category.id,
		};
	});

	// Helper function to get image URL
	const getImageUrl = (newsItem: News) => {
		if (newsItem.visual_content && newsItem.visual_content.length > 0) {
			return convertToApiUrl(newsItem.visual_content[0].secure_url);
		}
		return "/placeholder.svg";
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
	const fetchNewsByQuery = async (page: number = 1, categoryName?: string) => {
		setIsLoading(true);
		try {
			const params: any = {
				page,
				limit: 6,
				sortBy: "published_date",
				order: "desc",
			};

			if (searchQuery.trim()) {
				params.q = searchQuery.trim();
			}

			// Use the passed categoryName or fall back to selectedCategory
			const categoryToUse = categoryName || selectedCategory;

			if (categoryToUse !== "All") {
				// Find the category by name and use its id
				const category = categories.find((cat) => cat.name === categoryToUse);
				if (category) {
					params.category = category.id;
				}
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
		if (searchQuery.trim() || selectedCategory !== "All") {
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
		if (categoryName !== "All" || searchQuery.trim()) {
			setIsSearchMode(true);
			fetchNewsByQuery(1, categoryName); // Pass the category name directly
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
		setSearchQuery(e.target.value);
	};

	// Handle search on Enter key
	const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
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

	const handleShare = async (news: News) => {
		try {
			// Copy the file URL to clipboard
			await navigator.clipboard.writeText(`${window.location.origin}/news/${news.id}`);

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
			<Header />

			<div className="container mx-auto px-4 mt-16 py-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-1">NEWS</h1>
					<p className="text-lg text-gray-600">
						Stay updated with the latest legal insights and industry developments
					</p>
				</div>

				{/* Featured Articles */}
				{featured.length > 0 && (
					<section className="mb-12">
						<h2 className="text-2xl font-semibold text-gray-900 mb-6">
							Featured Stories
						</h2>
						<div className="grid lg:grid-cols-2 gap-8">
							{featured.slice(0, 2).map((article, index) => (
								<Card
									key={article.id}
									className={`overflow-hidden hover:shadow-xl transition-shadow ${
										index === 0 ? "lg:col-span-1" : ""
									}`}
								>
									<div className="relative">
										<Image
											src={getImageUrl(article)}
											alt={article.title}
											width={600}
											height={400}
											className="w-full h-64 object-cover"
										/>
										{trending.some((t) => t.id === article.id) && (
											<Badge className="absolute top-4 right-4 bg-red-500">
												<TrendingUp className="w-3 h-3 mr-1" />
												Trending
											</Badge>
										)}
									</div>
									<CardContent className="p-6">
										<h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
											{article.title}
										</h3>
										<p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
										<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
											<div className="flex items-center space-x-4">
												<span className="flex items-center">
													<User className="w-4 h-4 mr-1" />
													{article.created_by}
												</span>
												<span className="flex items-center">
													<Calendar className="w-4 h-4 mr-1" />
													{formatDate(article.published_date)}
												</span>
											</div>
											<div className="flex items-center space-x-4">
												<span className="flex items-center">
													<Clock className="w-4 h-4 mr-1" />
													{getReadTime(article.read_minutes)}
												</span>
												<span className="flex items-center">
													<Eye className="w-4 h-4 mr-1" />
													{article.view_count.toLocaleString()}
												</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<Link href={`/news/${article.id}`}>
												<Button className="bg-teal-500 hover:bg-teal-600">
													Read More
													<ChevronRight className="w-4 h-4 ml-2" />
												</Button>
											</Link>
											<div className="flex space-x-2">
												<Button variant="outline" size="icon" onClick={() => handleShare(article)}>
													<Share2 className="w-4 h-4" />
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
				<div className="grid lg:grid-cols-4 gap-8">
					{/* Latest Articles */}
					<div className="lg:col-span-2">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-semibold text-gray-900">LATEST</h2>
							<Button
								variant="outline"
								className="text-teal-500 border-teal-500 bg-transparent"
							>
								View All
							</Button>
						</div>
						<div className="space-y-6">
							{latest.slice(0, 5).map((article) => (
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
											<div className="p-4 flex-1">
												<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
													{article.title}
												</h3>
												<div className="flex items-center text-xs text-gray-500 space-x-3">
													<span>{article.created_by}</span>
													<span>{formatDate(article.published_date)}</span>
													<span>{getReadTime(article.read_minutes)}</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Top Articles Sidebar */}
					<div className="lg:col-span-1">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">TOP</h2>
						<div className="space-y-4">
							{[...latest]
								.sort((a, b) => b.view_count - a.view_count)
								.slice(0, 6)
								.map((article, index) => (
									<Card
										key={article.id}
										className="overflow-hidden hover:shadow-md transition-shadow"
									>
										<CardContent className="p-4">
											<div className="flex items-start space-x-3">
												<div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
													{index + 1}
												</div>
												<div className="flex-1">
													<h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
														{article.title}
													</h4>
													<div className="flex items-center text-xs text-gray-500 space-x-2">
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
								))}
						</div>
					</div>

					{/* Trending Articles */}
					<div className="lg:col-span-1">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
							<TrendingUp className="w-6 h-6 mr-2 text-red-500" />
							TRENDING
						</h2>
						<div className="space-y-4">
							{trending.map((article) => (
								<Card
									key={article.id}
									className="overflow-hidden hover:shadow-md transition-shadow"
								>
									<CardContent className="p-4">
										<h4 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
											{article.title}
										</h4>
										<p className="text-xs text-gray-600 mb-2 line-clamp-2">
											{article.content}
										</p>
										<div className="flex items-center text-xs text-gray-500 space-x-2">
											<span>{formatDate(article.published_date)}</span>
											<span className="flex items-center">
												<Eye className="w-3 h-3 mr-1" />
												{article.view_count.toLocaleString()}
											</span>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* Other News (Videos & External Links) Section */}
				{others.length > 0 && (
					<section className="mt-16">
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-2xl font-semibold text-gray-900">OTHER NEWS</h2>
							<Button
								variant="outline"
								className="text-teal-500 border-teal-500 bg-transparent"
							>
								View All Content
							</Button>
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{others.map((other) => (
								<EmbeddedContent
									key={other.id}
									title={other.title}
									description={other.description}
									link={other.link}
									createdAt={other.createdAt}
								/>
							))}
						</div>
					</section>
				)}

				{/* Browse by Category Section */}
				<section className="mt-16">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse News</h2>

					{/* Search and Filter Section */}
					<div className="mb-8">
						<div className="flex flex-col md:flex-row gap-4 mb-6">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search news..."
									value={searchQuery}
									onChange={handleSearchInputChange}
									onKeyPress={handleSearchKeyPress}
									className="pl-10"
								/>
							</div>
							<Button onClick={handleSearch} className="bg-teal-500 hover:bg-teal-600">
								Search
							</Button>
						</div>

						<div className="flex flex-wrap gap-2 mb-8">
							<Button
								key="All"
								variant={selectedCategory === "All" ? "default" : "outline"}
								onClick={() => handleCategoryChange("All")}
								className={
									selectedCategory === "All" ? "bg-teal-500 hover:bg-teal-600" : ""
								}
							>
								All
							</Button>
							{categories.map((category) => (
								<Button
									key={category.id}
									variant={selectedCategory === category.name ? "default" : "outline"}
									onClick={() => handleCategoryChange(category.name)}
									className={
										selectedCategory === category.name
											? "bg-teal-500 hover:bg-teal-600"
											: ""
									}
								>
									{category.name}
								</Button>
							))}
							{isSearchMode && (
								<Button
									key="Cancel"
									variant={selectedCategory === "All" ? "default" : "outline"}
									onClick={() => {
										// setSelectedCategory("All");
										setSearchQuery("");
										setIsSearchMode(false);
										setQueryResults(null);
									}}
									className={
										selectedCategory === "All" ? "bg-red-500 hover:bg-red-600" : ""
									}
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
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{getCurrentNewsItems().map((article) => (
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
											className="w-full h-48 object-cover"
										/>
									</div>
									<CardContent className="p-4">
										<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
											{article.title}
										</h3>
										<p className="text-sm text-gray-600 mb-3 line-clamp-2">
											{article.content}
										</p>
										<div className="flex items-center justify-between text-xs text-gray-500">
											<span>{article.created_by}</span>
											<span>{formatDate(article.published_date)}</span>
										</div>
									</CardContent>
								</Card>
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
								className="flex items-center"
							>
								<ChevronLeft className="w-4 h-4 mr-1" />
								Previous
							</Button>

							<span className="text-sm text-gray-600">
								Page {getPaginationInfo()?.currentPage} of{" "}
								{getPaginationInfo()?.totalPages}
							</span>

							<Button
								variant="outline"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === getPaginationInfo()?.totalPages}
								className="flex items-center"
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
