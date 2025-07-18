"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Eye,
	MessageCircle,
	ThumbsUp,
	ThumbsDown,
	User,
	Share2,
	Bookmark,
	BookmarkCheck,
	ChevronRight,
	TrendingUp,
	Loader,
	MoreVertical,
	Trash2,
	AlertTriangle,
	Edit,
	Check,
	X,
} from "lucide-react";
import Header from "@/components/Sections/Header";
import { useParams } from "next/navigation";
import { NewsByIdResponse, NewsQueryResponse } from "@/app/types/news";
import { convertToApiUrl } from "@/lib/utils";
import {
	postNewsComment,
	getNewsComments,
	toggleCommentLike,
	deleteNewsComment,
	editNewsComment,
} from "@/app/actions/news.actions";
import { useAuthRequired } from "@/hooks/use-auth-required";
import { useAuth } from "@/contexts/AuthContext";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Autoplay from "embla-carousel-autoplay";

interface NewsArticle {
	id: number;
	title: string;
	visual_content: {
		images?: string[];
		videos?: string[];
		thumbnail?: string;
	};
	links: {
		external?: string[];
		internal?: string[];
	};
	content: string;
	hashtags: string;
	category: {
		id: number;
		name: string;
	};
	source: string;
	view_count: number;
	featured: boolean;
	read_minutes: number;
	published_date: string;
	created_by: string;
	createdAt: string;
	updatedAt: string;
}

interface Comment {
	id: number;
	news_id: number;
	user_name: string;
	likes_count: number;
	dislikes_count: number;
	liked: boolean;
	disliked: boolean;
	visible: boolean;
	pinned: boolean;
	edited: boolean;
	flagged: boolean;
	flagged_reason?: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

interface NewsDetailPageProps {
	news: NewsByIdResponse;
	relatedNews: NewsQueryResponse | null;
}

export default function NewsDetailPage({
	news,
	relatedNews,
}: NewsDetailPageProps) {
	const params = useParams();
	const id = params.id as string;

	const [commentsList, setComments] = useState<Comment[]>([]);
	const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
	const [newComment, setNewComment] = useState("");
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isPostingComment, setIsPostingComment] = useState(false);
	const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
		null
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const [editingContent, setEditingContent] = useState("");
	const [isEditingComment, setIsEditingComment] = useState(false);
	const [carouselApi, setCarouselApi] = useState<any>(null);

	// Authentication
	const { user } = useAuth();
	const { requireAuth, AuthModal } = useAuthRequired();

	// Use the news data from props
	const article = news.data;
	console.log("article:", article);

	// Helper function to get image URL
	const getImageUrl = (newsItem: any) => {
		if (newsItem.visual_content && newsItem.visual_content.length > 0) {
			return convertToApiUrl(newsItem.visual_content[0]);
		}
		return "/placeholder.svg";
	};

	// Helper function to get all visual content URLs
	const getAllVisualContentUrls = (newsItem: any) => {
		if (newsItem.visual_content && newsItem.visual_content.length > 0) {
			return newsItem.visual_content.map((item: any) => convertToApiUrl(item));
		}
		return ["/placeholder.svg"];
	};

	// Helper function to format date
	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleDateString();
	};

	// Helper function to get read time
	const getReadTime = (minutes: number | null) => {
		return minutes ? `${minutes} min read` : "5 min read";
	};

	// Transform API news to component format
	const transformNewsToArticle = (newsItem: any): NewsArticle => {
		return {
			id: newsItem.news.id,
			title: newsItem.news.title,
			visual_content: {
				images: newsItem.news.visual_content
					? [getImageUrl(newsItem.news)]
					: ["/placeholder.svg?height=600&width=1200"],
				thumbnail: newsItem.news.visual_content
					? getImageUrl(newsItem.news)
					: "/placeholder.svg?height=400&width=600",
			},
			links: {
				external: [],
				internal: [],
			},
			content: newsItem.news.content,
			hashtags: newsItem.news.hashtags || "",
			category: {
				id: newsItem.news.category_id || 1,
				name: "Investment Law",
			},
			source: newsItem.news.source,
			view_count: newsItem.news.view_count || 0,
			featured: newsItem.news.featured || false,
			read_minutes: newsItem.news.read_minutes || 5,
			published_date: newsItem.news.published_date?.toString(),
			created_by: newsItem.news.created_by,
			createdAt: newsItem.news.createdAt?.toString(),
			updatedAt: newsItem.news.updatedAt?.toString(),
		};
	};

	const refreshComments = async () => {
		try {
			const username = user?.username || "anonymous";
			const updatedComments = await getNewsComments(id, username);
			setComments(updatedComments?.data || []);
		} catch (error) {
			console.error("Failed to refresh comments", error);
		}
	};

	// Initialize data
	useEffect(() => {
		// Transform related news data
		const transformedRelatedArticles: NewsArticle[] =
			relatedNews?.data?.news
				?.filter((item: any) => item.news.id !== news.data.id)
				?.slice(0, 2)
				?.map(transformNewsToArticle) || [];

		setRelatedArticles(transformedRelatedArticles);
		setLoading(false);
	}, [id, news, relatedNews]);

	// Fetch comments when user is available
	useEffect(() => {
		refreshComments();
	}, [user]);

	const handleCommentSubmit = async () => {
		if (!newComment.trim() || !user) return;

		setIsPostingComment(true);
		try {
			await postNewsComment(id, newComment, user.username);
			setNewComment("");
			// Refresh comments after posting
			await refreshComments();
		} catch (error) {
			console.error("Failed to post comment", error);
		} finally {
			setIsPostingComment(false);
		}
	};

	const handleCommentSubmitWithAuth = () => {
		requireAuth("comment", handleCommentSubmit);
	};

	const handleLike = async (commentId: number) => {
		if (!user) return;
		try {
			await toggleCommentLike(commentId.toString(), user.username, "like");
			await refreshComments();
		} catch (error) {
			console.error("Failed to like comment", error);
		}
	};

	const handleDislike = async (commentId: number) => {
		if (!user) return;
		try {
			await toggleCommentLike(commentId.toString(), user.username, "dislike");
			await refreshComments();
		} catch (error) {
			console.error("Failed to dislike comment", error);
		}
	};

	const handleLikeWithAuth = (commentId: number) => {
		requireAuth("like", () => handleLike(commentId));
	};

	const handleDislikeWithAuth = (commentId: number) => {
		requireAuth("dislike", () => handleDislike(commentId));
	};

	const handleDeleteComment = async (commentId: number) => {
		if (!user) return;

		setDeletingCommentId(commentId);
		try {
			await deleteNewsComment(commentId.toString());
			// Refresh comments after deletion
			await refreshComments();
			setShowDeleteModal(false);
			setCommentToDelete(null);
		} catch (error) {
			console.error("Failed to delete comment", error);
		} finally {
			setDeletingCommentId(null);
		}
	};

	const handleDeleteCommentWithAuth = (commentId: number) => {
		requireAuth("delete", () => {
			setCommentToDelete(commentId);
			setShowDeleteModal(true);
		});
	};

	const confirmDelete = () => {
		if (commentToDelete) {
			handleDeleteComment(commentToDelete);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
		setCommentToDelete(null);
	};

	const handleEditComment = async (commentId: number) => {
		if (!user || !editingContent.trim()) return;

		setIsEditingComment(true);
		try {
			await editNewsComment(commentId.toString(), editingContent.trim());
			// Refresh comments after editing
			await refreshComments();
			setEditingCommentId(null);
			setEditingContent("");
		} catch (error) {
			console.error("Failed to edit comment", error);
		} finally {
			setIsEditingComment(false);
		}
	};

	const handleEditCommentWithAuth = (commentId: number) => {
		requireAuth("edit", () => {
			setEditingCommentId(commentId);
			// Set the current comment content for editing
			const comment = commentsList.find((c) => c.id === commentId);
			if (comment) {
				setEditingContent(comment.content);
			}
		});
	};

	const cancelEdit = () => {
		setEditingCommentId(null);
		setEditingContent("");
	};

	const toggleBookmark = () => {
		setIsBookmarked(!isBookmarked);
	};

	const toggleShareMenu = () => {
		setShowShareMenu(!showShareMenu);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<Header />
				<div className="container mx-auto px-4 mt-16 py-8">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
						<div className="h-96 bg-gray-200 rounded mb-8"></div>
						<div className="space-y-4">
							<div className="h-4 bg-gray-200 rounded"></div>
							<div className="h-4 bg-gray-200 rounded w-5/6"></div>
							<div className="h-4 bg-gray-200 rounded w-4/6"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="min-h-screen bg-white">
				<Header />
				<div className="container mx-auto px-4 mt-16 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Article Not Found
						</h1>
						<p className="text-gray-600 mb-8">
							The article you're looking for doesn't exist or has been removed.
						</p>
						<Link href="/news">
							<Button className="bg-teal-500 hover:bg-teal-600">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to News
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<Header />

			<div className="container mx-auto px-4 mt-16 py-8">
				{/* Back Button */}
				<div className="mb-8">
					<Link href="/news">
						<Button variant="outline" className="flex items-center">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to News
						</Button>
					</Link>
				</div>

				{/* Article Header */}
				<div className="mb-8">
					<div className="flex items-center space-x-4 mb-4">
						{article.featured && (
							<Badge className="bg-red-500">
								<TrendingUp className="w-3 h-3 mr-1" />
								Featured
							</Badge>
						)}
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
					<div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
						<span className="flex items-center">
							<Calendar className="w-4 h-4 mr-1" />
							{formatDate(article.published_date)}
						</span>
						<span className="flex items-center">
							<Clock className="w-4 h-4 mr-1" />
							{getReadTime(article.read_minutes)}
						</span>
						<span className="flex items-center">
							<Eye className="w-4 h-4 mr-1" />
							{article.view_count.toLocaleString()} views
						</span>
					</div>
				</div>

				{/* Article Images Carousel */}
				{article.visual_content && article.visual_content.length > 0 && (
					<div className="mb-8">
						{article.visual_content.length === 1 ? (
							// Single image display
							<div className="flex justify-center">
								<Image
									src={getImageUrl(article)}
									alt={article.title}
									width={1200}
									height={600}
									className="lg:w-[80%] lg:h-[500px] w-full h-[300px] object-cover rounded-lg shadow-lg"
								/>
							</div>
						) : (
							// Carousel for multiple images
							<div className="lg:w-[80%]">
								<Carousel
									opts={{
										align: "start",
										loop: true,
										duration: 3000,
									}}
									plugins={[Autoplay({ delay: 2000 })]}
									setApi={setCarouselApi}
									className="w-full"
								>
									<CarouselContent>
										{getAllVisualContentUrls(article).map(
											(imageUrl: string, index: number) => (
												<CarouselItem key={index}>
													<div className="relative">
														<Image
															src={imageUrl}
															alt={`${article.title} - Image ${index + 1}`}
															width={1200}
															height={600}
															className="w-full lg:h-[500px] h-[300px] object-cover rounded-lg shadow-lg"
														/>
														{/* Image counter */}
														<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
															{index + 1} / {article.visual_content?.length || 0}
														</div>
													</div>
												</CarouselItem>
											)
										)}
									</CarouselContent>
									{/* <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
									<CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" /> */}
								</Carousel>

								{/* Carousel indicators */}
								{article.visual_content.length > 1 && (
									<div className="flex justify-center mt-4 space-x-2">
										{article.visual_content.map((_, index) => (
											<button
												key={index}
												onClick={() => carouselApi?.scrollTo(index)}
												className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
											/>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{/* Article Content */}
				<div className="grid lg:grid-cols-3 gap-8">
					<div className={`lg:col-span-${relatedArticles.length > 0 ? 2 : 3}`}>
						<div className="text-xl font-bold text-gray-900 mb-4">
							{article.title}
						</div>
						<div className="prose prose-lg max-w-none mb-8">
							<div dangerouslySetInnerHTML={{ __html: article.content }} />
						</div>

						{/* Hashtags */}
						{article.hashtags && (
							<div className="mb-8">
								<div className="flex flex-wrap gap-2">
									{article.hashtags.split(", ").map((tag, index) => (
										<Badge
											key={index}
											variant="outline"
											className="text-sm text-gray-600 border-gray-200"
										>
											#{tag}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Comments Section */}
						<div className="mb-8">
							<h3 className="text-2xl font-semibold text-gray-900 mb-6">
								Comments ({commentsList.length})
							</h3>

							{/* Add Comment */}
							<Card className="mb-6">
								<CardContent className="p-6">
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Comment
											</label>
											<Textarea
												value={newComment}
												onChange={(e) => setNewComment(e.target.value)}
												placeholder={
													user ? "Share your thoughts..." : "Sign in to leave a comment..."
												}
												className="min-h-[100px]"
												disabled={!user || isPostingComment}
											/>
										</div>
										<Button
											onClick={handleCommentSubmitWithAuth}
											disabled={!newComment.trim() || isPostingComment}
											className="bg-teal-500 hover:bg-teal-600"
										>
											{isPostingComment ? (
												<Loader className="w-4 h-4 mr-2 animate-spin" />
											) : (
												<MessageCircle className="w-4 h-4 mr-2" />
											)}
											{user
												? isPostingComment
													? "Posting..."
													: "Post Comment"
												: "Sign in to Comment"}
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Comments List */}
							<div className="space-y-4">
								{commentsList.map((comment) => {
									// Check if comment should be visible
									const isFlagged = comment.flagged;
									const isCommentOwner = user?.username === comment.user_name;
									const shouldShowComment = !isFlagged || isCommentOwner;

									// Don't render if comment is flagged and user is not the owner
									if (!shouldShowComment) {
										return null;
									}

									return (
										<Card
											key={comment.id}
											className={isFlagged ? "border-orange-200 bg-orange-50" : ""}
										>
											<CardContent className="p-4">
												{/* Warning message for flagged comments */}
												{isFlagged && (
													<div className="mb-3 p-3 bg-orange-100 border border-orange-300 rounded-lg">
														<div className="flex items-center space-x-2">
															<AlertTriangle className="w-4 h-4 text-orange-600" />
															<span className="text-sm font-medium text-orange-800">
																⚠️ Warning: Sharing links is forbidden
															</span>
														</div>
														<p className="text-xs text-orange-700 mt-1">
															This comment has been flagged and is hidden from other users.
															{comment.flagged_reason && ` Reason: ${comment.flagged_reason}`}
														</p>
													</div>
												)}

												<div className="flex items-start space-x-3">
													<Avatar className="w-8 h-8">
														<AvatarFallback>
															{comment.user_name.charAt(0).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="flex items-center space-x-2 mb-2">
															<span className="text-sm font-medium text-gray-500">
																{comment.user_name}
															</span>
															{isFlagged && (
																<Badge
																	variant="outline"
																	className="text-xs border-orange-300 text-orange-600 bg-orange-50"
																>
																	Hidden
																</Badge>
															)}
															{comment.edited && (
																<Badge
																	variant="outline"
																	className="text-xs border-gray-300 text-gray-600 bg-gray-50"
																>
																	Edited
																</Badge>
															)}
														</div>

														{/* Comment content - show textarea when editing */}
														{editingCommentId === comment.id ? (
															<div className="mb-3">
																<Textarea
																	value={editingContent}
																	onChange={(e) => setEditingContent(e.target.value)}
																	className="min-h-[80px] text-sm"
																	placeholder="Edit your comment..."
																/>
																<div className="flex items-center space-x-2 mt-2">
																	<Button
																		size="sm"
																		onClick={() => handleEditComment(comment.id)}
																		disabled={!editingContent.trim() || isEditingComment}
																		className="bg-teal-500 hover:bg-teal-600 text-white"
																	>
																		{isEditingComment ? (
																			<Loader className="w-3 h-3 mr-1 animate-spin" />
																		) : (
																			<Check className="w-3 h-3 mr-1" />
																		)}
																		{isEditingComment ? "Saving..." : "Save"}
																	</Button>
																	<Button
																		size="sm"
																		variant="outline"
																		onClick={cancelEdit}
																		disabled={isEditingComment}
																	>
																		<X className="w-3 h-3 mr-1" />
																		Cancel
																	</Button>
																</div>
															</div>
														) : (
															<p className="text-sm text-gray-700 mb-3">{comment.content}</p>
														)}
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-4 text-xs text-gray-500">
																<span>{formatDate(comment.createdAt)}</span>
																<div className="flex items-center space-x-2">
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => handleLikeWithAuth(comment.id)}
																		className={`flex items-center space-x-1 text-xs ${
																			comment.liked ? "text-blue-500" : ""
																		}`}
																	>
																		<ThumbsUp className="w-3 h-3" />
																		<span>{comment.likes_count}</span>
																	</Button>
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => handleDislikeWithAuth(comment.id)}
																		className={`flex items-center space-x-1 text-xs ${
																			comment.disliked ? "text-red-500" : ""
																		}`}
																	>
																		<ThumbsDown className="w-3 h-3" />
																		<span>{comment.dislikes_count}</span>
																	</Button>
																	{isCommentOwner && (
																		<DropdownMenu>
																			<DropdownMenuTrigger asChild>
																				<Button
																					variant="ghost"
																					size="sm"
																					className="text-gray-500 hover:text-gray-700"
																				>
																					<MoreVertical className="w-3 h-3" />
																				</Button>
																			</DropdownMenuTrigger>
																			<DropdownMenuContent align="end">
																				<DropdownMenuItem
																					onClick={() => handleEditCommentWithAuth(comment.id)}
																					className="text-blue-600 focus:text-blue-600"
																				>
																					<Edit className="w-3 h-3 mr-2" />
																					Edit Comment
																				</DropdownMenuItem>
																				<DropdownMenuItem
																					onClick={() => handleDeleteCommentWithAuth(comment.id)}
																					className="text-red-600 focus:text-red-600"
																				>
																					<Trash2 className="w-3 h-3 mr-2" />
																					Delete Comment
																				</DropdownMenuItem>
																			</DropdownMenuContent>
																		</DropdownMenu>
																	)}
																</div>
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					{relatedArticles.length > 0 && (
						<div className="lg:col-span-1">
							{/* Related Articles */}
							<div className="mb-8">
								<h3 className="text-xl font-semibold text-gray-900 mb-4">
									Related Articles
								</h3>
								<div className="space-y-4">
									{relatedArticles.map((relatedArticle) => {
										console.log(
											"relatedArticle.visual_content.thumbnail:",
											relatedArticle.visual_content.thumbnail
										);
										return (
											<Card
												key={relatedArticle.id}
												className="overflow-hidden hover:shadow-md transition-shadow"
											>
												<CardContent className="p-4">
													<div className="flex space-x-3">
														<div className="w-16 h-12 flex-shrink-0">
															<Image
																src={
																	relatedArticle.visual_content.thumbnail || "/placeholder.svg"
																}
																alt={relatedArticle.title || "No title"}
																width={64}
																height={48}
																className="w-full h-full object-cover rounded"
															/>
														</div>
														<div className="flex-1">
															<h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
																{relatedArticle.title || "-"}
															</h4>
															<div className="flex items-center text-xs text-gray-500 space-x-2">
																<span>
																	{isNaN(Date.parse(relatedArticle.published_date))
																		? "-"
																		: formatDate(relatedArticle.published_date)}
																</span>
																<span className="flex items-center">
																	<Eye className="w-3 h-3 mr-1" />
																	{(relatedArticle.view_count || 0).toLocaleString()}
																</span>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Auth Modal */}
			<AuthModal />

			{/* Delete Confirmation Modal */}
			<AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your comment.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={cancelDelete}
							disabled={deletingCommentId !== null}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							disabled={deletingCommentId !== null}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
						>
							{deletingCommentId !== null ? (
								<>
									<Loader className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
