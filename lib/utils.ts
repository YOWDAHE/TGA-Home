import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to convert backend URLs to use Next.js API routes for better caching
export function convertToApiUrl(url: string): string {
  if (!url) return '/office/placeholder.jpg';

  // Absolute URLs: if they point to backend uploads, proxy via our API route to avoid CORS/CORP
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    if (pathname.startsWith('/api-backend/uploads/')) return `/api${pathname.replace('/api-backend', '')}`;
    if (pathname.startsWith('/uploads/')) return `/api${pathname}`;
  } catch {
    // Not a valid absolute URL; fall through
  }
  
  // Relative URLs: normalize backend upload paths to our API proxy
  if (url.startsWith('/api-backend/uploads/')) return `/api${url.replace('/api-backend', '')}`;
  if (url.startsWith('/uploads/')) return `/api${url}`;
  
  // If it's already a relative URL (non-uploads), return as is
  if (url.startsWith('/')) return url;
  
  // For external URLs, return as is
  return url;
}
