import NewsDetailPage from '@/components/Sections/NewsDetailPage'
import { homeFont } from '../../fonts'
import { getNewsById as fetchNewsById } from '@/app/actions/news.actions'
import { getRelatedNews, getRelatedUpdates } from '@/lib/related-content'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import { pageMetadata, plainSummary } from '@/lib/seo'
import { convertToApiUrl } from '@/lib/utils'
import { parseHashtags } from '@/lib/hashtags'

// The backend counts a view on every fetch, so the metadata and the page share one request
const getNewsById = cache(fetchNewsById)

export const dynamic = 'force-dynamic'

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

  try {
  const news = await getNewsById(id);
  
  if (!news?.data) {
    return {
      title: 'News Not Found',
      description: 'The requested news article could not be found.',
    };
  }

  const { title, content, visual_content, hashtags, published_date, seo_keywords } = news.data as any;
  
  // Images are stored either as URL strings or as { secure_url } objects
  const firstImage = visual_content?.length ? visual_content[0] : null;

  // Prefer explicit seo_keywords (comma-separated). Fallback to generated + hashtags + title
  const explicitKeywords = typeof seo_keywords === 'string' && seo_keywords.trim().length > 0
    ? seo_keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k.length > 0)
    : null;
  const generatedKeywords = generateApproximateKeywords(title, content);
  const hashtagKeywords = parseHashtags(hashtags);
  const allKeywords = explicitKeywords && explicitKeywords.length > 0
    ? explicitKeywords
    : [...new Set([...generatedKeywords, ...hashtagKeywords, title.toLocaleLowerCase()])];

  return pageMetadata({
    title,
    description: plainSummary(content) || title,
    path: `/news/${id}`,
    type: 'article',
    publishedTime: published_date,
    keywords: allKeywords,
    card: {
      eyebrow: 'News',
      date: published_date,
      image: firstImage ? convertToApiUrl(firstImage) : null,
    },
  });
  } catch {
    return {
      title: 'Legal News | TGA Global Law Firm LL.P',
      description: 'Read the latest legal news and insights from TGA Global Law Firm LL.P.',
    };
  }
}

async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const news = await getNewsById(id);
  
  if (!news) {
    return <div>News not found.</div>;
  }

  // Same hashtag or practice area first, topped up with the latest
  const related = { categoryId: (news.data as { category_id?: number | null }).category_id };
  const [relatedNews, relatedUpdates] = await Promise.all([
    getRelatedNews({ ...related, excludeId: news.data.id, hashtags: news.data.hashtags }),
    getRelatedUpdates(related),
  ]);

  return (
    <div className={homeFont.className}>
      <NewsDetailPage news={news} relatedNews={relatedNews} relatedUpdates={relatedUpdates} />
    </div>
  );
}

export default page;