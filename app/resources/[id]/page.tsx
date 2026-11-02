import DocumentDetailPage from '@/components/Sections/DocumentDetailPage';
import { homeFont } from '../../fonts';
import { getResourceById as fetchResourceById } from '../../actions/resources.actions';
import { getRelatedNews, getRelatedResources, getRelatedUpdates } from '@/lib/related-content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import { cache } from 'react';
import { pageMetadata, plainSummary } from '@/lib/seo';

// The backend counts a view on every fetch, so the metadata and the page share one request
const getResourceById = cache(fetchResourceById);

export const dynamic = 'force-dynamic'

interface DocumentPageProps {
	params: Promise<{
		id: string;
	}>;
}

const generateApproximateKeywords = (title: string, description?: string) => {
    if (!title) return [];
    
    const baseKeywords = [
      'legal document', 'legal resource', 'download', 'law firm', 
      'TGA Global Law Firm', 'legal advice', 'law document', 'Ethiopia legal',
      'Ethiopian law firm', 'legal services', 'document download'
    ];
    
    // Extract main words from title
    const titleWords = title.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3) // Filter out short words
      .slice(0, 5); // Limit to 5 words
    
    // Extract words from description if available
    let descriptionWords: string[] = [];
    if (description) {
      descriptionWords = description.toLowerCase()
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
      }
    });
    
    // Combine all keywords and remove duplicates
    return [...new Set([...baseKeywords, ...titleWords, ...descriptionWords, ...relatedTerms])];
  };

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
	try {
		const resource = await getResourceById((await params).id);
		
		if (!resource) {
			return {
				title: 'Document Not Found',
				description: 'The requested document could not be found.',
			};
		}

		const { title, description, createdAt, seo_keywords } = resource as any;

		// Prefer explicit seo_keywords (comma-separated). Fallback to generated + title
		const explicitKeywords = typeof seo_keywords === 'string' && seo_keywords.trim().length > 0
			? seo_keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
			: null;
		const generatedKeywords = generateApproximateKeywords(title, description);

		return pageMetadata({
			title,
			description: plainSummary(description) || `Read and download "${title}", a legal resource from TGA Global Law Firm LL.P.`,
			path: `/resources/${(await params).id}`,
			type: 'article',
			publishedTime: createdAt,
			keywords:
				explicitKeywords && explicitKeywords.length > 0
					? explicitKeywords
					: [...generatedKeywords, title.toLocaleLowerCase()],
			card: { eyebrow: 'Resource · PDF', date: createdAt },
		});
	} catch (error) {
		return {
			title: 'Document Not Found',
			description: 'The requested document could not be found.',
		};
	}
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	try {
		const resource = await getResourceById((await params).id);
		console.log("Resource2", resource);
		if (!resource) {
			notFound();
		}

		// Same practice area first, topped up with the latest
		const related = { categoryId: resource.category_id };
		const [relatedResources, relatedUpdates, relatedNews] = await Promise.all([
			getRelatedResources({ ...related, excludeId: resource.id }),
			getRelatedUpdates(related),
			getRelatedNews(related),
		]);

		return (
			<div className={homeFont.className}>
				<DocumentDetailPage
					resource={resource}
					relatedResources={relatedResources}
					relatedUpdates={relatedUpdates}
					relatedNews={relatedNews}
				/>
			</div>
		);
	} catch (error) {
		console.error('Error fetching document:', error);
		notFound();
	}
} 