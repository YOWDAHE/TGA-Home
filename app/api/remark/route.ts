import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, content } = body;

		// Validate required fields
		if (!name || !email || !content) {
			return NextResponse.json(
				{
					message: "Name, email, and content are required",
					status: "error",
					error: "Validation error",
					data: null,
				},
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					message: "Invalid email format",
					status: "error",
					error: "Validation error",
					data: null,
				},
				{ status: 400 }
			);
		}

		// Make request to backend API
		const backendResponse = await fetch(`${BACKEND_URL}/api/remark`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, content }),
		});

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return NextResponse.json(
				{
					message: errorData.message || "Failed to create remark",
					status: "error",
					error: errorData.error || "Server error",
					data: null,
				},
				{ status: backendResponse.status }
			);
		}

		const data = await backendResponse.json();
		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error("Error creating remark:", error);
		return NextResponse.json(
			{
				message: "Internal server error",
				status: "error",
				error: "Server error",
				data: null,
			},
			{ status: 500 }
		);
	}
} 