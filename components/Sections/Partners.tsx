import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Partners() {
	const [currentPartner, setCurrentPartner] = useState(0);

	const partners = [
		{
			name: "Commercial Bank of Ethiopia",
			logo: "/placeholder.svg?height=80&width=120",
		},
		{ name: "Yingke Law Firm", logo: "/placeholder.svg?height=80&width=120" },
		{ name: "African Union", logo: "/placeholder.svg?height=80&width=120" },
		{
			name: "Woda Metal Industry",
			logo: "/placeholder.svg?height=80&width=120",
		},
		{
			name: "American Bar Association",
			logo: "/placeholder.svg?height=80&width=120",
		},
		{
			name: "International Association",
			logo: "/placeholder.svg?height=80&width=120",
		},
		{
			name: "Asian Exporters Chamber",
			logo: "/placeholder.svg?height=80&width=120",
		},
		{ name: "Diamond Hotel", logo: "/placeholder.svg?height=80&width=120" },
		{
			name: "China Civil Engineering",
			logo: "/placeholder.svg?height=80&width=120",
		},
		{ name: "Reed Smith", logo: "/placeholder.svg?height=80&width=120" },
		{ name: "USP Banking", logo: "/placeholder.svg?height=80&width=120" },
		{ name: "Yemen Bank", logo: "/placeholder.svg?height=80&width=120" },
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentPartner((prev) => (prev + 4) % partners.length);
		}, 4000);
		return () => clearInterval(timer);
	}, [partners.length]);

	const nextPartners = () => {
		setCurrentPartner((prev) => (prev + 4) % partners.length);
	};

	const prevPartners = () => {
		setCurrentPartner((prev) => (prev - 4 + partners.length) % partners.length);
	};
	return (
		<section className="py-20 bg-[#f6f7f8] relative overflow-hidden min-h-[800px] flex items-center justify-center">
			<div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-16">
					<h2 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
						OUR PARTNERS
					</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
					<p className="text-gray-600 mt-4 text-lg">
						Trusted by leading organizations worldwide
					</p>
				</div>

				<div className="relative">
					<div className="flex items-center justify-center space-x-8 mb-12">
						<Button
							variant="outline"
							size="icon"
							onClick={prevPartners}
							className="rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 w-14 h-14 transition-all duration-300"
						>
							<ChevronLeft className="w-6 h-6" />
						</Button>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 max-w-5xl">
							{partners
								.slice(currentPartner, currentPartner + 4)
								.map((partner, index) => (
									<div
										key={index}
										className="flex items-center justify-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
									>
										<img
											src={partner.logo || "/placeholder.svg"}
											alt={partner.name}
											width={120}
											height={80}
											className="max-w-full h-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
										/>
									</div>
								))}
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={nextPartners}
							className="rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 w-14 h-14 transition-all duration-300"
						>
							<ChevronRight className="w-6 h-6" />
						</Button>
					</div>

					<div className="flex justify-center space-x-3">
						{Array.from({ length: Math.ceil(partners.length / 4) }).map(
							(_, index) => (
								<button
									key={index}
									className={`w-4 h-4 rounded-full transition-all duration-300 ${
										Math.floor(currentPartner / 4) === index
											? "bg-gradient-to-r from-teal-500 to-emerald-500 scale-125 shadow-lg"
											: "bg-gray-300 hover:bg-gray-400 hover:scale-110"
									}`}
									onClick={() => setCurrentPartner(index * 4)}
								/>
							)
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
