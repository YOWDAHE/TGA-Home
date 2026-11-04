"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, LogOut, Mail, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { easeOut } from "./Reveal";

export const menuLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about-us", label: "About" },
	{ href: "/#services", label: "Services" },
	{ href: "/resources", label: "Resources" },
	{ href: "/news", label: "News" },
	{ href: "/legal-updates", label: "Legal Updates" },
];

const panel = {
	hidden: { x: "100%" },
	show: {
		x: 0,
		transition: { duration: 0.5, ease: easeOut, staggerChildren: 0.06, delayChildren: 0.15 },
	},
	exit: { x: "100%", transition: { duration: 0.35, ease: easeOut } },
};

// Each row slides in after the previous one
const item = {
	hidden: { opacity: 0, x: 40, filter: "blur(6px)" },
	show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: easeOut } },
};

interface MobileMenuProps {
	open: boolean;
	onClose: () => void;
	currentHref?: string;
}

/** Slide-in navigation drawer used by the hero and the sticky header on small screens. */
export default function MobileMenu({ open, onClose, currentHref = "/" }: MobileMenuProps) {
	const { user, logout, loading } = useAuth();

	// Lock page scroll and close on Escape while open
	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);

	return (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menu">
					<motion.div
						className="absolute inset-0 bg-brand-navy/40"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={onClose}
					/>

					<motion.aside
						variants={panel}
						initial="hidden"
						animate="show"
						exit="exit"
						className="absolute inset-y-0 right-0 flex w-[min(100%,400px)] flex-col overflow-hidden bg-white"
					>
						<motion.div variants={item} className="flex items-center justify-between p-5">
							<img
								src="/logo.svg"
								alt="TGA Global Law Firm LL.P"
								width={164}
								height={76}
								className="h-10 w-auto"
							/>
							<button
								type="button"
								onClick={onClose}
								aria-label="Close menu"
								className="flex h-10 w-10 items-center justify-center rounded-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-[#f4f5f7]"
							>
								<X className="h-5 w-5" />
							</button>
						</motion.div>

						<nav className="relative flex-1 overflow-y-auto px-5 pt-2">
							<ul>
								{menuLinks.map((link) => {
									const active = link.href === currentHref;
									return (
										<motion.li key={link.href} variants={item}>
											<Link
												href={link.href}
												onClick={onClose}
												className="group flex items-center gap-4 border-b border-[#eef1f5] py-4"
											>
												<span
													className={`flex-1 text-2xl font-semibold tracking-tight transition-colors ${
														active ? "text-brand-navy" : "text-[#7a8397] group-hover:text-brand-navy"
													}`}
												>
													{link.label}
												</span>
												{active ? (
													<span className="h-0.5 w-5 bg-brand-green" />
												) : (
													<ArrowUpRight className="h-5 w-5 text-[#b4bccb] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green" />
												)}
											</Link>
										</motion.li>
									);
								})}
							</ul>

							{/* Account */}
							<motion.div variants={item} className="mt-6">
								{user ? (
									<div className="flex items-center gap-3 border border-brand-navy/10 p-3">
										<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-brand-navy text-sm font-medium text-white">
											{user.username.charAt(0).toUpperCase()}
										</span>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-brand-navy">{user.username}</p>
											<p className="truncate text-xs text-[#7a8397]">{user.email}</p>
										</div>
										<button
											type="button"
											onClick={() => {
												logout();
												onClose();
											}}
											aria-label="Logout"
											className="flex h-9 w-9 items-center justify-center rounded-sm text-red-600 transition-colors hover:bg-red-50"
										>
											<LogOut className="h-4 w-4" />
										</button>
									</div>
								) : loading ? null : (
									<div className="grid grid-cols-2 gap-2">
										<Link
											href="/login"
											onClick={onClose}
											className="rounded-sm py-3 text-center text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-[#f4f5f7]"
										>
											Login
										</Link>
										<Link
											href="/signup"
											onClick={onClose}
											className="rounded-sm bg-brand-tint py-3 text-center text-sm font-medium text-brand-green transition-colors hover:bg-brand-green hover:text-white"
										>
											Sign Up
										</Link>
									</div>
								)}
							</motion.div>
						</nav>

						<motion.div variants={item} className="relative space-y-3 p-5">
							<Link
								href="/#contact"
								onClick={onClose}
								className="group flex items-center justify-between rounded-sm bg-brand-navy py-2 pl-6 pr-2 font-medium text-white transition-colors hover:bg-brand-green"
							>
								Get Legal Consultation
								<span className="flex h-10 w-10 items-center justify-center">
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								</span>
							</Link>
							<a
								href="mailto:info@tgagloballawfirm.com"
								className="flex items-center justify-center gap-2 text-sm text-[#7a8397] transition-colors hover:text-brand-navy"
							>
								<Mail className="h-4 w-4" />
								info@tgagloballawfirm.com
							</a>
						</motion.div>
					</motion.aside>
				</div>
			)}
		</AnimatePresence>
	);
}
