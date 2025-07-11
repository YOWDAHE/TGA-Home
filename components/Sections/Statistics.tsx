import React from "react";

export default function Statistics() {
	return (
		<section className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-24 lg:px-20 relative overflow-hidden">
			<div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-10"></div>
			<div className="container mx-auto px-4 relative z-10">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-6">
					{[
						{ number: "100s", label: "Corporate clients", icon: "👥" },
						{ number: ">120", label: "Partner and Affiliate Firms", icon: "🤝" },
						{ number: ">52", label: "Countries", icon: "🌍" },
						{ number: "4", label: "Continents", icon: "🗺️" },
						{ number: ">50", label: "Advisors", icon: "⚖️" },
					].map((stat, index) => (
						<div
							key={index}
							className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
						>
							<div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r text-white bg-clip-text text-transparent">
								{stat.number}
							</div>
							<div className="text-sm text-gray-300 font-medium">{stat.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
