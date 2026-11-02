import LegalUpdatesPage from "@/components/Sections/LegalUpdatesPage";
import { getLegalUpdates } from "../actions/legal-updates.actions";
import { getCategories } from "../actions/news.actions";
import type { Metadata } from "next";
import { homeFont } from "../fonts";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Legal Updates & Client Alerts",
    description:
      "Legal updates, client alerts, regulatory changes and expert analysis from TGA Global Law Firm LL.P.",
    path: "/legal-updates",
    card: { eyebrow: "Legal updates", title: "Legal updates and client alerts" },
  }),
  keywords: [
    "legal updates",
    "client alerts",
    "regulatory updates",
    "law firm alerts",
    "legal analysis",
    "Ethiopia law updates",
  ],
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
