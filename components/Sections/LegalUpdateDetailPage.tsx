"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Clock, Scale } from "lucide-react";
import { LegalUpdate } from "@/app/types/legal-updates";
import Header from "./Header";
import LegalUpdatesSubscribeForm from "./LegalUpdatesSubscribeForm";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  alert: "Client Alert",
  analysis: "Analysis",
  guide: "Guide",
  update: "Legal Update",
};

interface LegalUpdateDetailPageProps {
  legalUpdate: LegalUpdate;
}

export default function LegalUpdateDetailPage({ legalUpdate }: LegalUpdateDetailPageProps) {
  const formatDate = (date?: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="legal-updates" />

      {/* Hero header */}
      <section className="relative mt-16 overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-[url('/office/placeholder.jpg?height=100&width=100')] opacity-5" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full -ml-28 -mb-28" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-1/4 right-12 w-24 h-24 bg-white/10 rounded-full" />

        <div className="container mx-auto px-4 py-10 md:py-14 relative z-10 max-w-4xl">
          <Link href="/legal-updates">
            <Button
              variant="ghost"
              className="mb-6 -ml-2 text-white/90 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Legal Updates
            </Button>
          </Link>

          <div className="flex items-start gap-4 md:gap-6">
            <div className="hidden sm:flex shrink-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20">
                  {CONTENT_TYPE_LABELS[legalUpdate.content_type] || legalUpdate.content_type}
                </Badge>
                {legalUpdate.featured && (
                  <Badge className="bg-amber-400/90 text-amber-950 border-0">Featured</Badge>
                )}
                {legalUpdate.category && (
                  <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                    {legalUpdate.category.name}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
                {legalUpdate.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-teal-50">
                {legalUpdate.published_date && (
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    Published {formatDate(legalUpdate.published_date)}
                  </span>
                )}
                {legalUpdate.updatedAt && legalUpdate.updatedAt !== legalUpdate.createdAt && (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    Updated {formatDate(legalUpdate.updatedAt)}
                  </span>
                )}
                {legalUpdate.author && (
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    {legalUpdate.author}
                  </span>
                )}
              </div>

              {legalUpdate.summary && (
                <p className="mt-6 text-lg text-teal-50/95 leading-relaxed border-l-4 border-white/40 pl-4">
                  {legalUpdate.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <article className="container mx-auto px-4 py-10 max-w-4xl">
        <div
          className="rich-text-content mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10"
          dangerouslySetInnerHTML={{ __html: legalUpdate.content }}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <LegalUpdatesSubscribeForm compact />
        </div>
      </article>
    </div>
  );
}
