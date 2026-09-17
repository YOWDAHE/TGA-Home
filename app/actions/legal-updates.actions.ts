import axios from "axios";
import {
  LegalUpdatesResponse,
  LegalUpdateBySlugResponse,
} from "../types/legal-updates";

const BACKEND_URL = process.env.BACKEND_URL;

interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  q?: string;
  category?: string;
  content_type?: string;
}

export async function getLegalUpdates(params: QueryParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.order) queryParams.append("order", params.order);
  if (params.q) queryParams.append("q", params.q);
  if (params.category) queryParams.append("category", params.category);
  if (params.content_type) queryParams.append("content_type", params.content_type);

  const qs = queryParams.toString();
  const res = await axios.get<LegalUpdatesResponse>(
    `${BACKEND_URL}/api/legal-updates/public${qs ? `?${qs}` : ""}`,
  );
  return res.data;
}

export async function getLegalUpdateBySlug(slug: string) {
  const res = await axios.get<LegalUpdateBySlugResponse>(
    `${BACKEND_URL}/api/legal-updates/public/${slug}`,
  );
  return res.data;
}

export async function confirmSubscription(token: string) {
  const res = await axios.get(`${BACKEND_URL}/api/legal-updates/subscribe/confirm/${token}`);
  return res.data;
}

export async function unsubscribeFromLegalUpdates(token: string) {
  const res = await axios.get(`${BACKEND_URL}/api/legal-updates/subscribe/unsubscribe/${token}`);
  return res.data;
}

export async function subscribeToLegalUpdates(email: string, name?: string) {
  const response = await fetch("/api/legal-updates/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || result.error || "Failed to subscribe");
  }
  return result;
}
