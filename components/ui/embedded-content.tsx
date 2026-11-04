"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Play, X, Maximize2, Minimize2, Link as LinkIcon } from "lucide-react";

interface EmbeddedContentProps {
  title: string;
  description: string;
  link: string;
  createdAt: Date;
  className?: string;
}

function getLinkType(link: string): "youtube" | "website" | "vimeo" | "dailymotion" | "ted" | "other" {
  if (/youtu(be)?\.com|youtu\.be/.test(link)) return "youtube";
  if (/vimeo\.com/.test(link)) return "vimeo";
  if (/dailymotion\.com/.test(link)) return "dailymotion";
  if (/ted\.com/.test(link)) return "ted";
  if (/^https?:\/\//.test(link)) return "website";
  return "other";
}

function getLinkTypeLabel(type: string) {
  switch (type) {
    case "youtube": return "YOUTUBE";
    case "vimeo": return "VIMEO";
    case "dailymotion": return "DAILYMOTION";
    case "ted": return "TED";
    case "website": return "WEBSITE";
    default: return "LINK";
  }
}

function getLinkTypeColor(type: string) {
  switch (type) {
    case "youtube":
    case "vimeo":
    case "dailymotion":
    case "ted": return "bg-brand-navy text-white";
    case "website": return "bg-brand-green text-white";
    default: return "bg-white text-brand-navy ring-1 ring-brand-navy/15";
  }
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function getEmbedUrl(link: string): string | null {
  const type = getLinkType(link);
  if (type === "youtube") return getYouTubeEmbedUrl(link);
  if (type === "vimeo") return link.replace("vimeo.com", "player.vimeo.com/video");
  if (type === "dailymotion") return link.replace("dailymotion.com/video", "dailymotion.com/embed/video");
  if (type === "ted") return link.replace("ted.com/talks/", "embed.ted.com/talks/");
  return null;
}

function isEmbeddable(link: string): boolean {
  return !!getEmbedUrl(link);
}

export function EmbeddedContent({
  title,
  description,
  link,
  createdAt,
  className = ""
}: EmbeddedContentProps) {
  const [showIframe, setShowIframe] = useState(false);
  const type = getLinkType(link);
  const embedUrl = getEmbedUrl(link);

  // Helper function to format date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className={`rounded-sm shadow-none ring-1 ring-brand-navy/10 hover:ring-brand-navy/25 transition-colors duration-300 border-0 overflow-hidden bg-white ${className}`}>
      <div className="flex flex-col h-full">
        {/* Preview Area */}
        <div className="relative bg-brand-tint/50 overflow-hidden flex items-center justify-center min-h-[220px] h-56">
          {showIframe && embedUrl ? (
            <>
              <iframe
                src={embedUrl}
                title={title}
                width="100%"
                height="100%"
                className="w-full h-56 border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Button
                onClick={() => setShowIframe(false)}
                size="icon"
                variant="secondary"
                className="absolute top-3 right-3 rounded-sm bg-brand-navy/80 hover:bg-brand-navy text-white z-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </>
          ) : isEmbeddable(link) ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${getYouTubeVideoId(link)}/hqdefault.jpg`}
                alt={title}
                className="w-full h-56 object-cover object-center "
                style={{ display: type === "youtube" ? undefined : "none" }}
              />
              <Button
                onClick={() => setShowIframe(true)}
                size="icon"
                variant="secondary"
                className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-brand-navy/80 hover:bg-brand-green text-white z-10"
              >
                <Play className="w-8 h-8" />
              </Button>
              {/* Badge */}
              <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider ${getLinkTypeColor(type)}`}>
                {getLinkTypeLabel(type)}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full py-8">
              <div className="w-14 h-14 bg-white ring-1 ring-brand-navy/10 rounded-sm flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-brand-green" />
              </div>
              <span className={`px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider ${getLinkTypeColor(type)}`}>{getLinkTypeLabel(type)}</span>
            </div>
          )}
        </div>
        {/* Content Area */}
        <CardContent className="flex-1 flex flex-col gap-4 p-6">
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-2 text-brand-navy line-clamp-2 leading-snug">{title}</h3>
            <p className="text-brand-navy/70 text-sm leading-relaxed line-clamp-3">{description}</p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-navy/10">
            <div className="text-xs text-brand-navy/50 font-medium">
              {formatDate(createdAt)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm border-0 bg-white text-brand-navy ring-1 ring-brand-navy/15 shadow-none hover:bg-brand-tint hover:text-brand-navy text-sm font-medium transition-colors"
              onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Link
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
} 