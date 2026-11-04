"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  Scale,
  Loader2,
  ArrowUpRight,
  X,
} from "lucide-react";
import { LegalUpdate, LegalUpdateCategory } from "@/app/types/legal-updates";
import { MotionConfig, motion } from "framer-motion";
import PageHero from "./PageHero";
import Footer from "./Footer";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal, { easeOut } from "./Reveal";
import LegalUpdatesSubscribeForm from "./LegalUpdatesSubscribeForm";
import { Highlight, MatchBadges, excerptAround, matchedFields } from "./SearchMatch";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  alert: "Client Alert",
  analysis: "Analysis",
  guide: "Guide",
  update: "Legal Update",
};

const CONTENT_TYPE_COLORS: Record<string, string> = {
  alert: "bg-red-50 text-red-700",
  analysis: "bg-brand-navy/5 text-brand-navy",
  guide: "bg-amber-50 text-amber-700",
  update: "bg-brand-tint text-brand-green",
};

interface LegalUpdatesPageProps {
  initialUpdates: LegalUpdate[];
  featuredUpdates: LegalUpdate[];
  categories: LegalUpdateCategory[];
  pagination: { currentPage: number; totalPages: number; totalItems: number };
  initialSearch?: string;
  initialContentType?: string;
}

const pagerClass =
  "inline-flex items-center rounded-sm bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint disabled:pointer-events-none disabled:opacity-40";

// Content-type filters are square chips; the selected one is filled navy
const chipClass = (active: boolean) =>
  `shrink-0 rounded-sm px-4 py-2 text-sm transition-colors disabled:opacity-60 ${
    active
      ? "bg-brand-navy text-white"
      : "bg-white text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-tint"
  }`;

const typeBadge = (type: string) =>
  `inline-flex rounded-sm px-2.5 py-0.5 text-xs font-medium ${CONTENT_TYPE_COLORS[type] || "bg-brand-tint/50 text-brand-navy/75"}`;

// Update bodies are HTML; excerpts and matching use plain text
const stripHtml = (html: string) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const CardSkeleton = () => (
  <div className="rounded-sm bg-white p-6 ring-1 ring-brand-navy/10">
    <Skeleton className="mb-4 h-5 w-24 rounded-sm bg-brand-tint/50" />
    <Skeleton className="mb-2 h-6 w-full rounded-sm bg-brand-tint/50" />
    <Skeleton className="mb-4 h-4 w-3/4 rounded-sm bg-brand-tint/50" />
    <Skeleton className="h-4 w-1/2 rounded-sm bg-brand-tint/50" />
  </div>
);

export default function LegalUpdatesPage({
  initialUpdates,
  featuredUpdates,
  categories,
  pagination,
  initialSearch = "",
  initialContentType = "",
}: LegalUpdatesPageProps) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [contentType, setContentType] = useState(initialContentType);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [totalPages, setTotalPages] = useState(pagination.totalPages);
  const [totalItems, setTotalItems] = useState(pagination.totalItems);
  const [loading, setLoading] = useState(false);
  // The submitted phrase; while it is set the page shows only the results
  const [activeQuery, setActiveQuery] = useState(initialSearch.trim());
  const router = useRouter();

  useEffect(() => {
    setUpdates(initialUpdates);
    setCurrentPage(pagination.currentPage);
    setTotalPages(pagination.totalPages);
    setTotalItems(pagination.totalItems);
    setLoading(false);
  }, [initialUpdates, pagination]);

  const fetchUpdates = async (page: number, search: string, type: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "9", sortBy: "published_date", order: "desc" });
      if (search) params.append("q", search);
      if (type) params.append("content_type", type);
      const res = await fetch(`/api/legal-updates?${params.toString()}`);
      const result = await res.json();
      if (result.success) {
        setUpdates(result.data.data.legalUpdates);
        setCurrentPage(result.data.data.pagination.currentPage);
        setTotalPages(result.data.data.pagination.totalPages);
        setTotalItems(result.data.data.pagination.totalItems);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
    fetchUpdates(1, searchInput, contentType);
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveQuery("");
    fetchUpdates(1, "", contentType);
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-clip bg-white text-brand-navy antialiased">
        <PageHero
          currentHref="/legal-updates"
          label="TGA Global Law Firm LL.P"
          title="Legal Updates"
          description="Stay informed with client alerts, regulatory updates, and legal analysis from TGA Global Law Firm."
        >
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-xl items-center gap-2 rounded-sm bg-white p-1.5 pl-4 text-left ring-1 ring-brand-navy/15 focus-within:ring-2 focus-within:ring-brand-green/40"
          >
            <Search className="h-4 w-4 shrink-0 text-brand-navy/40" />
            <input
              type="search"
              placeholder="Search legal updates..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent py-2 text-brand-navy placeholder:text-brand-navy/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[5.5rem] items-center justify-center rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </button>
          </form>

          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
            {["", "alert", "analysis", "guide", "update"].map((type) => (
              <button
                key={type || "all"}
                type="button"
                className={chipClass(contentType === type)}
                onClick={() => {
                  setContentType(type);
                  fetchUpdates(1, activeQuery, type);
                }}
                disabled={loading}
              >
                {type ? CONTENT_TYPE_LABELS[type] : "All"}
              </button>
            ))}
          </div>
        </PageHero>

        {activeQuery ? (
          /* Search results only: featured updates and the sidebar stay hidden while searching */
          <section className="px-4 pb-16 sm:px-6 sm:pb-24">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
                    Results for “{activeQuery}”
                  </h2>
                  <p className="mt-1 text-sm text-brand-navy/50">
                    {loading
                      ? "Searching..."
                      : `${totalItems} update${totalItems === 1 ? "" : "s"} found${
                          contentType ? ` · ${CONTENT_TYPE_LABELS[contentType]}` : ""
                        }`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex shrink-0 items-center rounded-sm bg-white px-4 py-2 text-sm text-brand-navy ring-1 ring-brand-navy/15 transition-colors hover:bg-brand-tint"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear search
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20 text-brand-navy/60">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
                  <span className="ml-2">Searching...</span>
                </div>
              ) : updates.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-sm bg-white ring-1 ring-brand-navy/10">
                    <Search className="h-8 w-8 text-brand-navy/40" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-brand-navy">No legal updates found</h3>
                  <p className="text-brand-navy/60">Try a different phrase or another type.</p>
                </div>
              ) : (
                <ul className="mt-8 space-y-3">
                  {updates.map((item, index) => {
                    const text = stripHtml(item.content);
                    const found = matchedFields(activeQuery, [
                      { label: "Title", value: item.title },
                      { label: "Summary", value: item.summary },
                      { label: "Text", value: text },
                      { label: "Author", value: item.author },
                    ]);
                    // Show the passage where the phrase appears; fall back to the summary
                    const excerptSource =
                      !found.includes("Summary") && found.includes("Text") ? text : item.summary || text;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: easeOut, delay: Math.min(index, 8) * 0.04 }}
                      >
                        <Link
                          href={`/legal-updates/${item.slug}`}
                          className="group flex items-center gap-4 rounded-sm bg-white p-4 ring-1 ring-brand-navy/10 transition hover:ring-brand-navy/25 sm:gap-5 sm:p-5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <MatchBadges labels={found} />
                              <span className={typeBadge(item.content_type)}>{CONTENT_TYPE_LABELS[item.content_type]}</span>
                            </div>
                            <h3 className="mt-2 line-clamp-2 font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green sm:text-lg">
                              <Highlight text={item.title} query={activeQuery} />
                            </h3>
                            {excerptSource && (
                              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-brand-navy/75">
                                <Highlight text={excerptAround(excerptSource, activeQuery)} query={activeQuery} />
                              </p>
                            )}
                            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-navy/50">
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDate(item.published_date)}
                              </span>
                              {item.author && (
                                <span className="flex items-center">
                                  <User className="mr-1 h-3 w-3" />
                                  <Highlight text={item.author} query={activeQuery} />
                                </span>
                              )}
                            </p>
                          </div>
                          <ChevronRight className="hidden h-5 w-5 shrink-0 text-brand-green transition-transform group-hover:translate-x-0.5 sm:block" />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              )}

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className={pagerClass}
                    disabled={currentPage <= 1 || loading}
                    onClick={() => fetchUpdates(currentPage - 1, activeQuery, contentType)}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-brand-navy/60">Page {currentPage} of {totalPages}</span>
                  <button
                    type="button"
                    className={pagerClass}
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => fetchUpdates(currentPage + 1, activeQuery, contentType)}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
        <>
        {featuredUpdates.length > 0 && (
          <Section>
            <SectionHeading title="Featured Updates" description="The alerts and analysis we want every client to see" />
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredUpdates.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.08}>
                  <Link
                    href={`/legal-updates/${item.slug}`}
                    className="group flex h-full flex-col rounded-sm bg-brand-navy p-6 text-white transition duration-300 hover:-translate-y-1 sm:p-7"
                  >
                    <span className="mb-5 inline-flex self-start rounded-sm bg-white/10 px-2.5 py-0.5 text-xs font-medium text-brand-tint">
                      {CONTENT_TYPE_LABELS[item.content_type]}
                    </span>
                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold tracking-tight">{item.title}</h3>
                    {item.summary && <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/65">{item.summary}</p>}
                    <div className="mt-auto flex items-center justify-between text-xs text-white/55">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(item.published_date)}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors group-hover:bg-brand-green">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <SectionHeading
                title={contentType ? CONTENT_TYPE_LABELS[contentType] : "All updates"}
                className="mb-10"
              />

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : updates.length === 0 ? (
                <Reveal className="py-16 text-center text-brand-navy/60">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-sm bg-white ring-1 ring-brand-navy/10">
                    <Scale className="h-9 w-9 text-brand-navy/40" />
                  </div>
                  <p>No legal updates found.</p>
                </Reveal>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {updates.map((item, index) => (
                    <Reveal key={item.id} delay={(index % 2) * 0.06}>
                      <Link
                        href={`/legal-updates/${item.slug}`}
                        className="group flex h-full flex-col rounded-sm bg-white p-6 ring-1 ring-brand-navy/10 transition duration-300 hover:-translate-y-1 hover:ring-brand-navy/25"
                      >
                        <span className={`${typeBadge(item.content_type)} mb-4 self-start`}>
                          {CONTENT_TYPE_LABELS[item.content_type]}
                        </span>
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand-green">
                          {item.title}
                        </h3>
                        {item.summary && (
                          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-brand-navy/75">{item.summary}</p>
                        )}
                        <div className="mt-auto flex items-center justify-between gap-3 text-xs text-brand-navy/50">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(item.published_date)}
                            </span>
                            {item.author && (
                              <span className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                {item.author}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-brand-green transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className={pagerClass}
                    disabled={currentPage <= 1 || loading}
                    onClick={() => fetchUpdates(currentPage - 1, searchInput, contentType)}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-brand-navy/60">Page {currentPage} of {totalPages}</span>
                  <button
                    type="button"
                    className={pagerClass}
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => fetchUpdates(currentPage + 1, searchInput, contentType)}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.1} className="space-y-4 lg:sticky lg:top-8">
                <LegalUpdatesSubscribeForm />
                {categories.length > 0 && (
                  <div className="rounded-sm bg-white p-6 ring-1 ring-brand-navy/10">
                    <h3 className="mb-4 font-semibold tracking-tight text-brand-navy">Practice Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <span key={cat.id} className="cursor-default rounded-sm bg-brand-tint/50 px-3 py-1 text-xs text-brand-navy/75">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </Section>
        </>
        )}

        <Footer />
      </div>
    </MotionConfig>
  );
}
