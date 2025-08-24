import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal Services for Diaspora Ethiopians | Ethiopian Diaspora Legal Help | TGA Global Law Firm LL.P LL.P',
  description: 'Legal services for diaspora Ethiopians. Ethiopian diaspora legal help including property management, investment advisory, and cross-border legal services. #1 law firm in Ethiopia.',
  keywords: 'Legal Services for Diaspora Ethiopians, Ethiopian Diaspora Legal Help, Diaspora Property Lawyers Ethiopia, Ethiopian Diaspora Legal Services, Cross-Border Legal Services Ethiopia, Diaspora Legal Help Ethiopia',
  openGraph: {
    title: 'Legal Services for Diaspora Ethiopians | Ethiopian Diaspora Legal Help',
    description: 'Legal services for diaspora Ethiopians. Ethiopian diaspora legal help including property management, investment advisory, and cross-border legal services.',
    type: 'website',
  },
};

export default function DiasporaLegalServices() {
  return (
			<div className="min-h-screen bg-gray-50">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white pb-20">
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
								Legal Services for Diaspora Ethiopians
							</h1>
							<h2 className="text-2xl md:text-3xl font-semibold mb-8 text-teal-400">
								Ethiopian Diaspora Legal Help - #1 Law Firm in Ethiopia
							</h2>
							<p className="text-xl mb-8">
								Comprehensive legal services for Ethiopian diaspora worldwide. Property
								management, investment advisory, and cross-border legal support.
							</p>
						</div>
					</div>
				</section>

				{/* Services Section */}
				<section className="py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-6xl mx-auto">
							<h2 className="text-3xl font-bold text-center mb-12">
								Ethiopian Diaspora Legal Services
							</h2>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Diaspora Property Lawyers Ethiopia
									</h3>
									<p className="text-gray-600">
										Expert property legal services for Ethiopian diaspora including
										property purchase, sale, management, and investment in Ethiopia.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Cross-Border Legal Services Ethiopia
									</h3>
									<p className="text-gray-600">
										International legal services for diaspora including business setup,
										investment advisory, and cross-border transactions.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Ethiopian Diaspora Legal Help
									</h3>
									<p className="text-gray-600">
										Remote legal consultations, document preparation, and representation
										services for Ethiopian diaspora worldwide.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Investment Advisory
									</h3>
									<p className="text-gray-600">
										Legal guidance for diaspora investments in Ethiopia including real
										estate, business ventures, and financial investments.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Business Setup Services
									</h3>
									<p className="text-gray-600">
										Complete legal support for diaspora business setup in Ethiopia
										including registration, licensing, and compliance.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Inheritance & Succession
									</h3>
									<p className="text-gray-600">
										Legal services for inheritance, property succession, and estate
										planning for Ethiopian diaspora families.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Specialized Services Section */}
				<section className="bg-white py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto">
							<h2 className="text-3xl font-bold text-center mb-12">
								Specialized Diaspora Legal Services
							</h2>

							<div className="grid md:grid-cols-2 gap-8">
								<div className="bg-teal-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Property Management for Diaspora
									</h3>
									<ul className="text-gray-600 space-y-2">
										<li>• Remote property management services</li>
										<li>• Property maintenance and repairs</li>
										<li>• Rental property legal support</li>
										<li>• Property tax and compliance</li>
										<li>• Property insurance and protection</li>
									</ul>
								</div>

								<div className="bg-teal-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Investment Legal Support
									</h3>
									<ul className="text-gray-600 space-y-2">
										<li>• Investment legal advisory</li>
										<li>• Due diligence services</li>
										<li>• Contract review and negotiation</li>
										<li>• Regulatory compliance</li>
										<li>• Risk assessment and mitigation</li>
									</ul>
								</div>

								<div className="bg-teal-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Remote Legal Services
									</h3>
									<ul className="text-gray-600 space-y-2">
										<li>• Video consultations</li>
										<li>• Document preparation</li>
										<li>• Legal opinion services</li>
										<li>• Power of attorney</li>
										<li>• Legal representation</li>
									</ul>
								</div>

								<div className="bg-teal-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Family Legal Services
									</h3>
									<ul className="text-gray-600 space-y-2">
										<li>• Family law matters</li>
										<li>• Inheritance planning</li>
										<li>• Property succession</li>
										<li>• Guardianship services</li>
										<li>• Family business legal support</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Why Choose Us Section */}
				<section className="bg-gray-100 py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center">
							<h2 className="text-3xl font-bold mb-8">
								Why Choose TGA Global Law Firm LL.P LL.P for Diaspora Legal Services?
							</h2>

							<div className="grid md:grid-cols-2 gap-8 text-left">
								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										#1 Law Firm in Ethiopia
									</h3>
									<p className="text-gray-600 mb-6">
										Recognized as the leading law firm in Ethiopia with extensive
										experience serving Ethiopian diaspora worldwide.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										International Legal Network
									</h3>
									<p className="text-gray-600 mb-6">
										Global legal network with presence in 52 jurisdictions, providing
										seamless cross-border legal services.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Diaspora Property Lawyers Ethiopia
									</h3>
									<p className="text-gray-600 mb-6">
										Specialized property legal services for Ethiopian diaspora with deep
										understanding of local property laws.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Cross-Border Legal Services Ethiopia
									</h3>
									<p className="text-gray-600 mb-6">
										Expert cross-border legal services including business setup,
										investment advisory, and international transactions.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="bg-white py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center">
							<h2 className="text-3xl font-bold mb-12">
								What Ethiopian Diaspora Say About Our Services
							</h2>

							<div className="grid md:grid-cols-2 gap-8">
								<div className="bg-gray-50 p-6 rounded-lg">
									<p className="text-gray-600 mb-4 italic">
										"TGA Global Law Firm LL.P LL.P provided excellent legal services for my property
										investment in Ethiopia. Their diaspora legal help was invaluable."
									</p>
									<p className="font-semibold text-teal-600">
										- Ethiopian Diaspora Client
									</p>
								</div>

								<div className="bg-gray-50 p-6 rounded-lg">
									<p className="text-gray-600 mb-4 italic">
										"The cross-border legal services were seamless. They handled
										everything remotely and kept me informed throughout the process."
									</p>
									<p className="font-semibold text-teal-600">- International Client</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-teal-600 text-white py-16">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold mb-6">
							Need Legal Services for Diaspora Ethiopians?
						</h2>
						<p className="text-xl mb-8">
							Contact TGA Global Law Firm LL.P LL.P for comprehensive Ethiopian diaspora legal help
						</p>
						<button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
							Contact Our Diaspora Legal Team
						</button>
					</div>
				</section>
			</div>
		);
}
