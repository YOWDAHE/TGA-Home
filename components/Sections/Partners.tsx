import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Partner } from "@/app/types/landing";
import Image from "next/image";
import { convertToApiUrl } from "@/lib/utils";
import { InfiniteCarousel, CarouselItem } from "@/components/ui/infinite-carousel";

interface PartnersProps {
  partners: Partner[];
}

const Partners = React.memo(function Partners({ partners }: PartnersProps) {
  // Memoize the partners array to prevent unnecessary re-renders
  const memoizedPartners = useMemo(() => partners, [partners]);

  return (
    <section className="py-20 bg-[#f6f7f8] relative overflow-hidden min-h-[800px] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            OUR PARTNERS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Trusted by leading organizations worldwide
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center space-x-8 mb-12">

            {/* Custom Infinite Carousel */}
            <div className="flex-1 max-w-5xl">
              <InfiniteCarousel
                speed={10}
                direction="left"
                pauseOnHover={true}
                className="w-full"
                itemClassName="px-4"
              >
                {memoizedPartners.map((partner) => (
                  <CarouselItem key={partner.id}>
                    <div className="flex items-center justify-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group h-[200px] w-[200px] my-10 mb-20">
                      <Image
                        src={convertToApiUrl(partner.logo_url) || "/placeholder.svg"}
                        alt={partner.name}
                        width={120}
                        height={80}
                        className="max-w-full h-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </InfiniteCarousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Partners;
