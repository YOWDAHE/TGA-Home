import Link from "next/link";
import { unsubscribeFromLegalUpdates } from "@/app/actions/legal-updates.actions";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import PageHero from "@/components/Sections/PageHero";
import Footer from "@/components/Sections/Footer";
import { homeFont } from "@/app/fonts";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Unsubscribe",
  description: "Stop receiving legal updates from TGA Global Law Firm LL.P.",
  path: "/legal-updates/unsubscribe",
  card: { eyebrow: "Legal updates", title: "Legal updates in your inbox" },
  noIndex: true,
});

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

const buttonClass =
  "group inline-flex items-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green";

function StatusPage({ success, title, message }: { success: boolean; title: string; message: string }) {
  return (
    <div className={`${homeFont.className} min-h-screen bg-white text-brand-navy antialiased`}>
      <PageHero currentHref="/legal-updates" label="TGA Global Law Firm LL.P" title={title} description={message}>
        <div className="flex flex-col items-center gap-6">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-sm ring-1 ${
              success ? "bg-brand-tint text-brand-green ring-brand-green/15" : "bg-red-50 text-red-600 ring-red-200"
            }`}
          >
            {success ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
          </span>
          <Link href="/legal-updates" className={buttonClass}>
            Back to Legal Updates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </PageHero>
      <Footer />
    </div>
  );
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <StatusPage success={false} title="Invalid Link" message="This unsubscribe link is invalid." />;
  }

  let success = false;
  let message = "";

  try {
    const res = await unsubscribeFromLegalUpdates(token);
    success = res.status === "success";
    message = res.message;
  } catch {
    success = false;
    message = "Failed to unsubscribe. The link may be invalid.";
  }

  return <StatusPage success={success} title={success ? "Unsubscribed" : "Unsubscribe Failed"} message={message} />;
}
