import LegalUpdateDetailPage from "@/components/Sections/LegalUpdateDetailPage";
import { homeFont } from "../../fonts";
import { getLegalUpdateBySlug as fetchLegalUpdateBySlug } from "../../actions/legal-updates.actions";
import type { LegalUpdate } from "../../types/legal-updates";
import { getRelatedNews, getRelatedUpdates } from "@/lib/related-content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";

// The backend counts a view on every fetch, so the metadata and the page share one request
const getLegalUpdateBySlug = cache(fetchLegalUpdateBySlug);

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await getLegalUpdateBySlug(slug);
    const item = res.data;
    return {
      title: item.title,
      description: item.meta_description || item.summary || item.title,
      keywords: item.seo_keywords?.split(",").map((k) => k.trim()),
      openGraph: {
        title: item.title,
        description: item.meta_description || item.summary || undefined,
        url: `/legal-updates/${slug}`,
        type: "article",
      },
      alternates: { canonical: `/legal-updates/${slug}` },
    };
  } catch {
    return { title: "Legal Update Not Found" };
  }
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;

  let legalUpdate: LegalUpdate;
  try {
    legalUpdate = (await getLegalUpdateBySlug(slug)).data;
  } catch {
    notFound();
  }

  const related = { categoryId: legalUpdate.category_id };
  const [relatedUpdates, relatedNews] = await Promise.all([
    getRelatedUpdates({ ...related, excludeId: legalUpdate.id, contentType: legalUpdate.content_type }),
    getRelatedNews(related),
  ]);

  return (
    <div className={homeFont.className}>
      <LegalUpdateDetailPage
        legalUpdate={legalUpdate}
        relatedUpdates={relatedUpdates}
        relatedNews={relatedNews}
      />
    </div>
  );
}
