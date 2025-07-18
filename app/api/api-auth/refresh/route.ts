import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/types/auth";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
	try {
		// Get refresh token from cookies
		const refreshToken = request.cookies.get("tga_home_refresh_token")?.value;

		if (!refreshToken) {
			return NextResponse.json<ApiResponse>(
				{
					message: "Refresh token not found",
					status: "error",
					error: "Refresh token is required",
				},
				{ status: 401 }
			);
		}

		// Forward refresh token to backend
		const response = await fetch(`${API_BASE_URL}/api/api-auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		const result = await response.json();

		if (result.status === "error") {
			return NextResponse.json<ApiResponse>(
				{
					message: result.message || "Failed to refresh token",
					status: "error",
					error: result.error || "Refresh failed",
				},
				{ status: response.status }
			);
		}

		// Create response with new access token cookie
		const nextResponse = NextResponse.json<ApiResponse>(
			{
				message: result.message || "Token refreshed successfully",
				status: "success",
				error: null,
				data: result.data,
			},
			{ status: 200 }
		);

		// Set the new access token cookie if provided by backend
		if (result.data?.accessToken) {
			nextResponse.cookies.set("tga_home_access_token", result.data.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60, // 15 minutes
			});
		}

		return nextResponse;
	} catch (error) {
		console.error("Refresh token error:", error);
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