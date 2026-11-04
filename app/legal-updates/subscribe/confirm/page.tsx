import Link from "next/link";
import { confirmSubscription } from "@/app/actions/legal-updates.actions";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import PageHero from "@/components/Sections/PageHero";
import Footer from "@/components/Sections/Footer";
import { homeFont } from "@/app/fonts";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Confirm Subscription",
  description: "Confirm your subscription to legal updates from TGA Global Law Firm LL.P.",
  path: "/legal-updates/subscribe/confirm",
  card: { eyebrow: "Legal updates", title: "Legal updates in your inbox" },
  noIndex: true,
});

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

const buttonClass =
  "group inline-flex items-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green";

function StatusPage({
  success,
  title,
  message,
  email,
  cta,
}: {
  success: boolean;
  title: string;
  message: string;
  email?: string;
  cta: string;
}) {
  return (
    <div className={`${homeFont.className} min-h-screen bg-white text-brand-navy antialiased`}>
      <PageHero currentHref="/legal-updates" label="TGA Global Law Firm LL.P" title={title} description={message}>
        <div className="flex flex-col items-center gap-6">
          {email && <p className="text-sm text-brand-navy/50">{email}</p>}
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-sm ring-1 ${
              success ? "bg-brand-tint text-brand-green ring-brand-green/15" : "bg-red-50 text-red-600 ring-red-200"
            }`}
          >
            {success ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
          </span>
          <Link href="/legal-updates" className={buttonClass}>
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </PageHero>
      <Footer />
    </div>
  );
}

export default async function ConfirmSubscriptionPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <StatusPage
        success={false}
        title="Invalid Link"
        message="This confirmation link is invalid or has expired."
        cta="Back to Legal Updates"
      />
    );
  }

  let success = false;
  let message = "";
  let email = "";

  try {
    const res = await confirmSubscription(token);
    success = res.status === "success";
    message = res.message;
    email = res.data?.email || "";
  } catch {
    success = false;
    message = "Invalid or expired confirmation link.";
  }

  return (
    <StatusPage
      success={success}
      title={success ? "Subscription Confirmed!" : "Confirmation Failed"}
      message={message}
      email={success ? email : undefined}
      cta="Browse Legal Updates"
    />
  );
}
