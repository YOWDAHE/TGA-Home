"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, LogOut, Menu, User, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { easeOut } from "./Reveal";
import MobileMenu, { menuLinks } from "./MobileMenu";

// Plain text links; the current page gets a green rule underneath
const linkClass = (active: boolean) =>
	`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:transition-colors ${
		active
			? "text-brand-navy after:bg-brand-green"
			: "text-[#4b5468] after:bg-transparent hover:text-brand-navy hover:after:bg-brand-navy/20"
	}`;

const iconButtonClass =
	"h-10 w-10 items-center justify-center rounded-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-[#f4f5f7]";

/** Round account button for large screens: sign-in links, or the signed-in user with logout. */
function AccountMenu() {
	const { user, logout, loading } = useAuth();
	if (loading) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={user ? "Account" : "Log in or sign up"}
				className={`hidden text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green lg:flex ${iconButtonClass}`}
			>
				{user ? user.username.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-sm p-1.5">
				{user ? (
					<>
						<div className="px-3 py-2">
							<p className="truncate text-sm font-medium text-brand-navy">{user.username}</p>
							<p className="truncate text-xs text-[#7a8397]">{user.email}</p>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={logout} className="rounded-sm text-red-600">
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem asChild className="rounded-sm">
							<Link href="/login">
								<LogIn className="mr-2 h-4 w-4" />
								Login
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className="rounded-sm">
							<Link href="/signup">
								<UserPlus className="mr-2 h-4 w-4" />
								Sign Up
							</Link>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// Past this point the bar may hide, and it gets a solid background
const SCROLLED_AFTER = 80;
// Ignore tiny scroll jitters (trackpads, momentum) before changing direction
const DIRECTION_THRESHOLD = 8;

/** Hides the bar while scrolling down and brings it back on any scroll up. */
function useHideOnScroll() {
	const [hidden, setHidden] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const lastY = useRef(0);

	useEffect(() => {
		lastY.current = window.scrollY;
		let frame = 0;
		const update = () => {
			frame = 0;
			const y = window.scrollY;
			const delta = y - lastY.current;
			setScrolled(y > SCROLLED_AFTER);
			if (y <= SCROLLED_AFTER) setHidden(false);
			else if (Math.abs(delta) > DIRECTION_THRESHOLD) setHidden(delta > 0);
			else return;
			lastY.current = y;
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	return { hidden, scrolled };
}

/** Logo, text navigation and contact button at the top of the redesigned pages; a burger and drawer on small screens.
 *  Fixed to the top: it slides away while scrolling down and comes back when scrolling up.
 *  With `overlay` it is see-through over the page top (for the home hero) until the page scrolls. */
// Frosted glass: translucent white with a background blur
const frosted = "bg-white/70 backdrop-blur-md";

export default function TopNav({ currentHref, overlay = false }: { currentHref: string; overlay?: boolean }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const { hidden, scrolled } = useHideOnScroll();

	return (
		<>
			{/* Holds the bar's place in the page so content starts below it */}
			{!overlay && <div aria-hidden className="h-16 shrink-0" />}

			<motion.header
				initial={false}
				animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
				transition={{ duration: 0.35, ease: easeOut }}
				className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
					scrolled
						? `border-b border-brand-navy/10 py-3 ${frosted}`
						: `border-b border-transparent pb-3 pt-5 ${overlay ? "bg-transparent" : frosted}`
				}`}
			>
			<motion.div
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: easeOut }}
				className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
			>
				<Link href="/" aria-label="TGA Global Law Firm home" className="shrink-0">
					<img
						src="/logo.svg"
						alt="TGA Global Law Firm LL.P"
						width={164}
						height={76}
						className="h-8 w-auto sm:h-10"
					/>
				</Link>
				<nav className="hidden items-center gap-7 text-sm lg:flex">
					{menuLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							aria-current={link.href === currentHref ? "page" : undefined}
							className={linkClass(link.href === currentHref)}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-2">
					<Link
						href="/#contact"
						className="hidden rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green sm:inline-flex"
					>
						Contact us
					</Link>
					<AccountMenu />
					<button
						type="button"
						onClick={() => setMenuOpen(true)}
						aria-label="Open menu"
						aria-expanded={menuOpen}
						className={`flex lg:hidden ${iconButtonClass}`}
					>
						<Menu className="h-5 w-5" />
					</button>
				</div>
			</motion.div>
			</motion.header>

			<MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} currentHref={currentHref} />
		</>
	);
}
