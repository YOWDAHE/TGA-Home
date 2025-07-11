import React from "react";
import { Card, CardContent } from "../ui/card";
import { FileText, Play } from "lucide-react";
import { Button } from "../ui/button";

const newsItems = [
	{
		id: 1,
		title: "Latest Legal Updates in Ethiopian Business Law",
		description:
			"Stay informed about the recent changes in Ethiopian business regulations and their impact on international investments.",
		thumbnail: "/placeholder.svg?height=100&width=150",
	},
	{
		id: 2,
		title: "International Arbitration Trends in Africa",
		description:
			"Exploring the growing importance of arbitration in resolving commercial disputes across African markets.",
		thumbnail: "/placeholder.svg?height=100&width=150",
	},
	{
		id: 3,
		title: "Construction Law Developments",
		description:
			"Recent developments in construction law and their implications for infrastructure projects in Ethiopia.",
		thumbnail: "/placeholder.svg?height=100&width=150",
	},
];

const resources = [
	{ title: "Legal Framework Guide", type: "PDF" },
	{ title: "Investment Opportunities", type: "PDF" },
	{ title: "Compliance Checklist", type: "PDF" },
	{ title: "Contract Templates", type: "PDF" },
];

export default function News() {
	return (
		<section id="news" className="py-20 bg-[#f6f7f8]">
			<div className="container mx-auto px-4">
				<div className="grid lg:grid-cols-2 gap-16">
					{/* Latest News */}
					<div className="p-10">
						<div className="flex items-center justify-between mb-8">
							<div>
								<h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
									LATEST NEWS
								</h2>
								<div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
							</div>
							<Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
								See more
							</Button>
						</div>
						<p className="text-gray-600 mb-10 text-lg">
							Follow the latest news in the industry here.
						</p>

						<div className="space-y-6">
							{newsItems.map((item) => (
								<Card
									key={item.id}
									className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl"
								>
									<CardContent className="p-0">
										<div className="flex">
											<div className="relative w-40 h-28 bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center rounded-l-2xl">
												<div className="absolute inset-0 bg-black/20 rounded-l-2xl"></div>
												<Play className="text-white w-10 h-10 relative z-10 drop-shadow-lg" />
											</div>
											<div className="p-6 flex-1">
												<h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
													{item.title}
												</h3>
												<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
													{item.description}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Resources */}
					<div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
						<div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

						<div className="relative z-10">
							<div className="flex items-center justify-between mb-8">
								<div>
									<h2 className="text-4xl font-bold mb-2">RESOURCES</h2>
									<div className="w-16 h-1 bg-white/50 rounded-full"></div>
								</div>
								<Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl shadow-lg">
									See more
								</Button>
							</div>
							<p className="mb-10 text-white/90 text-lg">
								Look through our articles and updates here.
							</p>

							<div className="space-y-6">
								{resources.map((resource, index) => (
									<Card
										key={index}
										className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-2xl overflow-hidden"
									>
										<CardContent className="p-6">
											<div className="flex items-center">
												<div className="mr-6 flex-shrink-0">
													<div className="bg-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-lg">
														<FileText className="text-orange-500 w-8 h-8" />
													</div>
												</div>
												<div className="flex-1">
													<h3 className="font-bold mb-2 text-lg">{resource.title}</h3>
													<p className="text-sm text-white/80 leading-relaxed">
														Essential legal resources for your business needs
													</p>
												</div>
												<div className="ml-4">
													<span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
														PDF
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
