import React from "react";
import { Stat } from "@/app/types/landing";

interface StatisticsProps {
  stats: Stat[];
}

export default function Statistics({ stats }: StatisticsProps) {
  return (
			<section className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-24 lg:px-20 relative overflow-hidden">
				<div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-10"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="grid grid-cols-2 md:grid-cols-5 gap-6">
						{stats.map((stat, index) => (
							<div
								key={stat.id}
								className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
							>
								<div className="text-4xl md:text-5xl font-bold mb-3 text-teal-300">
									{stat.stat}
								</div>
								<div className="text-base text-gray-200 font-medium">
									{stat.description}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
}
