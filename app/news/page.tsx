import NewsPage from '@/components/Sections/NewsPage'
import React from 'react'
import { getCategories, getNews, getNewsByQuery } from '../actions/news.actions';
import { NewsResponse, NewsQueryResponse } from '../types/news';

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
