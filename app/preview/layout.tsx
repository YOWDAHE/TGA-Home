import type { Metadata } from "next";

// Previews for the admin's page builder: never indexed (see next.config.ts for who may frame them)
export const metadata: Metadata = {
	title: "Preview",
	robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
	return children;
}
