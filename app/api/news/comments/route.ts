import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const news_id = searchParams.get('news_id');
        const username = searchParams.get('username') || '';

        if (!news_id) {
            return NextResponse.json(
                { error: 'news_id is required' },
                { status: 400 }
            );
        }

        // Make request to backend
        const response = await axios.get(`${BACKEND_URL}/api/public/comments/${news_id}?username=${username}`);

        console.log('Comments fetched successfully via API route');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching comments via API route:', {
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
                { error: 'Comments endpoint not found.' },
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
            { error: `Failed to fetch comments: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { news_id, content, user_name } = body;
        const accessToken = request.cookies.get("tga_home_access_token")?.value;

        // Validate required fields
        if (!news_id || !content) {
            return NextResponse.json(
                { error: 'news_id and content are required' },
                { status: 400 }
            );
        }

        // Make request to backend
        const response = await axios.post(`${BACKEND_URL}/api/public/comments/`, {
            news_id,
            content,
            user_name,
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Comment posted successfully via API route');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error posting comment via API route:', {
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
                { error: 'Comments endpoint not found.' },
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
            { error: `Failed to post comment: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { comment_id, username, action } = body;
        const accessToken = request.cookies.get("tga_home_access_token")?.value;

        // Validate required fields
        if (!comment_id || !username || !action) {
            return NextResponse.json(
                { error: 'comment_id, username, and action are required' },
                { status: 400 }
            );
        }

        if (!['like', 'dislike'].includes(action)) {
            return NextResponse.json(
                { error: 'action must be either "like" or "dislike"' },
                { status: 400 }
            );
        }

        // Make request to backend
        const response = await axios.patch(`${BACKEND_URL}/api/public/comments/${comment_id}/toggle-like`, {
            username,
            action,
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Comment like/dislike toggled successfully via API route');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error toggling comment like/dislike via API route:', {
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
                { error: 'Comments endpoint not found.' },
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
            { error: `Failed to toggle comment like/dislike: ${error.message}` },
            { status: 500 }
        );
    }
}