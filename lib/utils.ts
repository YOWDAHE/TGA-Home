import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NEWS_IMAGES_FOLDER = '/news-images/';

/** Legacy DB URLs use .../uploads/news-images/:file or .../api/uploads/news-images/:file */
function filenameFromLegacyNewsImageUrl(input: string): string | null {
  const q = input.indexOf('?');
  const path = q === -1 ? input : input.slice(0, q);
  const idx = path.indexOf(NEWS_IMAGES_FOLDER);
  if (idx === -1) return null;
  const after = path.slice(idx + NEWS_IMAGES_FOLDER.length);
  const filename = after.split('/')[0];
  return filename || null;
}

// Utility: map stored backend URLs to browser-safe paths on this site.
// News images must use /api-backend/news/images/:file so nginx → Express /api/news/images (not /api/uploads/...).
export function convertToApiUrl(url: string | { secure_url?: string }): string {
  if (!url) return '/office/placeholder.jpg';
  if (typeof url === 'object' && url !== null && typeof url.secure_url === 'string') {
    return convertToApiUrl(url.secure_url);
  }
  if (typeof url !== 'string') return '/office/placeholder.jpg';

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // New canonical public URLs — keep same-origin path for Next/Image
    if (pathname.startsWith('/api-backend/news/images/')) {
      return `${pathname}${urlObj.search}`;
    }
    const newsFile = filenameFromLegacyNewsImageUrl(pathname);
    if (newsFile) {
      return `/api-backend/news/images/${newsFile}`;
    }
    if (pathname.startsWith('/api-backend/uploads/')) {
      return `/api${pathname.replace('/api-backend', '')}`;
    }
    if (pathname.startsWith('/uploads/')) return `/api${pathname}`;
  } catch {
    // Not a valid absolute URL; fall through
  }

  const legacyNewsFile = filenameFromLegacyNewsImageUrl(url);
  if (legacyNewsFile) {
    return `/api-backend/news/images/${legacyNewsFile}`;
  }

  if (url.startsWith('/api-backend/uploads/')) {
    return `/api${url.replace('/api-backend', '')}`;
  }
  if (url.startsWith('/uploads/')) return `/api${url}`;

  if (url.startsWith('/')) return url;

  return url;
}
