import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
    try {
        console.log('Fetching resources');
        const { searchParams } = new URL(request.url);
        const backendUrl = `${API_BASE_URL}/api/public/documents?${searchParams.toString()}`;

        const response = await axios.get(backendUrl);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json(
            {
                message: 'Failed to fetch resources',
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 