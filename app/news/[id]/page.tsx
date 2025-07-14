import NewsDetailPage from '@/components/Sections/NewsDetailPage'
import { getNewsById, getRelatedNews } from '@/app/actions/news.actions'
import React from 'react'

async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const news = await getNewsById(id);
  
  // Get related news based on the first hashtag
  let relatedNews = null;
  if (news?.data?.hashtags) {
    const hashtags = news.data.hashtags.split(',');
    const firstHashtag = hashtags[0].trim();
    if (firstHashtag) {
      try {
        relatedNews = await getRelatedNews(firstHashtag);
      } catch (error) {
        console.error('Error fetching related news:', error);
      }
    }
  }

  if (!news) {
    return <div>News not found.</div>;
  }

  return (
    <NewsDetailPage news={news} relatedNews={relatedNews} />
  );
}

export default page;