"use client";

import React, { useMemo, useRef } from "react";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeContent } from "@/app/types/landing";

type Segment = { text: string; color?: string; bold?: boolean };
/** One word as it reveals; punctuation right after a phrase stays in the same word, in its own colour */
type Word = { segments: Segment[]; lineBreak?: boolean };

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };
const decode = (text: string) =>
	text.replace(/&(#\d+|#x[\da-f]+|\w+);/gi, (match, code: string) => {
		if (entities[code]) return entities[code];
		if (code[0] === "#") return String.fromCodePoint(code[1] === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1)));
		return match;
	});

/** Splits the admin's statement HTML (paragraphs, bold, coloured spans) into words. Works the same on
 *  the server and in the browser, so the first render already has every word. */
function toWords(html: string): Word[] {
	const words: Word[] = [];
	const styles: Array<{ tag: string; color?: string; bold?: boolean }> = [];
	let joinNext = false;
	let breakNext = false;

	for (const [token] of html.matchAll(/<[^>]+>|[^<]+/g)) {
		if (token.startsWith("<")) {
			const tag = token.match(/^<\/?\s*([a-z0-9]+)/i)?.[1]?.toLowerCase() ?? "";
			if (token.startsWith("</")) {
				const at = styles.map((x) => x.tag).lastIndexOf(tag);
				if (at !== -1) styles.splice(at, 1);
				if (tag === "p" && words.length) breakNext = true;
			} else if (tag === "br") {
				breakNext = words.length > 0;
			} else if (!token.endsWith("/>")) {
				const color = token.match(/color:\s*([^;"']+)/i)?.[1]?.trim();
				styles.push({ tag, color, bold: tag === "strong" || tag === "b" });
			}
			continue;
		}

		const text = decode(token);
		const color = [...styles].reverse().find((x) => x.color)?.color;
		const bold = styles.some((x) => x.bold);
		// A chunk that starts mid-word (",") joins the previous word
		if (/^\s/.test(text)) joinNext = false;
		text.split(/\s+/).forEach((piece, index) => {
			if (!piece) return;
			const segment = { text: piece, color, bold };
			if (index === 0 && joinNext && words.length && !breakNext) {
				words[words.length - 1].segments.push(segment);
			} else {
				words.push({ segments: [segment], lineBreak: breakNext });
				breakNext = false;
			}
		});
		joinNext = !/\s$/.test(text);
	}
	return words;
}

function RevealWord({
	word,
	progress,
	range,
	still,
}: {
	word: Word;
	progress: MotionValue<number>;
	range: [number, number];
	/** Reduced motion: show the word at full strength from the start */
	still: boolean;
}) {
	const opacity = useTransform(progress, range, still ? [1, 1] : [0.18, 1]);
	return (
		<>
			{word.lineBreak ? <br /> : " "}
			<motion.span className="whitespace-nowrap" style={{ opacity }}>
				{word.segments.map((segment, index) => (
					<span key={index} className={segment.bold ? "font-semibold" : undefined} style={{ color: segment.color }}>
						{segment.text}
					</span>
				))}
			</motion.span>
		</>
	);
}

/** A large statement that darkens word by word as it scrolls through the view. */
export default function Statement({ content }: { content: HomeContent["statement"] }) {
	const words = useMemo(() => toWords(content.html), [content.html]);
	const ref = useRef<HTMLParagraphElement>(null);
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.65"] });
	// Count the arrow as the first step so it lights up with the opening word
	const steps = words.length + 1;
	const arrowOpacity = useTransform(scrollYProgress, [0, 1 / steps], reduceMotion ? [1, 1] : [0.18, 1]);

	return (
		<section className="relative bg-white px-4 py-24 sm:px-6 sm:py-36">
			<p
				ref={ref}
				className="mx-auto max-w-4xl text-balance text-center text-[1.625rem] font-medium leading-[1.2] tracking-[-0.025em] text-brand-navy sm:text-4xl lg:text-[2.75rem]"
			>
				<motion.span
					style={{ opacity: arrowOpacity }}
				>
					<ArrowRight aria-hidden className="mr-1 inline h-[0.8em] w-[0.8em] -translate-y-[0.06em]" strokeWidth={2} />
				</motion.span>
				{words.map((word, index) => (
					<RevealWord
						key={index}
						word={word}
						progress={scrollYProgress}
						still={!!reduceMotion}
						range={[(index + 1) / steps, (index + 2) / steps]}
					/>
				))}
			</p>
		</section>
	);
}
