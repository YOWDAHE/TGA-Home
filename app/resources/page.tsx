import ResourcesPage from '@/components/Sections/ResourcesPage'
import React, { Suspense } from 'react'
import { getResources, getTopViewedResources } from '../actions/resources.actions';
import { getCategories } from '../actions/news.actions';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Resources & Documents',
  description: 'Access comprehensive legal resources, documents, and materials from TGA Global Law Firm LL.P LL.P. Download legal guides, templates, and expert legal content.',
  keywords: [
    'legal resources',
    'legal documents',
    'legal templates',
    'legal guides',
    'law firm resources',
    'legal downloads',
    'attorney resources',
    'legal materials'
  ],
  openGraph: {
    title: 'Legal Resources & Documents | TGA Global Law Firm LL.P LL.P',
    description: 'Access comprehensive legal resources, documents, and materials from TGA Global Law Firm LL.P LL.P. Download legal guides, templates, and expert legal content.',
    url: '/resources',
    type: 'website',
    images: [
      {
        url: '/Images/logo/TGA_LOGO.svg',
        width: 1200,
        height: 630,
        alt: 'TGA Global Law Firm LL.P LL.P Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Resources & Documents | TGA Global Law Firm LL.P LL.P',
    description: 'Access comprehensive legal resources, documents, and materials from TGA Global Law Firm LL.P LL.P.',
    images: ['/Images/logo/TGA_LOGO.svg'],
  },
  alternates: {
    canonical: '/resources',
  },
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
      <Suspense fallback={<ResourcesLoading />}>
        <ResourcesPage 
          resources={resourcesResponse.data.documents} 
          topViewedResources={topViewedResponse} 
          categories={categoriesResponse.data.categories}
          pagination={resourcesResponse.data.pagination}
          isLoading={false}
        />
      </Suspense>
    )
  } catch (error) {
    console.error('Error fetching resources:', error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Resources</h1>
          <p className="text-gray-600">Failed to load resources. Please try again later.</p>
        </div>
      </div>
    );
  }
}
