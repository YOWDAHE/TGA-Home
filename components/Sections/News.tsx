import React from "react";
import { Card, CardContent } from "../ui/card";
import { FileText, Play, Calendar, User } from "lucide-react";
import { Button } from "../ui/button";
import type { News } from "@/app/types/news";
import type { Resource } from "@/app/actions/resources.actions";
import { convertToApiUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Loader from "../loader";

interface NewsProps {
	news: News[];
	resources: Resource[];
}

// Helper function to format date
const formatDate = (dateString: string | Date) => {
	return new Date(dateString).toLocaleDateString();
};

// Helper function to get image URL
const getImageUrl = (newsItem: News) => {
	if (newsItem.visual_content && newsItem.visual_content.length > 0) {
		return convertToApiUrl(newsItem.visual_content[0]);
	}
	return "/office/placeholder.jpg";
};

export default function News({ news, resources }: NewsProps) {
	return (
		<section id="news" className="py-10 md:py-20 bg-[#f6f7f8]">
			<div className="container mx-auto md:px-4">
				<div className="grid lg:grid-cols-2 gap-16">
					{/* Latest News */}
					<div className="md:p-10 p-4">
						<div className="flex items-center justify-between mb-8">
							<div>
								<h2 className="md:text-4xl text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
									LATEST NEWS
								</h2>
								<div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
							</div>
							<Link href="/news">
								<Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-sm md:text-base">
									See more
								</Button>
							</Link>
						</div>
						<p className="text-gray-600 mb-10 md:text-lg text-sm">
							Follow the latest news in the industry here.
						</p>

						<div className="flex flex-col gap-4">
							{news.slice(0, 4).map((item) => (
								<Link href={`/news/${item.id}`} key={item.id}>
									<Card
										key={item.id}
										className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-xl h-[150px]"
									>
										<CardContent className="p-0">
											<div className="flex">
												<div className="relative w-40 h-[150px] bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center overflow-hidden">
													<img
														src={getImageUrl(item)}
														alt={item.title}
														className="absolute inset-0 w-full h-full object-cover"
													/>
												</div>
												<div className="p-6 flex-1">
													<h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight line-clamp-1">
														{item.title}
													</h3>
													<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
														{item.content}
													</p>
													<div className="flex items-center text-xs text-gray-500 md:space-x-4 space-x-0">
														<span className="items-center hidden md:flex">
															<User className="w-3 h-3 mr-1" />
															TGA Global Law Firm LL.P LL.P
														</span>
														<span className="flex items-center">
															<Calendar className="w-3 h-3 mr-1" />
															{formatDate(item.published_date)}
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

					{/* Resources */}
					<div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white md:p-10 p-4 py-10 md:rounded-3xl shadow-2xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
						<div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

						<div className="relative z-10">
							<div className="flex items-center justify-between mb-8">
								<div>
									<h2 className="md:text-4xl text-2xl font-bold mb-2">RESOURCES</h2>
									<div className="w-16 h-1 bg-white/50 rounded-full"></div>
								</div>
								<Link href="/resources">
									<Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl shadow-lg text-sm md:text-base">
										See more
									</Button>
								</Link>
							</div>
							<p className="mb-10 text-white/90 md:text-lg text-sm">
								Look through our articles and updates here.
							</p>

							<div className="flex flex-col gap-4">
								{resources.slice(0, 4).map((resource) => (
									<Link href={`/resources/${resource.id}`} key={resource.id}>
										<Card
											key={resource.id}
											className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-2xl overflow-hidden h-[150px]"
										>
											<CardContent className="p-6">
												<div className="flex items-center">
													<div className="mr-6 flex-shrink-0">
														<div className="bg-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-lg">
															<FileText className="text-orange-500 w-8 h-8" />
														</div>
													</div>
													<div className="flex-1">
														<h3 className="font-bold mb-2 text-lg line-clamp-1">
															{resource.title}
														</h3>
														<p className="text-sm text-white/80 leading-relaxed line-clamp-2">
															{resource.description ||
																"Essential legal resources for your business needs"}
														</p>
														<div className="flex items-center text-xs text-white/60 mt-2 space-x-3">
															<span className="flex items-center">
																<User className="w-3 h-3 mr-1" />
																TGA Global Law Firm LL.P LL.P
															</span>
															<span className="flex items-center">
																<Calendar className="w-3 h-3 mr-1" />
																{formatDate(resource.createdAt)}
															</span>
														</div>
													</div>
													<div className="ml-4 hidden md:block">
														<span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
															{resource.filename.split(".").pop()?.toUpperCase() || "PDF"}
														</span>
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
