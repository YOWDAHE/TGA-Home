import axios from 'axios';
import { LandingPageResponse } from '../types/landing';

const NEXT_PUBLIC_API_URL = process.env.BACKEND_URL;

export const getLandingPageData = async (): Promise<LandingPageResponse> => {
    try {
        console.log('Fetching landing page data from Next.js API route');
        
        // Call our Next.js API route instead of the backend directly
        // const response = await axios.get<LandingPageResponse>(`${NEXT_PUBLIC_API_URL}/landing`);
        const response = await axios.get<LandingPageResponse>(`${NEXT_PUBLIC_API_URL}/api/landing`);
        
        console.log('Landing page data fetched successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching landing page data:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API credentials.');
        } else if (error.response?.status === 404) {
            throw new Error('Landing page endpoint not found.');
        } else if (error.response?.status === 503) {
            throw new Error('Backend server is not available. Please try again later.');
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to server. Please check if the server is running.');
        }

        throw new Error(`Failed to fetch landing page data: ${error.message}`);
    }
}