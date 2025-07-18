import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
	private client: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: Array<{
		resolve: (value?: any) => void;
		reject: (reason?: any) => void;
	}> = [];

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			withCredentials: true,
			timeout: 10000,
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interceptor
		this.client.interceptors.request.use(
			(config) => {
				// For API routes, we don't need to add Authorization header
				// as the server will handle it via cookies
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Response interceptor
		this.client.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			async (error) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					if (this.isRefreshing) {
						// If already refreshing, queue the request
						return new Promise((resolve, reject) => {
							this.failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								originalRequest.headers["Authorization"] = `Bearer ${token}`;
								return this.client(originalRequest);
							})
							.catch((err) => {
								return Promise.reject(err);
							});
					}

					originalRequest._retry = true;
					this.isRefreshing = true;

					try {
						// Attempt to refresh the token (refresh token is read from cookies on server)
						const response = await this.client.post("/api-auth/refresh");
						const { accessToken } = response.data.data;

						// Process queued requests
						this.processQueue(null, accessToken);

						// Retry the original request
						originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
						return this.client(originalRequest);
					} catch (refreshError) {
						// Refresh failed, redirect to login
						this.processQueue(refreshError, null);
						
						// Clear any stored auth state
						if (typeof window !== "undefined") {
							window.location.href = "/login";
						}
						
						return Promise.reject(refreshError);
					} finally {
						this.isRefreshing = false;
					}
				}

				return Promise.reject(error);
			}
		);
	}

	private processQueue(error: any, token: string | null) {
		this.failedQueue.forEach(({ resolve, reject }) => {
			if (error) {
				reject(error);
			} else {
				resolve(token);
			}
		});

		this.failedQueue = [];
	}

	// Generic request methods
	public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(url, config);
		return response.data;
	}

	public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.post<T>(url, data, config);
		return response.data;
	}

	public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.put<T>(url, data, config);
		return response.data;
	}

	public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.delete<T>(url, config);
		return response.data;
	}

	public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.patch<T>(url, data, config);
		return response.data;
	}
}

// Create and export a singleton instance
export const apiClient = new ApiClient(); 