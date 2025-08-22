import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Prefer PUBLIC_API_URL which can include path prefix like /api-backend
const PUBLIC_API_URL = (process.env.PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = (await params).path.join('/');
    const backendUrl = `${PUBLIC_API_URL}/uploads/${path}`;
    console.log('backendUrl:>>>', backendUrl);
    
    console.log('API route: Proxying upload request to:', backendUrl);
    
    const response = await axios.get(backendUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    // Get the content type from the response
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    // Return the file with proper caching headers
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('API route: Error proxying upload:', {
      path: params.path,
      message: error.message,
      status: error.response?.status,
    });

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to load file' },
      { status: 500 }
    );
  }
} 