import axios from "axios";

export interface Resource {
	id: number;
	filename: string;
	title: string;
	category_id: number;
	author: string;
	content_text: string;
	file_size: number;
	file_url: string;
	description: string;
	public_id: string;
	view_count: number;
	download_count: number;
	createdAt: string;
	updatedAt: string;
}

export interface ResourcesResponse {
	message: string;
	status: string;
	error: string | null;
	data: {
		documents: Resource[];
		pagination: {
			currentPage: number;
			totalPages: number;
			totalItems: string;
			itemsPerPage: number;
		};
	};
}

export interface ResourcesParams {
	page?: number;
	limit?: number;
	search?: string;
	category_id?: number;
}

export async function getResources(params: ResourcesParams = {}): Promise<ResourcesResponse> {
	const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';
	const searchParams = new URLSearchParams();

	if (params.page) searchParams.append('page', params.page.toString());
	if (params.limit) searchParams.append('limit', params.limit.toString());
	if (params.search) searchParams.append('search', params.search);
	if (params.category_id) searchParams.append('category_id', params.category_id.toString());

	const url = `${API_BASE_URL}/api/public/documents?${searchParams.toString()}`;

	const response = await axios.get(url);

	return response.data;
}

export async function getTopViewedResources(limit: number = 6): Promise<Resource[]> {
	const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';
	const url = `${API_BASE_URL}/api/public/documents/top-viewed?limit=${limit}`;

	const response = await axios.get(url);

	return response.data.data;
}

export async function getResourceById(id: string): Promise<Resource> {
	const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';
	const url = `${API_BASE_URL}/api/public/documents/${id}`;

	const response = await axios.get(url);
	console.log("Resource by id", response.data);
	return response.data.data;
}

export async function incrementDocumentView(id: string): Promise<void> {
	try {
		const response = await axios.patch(`/api/public/documents/${id}/increment-view`);

		return response.data;
	} catch (error) {
		console.error('Error incrementing document view:', error);
		throw error;
	}
}

export async function documentDownload(id: string): Promise<void> {
	try {
		const response = await fetch(`/api/public/documents/${id}/download`, {
			method: 'GET',
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to download document');
		}

		// Get the file blob
		const blob = await response.blob();
		
		// Create a download link
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		
		// Get filename from response headers
		const contentDisposition = response.headers.get('content-disposition');
		let filename = 'document.pdf';
		if (contentDisposition) {
			const filenameMatch = contentDisposition.match(/filename="(.+)"/);
			if (filenameMatch) {
				filename = filenameMatch[1];
			}
		}
		
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Error downloading document:', error);
		throw error;
	}
}
