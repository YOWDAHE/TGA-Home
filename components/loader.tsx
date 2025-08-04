"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LoaderProps {
	className?: string;
	size?: number;
}

export default function Loader({ className = "", size = 100 }: LoaderProps) {
	const [currentImage, setCurrentImage] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prev) =>
				prev === "/loader/loader-1.svg"
					? "/loader/loader-3.svg"
					: "/loader/loader-1.svg"
			);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<div className="relative" style={{ width: size, height: size }}>
				{currentImage !== "" && (
					<img
						src={currentImage}
						alt="Loading..."
						width={size}
						height={size}
						className="absolute inset-0 transition-opacity duration-500"
					/>
				)}
			</div>
		</div>
	);
}
