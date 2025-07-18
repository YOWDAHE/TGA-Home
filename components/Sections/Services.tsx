import React, { Component } from "react";

export class Services extends Component {
	render() {
		return (
			<section
				id="services"
				className="py-20 lg:px-20 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white relative overflow-hidden"
			>
				<div className="absolute inset-0 bg-black/10"></div>
				<div className="absolute top-0 left-0 w-full h-full">
					<div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
					<div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-2xl md:text-4xl font-bold mb-4">OUR SERVICES</h2>
						<div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
						{[
							{
								title: "RETENTION AND ONGOING LEGAL SUPPORT",
								content:
									"We have been successful in being able to retain huge national and multi-national corporations as retentions clients by offering a quality ongoing legal support, including International organizations as we combine Seasoned lawyers in various fields of Law.",
								icon: "🛡️",
							},
							{
								title: "REPRESENTATION",
								content:
									"We have the best litigation lawyers in the Ethiopian Legal Landscape in minefield areas of the law including taxation, Contracts, Investment disputes, Construction Issues and Criminal Law.",
								icon: "⚖️",
							},
							{
								title: "CONSULTING AND ADVISORY",
								content:
									"As a trusted advisor and considerable role in transactional matters, we have been helping corporations and business individuals navigate various aspects business transactions including Merger and Acquisitions, Due diligence, Contract Negotiation and Drafting, and Compliance.",
								icon: "💼",
							},
							{
								title: "CONTRACT MANAGEMENT AND ARBITRATION",
								content:
									"As a trusted advisor our office has been consulting and representing plentiful number of corporations and business entities in their contractual matters with 3rd Parties with a view to enable them have a robust contract management scheme.",
								icon: "📋",
							},
							{
								title: "ADR AND ARBITRATION",
								content:
									"The Law Group through its Managing Partner and Senior Associates frequently represents in International Commercial Arbitration under the auspices of various regional and ad hoc centers. We also offer a full scheme ADR mechanisms.",
								icon: "🤝",
							},
						].map((service, index) => (
							<div
								key={index}
								className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${
									index === 3 ? "lg:col-span-2" : ""
								} ${
									index === 4 ? "lg:col-start-3" : ""
								}`}
							>
								<div className="text-4xl mb-4">{service.icon}</div>
								<h3 className="text-xl md:text-2xl font-bold mb-6">{service.title}</h3>
								<p className="leading-relaxed text-white/90">{service.content}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}
}

export default Services;
