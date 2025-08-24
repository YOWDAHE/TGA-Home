import DocumentDetailPage from '@/components/Sections/DocumentDetailPage';
import { getResourceById } from '../../actions/resources.actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'

interface DocumentPageProps {
	params: {
		id: string;
	};
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
	try {
		const resource = await getResourceById(params.id);
		
		if (!resource) {
			return {
				title: 'Document Not Found',
				description: 'The requested document could not be found.',
			};
		}

		const { title, description, file_url, file_size, view_count, createdAt } = resource;
		
		// Format file size for display
		const formatFileSize = (bytes: number) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const sizes = ["Bytes", "KB", "MB", "GB"];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
		};

		return {
			title: title,
			description: description || `Download ${title} - Legal document from TGA Global Law Firm LL.P. File size: ${formatFileSize(file_size)}`,
			keywords: [
				'legal document',
				'legal resource',
				'download',
				'law firm document',
				title.toLowerCase(),
				...description?.toLowerCase().split(' ').slice(0, 5) || []
			],
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