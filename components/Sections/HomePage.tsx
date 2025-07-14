"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import AboutUs from "@/components/Sections/AboutUs";
import Hero from "@/components/Sections/Hero";
import Header from "@/components/Sections/Header";
import Statistics from "@/components/Sections/Statistics";
import Services from "@/components/Sections/Services";
import Partners from "@/components/Sections/Partners";
import News from "@/components/Sections/News";
import PracticeAreas from "@/components/Sections/PracticeAreas";
import ContactUs from "@/components/Sections/ContactUs";
import Footer from "@/components/Sections/Footer";
import { Stat, Partner, Practice, ContactUs as ContactUsType, NewsLink, LandingData } from "@/app/types/landing";

interface LandingPageProps {
  data: {
    landing: LandingData;
    stats: Stat[];
    partners: Partner[];
    practices: Practice[];
    contactUs: ContactUsType[];
    newsLinks: NewsLink[];
  };
}

export default function LandingPage({ data }: LandingPageProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white relative">
      <Header />
      <Hero />
      <AboutUs />
      <Statistics stats={data.stats} />
      <Services />
      <PracticeAreas practices={data.practices} />
      <News />
      <Partners partners={data.partners} />
      <ContactUs contactUs={data.contactUs} />
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white shadow-lg z-50"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
