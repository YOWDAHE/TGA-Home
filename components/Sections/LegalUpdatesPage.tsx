"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  Scale,
  Loader2,
} from "lucide-react";
import { LegalUpdate, LegalUpdateCategory } from "@/app/types/legal-updates";
import Header from "./Header";
import LegalUpdatesSubscribeForm from "./LegalUpdatesSubscribeForm";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  alert: "Client Alert",
  analysis: "Analysis",
  guide: "Guide",
  update: "Legal Update",
};

const CONTENT_TYPE_COLORS: Record<string, string> = {
  alert: "bg-red-100 text-red-700",
  analysis: "bg-blue-100 text-blue-700",
  guide: "bg-purple-100 text-purple-700",
  update: "bg-teal-100 text-teal-700",
};

interface LegalUpdatesPageProps {
  initialUpdates: LegalUpdate[];
  featuredUpdates: LegalUpdate[];
  categories: LegalUpdateCategory[];
  pagination: { currentPage: number; totalPages: number; totalItems: number };
  initialSearch?: string;
  initialContentType?: string;
}

const CardSkeleton = () => (
  <Card className="border-0 shadow-md">
    <CardContent className="p-6">
      <Skeleton className="h-5 w-24 mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUpdates(initialUpdates);
    setCurrentPage(pagination.currentPage);
    setTotalPages(pagination.totalPages);
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
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUpdates(1, searchInput, contentType);
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="legal-updates" />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Legal Updates</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Stay informed with client alerts, regulatory updates, and legal analysis from TGA Global Law Firm.
          </p>
        </div>

        {featuredUpdates.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Updates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredUpdates.map((item) => (
                <Link key={item.id} href={`/legal-updates/${item.slug}`}>
                  <Card className="border-teal-200 bg-teal-50 hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-5">
                      <Badge className={`mb-2 ${CONTENT_TYPE_COLORS[item.content_type] || "bg-gray-100"}`}>
                        {CONTENT_TYPE_LABELS[item.content_type]}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      {item.summary && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.summary}</p>}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(item.published_date)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex flex-wrap gap-2 mb-6">
              {["", "alert", "analysis", "guide", "update"].map((type) => (
                <Button
                  key={type || "all"}
                  variant={contentType === type ? "default" : "outline"}
                  size="sm"
                  className={contentType === type ? "bg-teal-600 hover:bg-teal-700" : ""}
                  onClick={() => {
                    setContentType(type);
                    fetchUpdates(1, searchInput, type);
                  }}
                  disabled={loading}
                >
                  {type ? CONTENT_TYPE_LABELS[type] : "All"}
                </Button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search legal updates..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </form>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : updates.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Scale className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No legal updates found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {updates.map((item) => (
                  <Link key={item.id} href={`/legal-updates/${item.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full border-0 shadow-md">
                      <CardContent className="p-5">
                        <Badge className={`mb-2 ${CONTENT_TYPE_COLORS[item.content_type] || "bg-gray-100"}`}>
                          {CONTENT_TYPE_LABELS[item.content_type]}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600">
                          {item.title}
                        </h3>
                        {item.summary && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.summary}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(item.published_date)}
                            </span>
                            {item.author && (
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {item.author}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-teal-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => fetchUpdates(currentPage - 1, searchInput, contentType)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => fetchUpdates(currentPage + 1, searchInput, contentType)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <LegalUpdatesSubscribeForm />
              {categories.length > 0 && (
                <Card className="shadow-md border-0">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">Practice Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Badge key={cat.id} variant="outline" className="cursor-default">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
