import Header from "@/components/Sections/Header";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title:
		"Corporate Lawyers Ethiopia | Business Law Firm Addis Ababa | TGA Law Group",
	description:
		"Leading corporate lawyers Ethiopia. Business law firm Addis Ababa specializing in corporate law, business registration, and commercial legal services. #1 law firm in Ethiopia.",
	keywords:
		"Corporate Lawyers Ethiopia, Business Law Firm Addis Ababa, Corporate Law Ethiopia, Business Registration Ethiopia, Commercial Lawyers Ethiopia, Commercial Law Ethiopia",
	openGraph: {
		title: "Corporate Lawyers Ethiopia | Business Law Firm Addis Ababa",
		description:
			"Leading corporate lawyers Ethiopia. Business law firm Addis Ababa specializing in corporate law, business registration, and commercial legal services.",
		type: "website",
	},
};

export default function CorporateLawEthiopia() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-10">
				<div className="flex items-center justify-center lg:gap-10 gap-4 left-0 w-full top-10 text-sm lg:text-base py-10">
					<Link href="/">Home</Link>
					<Link href="/about-us">About</Link>
					<Link href="#services" className="hidden lg:flex">
						Services
					</Link>
					<Link href="/resources">Resources</Link>
					<Link href="/news">News</Link>
					<Link href="#contact">Contact</Link>
				</div>
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Corporate Lawyers Ethiopia
						</h1>
						<h2 className="text-2xl md:text-3xl font-semibold mb-8 text-teal-400">
							Business Law Firm Addis Ababa - #1 Law Firm in Ethiopia
						</h2>
						<p className="text-xl mb-8">
							Leading corporate legal services in Ethiopia. Expert business
							registration, commercial law, and corporate governance for local and
							international businesses.
						</p>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-3xl font-bold text-center mb-12">
							Corporate Law Services Ethiopia
						</h2>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Business Registration Ethiopia
								</h3>
								<p className="text-gray-600">
									Complete business registration services including company formation,
									licensing, and regulatory compliance for Ethiopian businesses.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Commercial Law Ethiopia
								</h3>
								<p className="text-gray-600">
									Expert commercial law services covering contracts, transactions,
									mergers & acquisitions, and corporate governance.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Corporate Governance
								</h3>
								<p className="text-gray-600">
									Comprehensive corporate governance advisory, board structuring, and
									compliance management for Ethiopian corporations.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Mergers & Acquisitions
								</h3>
								<p className="text-gray-600">
									Strategic M&A services, due diligence, and transaction structuring for
									Ethiopian and international businesses.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									International Business Law
								</h3>
								<p className="text-gray-600">
									Cross-border legal services, international trade law, and foreign
									investment advisory for global businesses in Ethiopia.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Regulatory Compliance
								</h3>
								<p className="text-gray-600">
									Ethiopian regulatory compliance, licensing, and ongoing legal support
									for corporate entities.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us Section */}
			<section className="bg-white py-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-8">
							Why Choose TGA Law Group for Corporate Law Ethiopia?
						</h2>

						<div className="grid md:grid-cols-2 gap-8 text-left">
							<div>
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									#1 Law Firm in Ethiopia
								</h3>
								<p className="text-gray-600 mb-6">
									Recognized as the leading law firm in Ethiopia with unmatched expertise
									in corporate and commercial law.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									International Law Firm Ethiopia
								</h3>
								<p className="text-gray-600 mb-6">
									Global legal network with presence in 52 jurisdictions, providing
									international business law expertise.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Top African Lawyers
								</h3>
								<p className="text-gray-600 mb-6">
									Led by Tewodros Getachew Tulu, President of PALU, representing the
									highest standards in African legal practice.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold mb-4 text-teal-600">
									Business Law Firm Addis Ababa
								</h3>
								<p className="text-gray-600 mb-6">
									Strategic location in Addis Ababa with deep understanding of Ethiopian
									business environment and regulations.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-teal-600 text-white py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold mb-6">
						Ready to Work with Leading Corporate Lawyers Ethiopia?
					</h2>
					<p className="text-xl mb-8">
						Contact TGA Law Group for expert corporate legal services in Ethiopia
					</p>
					<button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
						Contact Our Corporate Lawyers
					</button>
				</div>
			</section>
		</div>
	);
}
