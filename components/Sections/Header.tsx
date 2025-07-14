import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Header({
	showHeader = true
}: {
	showHeader?: boolean;
}) {
	const [isVisible, setIsVisible] = useState(showHeader);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const heroSection = document.getElementById('hero-section');
			
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

        window.addEventListener('scroll', handleScroll, { passive: true });
        
		handleScroll();
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [lastScrollY]);

	return (
		<header 
			className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
				isVisible ? 'translate-y-0' : '-translate-y-full'
			}`}
		>
			<div className="container mx-auto px-4 py-1">
				<nav className="flex items-center justify-between">
					<Image src="/Images/logo/TGA_LOGO.svg" alt="Logo" width={100} height={100} />
					<div className="hidden md:flex space-x-8">
						<Link href="/" className="text-teal-500 font-medium hover:text-teal-600">
							Home
						</Link>
						<Link href="#about" className="text-gray-700 hover:text-teal-500">
							About
						</Link>
						<Link href="#services" className="text-gray-700 hover:text-teal-500">
							Our service
						</Link>
						<Link href="/resources" className="text-gray-700 hover:text-teal-500">
							Resources
						</Link>
						<Link href="/news" className="text-gray-700 hover:text-teal-500">
							News
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
