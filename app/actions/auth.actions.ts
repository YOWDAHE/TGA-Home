import { SignUpRequest, SignInRequest, AuthResponse, User, ApiResponse } from "@/app/types/auth";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
	const response = await axios.post(`/api/api-auth/signup`, data, {
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = response.data;

	if (result.status === "error") {
		throw new Error(result.error || "Failed to sign up");
	}

	return result.data;
};

export const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
	const response = await axios.post(`/api/api-auth/signin`, data, {
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = response.data;

	if (result.status === "error") {
		throw new Error(result.error || "Failed to sign in");
	}

	return result.data;
};

export const signOut = async (): Promise<void> => {
	const response = await axios.post(`/api/api-auth/signout`, {}, {
		withCredentials: true,
	});
	const result = response.data;

	if (result.status === "error") {
		throw new Error(result.error || "Failed to sign out");
	}
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        console.log("Getting current user from", API_BASE_URL);
		const response = await axios.get(`/api/api-auth/me`, {
			withCredentials: true,
		});
		const result: ApiResponse<User> = response.data;

		if (result.status === "error") {
			// If it's a 401 (unauthorized), return null instead of throwing
			if (response.status === 401) {
				return null;
			}
			throw new Error(result.error || "Failed to get user");
		}

		return result.data || null;
	} catch (error: any) {
		// If there's a network error or other issue, return null
		console.error("Error getting current user:", error);
		// Axios error handling for 401
		if (error.response && error.response.status === 401) {
			return null;
		}
		return null;
	}
};