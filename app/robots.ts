import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/signup',
        '/api/',
        '/admin/',
        '/office/',
      ],
    },
    sitemap: 'https://tgagloballawfirm.com/sitemap.xml', //TODO: Replace with your actual domain
  }
} 