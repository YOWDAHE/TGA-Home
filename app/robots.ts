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
        '/api-backend/',
        '/admin/',
        '/office/',
        '/preview/',
      ],
    },
    sitemap: 'https://tgagloballawfirm.com/sitemap.xml',
  }
}
