import NewsPage from '@/components/Sections/NewsPage'
import React from 'react'
import { getCategories, getNews, getNewsByQuery } from '../actions/news.actions';
import { NewsResponse, NewsQueryResponse } from '../types/news';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Stay updated with the latest legal news, industry insights, and updates from TGA Law Group. Read our expert analysis and legal perspectives.',
  keywords: [
    'legal news',
    'law firm news',
    'legal updates',
    'legal insights',
    'legal analysis',
    'law industry news',
    'legal blog',
    'attorney news'
  ],
  openGraph: {
    title: 'News & Updates | TGA Law Group',
    description: 'Stay updated with the latest legal news, industry insights, and updates from TGA Law Group. Read our expert analysis and legal perspectives.',
    url: '/news',
    type: 'website',
    images: [
      {
        url: '/Images/logo/TGA_LOGO.svg',
        width: 1200,
        height: 630,
        alt: 'TGA Law Group News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Updates | TGA Law Group',
    description: 'Stay updated with the latest legal news, industry insights, and updates from TGA Law Group.',
    images: ['/Images/logo/TGA_LOGO.svg'],
  },
  alternates: {
    canonical: '/news',
  },
}

export default async function page() {
  // Fetch data for the sections above Browse by Category
  const news = await getNews();
  const categories = await getCategories();
  const newsQuery = await getNewsByQuery({
    page: 1,
    limit: 10,
    sortBy: 'published_date',
    order: 'desc'
  });

  console.dir(categories, { depth: null });
  
  return (
    <NewsPage news={news} newsQuery={newsQuery} categories={categories} />
  )
}
