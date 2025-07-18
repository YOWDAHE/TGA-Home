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
	Calendar,
	Clock,
	Eye,
	Share2,
	Bookmark,
	ThumbsUp,
	ThumbsDown,
	MessageCircle,
	User,
	ArrowLeft,
	Facebook,
	Twitter,
	Linkedin,
	Copy,
	Flag,
	Pin,
	Edit,
	ChevronRight,
	TrendingUp,
	Loader,
} from "lucide-react";
import Header from "@/components/Sections/Header";
import { useParams } from "next/navigation";
import { NewsByIdResponse, NewsQueryResponse } from "@/app/types/news";
import { convertToApiUrl } from "@/lib/utils";
import {
	postNewsComment,
	getNewsComments,
	toggleCommentLike,
} from "@/app/actions/news.actions";
import { useAuthRequired } from "@/hooks/use-auth-required";
import { useAuth } from "@/contexts/AuthContext";

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

	// Authentication
	const { user } = useAuth();
	const { requireAuth, AuthModal } = useAuthRequired();

	// Use the news data from props
	const article = news.data;

	// Helper function to get image URL
	const getImageUrl = (newsItem: any) => {
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
							<User className="w-4 h-4 mr-1" />
							{article.created_by}
						</span>
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

				{/* Article Image */}
				{article.visual_content && article.visual_content.length > 0 && (
					<div className="mb-8">
						<Image
							src={getImageUrl(article)}
							alt={article.title}
							width={1200}
							height={600}
							className="w-full h-96 object-cover rounded-lg"
						/>
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
													user
														? "Share your thoughts..."
														: "Sign in to leave a comment..."
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
											{user ? (isPostingComment ? "Posting..." : "Post Comment") : "Sign in to Comment"}
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Comments List */}
							<div className="space-y-4">
								{commentsList.map((comment) => (
									<Card key={comment.id}>
										<CardContent className="p-4">
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
														{/* <div className="flex items-center space-x-2">
															{comment.pinned && (
																<Badge className="bg-yellow-500 text-xs">
																	<Pin className="w-3 h-3 mr-1" />
																	Pinned
																</Badge>
															)}
															{comment.edited && (
																<Badge variant="outline" className="text-xs">
																	<Edit className="w-3 h-3 mr-1" />
																	Edited
																</Badge>
															)}
														</div> */}
													</div>
													<p className="text-sm text-gray-700 mb-3">{comment.content}</p>
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
															</div>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
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
									{relatedArticles.map((relatedArticle) => (
										<Card
											key={relatedArticle.id}
											className="overflow-hidden hover:shadow-md transition-shadow"
										>
											<CardContent className="p-4">
												<div className="flex space-x-3">
													<div className="w-16 h-12 flex-shrink-0">
														<Image
															src={getImageUrl(relatedArticle) || "/placeholder.svg"}
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
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Auth Modal */}
			<AuthModal />
		</div>
	);
}
