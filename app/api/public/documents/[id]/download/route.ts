import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth.actions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		
		const documentId = params.id;
		if (!documentId) {
			return NextResponse.json(
				{ error: "Document ID is required" },
				{ status: 400 }
			);
		}

		// Get access token from cookies
		const accessToken = request.cookies.get("tga_home_access_token")?.value;
		if (!accessToken) {
			return NextResponse.json(
				{ error: "Access token is required" },
				{ status: 401 }
			);
		}

		// Make request to backend API to download document
		const backendResponse = await fetch(
			`${BACKEND_URL}/api/public/documents/${documentId}/download`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return NextResponse.json(
				{ error: errorData.message || "Failed to download document" },
				{ status: backendResponse.status }
			);
		}

		// Get the file stream from backend
		const fileBuffer = await backendResponse.arrayBuffer();
		
		// Get filename from response headers
		const content = backendResponse.headers.get('content-disposition');
		let filename = 'document.pdf';
		if (content) {
			const filenameMatch = content.match(/filename="(.+)"/);
			if (filenameMatch) {
				filename = filenameMatch[1];
			}
		}

		// Return the file as a download response
		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Cache-Control': 'no-cache',
			},
		});
	} catch (error) {
		console.error("Error downloading document:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 