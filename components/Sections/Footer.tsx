import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ContactUs as ContactUsType } from "@/app/types/landing";

interface FooterProps {
	contactUs?: ContactUsType[];
}

export default function Footer({ contactUs }: FooterProps) {
	// Extract contact information from contactUs data
	const getContactInfo = (type: string) => {
		contactUs = contactUs || [];
		const contact = contactUs.find(c => 
			c.medium.toLowerCase().includes(type.toLowerCase())
		);
		return contact?.email || contact?.phone_number || "";
	};

	// Services data (matching the Services component)
	const services = [
		{
			title: "Retention and Ongoing Legal Support",
			href: "#services",
		},
		{
			title: "Representation",
			href: "#services",
		},
		{
			title: "Consulting and Advisory",
			href: "#services",
		},
		{
			title: "Contract Management and Arbitration",
			href: "#services",
		},
	];

	return (
		<footer className="bg-slate-800 text-white py-12">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<img
							src="/loader/loader-1.svg"
							alt="Logo"
							width={100}
							height={100}
							className=" bg-white rounded-md mb-4"
						/>
						<p className="text-gray-400">
							Committed to excellence in legal services across Ethiopia and Africa.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Services</h3>
						<ul className="space-y-2 text-gray-400">
							{services.map((service, index) => (
								<li key={index}>
									<Link href={service.href} className="hover:text-white">
										{service.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-2 text-gray-400">
							<li>
								<Link href="#about" className="hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white">
									Our Team
								</Link>
							</li>
							<li>
								<Link href="/news" className="hover:text-white">
									News
								</Link>
							</li>
							<li>
								<Link href="/resources" className="hover:text-white">
									Resources
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Contact</h3>
						<div className="space-y-2 text-gray-400">
							<p>Addis Ababa, Ethiopia</p>
							<p>{getContactInfo("email")}</p>
							<p>{getContactInfo("phone")}</p>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
					<p>
						&copy; 2024 TG&A Law Group. All rights reserved. |{" "}
						<a href="/about-us#disclosure">Attorney Advertising</a>
					</p>
					{/* <p className="mt-6 text-sm opacity-60 group cursor-pointer">
						Website made by{" "}
						<a href="https://www.linkedin.com/in/yodahe-ketema-08310a208/" className="text-white group-hover:underline opacity-75">
							Yodahe Ketema
						</a>
					</p> */}
				</div>
			</div>
		</footer>
	);
}
