import Link from "next/link";
import React from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
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

	const linkClass = "text-white/60 transition-colors hover:text-white";
	const phone = getContactInfo("phone");

	return (
		<footer className="px-3 pb-3 pt-8 sm:px-6 sm:pb-6">
			<div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-sm bg-brand-navy px-6 pb-8 pt-12 text-white sm:px-12 sm:pt-16">
				{/* Soft emerald glow */}
				<div
					aria-hidden
					className="absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-brand-green/40 blur-3xl"
				/>
				<div
					aria-hidden
					className="absolute -bottom-40 -left-20 -z-10 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl"
				/>

				{/* Closing call to action */}
				<div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-xl">
						<img
							src="/logo.svg"
							alt="TGA Global Law Firm LL.P"
							width={164}
							height={76}
							className="mb-8 h-16 w-auto rounded-sm bg-white px-4 py-2.5"
						/>
						<p className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
							Committed to excellence in legal services across Ethiopia and Africa.
						</p>
					</div>
					<div className="flex shrink-0 flex-col gap-3 sm:flex-row">
						<Link
							href="/#contact"
							className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-white px-6 py-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-tint"
						>
							Get in touch
							<ArrowUpRight className="h-4 w-4" />
						</Link>
						<a
							href="mailto:info@tgagloballawfirm.com"
							className="inline-flex items-center justify-center rounded-sm px-6 py-3 text-sm font-medium text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
						>
							info@tgagloballawfirm.com
						</a>
					</div>
				</div>

				{/* Link columns */}
				<div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-brand-tint/70">
							Services
						</h3>
						<ul className="space-y-3 text-sm">
							{services.map((service, index) => (
								<li key={index}>
									<Link href={service.href} className={linkClass}>
										{service.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:col-span-3">
						<h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-brand-tint/70">
							Company
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="#about" className={linkClass}>
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className={linkClass}>
									Our Team
								</Link>
							</li>
							<li>
								<Link href="/news" className={linkClass}>
									News
								</Link>
							</li>
							<li>
								<Link href="/legal-updates" className={linkClass}>
									Legal Updates
								</Link>
							</li>
							<li>
								<Link href="/resources" className={linkClass}>
									Resources
								</Link>
							</li>
						</ul>
					</div>

					<div className="lg:col-span-4">
						<h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-brand-tint/70">
							Contact
						</h3>
						<ul className="space-y-3 text-sm text-white/60">
							<li className="flex items-center gap-3">
								<MapPin className="h-4 w-4 shrink-0 text-brand-tint/70" />
								Addis Ababa, Ethiopia
							</li>
							{/* <li>{getContactInfo("email")}</li> */}
							<li className="flex items-center gap-3">
								<Mail className="h-4 w-4 shrink-0 text-brand-tint/70" />
								info@tgagloballawfirm.com
							</li>
							{phone && (
								<li className="flex items-center gap-3">
									<Phone className="h-4 w-4 shrink-0 text-brand-tint/70" />
									{phone}
								</li>
							)}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
					<p>&copy; {new Date().getFullYear()} TGA Global Law Firm LL.P. All rights reserved.</p>
					<a href="/about-us#disclosure" className="transition-colors hover:text-white">
						Attorney Advertising
					</a>
					{/* <p className="mt-6 text-sm opacity-60 group cursor-pointer">
						Website made by{" "}
						<a href="https://www.linkedin.com/in/yodahe-ketema-08310a208/" className="text-white group-hover:underline opacity-75">
							Yodahe Ketema
						</a>
					</p> */}
				</div>

				{/* Oversized wordmark */}
				<p
					aria-hidden
					className="pointer-events-none mt-6 select-none whitespace-nowrap text-center text-[min(13vw,11rem)] font-semibold leading-none tracking-tighter text-white/[0.05]"
				>
					TGA Global
				</p>
			</div>
		</footer>
	);
}
