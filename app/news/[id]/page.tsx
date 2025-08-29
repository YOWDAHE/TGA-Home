import NewsDetailPage from '@/components/Sections/NewsDetailPage'
import { getNewsById, getRelatedNews } from '@/app/actions/news.actions'
import React from 'react'
import type { Metadata } from 'next'

interface NewsPageProps {
  params: Promise<{ id: string }>;
}

const generateApproximateKeywords = (title: string, content?: string) => {
    if (!title) return [];
    
    const baseKeywords = [
      'legal news', 'law firm news', 'legal updates', 'legal insights', 
      'TGA Global Law Firm', 'Ethiopia legal news', 'legal analysis',
      'law industry news', 'legal blog', 'attorney news', 'legal developments'
    ];
    
    // Extract main words from title
    const titleWords = title.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3) // Filter out short words
      .slice(0, 5); // Limit to 5 words
    
    // Extract words from content if available (strip HTML first)
    let contentWords: string[] = [];
    if (content) {
      const plainTextContent = content.replace(/<[^>]*>/g, '');
      contentWords = plainTextContent.toLowerCase()
        .split(' ')
        .filter(word => word.length > 4)
        .slice(0, 3);
    }
    
    // Add common alternatives and related terms
    const relatedTerms: string[] = [];
    titleWords.forEach(word => {
      if (word.includes('contract')) {
        relatedTerms.push('agreement', 'legal contract', 'document');
      } else if (word.includes('law')) {
        relatedTerms.push('legal', 'regulation', 'statute');
      } else if (word.includes('rights')) {
        relatedTerms.push('legal rights', 'entitlements', 'privileges');
      } else if (word.includes('business')) {
        relatedTerms.push('corporate', 'commercial', 'enterprise');
      } else if (word.includes('property')) {
        relatedTerms.push('real estate', 'land', 'ownership');
      } else if (word.includes('employment')) {
        relatedTerms.push('labor', 'work', 'job');
      } else if (word.includes('tax')) {
        relatedTerms.push('taxation', 'revenue', 'financial');
      } else if (word.includes('court')) {
        relatedTerms.push('judicial', 'litigation', 'legal proceedings');
      } else if (word.includes('regulation')) {
        relatedTerms.push('compliance', 'legal requirements', 'rules');
      }
    });
    
    // Combine all keywords and remove duplicates
    return [...new Set([...baseKeywords, ...titleWords, ...contentWords, ...relatedTerms])];
  };

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const id = (await params).id;
  const news = await getNewsById(id);
  
  if (!news?.data) {
    return {
      title: 'News Not Found',
      description: 'The requested news article could not be found.',
    };
  }

  const { title, content, visual_content, hashtags, published_date, seo_keywords } = news.data as any;
  
  // Strip HTML tags from content for description
  const plainTextContent = content?.replace(/<[^>]*>/g, '') || '';
  const description = plainTextContent.length > 160 
    ? plainTextContent.substring(0, 157) + '...' 
    : plainTextContent;

  // Get the first image from visual_content if available
  const imageUrl = visual_content && visual_content.length > 0 ? visual_content[0] : null;
  console.log(published_date);

  // Prefer explicit seo_keywords (comma-separated). Fallback to generated + hashtags + title
  const explicitKeywords = typeof seo_keywords === 'string' && seo_keywords.trim().length > 0
    ? seo_keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k.length > 0)
    : null;
  const generatedKeywords = generateApproximateKeywords(title, content);
  const hashtagKeywords = hashtags ? hashtags.split(",").map((tag: string) => tag.trim()) : [];
  const allKeywords = explicitKeywords && explicitKeywords.length > 0
    ? explicitKeywords
    : [...new Set([...generatedKeywords, ...hashtagKeywords, title.toLocaleLowerCase()])];

  return {
			title: title,
			description: description,
			keywords: allKeywords,
			openGraph: {
				title: `${title} | TGA Global Law Firm LL.P`,
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
								alt: "TGA Global Law Firm LL.P News",
							},
					  ],
				authors: ["TGA Global Law Firm LL.P"],
				section: "Legal News",
			},
			twitter: {
				card: "summary_large_image",
				title: `${title} | TGA Global Law Firm LL.P`,
				description: description,
				images: imageUrl ? [imageUrl] : ["/Images/logo/TGA_LOGO.svg"],
			},
			alternates: {
				canonical: `/news/${id}`,
			},
			other: {
				"article:published_time": published_date.toString(),
				"article:author": "TGA Global Law Firm LL.P",
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