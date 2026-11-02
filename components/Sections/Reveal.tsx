"use client";

import React from "react";
import { motion } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	y?: number;
}

/**
 * Fades and lifts its children in when they scroll into view, and back out
 * when they leave it (viewport `once` is off, so it plays both ways).
 */
export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y, filter: "blur(6px)" }}
			whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			viewport={{ amount: 0.15, margin: "0px 0px -40px 0px" }}
			transition={{ duration: 0.7, ease: easeOut, delay }}
		>
			{children}
		</motion.div>
	);
}
