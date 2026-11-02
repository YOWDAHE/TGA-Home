import NewsPage from '@/components/Sections/NewsPage'
import React from 'react'
import { getCategories, getNews, getNewsByQuery } from '../actions/news.actions';
import { NewsResponse, NewsQueryResponse } from '../types/news';
import type { Metadata } from 'next'
import { homeFont } from '../fonts'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'News & Updates',
    description:
      'The latest news, insights and updates from TGA Global Law Firm LL.P: our expert analysis and legal perspectives.',
    path: '/news',
    card: { eyebrow: 'News', title: 'News and insights from TGA Global' },
  }),
  keywords: [
    'legal news',
    'law firm news',
    'legal updates',
    'legal insights',
    'legal analysis',
    'law industry news',
    'legal blog',
    'attorney news',
  ],
}

export const dynamic = 'force-dynamic'

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

  return (
    <div className={homeFont.className}>
      <NewsPage news={news} newsQuery={newsQuery} categories={categories} />
    </div>
  )
}
