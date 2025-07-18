import { SignUpRequest, SignInRequest, AuthResponse, User, ApiResponse } from "@/app/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
	const response = await fetch(`${API_BASE_URL}/api-auth/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	const result = await response.json();

	if (result.status === "error") {
		throw new Error(result.error || "Failed to sign up");
	}

	return result.data;
};

export const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
	const response = await fetch(`${API_BASE_URL}/api-auth/signin`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	const result = await response.json();

	if (result.status === "error") {
		throw new Error(result.error || "Failed to sign in");
	}

	return result.data;
};

export const signOut = async (): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/api-auth/signout`, {
		method: "POST",
		credentials: "include",
	});

	const result = await response.json();

	if (result.status === "error") {
		throw new Error(result.error || "Failed to sign out");
	}
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        console.log("Getting current user from", API_BASE_URL);
		const response = await fetch(`${API_BASE_URL}/api-auth/me`, {
			method: "GET",
			credentials: "include",
		});

		const result: ApiResponse<User> = await response.json();

		if (result.status === "error") {
			// If it's a 401 (unauthorized), return null instead of throwing
			if (response.status === 401) {
				return null;
			}
			throw new Error(result.error || "Failed to get user");
		}

		return result.data || null;
	} catch (error) {
		// If there's a network error or other issue, return null
		console.error("Error getting current user:", error);
		return null;
	}
}; 