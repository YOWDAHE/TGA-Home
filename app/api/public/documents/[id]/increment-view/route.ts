import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth.actions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function PATCH(
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

		// Get access token from request headers
        const accessToken = request.cookies.get("tga_home_access_token")?.value;
		if (!accessToken) {
			return NextResponse.json(
				{ error: "Access token is required" },
				{ status: 401 }
			);
		}

		// Make request to backend API to increment view
		const backendResponse = await fetch(
			`${BACKEND_URL}/api/public/documents/${documentId}/increment-view`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return NextResponse.json(
				{ error: errorData.message || "Failed to increment view" },
				{ status: backendResponse.status }
			);
		}

		const data = await backendResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error incrementing document view:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 