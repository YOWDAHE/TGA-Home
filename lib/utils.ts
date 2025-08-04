import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to convert backend URLs to use Next.js API routes for better caching
export function convertToApiUrl(url: string): string {
  if (!url) return '/placeholder.jpg';
  
  // If it's already a relative URL, return as is
  if (url.startsWith('/')) return url;
  
  // If it's a localhost upload URL, convert to use our API route
  if (url.includes('localhost:3000/uploads/')) {
    const urlObj = new URL(url);
    console.log('urlObj:', `/api${urlObj.pathname}`);
    return `/api${urlObj.pathname}`;
  }
  
  // For external URLs, return as is
  return url;
}
