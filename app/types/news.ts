export interface NewsResponse {
    message: string;
    status:  string;
    error:   null;
    data:    NewsData;
}

export interface NewsByIdResponse {
    message: string;
    status: string;
    error: null;
    data: News;
}

export interface NewsQueryResponse {
    message: string;
    status: string;
    error: null;
    data: {
        news: News[];
        pagination: Pagination;
    };
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface NewsData {
    featured: News[];
    latest:   News[];
    trending: News[];
    hot:      News[];
    others:   Other[];
}

export interface News {
    id:                  number;
    title:               string;
    visual_content:      string[] | null;
    links:               null;
    content:             string;
    hashtags:            null | string;
    category_id:         null;
    source:              Source;
    view_count:          number;
    featured:            boolean;
    read_minutes:        number | null;
    source_id:           null | string;
    message_id:          null | string;
    telegram_message_id: number[] | null;
    linkedin_message_id: null;
    twitter_message_id:  null;
    published_date:      Date;
    created_by:          CreatedBy;
    createdAt:           Date;
    updatedAt:           Date;
}

export enum CreatedBy {
    Telegram = "telegram",
    YodaheKetema = "yodahe ketema",
}

export enum Source {
    Telegram = "Telegram",
    Website = "Website",
}

export interface VisualContent {
    public_id:  string;
    secure_url: string;
}

export interface Other {
    id:          number;
    title:       string;
    description: string;
    link:        string;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryResponse {
    message: string;
    status: string;
    error: null;
    data: {
        categories: Category[];
        pagination: Pagination;
    };
}