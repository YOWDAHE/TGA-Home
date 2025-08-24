import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, User, LogOut, ChevronDown, Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header({
	showHeader = true,
	currentPage = "home",
}: {
	showHeader?: boolean;
	currentPage?: "home" | "about-us" | "services" | "resources" | "news";
}) {
	const [isVisible, setIsVisible] = useState(showHeader);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, logout, loading } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const heroSection = document.getElementById("hero-section");

			if (heroSection) {
				const heroRect = heroSection.getBoundingClientRect();
				const windowHeight = window.innerHeight;

				const heroCenter = heroRect.top + heroRect.height / 2;
				const viewportCenter = windowHeight / 2;
				const tolerance = windowHeight * 0.25;

				const isHeroCentered = Math.abs(heroCenter - viewportCenter) < tolerance;

				if (isHeroCentered) {
					setIsVisible(false);
				} else {
					if (currentScrollY > lastScrollY && currentScrollY > 100) {
						setIsVisible(false);
					} else if (currentScrollY < lastScrollY) {
						setIsVisible(true);
					}
				}
			} else {
				if (currentScrollY > lastScrollY && currentScrollY > 100) {
					setIsVisible(false);
				} else if (currentScrollY < lastScrollY) {
					setIsVisible(true);
				}
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollY]);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isMobileMenuOpen && !(event.target as Element).closest(".mobile-menu")) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMobileMenuOpen]);

	// Close mobile menu when route changes
	const handleNavClick = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			{!isMobileMenuOpen && (
				<header
					className={`bg-white text-sm shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
						isVisible ? "translate-y-0" : "-translate-y-full"
					}`}
				>
					<div className="container mx-auto px-4 py-1">
						<nav className="flex items-center justify-between">
							<img src="/loader/loader-1.svg" alt="Logo" width={100} height={100} />

							{/* Desktop Navigation */}
							<div className="hidden md:flex items-center space-x-8">
								<Link
									href="/"
									className={`font-medium hover:text-teal-500 ${
										currentPage === "home" ? "text-teal-500" : "text-gray-700"
									}`}
								>
									Home
								</Link>
								<Link
									href="/about-us"
									className={`font-medium hover:text-teal-500 ${
										currentPage === "about-us" ? "text-teal-500" : "text-gray-700"
									}`}
								>
									About
								</Link>
								<Link
									href="/#services"
									scroll={true}
									className={`font-medium hover:text-teal-500 ${
										currentPage === "services" ? "text-teal-500" : "text-gray-700"
									}`}
								>
									Our service
								</Link>
								<Link
									href="/resources"
									className={`font-medium hover:text-teal-500 ${
										currentPage === "resources" ? "text-teal-500" : "text-gray-700"
									}`}
								>
									Resources
								</Link>
								<Link
									href="/news"
									className={`font-medium hover:text-teal-500 ${
										currentPage === "news" ? "text-teal-500" : "text-gray-700"
									}`}
								>
									News
								</Link>

								{/* Auth Section */}
								<div className="flex items-center space-x-4 ml-4">
									{user ? (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="flex items-center space-x-2 p-2 h-auto"
												>
													<Avatar className="h-8 w-8">
														<AvatarImage src="/placeholder-user.jpg" />
														<AvatarFallback>
															{user.username.charAt(0).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm font-medium text-gray-700">
														{user.username}
													</span>
													<ChevronDown className="h-4 w-4 text-gray-500" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-56">
												<div className="px-3 py-2">
													<p className="text-sm font-medium">{user.username}</p>
													<p className="text-xs text-gray-500">{user.email}</p>
												</div>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={logout} className="text-red-600">
													<LogOut className="w-4 h-4 mr-2" />
													Logout
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									) : loading ? (
										<Loader className="animate-spin" />
									) : (
										<div className="flex items-center space-x-2">
											<Link href="/login">
												<Button variant="outline" size="sm">
													<User className="w-4 h-4 mr-1" />
													Login
												</Button>
											</Link>
											<Link href="/signup">
												<Button size="sm" className="bg-teal-600 hover:bg-teal-700">
													Sign Up
												</Button>
											</Link>
										</div>
									)}
								</div>
							</div>

							{/* Mobile Menu Button */}
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
								aria-label="Toggle mobile menu"
							>
								{isMobileMenuOpen ? (
									<X className="w-6 h-6 text-gray-700" />
								) : (
									<Menu className="w-6 h-6 text-gray-700" />
								)}
							</button>
						</nav>
					</div>
				</header>
			)}

			{/* Mobile Sidebar */}
			<div
				className={`mobile-menu fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
					isMobileMenuOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			>
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black bg-opacity-50"
					onClick={() => setIsMobileMenuOpen(false)}
				/>

				{/* Sidebar */}
				<div
					className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-20 ${
						isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
					}`}
				>
					<div className="flex flex-col h-full">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b">
							<img src="/Images/logo/TGA_LOGO.svg" alt="Logo" width={80} height={80} />
							<button
								onClick={() => setIsMobileMenuOpen(false)}
								className="p-2 rounded-md hover:bg-gray-100 transition-colors"
							>
								<X className="w-6 h-6 text-gray-700" />
							</button>
						</div>

						{/* Navigation Links */}
						<nav className="flex-1 p-6">
							<div className="space-y-4">
								<Link
									href="/"
									onClick={handleNavClick}
									className={`block py-3 px-4 font-medium transition-colors ${
										currentPage === "home"
											? "bg-teal-50 text-teal-600 border-l-4 border-teal-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									Home
								</Link>
								<Link
									href="/about-us"
									onClick={handleNavClick}
									className={`block py-3 px-4 font-medium transition-colors ${
										currentPage === "about-us"
											? "bg-teal-50 text-teal-600 border-l-4 border-teal-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									About
								</Link>
								<Link
									href="/#services"
									onClick={handleNavClick}
									className={`block py-3 px-4 font-medium transition-colors ${
										currentPage === "services"
											? "bg-teal-50 text-teal-600 border-l-4 border-teal-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									Our service
								</Link>
								<Link
									href="/resources"
									onClick={handleNavClick}
									className={`block py-3 px-4 font-medium transition-colors ${
										currentPage === "resources"
											? "bg-teal-50 text-teal-600 border-l-4 border-teal-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									Resources
								</Link>
								<Link
									href="/news"
									onClick={handleNavClick}
									className={`block py-3 px-4 font-medium transition-colors ${
										currentPage === "news"
											? "bg-teal-50 text-teal-600 border-l-4 border-teal-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									News
								</Link>
							</div>

							{/* Auth Section */}
							<div className="mt-8 pt-6 border-t">
								{user ? (
									<div className="space-y-3">
										<div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
											<Avatar className="h-10 w-10">
												<AvatarImage src="/placeholder-user.jpg" />
												<AvatarFallback>
													{user.username.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium text-gray-900">{user.username}</p>
												<p className="text-xs text-gray-500">{user.email}</p>
											</div>
										</div>
										<Button
											onClick={() => {
												logout();
												handleNavClick();
											}}
											variant="outline"
											className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
										>
											<LogOut className="w-4 h-4" />
											<span>Logout</span>
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										<Link href="/login" onClick={handleNavClick}>
											<Button
												variant="outline"
												className="w-full flex items-center justify-center space-x-2"
											>
												<User className="w-4 h-4" />
												<span>Login</span>
											</Button>
										</Link>
										<Link href="/signup" onClick={handleNavClick}>
											<Button className="w-full bg-teal-600 hover:bg-teal-700">
												Sign Up
											</Button>
										</Link>
									</div>
								)}
							</div>
						</nav>

						{/* Footer */}
						<div className="p-6 border-t">
							<p className="text-sm text-gray-500 text-center">TGA Global Law Firm LL.P LL.P</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
