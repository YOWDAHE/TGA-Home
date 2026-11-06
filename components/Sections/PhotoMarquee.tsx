"use client";

import React, { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { homeImageUrl } from "@/lib/utils";
import { PhotoGallery, ViewPicturesButton } from "./PhotoGallery";

/** Photos shipped with the site go through the image optimiser; uploads are served as they are */
export const isOptimisable = (src: string) => src.startsWith("/") && !src.startsWith("/api");

/** Endless, slowly scrolling row of photos; pauses on hover. "View pictures" (top right) opens them
 *  all in a gallery, each one openable full size. */
export default function PhotoMarquee({
	photos,
	alt,
	reverse = false,
}: {
	photos: string[];
	alt: string;
	reverse?: boolean;
}) {
	const [galleryOpen, setGalleryOpen] = useState(false);
	const sources = photos.filter(Boolean).map(homeImageUrl);
	if (!sources.length) return null;
	return (
		<div className="relative mt-14">
			<ViewPicturesButton
				count={sources.length}
				onClick={() => setGalleryOpen(true)}
				className="absolute right-4 top-3 z-10 sm:right-6 sm:top-4"
			/>
			<PhotoGallery photos={sources} title={alt} open={galleryOpen} onOpenChange={setGalleryOpen} />
			<Reveal className="fade-x relative overflow-hidden">
				<div
					className="inline-flex animate-marquee gap-4 hover:[animation-play-state:paused]"
					style={{ animationDuration: `${sources.length * 5}s`, animationDirection: reverse ? "reverse" : undefined }}
				>
					{[...sources, ...sources].map((src, idx) => (
						<div
							key={idx}
							aria-hidden={idx >= sources.length}
							className="relative h-56 w-72 shrink-0 overflow-hidden rounded-sm bg-brand-tint/50 sm:h-72 sm:w-[26rem]"
						>
							<Image
								src={src}
								alt={`${alt} ${(idx % sources.length) + 1}`}
								fill
								unoptimized={!isOptimisable(src)}
								sizes="(min-width: 640px) 416px, 288px"
								className="object-cover transition-transform duration-700 hover:scale-105"
							/>
						</div>
					))}
				</div>
			</Reveal>
		</div>
	);
}
