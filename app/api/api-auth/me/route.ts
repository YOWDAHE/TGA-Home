import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, User } from "@/app/types/auth";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
	try {
		// Get access token and refresh token from cookies
        const accessToken = request.cookies.get("tga_home_access_token")?.value;
        const refreshToken = request.cookies.get("tga_home_refresh_token")?.value;
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken ? "exists" : "not found");

		// If no access token but we have refresh token, try to refresh first
		if (!accessToken && refreshToken) {
			console.log("No access token, attempting refresh...");
			
			// Call the backend refresh endpoint directly
			const refreshResponse = await fetch(`${API_BASE_URL}/api/api-auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refreshToken }),
			});

			if (refreshResponse.ok) {
				const refreshResult = await refreshResponse.json();
				const newAccessToken = refreshResult.data?.accessToken;
				
				if (newAccessToken) {
					// Try to get user profile with new access token
					const response = await fetch(`${API_BASE_URL}/api/api-auth/me`, {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${newAccessToken}`,
						},
					});

					const result = await response.json();

					if (result.status === "error") {
						return NextResponse.json<ApiResponse>(
							{
								message: result.message || "Failed to get user profile",
								status: "error",
								error: result.error || "Profile fetch failed",
							},
							{ status: response.status }
						);
					}

					// Create response with user data and new access token cookie
					const nextResponse = NextResponse.json<ApiResponse<User>>(
						{
							message: result.message || "User profile retrieved successfully",
							status: "success",
							error: null,
							data: result.data,
						},
						{ status: 200 }
					);

					// Set the new access token cookie
					nextResponse.cookies.set("tga_home_access_token", newAccessToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						maxAge: 15 * 60, // 15 minutes
					});

					return nextResponse;
				}
			}
		}

		// If no access token and no refresh token, or refresh failed
		if (!accessToken) {
			return NextResponse.json<ApiResponse>(
				{
					message: "Access token not found",
					status: "error",
					error: "Access token is required",
				},
				{ status: 401 }
			);
		}

		// First attempt with current access token
		let response = await fetch(`${API_BASE_URL}/api/api-auth/me`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${accessToken}`,
			},
		});

		let result = await response.json();
		let newAccessToken: string | null = null;

		// If we get a 401, try to refresh the token and retry
		if (response.status === 401 && refreshToken) {
			console.log("Access token expired, attempting refresh...");
			
			// Call the backend refresh endpoint directly
			const refreshResponse = await fetch(`${API_BASE_URL}/api/api-auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refreshToken }),
			});

			if (refreshResponse.ok) {
				const refreshResult = await refreshResponse.json();
				newAccessToken = refreshResult.data?.accessToken;
				
				if (newAccessToken) {
					// Retry with new access token
					response = await fetch(`${API_BASE_URL}/api/api-auth/me`, {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${newAccessToken}`,
						},
					});
					result = await response.json();
				}
			}
		}

		if (result.status === "error") {
			return NextResponse.json<ApiResponse>(
				{
					message: result.message || "Failed to get user profile",
					status: "error",
					error: result.error || "Profile fetch failed",
				},
				{ status: response.status }
			);
		}

		// Create response with user data
		const nextResponse = NextResponse.json<ApiResponse<User>>(
			{
				message: result.message || "User profile retrieved successfully",
				status: "success",
				error: null,
				data: result.data,
			},
			{ status: 200 }
		);

		// If we refreshed the token, set the new access token cookie
		if (newAccessToken) {
			nextResponse.cookies.set("tga_home_access_token", newAccessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60, // 15 minutes
			});
		}

		return nextResponse;
	} catch (error) {
		console.error("Get user profile error:", error);
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