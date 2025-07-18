import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/types/auth";

export async function POST(request: NextRequest) {
	try {
		// Create response
		const response = NextResponse.json<ApiResponse>(
			{
				message: "Logged out successfully",
				status: "success",
				error: null,
			},
			{ status: 200 }
		);

		// Clear cookies
		response.cookies.set("tga_home_access_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0, // Expire immediately
		});

		response.cookies.set("tga_home_refresh_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0, // Expire immediately
		});

		return response;
	} catch (error) {
		console.error("Signout error:", error);
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