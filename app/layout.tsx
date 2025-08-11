import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: {
    default: 'TGA Global Law Firm',
    template: '%s | TGA Law Group'
  },
  icons: {
    icon: '/favicon.ico',
  },
  description: 'TGA Law Group provides comprehensive legal services with expertise in corporate law, litigation, and legal consulting. Trust our experienced attorneys for your legal needs.',
  keywords: [
    'TGA Law Group',
    'International law',
    'legal services',
    'law firm',
    'attorneys',
    'corporate law',
    'litigation',
    'legal consulting',
    'lawyers',
    'legal advice',
    'legal representation',
    'ethiopian law',
    'ethiopian lawyers',
    'ethiopian law firm',
    'ethiopian legal services',
    'ethiopian legal consulting',
    'ethiopian legal representation',
    'ethiopian legal advice',
    'ethiopian legal representation',
    'ethiopian legal advice',
    'ethiopian legal representation',
    'ethiopian news',
    'ethiopian law news',
    'ethiopian legal news',
    'ethiopian legal news',
  ],
  authors: [{ name: 'TGA Law Group' }],
  creator: 'TGA Law Group',
  publisher: 'TGA Law Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tga-law.com'), //TODO: To be replaced with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tga-law.com', //TODO: Replace with your actual domain
    siteName: 'TGA Law Group',
    title: 'TGA Law Group - Professional Legal Services',
    description: 'TGA Law Group provides comprehensive legal services with expertise in corporate law, litigation, and legal consulting. Trust our experienced attorneys for your legal needs.',
    images: [
      {
        url: '/Images/logo/TGA_LOGO.svg', //TODO: Replace with your actual logo path
        width: 1200,
        height: 630,
        alt: 'TGA Law Group Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TGA Law Group - Professional Legal Services',
    description: 'TGA Law Group provides comprehensive legal services with expertise in corporate law, litigation, and legal consulting.',
    images: ['/Images/logo/TGA_LOGO.svg'],
    creator: '@tgalawgroup', //TODO: Replace with your actual Twitter handle
    site: '@tgalawgroup', //TODO: Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', //TODO: Replace with your actual Google verification code
    yandex: 'your-yandex-verification-code', //TODO: Replace with your actual Yandex verification code
    yahoo: 'your-yahoo-verification-code', //TODO: Replace with your actual Yahoo verification code
  },
  category: 'legal services',
  classification: 'law firm',
  other: {
    'msapplication-TileColor': '#0D9488',
    'theme-color': '#0D9488',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'TGA Law Group',
    'application-name': 'TGA Law Group',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0D9488" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TGA Law Group" />
        <meta name="application-name" content="TGA Law Group" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "TGA Law Group",
              "description": "Professional legal services with expertise in corporate law, litigation, and legal consulting",
              "url": "https://tga-law.com",
              "logo": "https://tga-law.com/Images/logo/TGA_LOGO.svg",
              "image": "https://tga-law.com/Images/logo/TGA_LOGO.svg",
              "telephone": "+1-XXX-XXX-XXXX", // Replace with actual phone number
              "email": "info@tga-law.com", // Replace with actual email
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Your Street Address", // Replace with actual address
                "addressLocality": "Your City", // Replace with actual city
                "addressRegion": "Your State", // Replace with actual state
                "postalCode": "Your ZIP", // Replace with actual ZIP
                "addressCountry": "US" // Replace with actual country
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "YOUR_LATITUDE", // Replace with actual coordinates
                "longitude": "YOUR_LONGITUDE" // Replace with actual coordinates
              },
              "openingHours": "Mo-Fr 09:00-17:00", // Replace with actual hours
              "priceRange": "$$",
              "sameAs": [
                "https://www.linkedin.com/company/tga-law-group", // Replace with actual social media URLs
                "https://twitter.com/tgalawgroup",
                "https://www.facebook.com/tgalawgroup"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Legal Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Corporate Law"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Litigation"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Legal Consulting"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
