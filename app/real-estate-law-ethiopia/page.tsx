import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Real Estate Lawyers Ethiopia | Real Estate Law Ethiopia | TGA Global Law Firm LL.P',
  description: 'Expert real estate lawyers Ethiopia. Real estate law Ethiopia services including property transactions, land disputes, and real estate legal advice. #1 law firm in Ethiopia.',
  keywords: 'Real Estate Lawyers Ethiopia, Real Estate Law Ethiopia, Real Estate Lawyers Ethiopia Diaspora, Property Law Ethiopia, Land Law Ethiopia, Real Estate Legal Services Ethiopia',
  openGraph: {
    title: 'Real Estate Lawyers Ethiopia | Real Estate Law Ethiopia',
    description: 'Expert real estate lawyers Ethiopia. Real estate law Ethiopia services including property transactions, land disputes, and real estate legal advice.',
    type: 'website',
  },
};

export default function RealEstateLawEthiopia() {
  return (
			<div className="min-h-screen bg-gray-50">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
					<div className="flex items-center justify-center lg:gap-10 gap-4 left-0 w-full top-10 text-sm lg:text-base pb-10">
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
								Real Estate Lawyers Ethiopia
							</h1>
							<h2 className="text-2xl md:text-3xl font-semibold mb-8 text-teal-400">
								Real Estate Law Ethiopia - #1 Law Firm in Ethiopia
							</h2>
							<p className="text-xl mb-8">
								Expert real estate legal services in Ethiopia. Property transactions,
								land disputes, and real estate law expertise for local and diaspora
								clients.
							</p>
						</div>
					</div>
				</section>

				{/* Services Section */}
				<section className="py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-6xl mx-auto">
							<h2 className="text-3xl font-bold text-center mb-12">
								Real Estate Law Services Ethiopia
							</h2>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Property Transactions
									</h3>
									<p className="text-gray-600">
										Complete legal support for property purchases, sales, transfers, and
										real estate transactions in Ethiopia.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Land Law Ethiopia
									</h3>
									<p className="text-gray-600">
										Expert land law services including land registration, title
										verification, and land use regulations.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Real Estate Lawyers Ethiopia Diaspora
									</h3>
									<p className="text-gray-600">
										Specialized legal services for Ethiopian diaspora including property
										management and investment in Ethiopia.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Property Disputes
									</h3>
									<p className="text-gray-600">
										Resolution of property disputes, boundary conflicts, and real estate
										litigation in Ethiopian courts.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Real Estate Development
									</h3>
									<p className="text-gray-600">
										Legal advisory for real estate development projects, zoning
										compliance, and construction law in Ethiopia.
									</p>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Property Investment
									</h3>
									<p className="text-gray-600">
										Legal guidance for property investment, rental agreements, and real
										estate portfolio management in Ethiopia.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Diaspora Services Section */}
				<section className="bg-white py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto">
							<h2 className="text-3xl font-bold text-center mb-12">
								Real Estate Lawyers Ethiopia Diaspora Services
							</h2>

							<div className="grid md:grid-cols-2 gap-8">
								<div className="bg-teal-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Diaspora Property Lawyers Ethiopia
									</h3>
									<ul className="text-gray-600 space-y-2">
										<li>• Property purchase and sale for diaspora</li>
										<li>• Property management and maintenance</li>
										<li>• Rental property legal services</li>
										<li>• Inheritance and property succession</li>
										<li>• Cross-border property transactions</li>
									</ul>
								</div>

								<div className="bg-teal-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Ethiopian Diaspora Legal Help
									</h3>
									<ul className="text-gray-600 space-y-2">
										<li>• Remote legal consultations</li>
										<li>• Document preparation and review</li>
										<li>• Power of attorney services</li>
										<li>• Property investment advisory</li>
										<li>• Legal representation in Ethiopia</li>
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
								Why Choose TGA Global Law Firm LL.P for Real Estate Law Ethiopia?
							</h2>

							<div className="grid md:grid-cols-2 gap-8 text-left">
								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										#1 Law Firm in Ethiopia
									</h3>
									<p className="text-gray-600 mb-6">
										Recognized as the leading law firm in Ethiopia with extensive
										experience in real estate and property law.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Real Estate Law Ethiopia Experts
									</h3>
									<p className="text-gray-600 mb-6">
										Deep understanding of Ethiopian real estate laws, regulations, and
										local property market dynamics.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										Real Estate Lawyers Ethiopia Diaspora
									</h3>
									<p className="text-gray-600 mb-6">
										Specialized services for Ethiopian diaspora with remote consultation
										and local representation capabilities.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold mb-4 text-teal-600">
										International Legal Network
									</h3>
									<p className="text-gray-600 mb-6">
										Global legal network with presence in 52 jurisdictions, providing
										cross-border real estate legal services.
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
							Need Expert Real Estate Lawyers Ethiopia?
						</h2>
						<p className="text-xl mb-8">
							Contact TGA Global Law Firm LL.P for comprehensive real estate legal services in
							Ethiopia
						</p>
						<button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
							Contact Our Real Estate Lawyers
						</button>
					</div>
				</section>
			</div>
		);
}
