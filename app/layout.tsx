import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
	title: {
		default: "TGA Global Law Firm LL.P",
		template: "%s | TGA Global Law Firm LL.P",
	},
	icons: {
		icon: "/favicon.ico",
	},
	description:
		"TGA Global Law Firm LL.P provides comprehensive legal services with expertise in corporate law, litigation, and legal consulting. Trust our experienced attorneys for your legal needs.",
	keywords: [
		"TGA Global Law Firm LL.P",
		"TGA Global Law Firm LL.P",
		"International law",
		"legal services",
		"law firm",
		"attorneys",
		"corporate law",
		"litigation",
		"legal consulting",
		"lawyers",
		"legal advice",
		"legal representation",
		"ethiopian law",
		"ethiopian lawyers",
		"ethiopian law firm",
		"ethiopian legal services",
		"ethiopian legal consulting",
		"ethiopian legal representation",
		"ethiopian legal advice",
		"ethiopian legal representation",
		"ethiopian legal advice",
		"ethiopian legal representation",
		"ethiopian news",
		"ethiopian law news",
		"ethiopian legal news",
		"ethiopian legal news",
		"#1 Law Firm in Ethiopia",
		"TGA Global Law Firm LL.P LL.P",
		"International Law Firm Ethiopia",
		"Corporate Lawyers Ethiopia",
		"Business Law Firm Addis Ababa",
		"Real Estate Lawyers Ethiopia",
		"Legal Services for Diaspora Ethiopians",
		"Top African Lawyers",
		"Pan African Lawyers Union President Law Firm",
		"Ethiopian Bar Association President Law Firm",
		"Corporate Law Ethiopia",
		"Business Registration Ethiopia",
		"Commercial Lawyers Ethiopia",
		"Real Estate Law Ethiopia",
		"Diaspora Property Lawyers Ethiopia",
		"Cross-Border Legal Services Ethiopia",
		"International Business Lawyers Ethiopia",
		"Top Law Group Ethiopia",
		"Africa's Leading Law Group Ethiopia",
		"Global Legal Expertise Addis Ababa",
		"Trusted Ethiopian Law Firm",
		"Ethiopian Diaspora Legal Help",
		"Real Estate Lawyers Ethiopia Diaspora",
		"Ethiopia International Business Lawyers",
		"Global Legal Services",
	],
	authors: [{ name: "TGA Global Law Firm LL.P" }],
	creator: "TGA Global Law Firm LL.P",
	publisher: "TGA Global Law Firm LL.P",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://tgalawgroup.com"), //TODO: To be replaced with actual domain
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://tgalawgroup.com", //TODO: Replace with your actual domain
		siteName: "TGA Global Law Firm LL.P",
		title: "TGA Global Law Firm LL.P - Professional Legal Services",
		description:
			"TGA provides comprehensive legal services with expertise in corporate law, litigation, and legal consulting. Trust our experienced attorneys for your legal needs.",
		images: [
			{
				url: "/loader/loader-1.svg",
				width: 1200,
				height: 630,
				alt: "TGA Global Law Firm LL.P Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "TGA Global Law Firm LL.P - Professional Legal Services",
		description:
			"TGA provides comprehensive legal services with expertise in corporate law, litigation, and legal consulting.",
		images: ["/loader/loader-1.svg"],
		creator: "@tgalawgroup", //TODO: Replace with your actual Twitter handle
		site: "@tgalawgroup", //TODO: Replace with your actual Twitter handle
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "your-google-verification-code", //TODO: Replace with your actual Google verification code
		yandex: "your-yandex-verification-code", //TODO: Replace with your actual Yandex verification code
		yahoo: "your-yahoo-verification-code", //TODO: Replace with your actual Yahoo verification code
	},
	category: "legal services",
	classification: "law firm",
	other: {
		"msapplication-TileColor": "#0D9488",
		"theme-color": "#0D9488",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "TGA Global Law Firm LL.P",
		"application-name": "TGA Global Law Firm LL.P",
		"mobile-web-app-capable": "yes",
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
			<html lang="en">
				<head>
					{/* Additional meta tags for better SEO */}
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, maximum-scale=5"
					/>
					<meta name="theme-color" content="#0D9488" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="default" />
					<meta name="apple-mobile-web-app-title" content="TGA Global Law Firm LL.P" />
					<meta name="application-name" content="TGA Global Law Firm LL.P" />
					<meta name="mobile-web-app-capable" content="yes" />

					{/* Structured Data for Organization */}
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify({
								"@context": "https://schema.org",
								"@type": "LegalService",
								name: "TGA Global Law Firm LL.P",
								description:
									"Professional legal services with expertise in corporate law, litigation, and legal consulting",
								url: "https://tgalawgroup.com",
								logo: "https://tgalawgroup.com/Images/logo/TGA_LOGO.svg",
								image: "https://tgalawgroup.com/Images/logo/TGA_LOGO.svg",
								telephone: "+251115517942", // Replace with actual phone number
								email: "info@tgalawgroup.com", // Replace with actual email
								address: {
									"@type": "PostalAddress",
									streetAddress: "Dembel",
									addressLocality: "Addis Ababa",
									addressRegion: "Dembel",
									postalCode: "10000",
									addressCountry: "ET",
								},
								geo: {
									"@type": "GeoCoordinates",
									latitude: "YOUR_LATITUDE", // Replace with actual coordinates
									longitude: "YOUR_LONGITUDE", // Replace with actual coordinates
								},
								openingHours: "Mo-Fr 02:00-13:00",
								priceRange: "$$",
								sameAs: [
									"https://www.linkedin.com/company/tga-law-group", // Replace with actual social media URLs
									"https://twitter.com/tgalawgroup",
									"https://www.facebook.com/tgalawgroup",
								],
								hasOfferCatalog: {
									"@type": "OfferCatalog",
									name: "Legal Services",
									itemListElement: [
										{
											"@type": "Offer",
											itemOffered: {
												"@type": "Service",
												name: "Corporate Law",
											},
										},
										{
											"@type": "Offer",
											itemOffered: {
												"@type": "Service",
												name: "Litigation",
											},
										},
										{
											"@type": "Offer",
											itemOffered: {
												"@type": "Service",
												name: "Legal Consulting",
											},
										},
									],
								},
							}),
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
		);
}
