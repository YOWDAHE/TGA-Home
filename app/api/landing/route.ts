import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    console.log('API route: Fetching landing page data from backend');
    
    const response = await axios.get(`${BACKEND_URL}/api/landing`);

    console.log('API route: Successfully fetched landing page data');
    
    // Return the data with proper caching headers
    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes, stale for 10 minutes
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('API route: Error fetching landing page data:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });

    // Return appropriate error response
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    } else if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Landing page endpoint not found' },
        { status: 404 }
      );
    } else if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Backend server is not available' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 