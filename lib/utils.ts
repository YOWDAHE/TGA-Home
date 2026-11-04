import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NEWS_IMAGES_FOLDER = '/news-images/';

/** Legacy DB URLs use .../uploads/partners/:file or .../landing/uploads/partners/:file */
function filenameFromPartnerUrl(input: string): string | null {
  const q = input.indexOf('?');
  const path = q === -1 ? input : input.slice(0, q);
  for (const marker of ['/landing/uploads/partners/', '/uploads/partners/']) {
    const idx = path.indexOf(marker);
    if (idx === -1) continue;
    const after = path.slice(idx + marker.length);
    const filename = after.split('/')[0];
    if (filename) return filename;
  }
  return null;
}

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
    // Documents always go through this site's proxy, whichever backend path the URL uses
    const documentFile = pathname.split('/uploads/documents/')[1];
    if (documentFile) return `/api/uploads/documents/${documentFile.split('/')[0]}`;
    // New canonical public URLs — keep same-origin path for Next/Image
    if (pathname.startsWith('/api-backend/news/images/')) {
      return `${pathname}${urlObj.search}`;
    }
    // Direct backend URLs (local dev stores http://localhost:3000/api/news/images/:file)
    const directNewsFile = pathname.split('/api/news/images/')[1];
    if (directNewsFile) return `/api-backend/news/images/${directNewsFile.split('/')[0]}`;
    if (pathname.startsWith('/api-backend/landing/uploads/partners/')) {
      return `${pathname}${urlObj.search}`;
    }
    const partnerFile = filenameFromPartnerUrl(pathname);
    if (partnerFile) {
      return `/api-backend/landing/uploads/partners/${partnerFile}`;
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

  const legacyPartnerFile = filenameFromPartnerUrl(url);
  if (legacyPartnerFile) {
    return `/api-backend/landing/uploads/partners/${legacyPartnerFile}`;
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

/** Image for the written home page sections: photos that ship with this site ("/Images/…") as they
 *  are, photos uploaded in the admin through this site's uploads proxy. */
export function homeImageUrl(url: string): string {
  if (!url) return '/office/placeholder.jpg';
  const uploaded = url.split('?')[0].split('/landing/uploads/home/')[1];
  if (uploaded) return `/api/uploads/home/${uploaded.split('/')[0]}`;
  if (url.startsWith('/')) return url;
  return convertToApiUrl(url);
}
