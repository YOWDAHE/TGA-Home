import DocumentDetailPage from '@/components/Sections/DocumentDetailPage';
import { getResourceById } from '../../actions/resources.actions';
import { notFound } from 'next/navigation';

interface DocumentPageProps {
	params: {
		id: string;
	};
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