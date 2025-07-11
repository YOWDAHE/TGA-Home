import { Award, User } from "lucide-react";
import React, { Component } from "react";
import Image from "next/image";

export class AboutUs extends Component {
	render() {
		return (
			<section
				id="about"
				className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden h-screen max-h-[1000px]"
            >
                <Image src="/Images/aboutUs/woman.png" alt="About Us" width={1000} height={1000} className="absolute top-0 left-0 w-full h-full object-cover blur-[5px] opacity-50" />
				<div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
								ABOUT US
							</h2>
							<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
						</div>

						<div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
							<p className="text-xl text-gray-700 mb-8 leading-relaxed text-center max-w-4xl mx-auto">
								TG&A Law Group is a premier legal practice committed to excellence in
								serving our clients across Ethiopia and Africa. Our experienced team
								combines deep local knowledge with international expertise to deliver
								comprehensive legal solutions.
							</p>

							<div className="grid md:grid-cols-2 gap-12">
								<div className="space-y-6">
									<div className="flex items-center mb-6">
										<div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
											<User className="w-6 h-6 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-900">
											Leadership & Expertise
										</h3>
									</div>
									<div className="space-y-4">
										{[
											"Executive Board member of The Ethiopian Lawyers' Association",
											"Head of Publication and International Relations Committee",
											"Advisor to the Committee of Intelligence for Security Services of Africa CISSA",
											"Board member of the State Infrastructure Transparency Initiative",
										].map((item, index) => (
											<div key={index} className="flex items-start group">
												<div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
												<span className="text-gray-700 leading-relaxed">{item}</span>
											</div>
										))}
									</div>
								</div>

								<div className="space-y-6">
									<div className="flex items-center mb-6">
										<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
											<Award className="w-6 h-6 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-900">
											Professional Affiliations
										</h3>
									</div>
									<div className="space-y-4">
										{[
											"Member of Advisory Council for the Federal Supreme Court of Ethiopia",
											"Member of the Board for Law & Justice Institute of Ethiopia",
											"Council member of Joined-up Justice High level forum",
											"Certified Trademark Agent by the Ethiopian Intellectual Property Office",
										].map((item, index) => (
											<div key={index} className="flex items-start group">
												<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
												<span className="text-gray-700 leading-relaxed">{item}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default AboutUs;
