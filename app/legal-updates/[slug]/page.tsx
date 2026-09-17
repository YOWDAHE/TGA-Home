import LegalUpdateDetailPage from "@/components/Sections/LegalUpdateDetailPage";
import { getLegalUpdateBySlug } from "../../actions/legal-updates.actions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  try {
    const res = await getLegalUpdateBySlug(slug);
    return <LegalUpdateDetailPage legalUpdate={res.data} />;
  } catch {
    notFound();
  }
}
