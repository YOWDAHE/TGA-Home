import LegalUpdatesPage from "@/components/Sections/LegalUpdatesPage";
import { getLegalUpdates } from "../actions/legal-updates.actions";
import { getCategories } from "../actions/news.actions";
import type { Metadata } from "next";
import { homeFont } from "../fonts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Legal Updates & Client Alerts",
  description:
    "Stay informed with legal updates, client alerts, regulatory changes, and expert analysis from TGA Global Law Firm LL.P.",
  keywords: [
    "legal updates",
    "client alerts",
    "regulatory updates",
    "law firm alerts",
    "legal analysis",
    "Ethiopia law updates",
  ],
  openGraph: {
    title: "Legal Updates & Client Alerts | TGA Global Law Firm LL.P",
    description:
      "Stay informed with legal updates, client alerts, and regulatory changes from TGA Global Law Firm.",
    url: "/legal-updates",
    type: "website",
  },
  alternates: { canonical: "/legal-updates" },
};

export default async function page() {
  const [updatesRes, categoriesRes] = await Promise.all([
    getLegalUpdates({ page: 1, limit: 50, sortBy: "published_date", order: "desc" }),
    getCategories(),
  ]);

  const allUpdates = updatesRes.data?.legalUpdates || [];
  const updates = allUpdates.slice(0, 9);
  const featuredUpdates = allUpdates.filter((u) => u.featured).slice(0, 3);
  const categories = categoriesRes.data?.categories || [];
  const pagination = updatesRes.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  return (
    <div className={homeFont.className}>
      <LegalUpdatesPage
        initialUpdates={updates}
        featuredUpdates={featuredUpdates}
        categories={categories}
        pagination={pagination}
      />
    </div>
  );
}
