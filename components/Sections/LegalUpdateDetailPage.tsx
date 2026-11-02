"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { LegalUpdate } from "@/app/types/legal-updates";
import { News } from "@/app/types/news";
import TopNav from "./TopNav";
import Footer from "./Footer";
import Reveal, { easeOut } from "./Reveal";
import { FrostedColors } from "./Backdrop";
import LegalUpdatesSubscribeForm from "./LegalUpdatesSubscribeForm";
import RelatedContent, { CONTENT_TYPE_COLORS, CONTENT_TYPE_LABELS } from "./RelatedContent";

const pillClass = "inline-flex rounded-full px-3 py-1 text-xs font-medium";

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

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-clip text-brand-navy antialiased">
        <FrostedColors />
        <TopNav currentHref="/legal-updates" />

        {/* Article header */}
        <header className="mx-auto max-w-3xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
          >
            <Link
              href="/legal-updates"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-brand-navy shadow-sm ring-1 ring-black/5 transition-colors hover:bg-brand-tint"
            >
              <ArrowLeft className="h-4 w-4" />
              Legal Updates
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            <span className={`${pillClass} ${CONTENT_TYPE_COLORS[legalUpdate.content_type] || "bg-[#f2f4f8] text-[#4b5468]"}`}>
              {CONTENT_TYPE_LABELS[legalUpdate.content_type] || legalUpdate.content_type}
            </span>
            {legalUpdate.featured && <span className={`${pillClass} bg-brand-navy text-white`}>Featured</span>}
            {legalUpdate.category && (
              <span className={`${pillClass} bg-white text-[#4b5468] ring-1 ring-black/5`}>{legalUpdate.category.name}</span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
            className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          >
            {legalUpdate.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#606b80]"
          >
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
          </motion.div>

          {legalUpdate.summary && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.35 }}
              className="mt-8 border-l-2 border-brand-green pl-5 text-pretty text-lg leading-relaxed text-[#4b5468]"
            >
              {legalUpdate.summary}
            </motion.p>
          )}
        </header>

        {/* Content sits directly on the page, set to a comfortable reading width */}
        <article className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
            className="rich-text-content border-t border-black/10 pt-10 text-[#3b4457] [&_h1]:text-brand-navy [&_h2]:text-brand-navy [&_h3]:text-brand-navy [&_h4]:text-brand-navy"
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
