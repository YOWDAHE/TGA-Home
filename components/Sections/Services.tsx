import React, { Component } from "react";
import Link from "next/link";

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
								title: "CORPORATE LAW ETHIOPIA",
								content:
									"Leading corporate lawyers Ethiopia providing business law services including business registration, commercial law, and corporate governance. #1 law firm in Ethiopia.",
								icon: "💼",
								link: "/corporate-law-ethiopia",
							},
							{
								title: "REAL ESTATE LAW ETHIOPIA",
								content:
									"Expert real estate lawyers Ethiopia specializing in property transactions, land law, and real estate development. Comprehensive legal services for local and diaspora clients.",
								icon: "🏠",
								link: "/real-estate-law-ethiopia",
							},
							{
								title: "DIASPORA LEGAL SERVICES",
								content:
									"Legal services for diaspora Ethiopians including property management, investment advisory, and cross-border legal services. Ethiopian diaspora legal help worldwide.",
								icon: "🌍",
								link: "/diaspora-legal-services",
							},
							{
								title: "INTERNATIONAL BUSINESS LAW",
								content:
									"International law firm Ethiopia providing cross-border legal services, international trade law, and foreign investment advisory for global businesses.",
								icon: "🌐",
								link: "#",
							},
							{
								title: "ARBITRATION & ADR",
								content:
									"Expert arbitration lawyers Ethiopia representing in international commercial arbitration and offering comprehensive ADR mechanisms for dispute resolution.",
								icon: "🤝",
								link: "#",
							},
						].map((service, index) => (
							<Link
								key={index}
								href={service.link}
								className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
									index === 0 ? "lg:col-span-2" : ""
								}`}
							>
								<div className="text-4xl mb-4">{service.icon}</div>
								<h3 className="text-xl md:text-2xl font-bold mb-6">{service.title}</h3>
								<p className="leading-relaxed text-white/90">{service.content}</p>
								{service.link !== "#" && (
									<div className="mt-4 text-sm text-white/70 hover:text-white transition-colors">
										Learn More →
									</div>
								)}
							</Link>
						))}
					</div>
				</div>
			</section>
		);
	}
}

export default Services;
