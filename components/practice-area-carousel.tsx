"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PracticeArea {
  title: string
  items: string[]
}

export default function PracticeAreaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2) // Start with middle item

  const practiceAreas: PracticeArea[] = [
    {
      title: "CONSTRUCTION LAW",
      items: [
        "Contract Drafting & Review",
        "Dispute Resolution",
        "Regulatory Compliance",
        "Project Management Legal Support",
        "International Construction Projects",
      ],
    },
    {
      title: "CORPORATE LAW",
      items: [
        "Business Formation",
        "Mergers & Acquisitions",
        "Corporate Governance",
        "Compliance & Regulations",
        "International Business Transactions",
      ],
    },
    {
      title: "INVESTMENT LAW",
      items: [
        "Foreign Direct Investment",
        "Investment Structuring",
        "Regulatory Compliance",
        "Investment Disputes",
        "Cross-border Transactions",
      ],
    },
    {
      title: "LITIGATION",
      items: [
        "Civil Litigation",
        "Commercial Disputes",
        "Arbitration",
        "Mediation",
        "International Dispute Resolution",
      ],
    },
    {
      title: "INTELLECTUAL PROPERTY",
      items: [
        "Trademark Registration",
        "Patent Applications",
        "Copyright Protection",
        "IP Litigation",
        "Licensing & Agreements",
      ],
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % practiceAreas.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [practiceAreas.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? practiceAreas.length - 1 : prevIndex - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % practiceAreas.length)
  }

  const getVisibleItems = () => {
    const items = []
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + practiceAreas.length) % practiceAreas.length
      items.push({
        ...practiceAreas[index],
        position: i,
        index: index,
      })
    }
    return items
  }

  const getItemStyles = (position: number) => {
    const absPosition = Math.abs(position)

    if (position === 0) {
      // Center item
      return {
        transform: "translateX(0) scale(1.05) translateZ(0)",
        opacity: 1,
        zIndex: 50,
        filter: "none",
        boxShadow: "0 8px 32px 0 rgba(0, 255, 200, 0.15), 0 2px 8px 0 rgba(0,0,0,0.10)",
        transition: "transform 0.5s cubic-bezier(.4,2,.6,1), box-shadow 0.3s",
        width: "100%",
        height: "auto",
      }
    } else if (absPosition === 1) {
      // Adjacent items
      return {
        transform: `translateX(${position * 55}%) scale(0.8) translateZ(-80px)`,
        opacity: 0.5,
        zIndex: 20,
        filter: "blur(2px) grayscale(0.3)",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
        transition: "transform 0.5s cubic-bezier(.4,2,.6,1), filter 0.3s",
        width: "80%",
        height: "80%",
      }
    } else {
      // Far items
      return {
        transform: `translateX(${position * 80}%) scale(0.6) translateZ(-200px)`,
        opacity: 0.2,
        zIndex: 5,
        filter: "blur(4px) grayscale(0.7)",
        boxShadow: "none",
        transition: "transform 0.5s cubic-bezier(.4,2,.6,1), filter 0.3s",
        width: "60%",
        height: "60%",
      }
    }
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <div
        className="relative h-96 flex items-center justify-center bg-gradient-to-r from-gray-50 to-white rounded-3xl shadow-2xl"
        style={{ perspective: "1000px" }}
      >
        {getVisibleItems().map((item, idx) => {
          const styles = getItemStyles(item.position)

          return (
            <div
              key={`${item.index}-${idx}`}
              className={`absolute transition-all duration-700 ease-out cursor-pointer select-none ${item.position === 0 ? "hover:scale-105" : ""}`}
              style={{
                ...styles,
                transformStyle: "preserve-3d",
              }}
              onClick={() => item.position !== 0 && goToSlide(item.index)}
            >
              <div
                className={`bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 shadow-2xl border transition-all duration-300 ${
                  item.position === 0
                    ? "border-2 border-teal-400 shadow-teal-400/25 ring-2 ring-teal-200/30 hover:shadow-lg hover:ring-4"
                    : "border-slate-700"
                } ${item.position !== 0 ? "pointer-events-auto" : ""}`}
              >
                <h3 className={`font-bold mb-6 text-center ${item.position === 0 ? "text-3xl" : "text-lg"}`}>
                  {item.title}
                </h3>
                <ul className={`space-y-3 ${item.position === 0 ? "text-lg" : "text-sm"}`}>
                  {item.items.map((listItem, index) => (
                    <li key={index} className="text-center flex items-center justify-center">
                      <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                      {listItem}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}

        {/* Enhanced Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/80 hover:bg-white border-2 border-teal-400 text-teal-600 hover:text-teal-700 shadow-lg hover:scale-110 transition-all duration-200 w-10 h-10 md:w-12 md:h-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/80 hover:bg-white border-2 border-teal-400 text-teal-600 hover:text-teal-700 shadow-lg hover:scale-110 transition-all duration-200 w-10 h-10 md:w-12 md:h-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Enhanced Dots Indicator */}
      <div className="flex justify-center space-x-3 mt-8">
        {practiceAreas.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-teal-400 ${
              index === currentIndex
                ? "bg-gradient-to-r from-teal-400 to-emerald-400 scale-125 shadow-lg animate-pulse"
                : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Practice Area Labels */}
      <div className="flex justify-center mt-6">
        <div className="text-center bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {practiceAreas[currentIndex].title}
          </h4>
          <p className="text-sm text-gray-500 mt-2">Click on side panels to explore other practice areas</p>
        </div>
      </div>

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .h-96 { height: 18rem !important; }
          .p-8 { padding: 1.25rem !important; }
          .text-3xl { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}
