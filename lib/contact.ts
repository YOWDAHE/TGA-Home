import { Home, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { ContactUs } from "@/app/types/landing";

export const DEFAULT_EMAIL = "info@tgagloballawfirm.com";

export interface ContactRow {
	id: number;
	medium: string;
	Icon: LucideIcon;
	lines: { text: string; href?: string }[];
	/** Opens outside the site (WhatsApp) */
	external: boolean;
	isOffice: boolean;
}

/** Contact entries from the admin, ready to show. Phone and WhatsApp rows show their number;
 *  the others show their email (and phone, if any). */
export function contactRows(contactUs: ContactUs[]): ContactRow[] {
	return contactUs.map((contact) => {
		const medium = contact.medium.toLowerCase();
		const isWhatsApp = medium.includes("whatsapp");
		const isPhone = medium.includes("phone");
		const isOffice = medium.includes("office");
		const digits = (contact.phone_number ?? "").replace(/[^\d]/g, "");
		let Icon: LucideIcon = Mail;
		if (isPhone) Icon = Phone;
		else if (isWhatsApp) Icon = MessageCircle;
		else if (isOffice) Icon = Home;

		const lines: ContactRow["lines"] =
			isPhone || isWhatsApp
				? [
						{
							text: contact.phone_number || contact.email || "-",
							href: contact.phone_number
								? isWhatsApp
									? `https://wa.me/${digits}`
									: `tel:${digits ? `+${digits}` : contact.phone_number}`
								: undefined,
						},
					]
				: [
						{ text: contact.email ?? DEFAULT_EMAIL, href: `mailto:${contact.email ?? DEFAULT_EMAIL}` },
						...(contact.phone_number ? [{ text: contact.phone_number, href: `tel:+${digits}` }] : []),
					];
		return { id: contact.id, medium: contact.medium, Icon, lines, external: isWhatsApp, isOffice };
	});
}

/** The address the site's "email us" buttons use: the first email entered in the admin. */
export const primaryEmail = (contactUs: ContactUs[]) => contactUs.find((c) => c.email)?.email ?? DEFAULT_EMAIL;
