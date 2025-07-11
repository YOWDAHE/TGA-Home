"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, Play, TrendingUp, ChevronRight, User, Share2, Bookmark } from "lucide-react"

interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: string
  views: number
  category: string
  featured: boolean
  image: string
  trending?: boolean
}

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  publishDate: string
  channel: string
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const articles: Article[] = [
    {
      id: 1,
      title: "New Ethiopian Investment Law Reforms Boost Foreign Direct Investment",
      excerpt:
        "The Ethiopian government has introduced comprehensive reforms to investment laws, creating new opportunities for international businesses and streamlining regulatory processes.",
      content: "Full article content here...",
      author: "Dr. Alemayehu Tadesse",
      publishDate: "2024-01-15",
      readTime: "5 min read",
      views: 2450,
      category: "Investment Law",
      featured: true,
      image: "/placeholder.svg?height=400&width=600",
      trending: true,
    },
    {
      id: 2,
      title: "Construction Sector Legal Framework Updates in Ethiopia",
      excerpt:
        "Recent amendments to construction laws aim to improve project delivery timelines and enhance quality standards across the Ethiopian construction industry.",
      content: "Full article content here...",
      author: "Ato Bekele Mekonnen",
      publishDate: "2024-01-12",
      readTime: "7 min read",
      views: 1890,
      category: "Construction Law",
      featured: true,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Corporate Governance Best Practices for Ethiopian Companies",
      excerpt:
        "A comprehensive guide to implementing effective corporate governance structures that comply with Ethiopian regulations and international standards.",
      content: "Full article content here...",
      author: "W/ro Hanan Ahmed",
      publishDate: "2024-01-10",
      readTime: "6 min read",
      views: 1650,
      category: "Corporate Law",
      featured: false,
      image: "/placeholder.svg?height=300&width=400",
      trending: true,
    },
    {
      id: 4,
      title: "Intellectual Property Protection Strategies in Africa",
      excerpt:
        "Exploring effective methods for protecting intellectual property rights across African markets, with focus on Ethiopian IP law developments.",
      content: "Full article content here...",
      author: "Dr. Sarah Johnson",
      publishDate: "2024-01-08",
      readTime: "8 min read",
      views: 1420,
      category: "IP Law",
      featured: false,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 5,
      title: "Tax Law Changes Impact on Small and Medium Enterprises",
      excerpt:
        "Analysis of recent tax law modifications and their implications for SMEs operating in Ethiopia's growing economy.",
      content: "Full article content here...",
      author: "Ato Dawit Haile",
      publishDate: "2024-01-05",
      readTime: "4 min read",
      views: 1280,
      category: "Tax Law",
      featured: false,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 6,
      title: "Environmental Law Compliance for Industrial Projects",
      excerpt:
        "Understanding environmental regulations and compliance requirements for large-scale industrial developments in Ethiopia.",
      content: "Full article content here...",
      author: "Dr. Meron Teshome",
      publishDate: "2024-01-03",
      readTime: "9 min read",
      views: 1150,
      category: "Environmental Law",
      featured: false,
      image: "/placeholder.svg?height=300&width=400",
      trending: true,
    },
  ]

  const videos: Video[] = [
    {
      id: 1,
      title: "Legal Insights: Ethiopian Business Law Updates",
      description:
        "Our senior partners discuss the latest developments in Ethiopian business law and their impact on international investments.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "15:32",
      views: "12K",
      publishDate: "2024-01-14",
      channel: "TG&A Law Group",
    },
    {
      id: 2,
      title: "Construction Law Webinar: Contract Management",
      description:
        "Comprehensive webinar covering best practices in construction contract management and dispute resolution.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "28:45",
      views: "8.5K",
      publishDate: "2024-01-11",
      channel: "TG&A Law Group",
    },
    {
      id: 3,
      title: "Investment Opportunities in Ethiopian Markets",
      description: "Expert panel discussion on emerging investment opportunities and regulatory landscape in Ethiopia.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "22:18",
      views: "15K",
      publishDate: "2024-01-09",
      channel: "TG&A Law Group",
    },
    {
      id: 4,
      title: "IP Law Masterclass: Trademark Protection",
      description:
        "Detailed masterclass on trademark registration and protection strategies in Ethiopian and African markets.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "35:20",
      views: "6.2K",
      publishDate: "2024-01-06",
      channel: "TG&A Law Group",
    },
  ]

  const categories = [
    "All",
    "Investment Law",
    "Construction Law",
    "Corporate Law",
    "IP Law",
    "Tax Law",
    "Environmental Law",
  ]

  const featuredArticles = articles.filter((article) => article.featured)
  const latestArticles = [...articles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  )
  const topArticles = [...articles].sort((a, b) => b.views - a.views)
  const trendingArticles = articles.filter((article) => article.trending)

  const filteredArticles =
    selectedCategory === "All" ? articles : articles.filter((article) => article.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-teal-500 text-white px-3 py-2 rounded font-bold text-xl">TG&A</div>
              <span className="text-gray-700 font-medium">LAW GROUP</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-teal-500">
                Home
              </Link>
              <Link href="#" className="text-gray-700 hover:text-teal-500">
                About
              </Link>
              <Link href="#" className="text-gray-700 hover:text-teal-500">
                Our service
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-teal-500">
                Resources
              </Link>
              <Link href="/news" className="text-teal-500 font-medium">
                News
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">NEWS</h1>
          <p className="text-xl text-gray-600">Stay updated with the latest legal insights and industry developments</p>
        </div>

        {/* Featured Articles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Stories</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredArticles.slice(0, 2).map((article, index) => (
              <Card
                key={article.id}
                className={`overflow-hidden hover:shadow-xl transition-shadow ${index === 0 ? "lg:col-span-1" : ""}`}
              >
                <div className="relative">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-teal-500">{article.category}</Badge>
                  {article.trending && (
                    <Badge className="absolute top-4 right-4 bg-red-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button className="bg-teal-500 hover:bg-teal-600">
                      Read More
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Latest Articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">LATEST</h2>
              <Button variant="outline" className="text-teal-500 border-teal-500 bg-transparent">
                View All
              </Button>
            </div>
            <div className="space-y-6">
              {latestArticles.slice(0, 5).map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-32 h-24 flex-shrink-0">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          width={128}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <Badge variant="outline" className="text-xs mb-2">
                          {article.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <span>{article.author}</span>
                          <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Articles Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">TOP</h2>
            <div className="space-y-4">
              {topArticles.slice(0, 6).map((article, index) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{article.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views.toLocaleString()}
                          </span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Articles */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-red-500" />
              TRENDING
            </h2>
            <div className="space-y-4">
              {trendingArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-xs mb-2 text-red-600 border-red-200">
                      {article.category}
                    </Badge>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Other News (Videos) Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">OTHER NEWS</h2>
            <Button variant="outline" className="text-teal-500 border-teal-500 bg-transparent">
              View All Videos
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="bg-red-600 text-white rounded-full p-3 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6" />
                    </div>
                  </div>
                  <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">{video.duration}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.channel}</span>
                    <div className="flex items-center space-x-2">
                      <span>{video.views} views</span>
                      <span>{new Date(video.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Filter */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-teal-500 hover:bg-teal-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 6).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-teal-500">{article.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
