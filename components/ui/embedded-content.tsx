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
    case "youtube": return "bg-red-400 text-white";
    case "vimeo": return "bg-blue-400 text-white";
    case "dailymotion": return "bg-yellow-400 text-white";
    case "ted": return "bg-orange-400 text-white";
    case "website": return "bg-gray-400 text-white";
    default: return "bg-gray-300 text-gray-700";
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
    <Card className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white ${className}`}>
      <div className="flex flex-col h-full">
        {/* Preview Area */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center min-h-[220px] h-56">
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
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white z-10"
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white z-10 shadow-lg"
              >
                <Play className="w-8 h-8" />
              </Button>
              {/* Badge */}
              <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm ${getLinkTypeColor(type)}`}>
                {getLinkTypeLabel(type)}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <LinkIcon className="w-8 h-8 text-gray-500" />
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${getLinkTypeColor(type)}`}>{getLinkTypeLabel(type)}</span>
            </div>
          )}
        </div>
        {/* Content Area */}
        <CardContent className="flex-1 flex flex-col gap-4 p-6">
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 leading-tight">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-medium">
              {formatDate(createdAt)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:border-teal-700 text-sm font-semibold rounded-lg transition-all duration-200"
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