import Link from "next/link";
import React from "react";

export default function Footer() {
	return (
		<footer className="bg-slate-800 text-white py-12">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<div className="bg-teal-500 text-white px-3 py-2 rounded font-bold text-xl">
								TG&A
							</div>
							<span className="font-medium">LAW GROUP</span>
						</div>
						<p className="text-gray-400">
							Committed to excellence in legal services across Ethiopia and Africa.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Services</h3>
						<ul className="space-y-2 text-gray-400">
							<li>
								<Link href="#" className="hover:text-white">
									Legal Consulting
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Contract Management
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Arbitration
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Construction Law
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-2 text-gray-400">
							<li>
								<Link href="#" className="hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Our Team
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Careers
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Contact</h3>
						<div className="space-y-2 text-gray-400">
							<p>Addis Ababa, Ethiopia</p>
							<p>info@tgalawgroup.com</p>
							<p>+251 11 XXX XXXX</p>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
					<p>&copy; 2024 TG&A Law Group. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
