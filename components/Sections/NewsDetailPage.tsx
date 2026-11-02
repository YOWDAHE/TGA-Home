"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { MotionConfig, motion } from "framer-motion";
import TopNav from "@/components/Sections/TopNav";
import Footer from "./Footer";
import Reveal, { easeOut } from "./Reveal";
import { FrostedColors } from "./Backdrop";
import { useParams } from "next/navigation";
import { News, NewsByIdResponse } from "@/app/types/news";
import { LegalUpdate } from "@/app/types/legal-updates";
import RelatedContent from "./RelatedContent";
import HashtagNewsModal, { parseHashtags } from "./HashtagNewsModal";
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
	relatedNews: News[];
	relatedUpdates: LegalUpdate[];
}

export default function NewsDetailPage({
	news,
	relatedNews,
	relatedUpdates,
}: NewsDetailPageProps) {
	const params = useParams();
	const id = params.id as string;

	const [commentsList, setComments] = useState<Comment[]>([]);
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
	const [slideIndex, setSlideIndex] = useState(0);
	// Hashtag whose stories are shown in the modal
	const [openTag, setOpenTag] = useState<string | null>(null);

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
		return "/office/placeholder.jpg";
	};

	// Helper function to get all visual content URLs
	const getAllVisualContentUrls = (newsItem: any) => {
		if (newsItem.visual_content && newsItem.visual_content.length > 0) {
			return newsItem.visual_content.map((item: any) => convertToApiUrl(item));
		}
		return ["/office/placeholder.jpg"];
	};

	// Helper function to format date
	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleDateString();
	};

	// Helper function to get read time
	const getReadTime = (minutes: number | null) => {
		return minutes ? `${minutes} min read` : "5 min read";
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
		setLoading(false);
	}, [id, news]);

	// Keep the dots in step with the carousel
	useEffect(() => {
		if (!carouselApi) return;
		const onSelect = () => setSlideIndex(carouselApi.selectedScrollSnap());
		carouselApi.on("select", onSelect);
		return () => carouselApi.off("select", onSelect);
	}, [carouselApi]);

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

	const backLink = (
		<Link
			href="/news"
			className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-brand-navy shadow-sm ring-1 ring-black/5 transition-colors hover:bg-brand-tint"
		>
			<ArrowLeft className="h-4 w-4" />
			News
		</Link>
	);

	// Page shell shared by the loading, missing and article views
	const shell = (children: React.ReactNode) => (
		<MotionConfig reducedMotion="user">
			<div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
				<FrostedColors />
				<TopNav currentHref="/news" />
				{children}
				<Footer />
			</div>
		</MotionConfig>
	);

	const smallButton =
		"inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors hover:bg-[#f2f4f8] disabled:opacity-50";

	if (loading) {
		return shell(
			<div className="mx-auto max-w-3xl animate-pulse px-4 pb-24 pt-16 sm:px-6">
				<div className="mb-6 h-9 w-24 rounded-full bg-[#eef1f5]" />
				<div className="mb-3 h-10 w-full rounded-xl bg-[#eef1f5]" />
				<div className="mb-8 h-10 w-2/3 rounded-xl bg-[#eef1f5]" />
				<div className="mb-8 h-80 rounded-3xl bg-[#eef1f5]" />
				<div className="space-y-3">
					<div className="h-4 rounded bg-[#eef1f5]" />
					<div className="h-4 w-5/6 rounded bg-[#eef1f5]" />
					<div className="h-4 w-4/6 rounded bg-[#eef1f5]" />
				</div>
			</div>
		);
	}

	if (!article) {
		return shell(
			<div className="px-4 py-28 text-center sm:px-6">
				<h1 className="mb-3 text-3xl font-semibold tracking-tight">Article not found</h1>
				<p className="mb-8 text-[#606b80]">
					The article you're looking for doesn't exist or has been removed.
				</p>
				{backLink}
			</div>
		);
	}

	const imageCount = article.visual_content?.length || 0;

	return shell(
		<>
			{/* Article header */}
			<header className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
				>
					{backLink}
				</motion.div>

				{article.featured && (
					<motion.span
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
						className="mt-8 inline-flex items-center gap-1 rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand-green"
					>
						<TrendingUp className="h-3 w-3" />
						Featured
					</motion.span>
				)}

				<motion.h1
					initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
					className={`${article.featured ? "mt-4" : "mt-8"} text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl`}
				>
					{article.title}
				</motion.h1>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
					className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#606b80]"
				>
					<span className="flex items-center">
						<Calendar className="mr-1.5 h-4 w-4 text-brand-green" />
						{formatDate(article.published_date)}
					</span>
					<span className="flex items-center">
						<Clock className="mr-1.5 h-4 w-4 text-brand-green" />
						{getReadTime(article.read_minutes)}
					</span>
					<span className="flex items-center">
						<Eye className="mr-1.5 h-4 w-4 text-brand-green" />
						{article.view_count.toLocaleString()} views
					</span>
				</motion.div>
			</header>

			{/* Article images */}
			{imageCount > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: easeOut, delay: 0.35 }}
					className="mx-auto mb-12 max-w-5xl px-4 sm:px-6"
				>
					{imageCount === 1 ? (
						<img
							src={getImageUrl(article)}
							alt={article.title}
							width={1200}
							height={600}
							className="h-[260px] w-full rounded-3xl object-cover shadow-sm ring-1 ring-black/5 sm:h-[480px]"
						/>
					) : (
						<>
							<Carousel
								opts={{
									align: "start",
									loop: true,
									duration: 20,
								}}
								// plugins={[Autoplay({ delay: 2000 })]}
								setApi={setCarouselApi}
								className="w-full"
							>
								<CarouselContent>
									{getAllVisualContentUrls(article).map(
										(imageUrl: string, index: number) => (
											<CarouselItem key={index}>
												<div className="relative overflow-hidden rounded-3xl ring-1 ring-black/5">
													<img
														src={imageUrl}
														alt={`${article.title} - Image ${index + 1}`}
														width={1200}
														height={600}
														className="h-[260px] w-full object-cover sm:h-[480px]"
													/>
													{/* Image counter */}
													<div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
														{index + 1} / {imageCount}
													</div>
												</div>
											</CarouselItem>
										)
									)}
								</CarouselContent>
							</Carousel>

							{/* Carousel indicators */}
							<div className="mt-4 flex justify-center gap-2">
								{Array.from({ length: imageCount }).map((_, index) => (
									<button
										key={index}
										type="button"
										aria-label={`Show image ${index + 1}`}
										onClick={() => carouselApi?.scrollTo(index)}
										className={`h-1.5 rounded-full transition-all duration-500 ${
											index === slideIndex ? "w-8 bg-brand-green" : "w-1.5 bg-[#c3ccd9] hover:bg-[#9aa5b8]"
										}`}
									/>
								))}
							</div>
						</>
					)}
				</motion.div>
			)}

			{/* Article body, comments and related stories */}
			{/* Article body uses the full column; related stories follow at the bottom */}
			<div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
				<div>
					<Reveal>
						<div
							className="rich-text-content border-t border-black/10 pt-10 text-[#3b4457] [&_h1]:text-brand-navy [&_h2]:text-brand-navy [&_h3]:text-brand-navy [&_h4]:text-brand-navy"
							dangerouslySetInnerHTML={{ __html: article.content }}
						/>
					</Reveal>

					{/* Hashtags */}
					{article.hashtags && (
						<div className="mt-6 flex flex-wrap gap-2">
							{/* Each tag opens a list of other stories carrying it */}
							{parseHashtags(article.hashtags).map((tag, index) => (
								<button
									key={index}
									type="button"
									onClick={() => setOpenTag(tag)}
									aria-haspopup="dialog"
									className="rounded-full bg-white px-3 py-1 text-sm text-[#4b5468] ring-1 ring-black/5 transition-colors hover:bg-brand-tint hover:text-brand-green hover:ring-brand-green/20"
								>
									#{tag}
								</button>
							))}
						</div>
					)}

					{/* Comments Section */}
					<section className="mt-14">
						<h2 className="mb-6 text-2xl font-semibold tracking-tight">
							Comments <span className="text-[#9aa3b5]">({commentsList.length})</span>
						</h2>

						{/* Add Comment */}
						<div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
							<label htmlFor="news-comment" className="mb-2 block text-sm font-medium">
								Comment
							</label>
							<textarea
								id="news-comment"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder={user ? "Share your thoughts..." : "Sign in to leave a comment..."}
								className="min-h-[110px] w-full resize-y rounded-2xl bg-[#f5f7fa] px-4 py-3 text-sm text-brand-navy placeholder:text-[#9aa3b5] focus:outline-none focus:ring-2 focus:ring-brand-green/40 disabled:opacity-60"
								disabled={!user || isPostingComment}
							/>
							<button
								type="button"
								onClick={handleCommentSubmitWithAuth}
								disabled={(!!user && !newComment.trim()) || isPostingComment}
								className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green disabled:opacity-50"
							>
								{isPostingComment ? (
									<Loader className="h-4 w-4 animate-spin" />
								) : (
									<MessageCircle className="h-4 w-4" />
								)}
								{user
									? isPostingComment
										? "Posting..."
										: "Post Comment"
									: "Sign in to Comment"}
							</button>
						</div>

						{/* Comments List */}
						<div className="space-y-3">
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
									<div
										key={comment.id}
										className={`rounded-3xl p-5 shadow-sm ring-1 ${
											isFlagged ? "bg-orange-50 ring-orange-200" : "bg-white ring-black/5"
										}`}
									>
										{/* Warning message for flagged comments */}
										{isFlagged && (
											<div className="mb-3 rounded-2xl bg-orange-100 p-3">
												<div className="flex items-center gap-2">
													<AlertTriangle className="h-4 w-4 text-orange-600" />
													<span className="text-sm font-medium text-orange-800">
														Warning: Sharing links is forbidden
													</span>
												</div>
												<p className="mt-1 text-xs text-orange-700">
													This comment has been flagged and is hidden from other users.
													{comment.flagged_reason && ` Reason: ${comment.flagged_reason}`}
												</p>
											</div>
										)}

										<div className="flex items-start gap-3">
											<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-medium text-white">
												{comment.user_name.charAt(0).toUpperCase()}
											</span>
											<div className="min-w-0 flex-1">
												<div className="mb-1.5 flex flex-wrap items-center gap-2">
													<span className="text-sm font-medium">{comment.user_name}</span>
													<span className="text-xs text-[#9aa3b5]">{formatDate(comment.createdAt)}</span>
													{isFlagged && (
														<span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">Hidden</span>
													)}
													{comment.edited && (
														<span className="rounded-full bg-[#f2f4f8] px-2 py-0.5 text-xs text-[#4b5468]">Edited</span>
													)}
												</div>

												{/* Comment content - show textarea when editing */}
												{editingCommentId === comment.id ? (
													<div className="mb-2">
														<textarea
															value={editingContent}
															onChange={(e) => setEditingContent(e.target.value)}
															className="min-h-[80px] w-full rounded-2xl bg-[#f5f7fa] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
															placeholder="Edit your comment..."
														/>
														<div className="mt-2 flex items-center gap-2">
															<button
																type="button"
																onClick={() => handleEditComment(comment.id)}
																disabled={!editingContent.trim() || isEditingComment}
																className="inline-flex items-center gap-1 rounded-full bg-brand-navy px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-green disabled:opacity-50"
															>
																{isEditingComment ? (
																	<Loader className="h-3 w-3 animate-spin" />
																) : (
																	<Check className="h-3 w-3" />
																)}
																{isEditingComment ? "Saving..." : "Save"}
															</button>
															<button
																type="button"
																onClick={cancelEdit}
																disabled={isEditingComment}
																className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs ring-1 ring-black/10 transition-colors hover:bg-[#f5f7fa] disabled:opacity-50"
															>
																<X className="h-3 w-3" />
																Cancel
															</button>
														</div>
													</div>
												) : (
													<p className="mb-2 text-sm leading-relaxed text-[#4b5468]">{comment.content}</p>
												)}

												<div className="-ml-2.5 flex items-center gap-1 text-[#7a8397]">
													<button
														type="button"
														onClick={() => handleLikeWithAuth(comment.id)}
														className={`${smallButton} ${comment.liked ? "text-brand-green" : ""}`}
													>
														<ThumbsUp className="h-3.5 w-3.5" />
														{comment.likes_count}
													</button>
													<button
														type="button"
														onClick={() => handleDislikeWithAuth(comment.id)}
														className={`${smallButton} ${comment.disliked ? "text-red-500" : ""}`}
													>
														<ThumbsDown className="h-3.5 w-3.5" />
														{comment.dislikes_count}
													</button>
													{isCommentOwner && (
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<button type="button" aria-label="Comment options" className={smallButton}>
																	<MoreVertical className="h-3.5 w-3.5" />
																</button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end" className="rounded-2xl">
																<DropdownMenuItem onClick={() => handleEditCommentWithAuth(comment.id)}>
																	<Edit className="mr-2 h-3 w-3" />
																	Edit Comment
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => handleDeleteCommentWithAuth(comment.id)}
																	className="text-red-600 focus:text-red-600"
																>
																	<Trash2 className="mr-2 h-3 w-3" />
																	Delete Comment
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													)}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</section>
				</div>

			</div>

			<RelatedContent news={relatedNews} updates={relatedUpdates} order={["news", "updates"]} />

			<HashtagNewsModal tag={openTag} excludeId={article.id} onClose={() => setOpenTag(null)} />

			{/* Auth Modal */}
			<AuthModal />

			{/* Delete Confirmation Modal */}
			<AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
				<AlertDialogContent className="rounded-3xl">
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
							className="rounded-full"
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							disabled={deletingCommentId !== null}
							className="rounded-full bg-red-600 hover:bg-red-700 focus:ring-red-600"
						>
							{deletingCommentId !== null ? (
								<>
									<Loader className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
