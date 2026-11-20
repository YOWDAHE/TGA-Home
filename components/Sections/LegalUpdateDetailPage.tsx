"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Clock, Download, Eye, ExternalLink, FileText, Share2 } from "lucide-react";
import { LegalUpdate } from "@/app/types/legal-updates";
import { News } from "@/app/types/news";
import PageHero from "./PageHero";
import Footer from "./Footer";
import Reveal, { easeOut } from "./Reveal";
import LegalUpdatesSubscribeForm from "./LegalUpdatesSubscribeForm";
import RelatedContent, { CONTENT_TYPE_COLORS, CONTENT_TYPE_LABELS } from "./RelatedContent";
import IframePdfViewer from "./IframePdfViewer";
import { useCopyLink } from "./useCopyLink";
import { convertToApiUrl } from "@/lib/utils";

const pillClass = "inline-flex rounded-sm px-3 py-1 text-xs font-medium";

interface LegalUpdateDetailPageProps {
  legalUpdate: LegalUpdate;
  relatedUpdates?: LegalUpdate[];
  relatedNews?: News[];
}

export default function LegalUpdateDetailPage({
  legalUpdate,
  relatedUpdates = [],
  relatedNews = [],
}: LegalUpdateDetailPageProps) {
  const formatDate = (date?: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const copyLink = useCopyLink();

  // A PDF update gets the same page as a resource: actions and details up top, the document below
  if (legalUpdate.pdf_url) {
    return (
      <LegalUpdatePdfPage
        legalUpdate={legalUpdate}
        pdfUrl={legalUpdate.pdf_url}
        onShare={() => copyLink(`/legal-updates/${legalUpdate.slug}`)}
        relatedUpdates={relatedUpdates}
        relatedNews={relatedNews}
      />
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-clip bg-white text-brand-navy antialiased">
        <PageHero currentHref="/legal-updates" label="TGA Global Law Firm LL.P" title={legalUpdate.title}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={`${pillClass} ${CONTENT_TYPE_COLORS[legalUpdate.content_type] || "bg-brand-tint/50 text-brand-navy/75"}`}>
              {CONTENT_TYPE_LABELS[legalUpdate.content_type] || legalUpdate.content_type}
            </span>
            {legalUpdate.featured && <span className={`${pillClass} bg-brand-navy text-white`}>Featured</span>}
            {legalUpdate.category && (
              <span className={`${pillClass} bg-white text-brand-navy/75 ring-1 ring-brand-navy/15`}>{legalUpdate.category.name}</span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-brand-navy/60">
            {legalUpdate.published_date && (
              <span className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 text-brand-green" />
                Published {formatDate(legalUpdate.published_date)}
              </span>
            )}
            {legalUpdate.updatedAt && legalUpdate.updatedAt !== legalUpdate.createdAt && (
              <span className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 text-brand-green" />
                Updated {formatDate(legalUpdate.updatedAt)}
              </span>
            )}
            {legalUpdate.author && (
              <span className="flex items-center">
                <User className="mr-1.5 h-4 w-4 text-brand-green" />
                {legalUpdate.author}
              </span>
            )}
          </div>

          <Link
            href="/legal-updates"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint"
          >
            <ArrowLeft className="h-4 w-4" />
            Legal Updates
          </Link>
        </PageHero>

        {/* Content sits directly on the page, set to a comfortable reading width */}
        <article className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          {legalUpdate.summary && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.35 }}
              className="mb-10 border-l-2 border-brand-green pl-5 text-pretty text-lg leading-relaxed text-brand-navy/75"
            >
              {legalUpdate.summary}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
            className="rich-text-content border-t border-brand-navy/10 pt-10 text-brand-navy/75 [&_h1]:text-brand-navy [&_h2]:text-brand-navy [&_h3]:text-brand-navy [&_h4]:text-brand-navy"
            dangerouslySetInnerHTML={{ __html: legalUpdate.content }}
          />

          <Reveal className="mt-12">
            <LegalUpdatesSubscribeForm compact />
          </Reveal>
        </article>

        <RelatedContent updates={relatedUpdates} news={relatedNews} order={["updates", "news"]} />

        <Footer />
      </div>
    </MotionConfig>
  );
}

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

function LegalUpdatePdfPage({
  legalUpdate,
  pdfUrl,
  onShare,
  relatedUpdates,
  relatedNews,
}: {
  legalUpdate: LegalUpdate;
  pdfUrl: string;
  onShare: () => void;
  relatedUpdates: LegalUpdate[];
  relatedNews: News[];
}) {
  const fileUrl = convertToApiUrl(pdfUrl);
  const downloadName = legalUpdate.pdf_filename || `${legalUpdate.slug}.pdf`;

  const details = [
    { icon: User, label: "Author", value: legalUpdate.author || "TGA Global Law Firm LL.P" },
    {
      icon: Calendar,
      label: "Published",
      value: new Date(legalUpdate.published_date || legalUpdate.createdAt).toLocaleDateString(),
    },
    { icon: Eye, label: "Views", value: (legalUpdate.view_count ?? 0).toLocaleString() },
    { icon: FileText, label: "File size", value: formatFileSize(legalUpdate.pdf_size) || "PDF" },
  ];

  const actionClass =
    "inline-flex items-center justify-center gap-2 rounded-sm bg-white px-4 py-2.5 text-sm font-medium text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint";

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
        <PageHero
          currentHref="/legal-updates"
          label={`${CONTENT_TYPE_LABELS[legalUpdate.content_type] || "Legal update"} · PDF`}
          title={legalUpdate.title}
          description={legalUpdate.summary || undefined}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href={fileUrl}
              download={downloadName}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <button type="button" onClick={onShare} className={actionClass}>
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button type="button" onClick={() => window.open(fileUrl, "_blank")} className={actionClass}>
              <ExternalLink className="h-4 w-4" />
              New tab
            </button>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-2 text-left sm:grid-cols-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-sm bg-white p-3 ring-1 ring-brand-navy/10">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-tint text-brand-green">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-brand-navy/50">{label}</dt>
                  <dd className="truncate text-sm font-medium text-brand-navy">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </PageHero>

        {/* The document itself, as large as the screen allows */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.35 }}
          className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <Link
            href="/legal-updates"
            className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-brand-green"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All legal updates
          </Link>
          <IframePdfViewer
            resource={{ file_url: pdfUrl, title: legalUpdate.title }}
            className="h-[calc(100svh-6rem)] min-h-[32rem]"
            openLabel="Open document"
          />

          <Reveal className="mx-auto mt-12 max-w-3xl">
            <LegalUpdatesSubscribeForm compact />
          </Reveal>
        </motion.section>

        <RelatedContent updates={relatedUpdates} news={relatedNews} order={["updates", "news"]} />

        <Footer />
      </div>
    </MotionConfig>
  );
}
