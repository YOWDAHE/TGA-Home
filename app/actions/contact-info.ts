import type { ContactUs } from "../types/landing";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

/** Contact details for the footer. Refreshed every five minutes; an outage leaves the list empty
 *  rather than taking every page down with it. */
export async function getContactInfo(): Promise<ContactUs[]> {
	try {
		const res = await fetch(`${BACKEND_URL}/api/landing/contact`, { next: { revalidate: 300 } });
		if (!res.ok) throw new Error(`status ${res.status}`);
		const body = await res.json();
		return Array.isArray(body?.data) ? body.data : [];
	} catch (error) {
		console.error("Failed to load contact info:", error);
		return [];
	}
}
