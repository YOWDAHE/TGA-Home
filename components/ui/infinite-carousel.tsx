"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InfiniteCarouselProps {
  children: React.ReactNode;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

export function InfiniteCarousel({
  children,
  speed = 1000,
  direction = "left",
  pauseOnHover = true,
  className,
  itemClassName,
}: InfiniteCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [duplicateContent, setDuplicateContent] = useState(false);

  // Duplicate content for seamless infinite scroll
  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current.innerHTML;
      if (content) {
        setDuplicateContent(true);
      }
    }
  }, [children]);

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

  const animationStyle = {
    animation: `scroll ${speed}s linear infinite`,
    animationDirection: direction === "left" ? "normal" : "reverse",
    animationPlayState: isPaused ? "paused" : "running",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left gradient overlay */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #f5f6f7 0%, rgba(245, 246, 247, 0.8) 25%, rgba(245, 246, 247, 0.4) 50%, rgba(245, 246, 247, 0.1) 75%, transparent 100%)'
        }}
      />
      
      {/* Right gradient overlay */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #f5f6f7 0%, rgba(245, 246, 247, 0.8) 25%, rgba(245, 246, 247, 0.4) 50%, rgba(245, 246, 247, 0.1) 75%, transparent 100%)'
        }}
      />

      <div
        ref={contentRef}
        className="flex items-center"
        style={animationStyle}
      >
        {/* Original content */}
        <div className="flex items-center">
          {React.Children.map(children, (child, index) => (
            <div key={`original-${index}`} className={cn("flex-shrink-0", itemClassName)}>
              {child}
            </div>
          ))}
        </div>

        {/* Duplicated content for seamless loop */}
        {duplicateContent && (
          <div className="flex items-center">
            {React.Children.map(children, (child, index) => (
              <div key={`duplicate-${index}`} className={cn("flex-shrink-0", itemClassName)}>
                {child}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

// Individual carousel item component
interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div className={cn("flex-shrink-0", className)}>
      {children}
    </div>
  );
} 