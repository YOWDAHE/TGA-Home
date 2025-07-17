import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useRef, useCallback, useEffect } from "react";

interface CarouselProps<T> {
	items: T[];
	renderItem: (item: T, idx: number) => React.ReactNode;
	initialIndex?: number;
	className?: string;
	autoPlay?: boolean;
	autoPlayInterval?: number; // milliseconds
	pauseOnHover?: boolean;
}

export default function Carousel<T>({
	items,
	renderItem,
	initialIndex = 0,
	className = "",
	autoPlay = true,
	autoPlayInterval = 3000,
	pauseOnHover = true,
}: CarouselProps<T>) {
	const [activeIndex, setActiveIndex] = useState(initialIndex);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStartX, setDragStartX] = useState(0);
	const [dragOffset, setDragOffset] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const carouselRef = useRef<HTMLDivElement>(null);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

	const prevCard = () => {
		setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
	};

	const nextCard = () => {
		setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
	};

	// Auto-play functionality
	useEffect(() => {
		if (!autoPlay || isPaused || isDragging) {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
				autoPlayRef.current = null;
			}
			return;
		}

		autoPlayRef.current = setInterval(() => {
			nextCard();
		}, autoPlayInterval);

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
				autoPlayRef.current = null;
			}
		};
	}, [autoPlay, isPaused, isDragging, autoPlayInterval, items.length]);

	// Handle drag start
	const handleDragStart = useCallback((clientX: number) => {
		setIsDragging(true);
		setDragStartX(clientX);
		setDragOffset(0);
	}, []);

	// Handle drag move
	const handleDragMove = useCallback((clientX: number) => {
		if (!isDragging) return;
		const offset = clientX - dragStartX;
		setDragOffset(offset);
	}, [isDragging, dragStartX]);

	// Handle drag end
	const handleDragEnd = useCallback(() => {
		if (!isDragging) return;
		
		const threshold = 100; // Minimum drag distance to trigger slide
		
		if (dragOffset > threshold) {
			prevCard();
		} else if (dragOffset < -threshold) {
			nextCard();
		}
		
		setIsDragging(false);
		setDragOffset(0);
	}, [isDragging, dragOffset]);

	// Mouse event handlers
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		handleDragStart(e.clientX);
	}, [handleDragStart]);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		handleDragMove(e.clientX);
	}, [handleDragMove]);

	const handleMouseUp = useCallback(() => {
		handleDragEnd();
	}, [handleDragEnd]);

	// Touch event handlers
	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		handleDragStart(e.touches[0].clientX);
	}, [handleDragStart]);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		e.preventDefault();
		handleDragMove(e.touches[0].clientX);
	}, [handleDragMove]);

	const handleTouchEnd = useCallback(() => {
		handleDragEnd();
	}, [handleDragEnd]);

	// Pause/resume on hover
	const handleMouseEnter = useCallback(() => {
		if (pauseOnHover) {
			setIsPaused(true);
		}
	}, [pauseOnHover]);

	const handleMouseLeave = useCallback(() => {
		if (pauseOnHover) {
			setIsPaused(false);
		}
	}, [pauseOnHover]);

	// Add/remove global mouse event listeners
	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			document.body.style.userSelect = 'none';
			document.body.style.cursor = 'grabbing';
		} else {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	// Show max 5 cards: center, two left, two right
	const getCardProps = (index: number) => {
		const total = items.length;
		let pos = index - activeIndex;
		if (pos > total / 2) pos -= total;
		if (pos < -total / 2) pos += total;
		let style = {};
		let zIndex = 0;
		
		// Calculate drag offset for smooth dragging
		const dragTransform = isDragging ? `translateX(${dragOffset * 0.1}px)` : '';
		
		if (pos === 0) {
			// Center card
			style = {
				transform: `perspective(1000px) rotateY(0deg) scale(1) ${dragTransform}`,
				boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
				backgroundColor: "rgba(35, 39, 51, 1)",
				transition: isDragging ? "none" : "transform 0.5s, filter 0.5s, background-color 1s",
			};
			zIndex = 10;
		} else if (pos === -1) {
			// Left 1 (mirror right 1)
			style = {
				transform: `perspective(1000px) rotateY(-25deg) scale(1.1) translateX(-400px) ${dragTransform}`,
				backgroundColor: "rgba(85, 89, 101, 1)",
				// filter: "blur(2px)",
				transition: isDragging ? "none" : "transform 0.5s, filter 0.5s, background-color 1s",
			};
			zIndex = 5;
		} else if (pos === 1) {
			// Right 1
			style = {
				transform: `perspective(1000px) rotateY(30deg) scale(0.9) translateX(300px) ${dragTransform}`,
				backgroundColor: "rgba(85, 89, 101, 1)",
				// filter: "blur(2px)",
				transition: isDragging ? "none" : "transform 0.5s, filter 0.5s, background-color 1s",
			};
			zIndex = 5;
		} else if (pos === -2) {
			// Left 2 (mirror right 2)
			style = {
				transform: `perspective(1000px) rotateY(-25deg) scale(0.9) translateX(-700px) ${dragTransform}`,
				backgroundColor: "rgba(125, 129, 141, 1)",
				// filter: "blur(10px)",
				transition: isDragging ? "none" : "transform 0.5s, filter 0.5s, background-color 1s",
			};
			zIndex = 1;
		} else if (pos === 2) {
			// Right 2
			style = {
				transform: `perspective(1000px) rotateY(45deg) scale(0.8) translateX(600px) ${dragTransform}`,
				backgroundColor: "rgba(125, 129, 141, 1)",
				// filter: "blur(10px)",
				transition: isDragging ? "none" : "transform 0.5s, filter 0.5s, background-color 1s",
			};
			zIndex = 1;
		} else {
			// Hide other cards
			style = { opacity: 0, pointerEvents: "none" };
			zIndex = 0;
		}
		return { style, zIndex, pos };
	};

	return (
		<div
			className={`flex flex-col items-center justify-center py-40 ${className} relative`}
		>
			<div className="flex items-center space-x-4">
				<button
					onClick={prevCard}
					className="text-white text-3xl font-bold px-4 py-2 rounded transition absolute left-20 z-20"
				>
					<ArrowLeft color="black" />
				</button>
				<div 
					ref={carouselRef}
					className="relative flex items-center h-64 w-auto justify-center cursor-grab active:cursor-grabbing select-none"
					onMouseDown={handleMouseDown}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{items.map((item, idx) => {
						const { style, zIndex, pos } = getCardProps(idx);
						// Determine overlay opacity
						let overlayOpacity = 0;
						// if (Math.abs(pos) === 1) overlayOpacity = 0.15;
						// if (Math.abs(pos) === 2) overlayOpacity = 0.3;
						return (
							<div
								key={idx}
								className={`absolute rounded-xl overflow-hidden shadow-lg min-w-64 min-h-40 flex items-center justify-center transition-all duration-500`}
								style={{
									...style,
									left: "50%",
									top: "50%",
									transform: `${
										(style as any).transform ? (style as any).transform + " " : ""
									}translate(-50%, -50%)`,
									zIndex,
								}}
							>
								{/* White overlay for side cards */}
								{overlayOpacity > 0 && (
									<div
										style={{
											position: "absolute",
											inset: 0,
											background: `rgba(255,255,255,${overlayOpacity})`,
											pointerEvents: "none",
											zIndex: 20,
										}}
									/>
								)}
								<div className="relative w-full h-full flex items-center justify-center">
									{renderItem(item, idx)}
								</div>
							</div>
						);
					})}
				</div>
				<button
					onClick={nextCard}
					className="text-white text-3xl font-bold px-4 py-2 rounded transition absolute right-20 z-20"
				>
					<ArrowRight color="black" />
				</button>
			</div>
		</div>
	);
}
