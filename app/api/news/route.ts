import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Extract query parameters
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const q = searchParams.get('q') || '';
        const category = searchParams.get('category') || '';

        // Build query parameters for backend
        const queryParams = new URLSearchParams({
            page,
            limit,
            sortBy,
            order,
            ...(q && { q }),
            ...(category && { category }),
        });

        // Make request to backend
        const response = await axios.get(`${BACKEND_URL}/api/news?${queryParams}`);

        console.log('News query data fetched successfully via API route');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching news query data via API route:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            return NextResponse.json(
                { error: 'Authentication failed. Please check your API credentials.' },
                { status: 401 }
            );
        } else if (error.response?.status === 404) {
            return NextResponse.json(
                { error: 'News endpoint not found.' },
                { status: 404 }
            );
        } else if (error.response?.status === 503) {
            return NextResponse.json(
                { error: 'Backend server is not available. Please try again later.' },
                { status: 503 }
            );
        } else if (error.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { error: 'Cannot connect to server. Please check if the server is running.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: `Failed to fetch news query data: ${error.message}` },
            { status: 500 }
        );
    }
} 