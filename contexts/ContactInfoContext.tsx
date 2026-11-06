"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ContactUs } from "@/app/types/landing";

// Contact details from the admin, loaded once in the root layout so every footer can show them
const ContactInfoContext = createContext<ContactUs[]>([]);

export function ContactInfoProvider({ value, children }: { value: ContactUs[]; children: ReactNode }) {
	return <ContactInfoContext.Provider value={value}>{children}</ContactInfoContext.Provider>;
}

export const useContactInfo = () => useContext(ContactInfoContext);
