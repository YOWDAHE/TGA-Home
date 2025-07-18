import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, SignUpRequest, AuthResponse } from "@/app/types/auth";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
	try {
		const body: SignUpRequest = await request.json();
		const { username, email, phone_number, password } = body;

		// Forward request to backend
		const response = await fetch(`${API_BASE_URL}/api/api-auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, phone_number, password }),
		});

		const result = await response.json();

		if (result.status === "error") {
			return NextResponse.json<ApiResponse>(
				{
					message: result.message || "Failed to sign up",
					status: "error",
					error: result.error || "Signup failed",
				},
				{ status: response.status }
			);
		}

		// Create response with cookies
		const nextResponse = NextResponse.json<ApiResponse<AuthResponse>>(
			{
				message: result.message || "API user sign up successful",
				status: "success",
				error: null,
				data: {
					user: result.data.user,
					tokens: result.data,
				},
			},
			{ status: 201 }
		);

		// Set cookies from backend response
		if (result.data.accessToken) {
			nextResponse.cookies.set("tga_home_access_token", result.data.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 24 * 60 * 60,
			});
		}

		if (result.data.refreshToken) {
			nextResponse.cookies.set("tga_home_refresh_token", result.data.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60, // 7 days
			});
		}

		return nextResponse;
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json<ApiResponse>(
			{
				message: "Internal server error",
				status: "error",
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
} 