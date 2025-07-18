"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Resource, incrementDocumentView } from "@/app/actions/resources.actions";
import { Category } from "@/app/types/news";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import Header from "./Header";
import { useToast } from "@/hooks/use-toast";

interface ResourcesPageProps {
	resources: Resource[];
	topViewedResources: Resource[];
	categories: Category[];
	pagination?: {
		currentPage: number;
		totalPages: number;
		totalItems: string;
		itemsPerPage: number;
	};
	isLoading?: boolean;
}

// Skeleton component for resource cards
const ResourceCardSkeleton = () => (
	<Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl overflow-hidden flex flex-col h-full">
		<CardContent className="p-0 flex flex-col h-full">
			{/* Header skeleton */}
			<div className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-white relative overflow-hidden">
				<Skeleton className="w-12 h-12 bg-white/20 rounded-2xl mx-auto" />
			</div>

			{/* Content skeleton */}
			<div className="p-6 flex flex-col flex-grow">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-2">
						<Skeleton className="w-12 h-5 bg-gray-200 rounded" />
						<Skeleton className="w-16 h-5 bg-gray-200 rounded" />
					</div>
					<Skeleton className="w-8 h-4 bg-gray-200 rounded" />
				</div>

				<Skeleton className="w-full h-6 bg-gray-200 rounded mb-3" />
				<Skeleton className="w-3/4 h-6 bg-gray-200 rounded mb-4" />

				<Skeleton className="w-full h-4 bg-gray-200 rounded mb-4" />
				<Skeleton className="w-2/3 h-4 bg-gray-200 rounded mb-6" />

				{/* Action buttons skeleton */}
				<div className="flex space-x-2 mt-auto">
					<Skeleton className="flex-1 h-9 bg-gray-200 rounded" />
					<Skeleton className="w-9 h-9 bg-gray-200 rounded" />
				</div>
			</div>
		</CardContent>
	</Card>
);

// Skeleton for most visited section
const MostVisitedSkeleton = () => (
	<div className="mb-8">
		<div className="flex items-center mb-4">
			<TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
			<h2 className="text-2xl font-bold text-gray-900">Most Visited</h2>
		</div>
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, index) => (
				<Card
					key={index}
					className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl overflow-hidden flex flex-col h-full"
				>
					<CardContent className="p-0 flex flex-col h-full">
						<div className="p-4 flex flex-col flex-grow">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center space-x-2">
									<Skeleton className="w-10 h-4 bg-gray-200 rounded" />
									<Skeleton className="w-14 h-4 bg-gray-200 rounded" />
								</div>
							</div>

							<Skeleton className="w-full h-5 bg-gray-200 rounded mb-2" />
							<Skeleton className="w-3/4 h-5 bg-gray-200 rounded mb-4" />

							<div className="flex items-center text-sm text-gray-500 mb-4">
								<Eye className="w-4 h-4 mr-1" />
								<Skeleton className="w-12 h-4 bg-gray-200 rounded" />
							</div>

							<div className="flex space-x-2 mt-auto">
								<Skeleton className="flex-1 h-8 bg-gray-200 rounded" />
								<Skeleton className="w-8 h-8 bg-gray-200 rounded" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	</div>
);

export default function ResourcesPage({ resources, topViewedResources, categories, pagination, isLoading = false }: ResourcesPageProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useAuth();
	const { toast } = useToast();
	
	// Get search term from URL or default to empty
	const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
	const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isIncrementingView, setIsIncrementingView] = useState(false);
	const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

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
		setCurrentPage(page);
		updateURL(searchTerm, selectedCategory, page);
	};

	// Handle search input change
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
	};

	// Handle search on Enter key press
	const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			updateURL(searchTerm, selectedCategory, 1); // Reset to page 1 when searching
		}
	};

	// Handle category selection
	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		updateURL(searchTerm, category, 1); // Reset to page 1 when changing category
	};

	return (
		<div className="min-h-screen bg-white">
			<Header />

			<div className="container mx-auto px-4 py-8 mt-16">
				<div className="grid lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-teal-500 text-white p-6 rounded-lg sticky top-8">
							<h1 className="text-2xl font-bold mb-6">RESOURCES</h1>

							{/* Search */}
							<div className="mb-6">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-200 w-4 h-4" />
									<Input
										type="text"
										placeholder="Search resources... (Press Enter to search)"
										value={searchTerm}
										onChange={(e) => handleSearchChange(e.target.value)}
										onKeyPress={handleSearchKeyPress}
										className="pl-10 pr-12 bg-white/20 border-white/30 text-white placeholder:text-teal-200 focus:bg-white/30"
									/>
									<Button
										size="sm"
										onClick={() => updateURL(searchTerm, selectedCategory)}
										className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0"
									>
										<Search className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{/* Categories */}
							<div>
								<h3 className="text-xl font-semibold mb-4 flex items-center">
									<Folder className="w-5 h-5 mr-2" />
									Categories
								</h3>
								<div className="space-y-2">
									{/* All Categories Option */}
									<button
										onClick={() => handleCategorySelect("All")}
										className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center ${
											selectedCategory === "All"
												? "bg-white/20 text-white"
												: "text-teal-100 hover:bg-white/10 hover:text-white"
										}`}
									>
										<Folder className="w-4 h-4 mr-2 flex-shrink-0" />
										<span className="truncate">All Categories</span>
										<Badge
											variant="secondary"
											className="ml-auto bg-white/20 text-teal-100 text-xs"
										>
											{isLoading ? "..." : resources.length}
										</Badge>
									</button>

									{/* Individual Categories */}
									{categories.map((category) => (
										<button
											key={category.id}
											onClick={() => handleCategorySelect(category.id.toString())}
											className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center ${
												selectedCategory === category.id.toString()
													? "bg-white/20 text-white"
													: "text-teal-100 hover:bg-white/10 hover:text-white"
											}`}
										>
											<Folder className="w-4 h-4 mr-2 flex-shrink-0" />
											<span className="truncate">{category.name}</span>
											<Badge
												variant="secondary"
												className="ml-auto bg-white/20 text-teal-100 text-xs"
											>
												{isLoading
													? "..."
													: resources.filter((r) => r.category_id === category.id).length}
											</Badge>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3 flex gap-8 md:flex-col flex-col-reverse">
						{/* Most Visited Section */}
						{isLoading ? (
							<MostVisitedSkeleton />
						) : (
							<div className="mb-8">
								<div className="flex items-center mb-4">
									<TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
									<h2 className="text-xl font-bold text-gray-900">Most Visited</h2>
								</div>
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
									{topViewedResources.slice(0, 6).map((resource) => (
										<Card
											key={resource.id}
											className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl overflow-hidden flex flex-col h-full"
										>
											<CardContent className="p-0 flex flex-col h-full">
												{/* Content */}
												<div className="p-4 flex flex-col flex-grow">
													<div className="flex items-center justify-between mb-2">
														<div className="flex items-center space-x-2">
															<Badge
																variant="outline"
																className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50"
															>
																PDF
															</Badge>
															<Badge
																variant="outline"
																className="text-xs text-gray-600 border-gray-200 bg-gray-50"
															>
																{getCategoryName(resource.category_id)}
															</Badge>
														</div>
													</div>

													<Link href={`/resources/${resource.id}`}>
														<h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors cursor-pointer">
															{resource.title}
														</h3>
													</Link>

													<div className="flex items-center text-sm text-gray-500 mb-4">
														<Eye className="w-4 h-4 mr-1" />
														<span>{resource.view_count.toLocaleString()} views</span>
													</div>

													{/* Action Buttons - Always at bottom */}
													<div className="flex space-x-2 mt-auto">
														<Link href={`/resources/${resource.id}`} className="flex-1">
															<Button
																size="sm"
																className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
															>
																<Eye className="w-4 h-4 mr-2" />
																Open
															</Button>
														</Link>
														{/* <Button
															size="sm"
															variant="outline"
															onClick={() => handlePreview(resource)}
															className=" border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 flex items-center justify-center"
															title="Preview in new tab"
														>
															<ExternalLink className="w-4 h-4" />
														</Button> */}
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleOpenResource(resource)}
															disabled={isIncrementingView}
															className=" border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 flex items-center justify-center"
														>
															{isIncrementingView ? (
																<Loader2 className="w-4 h-4 mr-2 animate-spin" />
															) : (
																<ExternalLink className="w-4 h-4" />
															)}
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* Results Section */}
						<div>
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-gray-900">
									Results {searchTerm && `for "${searchTerm}"`}
								</h2>
								<div className="text-sm text-gray-500">
									{isLoading
										? "Loading..."
										: `${resources.length} resource${
												resources.length !== 1 ? "s" : ""
										  } found`}
								</div>
							</div>

							{isLoading ? (
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
									{Array.from({ length: 9 }).map((_, index) => (
										<ResourceCardSkeleton key={index} />
									))}
								</div>
							) : resources.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<FileText className="w-12 h-12 text-gray-400" />
									</div>
									<h3 className="text-xl font-semibold text-gray-600 mb-2">
										No resources found
									</h3>
									<p className="text-gray-500">
										Try adjusting your search terms or category filter.
									</p>
								</div>
							) : (
								<>
									<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
										{resources.map((resource) => (
											<Card
												key={resource.id}
												className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl overflow-hidden flex flex-col h-full"
											>
												<CardContent className="p-0 flex flex-col h-full">
													{/* Header with PDF Icon */}
													<div className="bg-gradient-to-br from-gray-500 to-gray-700 p-6 text-white relative overflow-hidden">
														<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
														<div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
														<div className="relative z-10 flex items-center justify-center">
															<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300 flex flex-col items-center justify-center gap-2">
																<FileText className="w-12 h-12 text-white" />
																<text
																	x="12"
																	y="16"
																	textAnchor="middle"
																	className="text-xs font-bold fill-current text-center"
																>
																	PDF
																</text>
															</div>
														</div>
													</div>

													{/* Content */}
													<div className="p-6 flex flex-col flex-grow">
														<div className="flex items-center justify-between mb-3">
															<div className="flex items-center space-x-2">
																<Badge
																	variant="outline"
																	className="text-xs text-red-600 border-red-200 bg-red-50"
																>
																	PDF
																</Badge>
																<Badge
																	variant="outline"
																	className="text-xs text-gray-600 border-gray-200 bg-gray-50"
																>
																	{getCategoryName(resource.category_id)}
																</Badge>
															</div>
															<div className="flex items-center text-xs text-gray-500">
																<Eye className="w-3 h-3 mr-1" />
																{resource.view_count}
															</div>
														</div>

														<Link href={`/resources/${resource.id}`}>
															<h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight group-hover:text-red-600 transition-colors cursor-pointer">
																{resource.title}
															</h3>
														</Link>

														<p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
															{resource.description}
														</p>

														<div className="flex items-center justify-between text-xs text-gray-500 mb-6">
															<div className="flex items-center space-x-3">
																<span className="flex items-center">
																	<Download className="w-3 h-3 mr-1" />
																	{resource.download_count}
																</span>
																<span className="text-gray-300">•</span>
																<span>{new Date(resource.createdAt).toLocaleDateString()}</span>
															</div>
														</div>

														{/* Action Buttons - Always at bottom */}
														<div className="flex space-x-2 mt-auto">
															<Link href={`/resources/${resource.id}`} className="flex-1">
																<Button
																	size="sm"
																	className="flex-1 bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-300 w-full"
																>
																	<Eye className="w-4 h-4 mr-2" />
																	Open
																</Button>
															</Link>
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleOpenResource(resource)}
																disabled={isIncrementingView}
																className=" border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 flex items-center justify-center"
															>
																{isIncrementingView ? (
																	<Loader2 className="w-4 h-4 mr-2 animate-spin" />
																) : (
																	<ExternalLink className="w-4 h-4" />
																)}
															</Button>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>

									{/* Pagination */}
									{pagination && pagination.totalPages > 1 && (
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
												Page {pagination.currentPage} of {pagination.totalPages}
											</span>

											<Button
												variant="outline"
												onClick={() => handlePageChange(currentPage + 1)}
												disabled={currentPage === pagination.totalPages}
												className="flex items-center"
											>
												Next
												<ChevronRight className="w-4 h-4 ml-1" />
											</Button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				action="access resources"
			/>
		</div>
	);
}
