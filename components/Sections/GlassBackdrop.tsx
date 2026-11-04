"use client";

import React from "react";
import { motion } from "framer-motion";
import { easeOut } from "./Reveal";

// Four long slanted rows of frosted glass running across the hero. Each row is a line of panels
// with a gap between them and one straight lower edge; the rows are parallel and evenly spaced.
const ROWS = 4;
const PANELS_PER_ROW = 3;
const PANEL_GAP = 1.5; // % of the row width left empty between panels
const panelAlphas = [0.62, 0.42, 0.54];
const alpha = (index: number, row: number) => panelAlphas[(index + row) % panelAlphas.length];

/** The brand wash with four slanted rows of frosted glass, fading to white at the bottom. Used behind
 *  the home hero and the inner page heroes; place it inside a `relative isolate overflow-hidden` box. */
export default function GlassBackdrop() {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
			{/* Brand wash over white: emerald green on the left, the brand tint in the middle, navy on the right */}
			<div className="absolute inset-0 bg-white bg-[linear-gradient(100deg,rgba(0,122,94,0.42)_0%,#E6F2EE_48%,rgba(11,27,77,0.34)_100%)]" />
			<div className="absolute -left-[20%] -top-[30%] h-[140%] w-[140%]">
					{Array.from({ length: ROWS }, (_, row) => (
						<motion.div
							key={row}
							initial={{ opacity: 0, y: -40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.4, ease: easeOut, delay: 0.1 + row * 0.12 }}
							className="absolute inset-x-0 h-[30%]"
							// Top row in front, each lower row further back
							style={{ top: `${-6 + row * 17}%`, skewY: 22, zIndex: ROWS - row }}
						>
							{/* Every other row is shifted half a panel so its gaps fall between the gaps of the rows
							    beside it; it gets one extra panel to fill the edge it uncovers */}
							{Array.from({ length: PANELS_PER_ROW + (row % 2) }, (_, index) => (
								// Frosted glass: a background blur plus a milky fill that brightens toward the lower edge.
								// The mask fades the whole box, blur included, out toward its top.
								// Only these few boxes use backdrop-filter, and they don't move once the intro ends.
								<div
									key={index}
									className="absolute top-0 h-full backdrop-blur-md"
									style={{
										left: `${((index - (row % 2) / 2) * 100) / PANELS_PER_ROW}%`,
										width: `${100 / PANELS_PER_ROW - PANEL_GAP}%`,
										maskImage: "linear-gradient(to bottom, transparent 0%, black 55%)",
										WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%)",
										background: `linear-gradient(180deg, rgba(255,255,255,${alpha(index, row) * 0.35}) 0%, rgba(255,255,255,${
											alpha(index, row) * 0.6
										}) 65%, rgba(255,255,255,${alpha(index, row)}) 100%)`,
									}}
								/>
							))}
						</motion.div>
					))}
			</div>
			{/* Fade to the white page so the headline sits on a calm ground */}
			<div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_45%,rgba(255,255,255,0.7)_70%,#ffffff_86%)]" />
		</div>
	);
}
