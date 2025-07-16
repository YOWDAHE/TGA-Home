import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const backendUrl = `${API_BASE_URL}/api/public/documents/${params.id}`;
		
		const response = await fetch(backendUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Backend responded with status: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching resource:', error);
		return NextResponse.json(
			{ 
				message: 'Failed to fetch resource', 
				status: 'error', 
				error: error instanceof Error ? error.message : 'Unknown error' 
			},
			{ status: 500 }
		);
	}
} 