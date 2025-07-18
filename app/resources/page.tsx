import ResourcesPage from '@/components/Sections/ResourcesPage'
import React, { Suspense } from 'react'
import { getResources, getTopViewedResources } from '../actions/resources.actions';
import { getCategories } from '../actions/news.actions';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
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
   const {search, category} = await searchParams;
    
    // Build query parameters for resources
    const resourceParams: any = { limit: 50 };
    if (search) resourceParams.search = search;
    if (category) resourceParams.category_id = parseInt(category);

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
