import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TGA Law Group',
    short_name: 'TGA Law',
    description: 'Professional legal services with expertise in corporate law, litigation, and legal consulting',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0D9488',
    icons: [
      {
        src: '/Images/logo/TGA_LOGO.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/Images/logo/TGA_LOGO.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/Images/logo/TGA_LOGO.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    categories: ['business', 'legal'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
    prefer_related_applications: false,
  }
} 