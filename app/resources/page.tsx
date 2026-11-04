import ResourcesPage from '@/components/Sections/ResourcesPage'
import React, { Suspense } from 'react'
import { getResources, getTopViewedResources } from '../actions/resources.actions';
import { getCategories } from '../actions/news.actions';
import type { Metadata } from 'next'
import { homeFont } from '../fonts'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Legal Resources & Documents',
    description:
      'Legal guides, documents and materials from TGA Global Law Firm LL.P, free to read and download.',
    path: '/resources',
    card: { eyebrow: 'Resources', title: 'Legal guides and documents' },
  }),
  keywords: [
    'legal resources',
    'legal documents',
    'legal templates',
    'legal guides',
    'law firm resources',
    'legal downloads',
    'attorney resources',
    'legal materials',
  ],
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

// Loading component for the resources page
function ResourcesLoading() {
  return (
    <ResourcesPage 
      resources={[]} 
      topViewedResources={[]} 
      categories={[]}
      isLoading={true}
    />
  );
}

export default async function page({ searchParams }: PageProps) {
  try {
    // Extract search parameters
   const {search, category, page} = await searchParams;
    
    // Build query parameters for resources
    const resourceParams: any = { limit: 6 };
    if (search) resourceParams.search = search;
    if (category) resourceParams.category_id = parseInt(category);
    if (page) resourceParams.page = parseInt(page);

    const [resourcesResponse, topViewedResponse, categoriesResponse] = await Promise.all([
      getResources(resourceParams),
      getTopViewedResources(6),
      getCategories()
    ]);

    console.log(">>>>>", resourcesResponse.data.documents);
    return (
      <div className={homeFont.className}>
      <Suspense fallback={<ResourcesLoading />}>
        <ResourcesPage 
          resources={resourcesResponse.data.documents} 
          topViewedResources={topViewedResponse} 
          categories={categoriesResponse.data.categories}
          pagination={resourcesResponse.data.pagination}
          categoryCounts={resourcesResponse.data.categoryCounts}
          isLoading={false}
        />
      </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error fetching resources:', error);
    // Hand over to app/error.tsx, which offers a retry
    throw error;
  }
}
