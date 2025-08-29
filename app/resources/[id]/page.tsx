import DocumentDetailPage from '@/components/Sections/DocumentDetailPage';
import { getResourceById } from '../../actions/resources.actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'

interface DocumentPageProps {
	params: {
		id: string;
	};
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
		const resource = await getResourceById(params.id);
		
		if (!resource) {
			return {
				title: 'Document Not Found',
				description: 'The requested document could not be found.',
			};
		}

		const { title, description, file_url, file_size, view_count, createdAt, seo_keywords } = resource as any;
		
		// Format file size for display
		const formatFileSize = (bytes: number) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const sizes = ["Bytes", "KB", "MB", "GB"];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
		};

		// Prefer explicit seo_keywords (comma-separated). Fallback to generated + title
		const explicitKeywords = typeof seo_keywords === 'string' && seo_keywords.trim().length > 0
			? seo_keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
			: null;
		const generatedKeywords = generateApproximateKeywords(title, description);

		return {
			title: title,
			description: description || `Download ${title} - Legal document from TGA Global Law Firm LL.P. File size: ${formatFileSize(file_size)}`,
			keywords: explicitKeywords && explicitKeywords.length > 0 ? explicitKeywords : [...generatedKeywords, title.toLocaleLowerCase()],
			openGraph: {
				title: `${title} | TGA Global Law Firm LL.P`,
				description: description || `Download ${title} - Legal document from TGA Global Law Firm LL.P`,
				url: `/resources/${params.id}`,
				type: 'website',
				images: [
					{
						url: '/Images/logo/TGA_LOGO.svg',
						width: 1200,
						height: 630,
						alt: `${title} - TGA Global Law Firm LL.P`,
					}
				],
			},
			twitter: {
				card: 'summary_large_image',
				title: `${title} | TGA Global Law Firm LL.P`,
				description: description || `Download ${title} - Legal document from TGA Global Law Firm LL.P`,
				images: ['/Images/logo/TGA_LOGO.svg'],
			},
			alternates: {
				canonical: `/resources/${params.id}`,
			},
			other: {
				'file:size': formatFileSize(file_size),
				'file:type': 'document',
				'view:count': view_count.toString(),
				'published:date': createdAt,
			},
		};
	} catch (error) {
		return {
			title: 'Document Not Found',
			description: 'The requested document could not be found.',
		};
	}
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	try {
		const resource = await getResourceById(params.id);
		console.log("Resource2", resource);
		// if (!resource) {
		// 	notFound();
		// }

		return <DocumentDetailPage resource={resource} />;
	} catch (error) {
		console.error('Error fetching document:', error);
		notFound();
	}
} 