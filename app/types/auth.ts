export interface User {
	id: number;
	username: string;
	email: string;
	phone_number: string;
	is_active: boolean;
	last_login: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface SignUpRequest {
	email: string;
	password: string;
	username: string;
	phone_number: string;
}

export interface SignInRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	tokens: AuthTokens;
}

export interface RefreshResponse {
	accessToken: string;
}

export interface ApiResponse<T = any> {
	message: string;
	status: "success" | "error";
	error: string | null;
	data?: T;
} 