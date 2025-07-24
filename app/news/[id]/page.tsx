import NewsDetailPage from '@/components/Sections/NewsDetailPage'
import { getNewsById, getRelatedNews } from '@/app/actions/news.actions'
import React from 'react'
import type { Metadata } from 'next'

interface NewsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const id = (await params).id;
  const news = await getNewsById(id);
  
  if (!news?.data) {
    return {
      title: 'News Not Found',
      description: 'The requested news article could not be found.',
    };
  }

  const { title, content, visual_content, hashtags, published_date } = news.data;
  
  // Strip HTML tags from content for description
  const plainTextContent = content?.replace(/<[^>]*>/g, '') || '';
  const description = plainTextContent.length > 160 
    ? plainTextContent.substring(0, 157) + '...' 
    : plainTextContent;

  // Get the first image from visual_content if available
  const imageUrl = visual_content && visual_content.length > 0 ? visual_content[0] : null;
  console.log(published_date);

  return {
			title: title,
			description: description,
			keywords: hashtags ? hashtags.split(",").map((tag) => tag.trim()) : [],
			openGraph: {
				title: `${title} | TGA Law Group`,
				description: description,
				url: `/news/${id}`,
				type: "article",
				publishedTime: published_date.toString(),
				images: imageUrl
					? [
							{
								url: imageUrl,
								width: 1200,
								height: 630,
								alt: title,
							},
					  ]
					: [
							{
								url: "/Images/logo/TGA_LOGO.svg",
								width: 1200,
								height: 630,
								alt: "TGA Law Group News",
							},
					  ],
				authors: ["TGA Law Group"],
				section: "Legal News",
			},
			twitter: {
				card: "summary_large_image",
				title: `${title} | TGA Law Group`,
				description: description,
				images: imageUrl ? [imageUrl] : ["/Images/logo/TGA_LOGO.svg"],
			},
			alternates: {
				canonical: `/news/${id}`,
			},
			other: {
				"article:published_time": published_date.toString(),
				"article:author": "TGA Law Group",
				"article:section": "Legal News",
			},
		};
}

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