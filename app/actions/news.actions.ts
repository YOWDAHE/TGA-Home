import axios from "axios";
import { NewsResponse, NewsQueryResponse, CategoryResponse, NewsByIdResponse } from "../types/news";


const BACKEND_URL = process.env.BACKEND_URL;


export const getNews = async () => {
    try {

        const news = await axios.get<NewsResponse>(`${BACKEND_URL}/api/news/public`);

        console.log('News data fetched successfully');
        return news.data;
    } catch (error: any) {
        console.error('Error fetching news data:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API credentials.');
        } else if (error.response?.status === 404) {
            throw new Error('Landing page endpoint not found.');
        } else if (error.response?.status === 503) {
            throw new Error('Backend server is not available. Please try again later.');
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to server. Please check if the server is running.');
        }

        throw new Error(`Failed to fetch news data: ${error.message}`);
    }
}

interface NewsQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    q?: string;
    category?: string;
}

export const getNewsByQuery = async (params: NewsQueryParams = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
            q = '',
            category = '',
        } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            order,
            ...(q && { q }),
            ...(category && { category }),
        });

        const response = await axios.get<NewsQueryResponse>(`${BACKEND_URL}/api/news?${queryParams}`);

        console.log('News query data fetched successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching news query data:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API credentials.');
        } else if (error.response?.status === 404) {
            throw new Error('News endpoint not found.');
        } else if (error.response?.status === 503) {
            throw new Error('Backend server is not available. Please try again later.');
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to server. Please check if the server is running.');
        }

        throw new Error(`Failed to fetch news query data: ${error.message}`);
    }
}

export const getRelatedNews = async (hashtag: string) => {
    try {
        const response = await axios.get<NewsQueryResponse>(`${BACKEND_URL}/api/public/search/news?q=${encodeURIComponent(hashtag)}`);
        console.log('Related news data fetched successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching related news:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API credentials.');
        } else if (error.response?.status === 404) {
            throw new Error('Related news endpoint not found.');
        } else if (error.response?.status === 503) {
            throw new Error('Backend server is not available. Please try again later.');
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to server. Please check if the server is running.');
        }

        throw new Error(`Failed to fetch related news: ${error.message}`);
    }
}

export const getCategories = async () => {
    try {
        const response = await axios.get<CategoryResponse>(`${BACKEND_URL}/api/category`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching categories:', {
            message: error.message,
            status: error.response?.status,
        });

        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
}

export const getNewsById = async (id: string) => {
    try {
        const response = await axios.get<NewsByIdResponse>(`${BACKEND_URL}/api/news/public/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching news by id:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
        })
    }
}