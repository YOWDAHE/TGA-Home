"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Play,
  ArrowUp,
  Phone,
  Mail,
  MessageCircle,
  Home,
  User,
  Award,
} from "lucide-react"
import PracticeAreaCarousel from "@/components/practice-area-carousel"

export default function LandingPage() {
  const [currentPartner, setCurrentPartner] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const partners = [
    { name: "Commercial Bank of Ethiopia", logo: "/placeholder.svg?height=80&width=120" },
    { name: "Yingke Law Firm", logo: "/placeholder.svg?height=80&width=120" },
    { name: "African Union", logo: "/placeholder.svg?height=80&width=120" },
    { name: "Woda Metal Industry", logo: "/placeholder.svg?height=80&width=120" },
    { name: "American Bar Association", logo: "/placeholder.svg?height=80&width=120" },
    { name: "International Association", logo: "/placeholder.svg?height=80&width=120" },
    { name: "Asian Exporters Chamber", logo: "/placeholder.svg?height=80&width=120" },
    { name: "Diamond Hotel", logo: "/placeholder.svg?height=80&width=120" },
    { name: "China Civil Engineering", logo: "/placeholder.svg?height=80&width=120" },
    { name: "Reed Smith", logo: "/placeholder.svg?height=80&width=120" },
    { name: "USP Banking", logo: "/placeholder.svg?height=80&width=120" },
    { name: "Yemen Bank", logo: "/placeholder.svg?height=80&width=120" },
  ]

  const newsItems = [
    {
      id: 1,
      title: "Latest Legal Updates in Ethiopian Business Law",
      description:
        "Stay informed about the recent changes in Ethiopian business regulations and their impact on international investments.",
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "International Arbitration Trends in Africa",
      description:
        "Exploring the growing importance of arbitration in resolving commercial disputes across African markets.",
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      title: "Construction Law Developments",
      description:
        "Recent developments in construction law and their implications for infrastructure projects in Ethiopia.",
      thumbnail: "/placeholder.svg?height=100&width=150",
    },
  ]

  const resources = [
    { title: "Legal Framework Guide", type: "PDF" },
    { title: "Investment Opportunities", type: "PDF" },
    { title: "Compliance Checklist", type: "PDF" },
    { title: "Contract Templates", type: "PDF" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPartner((prev) => (prev + 4) % partners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [partners.length])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const nextPartners = () => {
    setCurrentPartner((prev) => (prev + 4) % partners.length)
  }

  const prevPartners = () => {
    setCurrentPartner((prev) => (prev - 4 + partners.length) % partners.length)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-teal-500 text-white px-3 py-2 rounded font-bold text-xl">TG&A</div>
              <span className="text-gray-700 font-medium">LAW GROUP</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#" className="text-teal-500 font-medium hover:text-teal-600">
                Home
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-teal-500">
                About
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-teal-500">
                Our service
              </Link>
              <Link href="#resources" className="text-gray-700 hover:text-teal-500">
                Resources
              </Link>
              <Link href="#news" className="text-gray-700 hover:text-teal-500">
                News
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 inline-block border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="bg-gradient-to-r from-teal-400 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-3xl shadow-lg">
                TG&A
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold tracking-wide">TGA LAW GROUP</div>
                <div className="text-sm text-teal-200 font-medium">EFFICIENCY • INTEGRITY • PROFESSIONALISM</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            COMMITTED TO A{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              ROBUST BUSINESS AND INVESTMENT
            </span>{" "}
            ENVIRONMENT
            <br />
            <span className="text-3xl md:text-4xl text-gray-300">IN ETHIOPIA AND AFRICA</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Legal Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl backdrop-blur-sm bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                ABOUT US
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <p className="text-xl text-gray-700 mb-8 leading-relaxed text-center max-w-4xl mx-auto">
                TG&A Law Group is a premier legal practice committed to excellence in serving our clients across
                Ethiopia and Africa. Our experienced team combines deep local knowledge with international expertise to
                deliver comprehensive legal solutions.
              </p>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Leadership & Expertise</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Executive Board member of The Ethiopian Lawyers' Association",
                      "Head of Publication and International Relations Committee",
                      "Advisor to the Committee of Intelligence for Security Services of Africa CISSA",
                      "Board member of the State Infrastructure Transparency Initiative",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Professional Affiliations</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Member of Advisory Council for the Federal Supreme Court of Ethiopia",
                      "Member of the Board for Law & Justice Institute of Ethiopia",
                      "Council member of Joined-up Justice High level forum",
                      "Certified Trademark Agent by the Ethiopian Intellectual Property Office",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { number: "100s", label: "Corporate clients", icon: "👥" },
              { number: ">120", label: "Partner and Affiliate Firms", icon: "🤝" },
              { number: ">52", label: "Countries", icon: "🌍" },
              { number: "4", label: "Continents", icon: "🗺️" },
              { number: ">50", label: "Advisors", icon: "⚖️" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="py-20 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">OUR SERVICES</h2>
            <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "RETENTION AND ONGOING LEGAL SUPPORT",
                content:
                  "We have been successful in being able to retain huge national and multi-national corporations as retentions clients by offering a quality ongoing legal support, including International organizations as we combine Seasoned lawyers in various fields of Law.",
                icon: "🛡️",
              },
              {
                title: "REPRESENTATION",
                content:
                  "We have the best litigation lawyers in the Ethiopian Legal Landscape in minefield areas of the law including taxation, Contracts, Investment disputes, Construction Issues and Criminal Law.",
                icon: "⚖️",
              },
              {
                title: "CONSULTING AND ADVISORY",
                content:
                  "As a trusted advisor and considerable role in transactional matters, we have been helping corporations and business individuals navigate various aspects business transactions including Merger and Acquisitions, Due diligence, Contract Negotiation and Drafting, and Compliance.",
                icon: "💼",
              },
              {
                title: "CONTRACT MANAGEMENT AND ARBITRATION",
                content:
                  "As a trusted advisor our office has been consulting and representing plentiful number of corporations and business entities in their contractual matters with 3rd Parties with a view to enable them have a robust contract management scheme.",
                icon: "📋",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-6">{service.title}</h3>
                <p className="leading-relaxed text-white/90">{service.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">PRACTICE AREAS</h2>
          <p className="text-xl text-gray-600 mb-12">WE PROVIDE A QUALITY LEGAL SERVICE WITH CREATIVE SOLUTIONS</p>

          <PracticeAreaCarousel />
        </div>
      </section>

      {/* News and Resources */}
      <section id="news" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Latest News */}
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    LATEST NEWS
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
                </div>
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  See more
                </Button>
              </div>
              <p className="text-gray-600 mb-10 text-lg">Follow the latest news in the industry here.</p>

              <div className="space-y-6">
                {newsItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg bg-white rounded-2xl"
                  >
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative w-40 h-28 bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center rounded-l-2xl">
                          <div className="absolute inset-0 bg-black/20 rounded-l-2xl"></div>
                          <Play className="text-white w-10 h-10 relative z-10 drop-shadow-lg" />
                        </div>
                        <div className="p-6 flex-1">
                          <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{item.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">RESOURCES</h2>
                    <div className="w-16 h-1 bg-white/50 rounded-full"></div>
                  </div>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl shadow-lg">
                    See more
                  </Button>
                </div>
                <p className="mb-10 text-white/90 text-lg">Look through our articles and updates here.</p>

                <div className="space-y-6">
                  {resources.map((resource, index) => (
                    <Card
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="mr-6 flex-shrink-0">
                            <div className="bg-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-lg">
                              <FileText className="text-orange-500 w-8 h-8" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold mb-2 text-lg">{resource.title}</h3>
                            <p className="text-sm text-white/80 leading-relaxed">
                              Essential legal resources for your business needs
                            </p>
                          </div>
                          <div className="ml-4">
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
                              PDF
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              OUR PARTNERS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 text-lg">Trusted by leading organizations worldwide</p>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center space-x-8 mb-12">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPartners}
                className="rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 w-14 h-14 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 max-w-5xl">
                {partners.slice(currentPartner, currentPartner + 4).map((partner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
                  >
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      width={120}
                      height={80}
                      className="max-w-full h-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextPartners}
                className="rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 w-14 h-14 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex justify-center space-x-3">
              {Array.from({ length: Math.ceil(partners.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    Math.floor(currentPartner / 4) === index
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 scale-125 shadow-lg"
                      : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                  }`}
                  onClick={() => setCurrentPartner(index * 4)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              CONTACT US
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 text-lg">Get in touch for premium legal services</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Get in touch with us for premium business service, we will promptly respond to all your enquiries.
              </p>

              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="remark" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="remark"
                    placeholder="Tell us about your legal needs..."
                    rows={5}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg font-semibold">
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Phone, label: "Phone", value: "+123 456 7890", color: "from-blue-500 to-blue-600" },
                  { icon: Mail, label: "Email", value: "info@example.com", color: "from-green-500 to-green-600" },
                  {
                    icon: MessageCircle,
                    label: "WhatsApp",
                    value: "+123 456 7890",
                    color: "from-emerald-500 to-emerald-600",
                  },
                  {
                    icon: Home,
                    label: "Our Office",
                    value: "123 Main Street, City, Country",
                    color: "from-purple-500 to-purple-600",
                  },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-gray-500 font-semibold mb-2">{contact.label}</h3>
                    <p className="text-gray-900 font-bold">{contact.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256613498!2d-73.98784492426362!3d40.75079657138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1689211354242!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-3xl"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-teal-500 text-white px-3 py-2 rounded font-bold text-xl">TG&A</div>
                <span className="font-medium">LAW GROUP</span>
              </div>
              <p className="text-gray-400">Committed to excellence in legal services across Ethiopia and Africa.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Legal Consulting
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contract Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Arbitration
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Construction Law
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Addis Ababa, Ethiopia</p>
                <p>info@tgalawgroup.com</p>
                <p>+251 11 XXX XXXX</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TG&A Law Group. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
  )
}
