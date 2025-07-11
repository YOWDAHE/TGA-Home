"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Folder, Download, Eye, TrendingUp } from "lucide-react"

interface Resource {
  id: number
  title: string
  category: string
  type: string
  description: string
  downloadCount: number
  viewCount: number
  dateAdded: string
  featured?: boolean
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const resources: Resource[] = [
    {
      id: 1,
      title: "Ethiopian Business Law Guide",
      category: "Legal Framework",
      type: "PDF",
      description: "Comprehensive guide to Ethiopian business regulations and compliance requirements.",
      downloadCount: 1250,
      viewCount: 3420,
      dateAdded: "2024-01-15",
      featured: true,
    },
    {
      id: 2,
      title: "Investment Opportunities in Ethiopia",
      category: "Investment",
      type: "PDF",
      description: "Detailed analysis of investment sectors and opportunities in Ethiopian markets.",
      downloadCount: 980,
      viewCount: 2890,
      dateAdded: "2024-01-10",
      featured: true,
    },
    {
      id: 3,
      title: "Construction Contract Templates",
      category: "Construction Law",
      type: "PDF",
      description: "Standard contract templates for construction projects in Ethiopia.",
      downloadCount: 750,
      viewCount: 2100,
      dateAdded: "2024-01-08",
    },
    {
      id: 4,
      title: "Tax Compliance Checklist",
      category: "Tax Law",
      type: "PDF",
      description: "Essential checklist for tax compliance in Ethiopian business operations.",
      downloadCount: 650,
      viewCount: 1850,
      dateAdded: "2024-01-05",
    },
    {
      id: 5,
      title: "Intellectual Property Protection Guide",
      category: "IP Law",
      type: "PDF",
      description: "Guide to protecting intellectual property rights in Ethiopia and Africa.",
      downloadCount: 520,
      viewCount: 1650,
      dateAdded: "2024-01-03",
    },
    {
      id: 6,
      title: "Corporate Governance Framework",
      category: "Corporate Law",
      type: "PDF",
      description: "Best practices for corporate governance in Ethiopian companies.",
      downloadCount: 480,
      viewCount: 1420,
      dateAdded: "2024-01-01",
    },
    {
      id: 7,
      title: "International Trade Regulations",
      category: "Trade Law",
      type: "PDF",
      description: "Overview of international trade regulations affecting Ethiopian businesses.",
      downloadCount: 420,
      viewCount: 1280,
      dateAdded: "2023-12-28",
    },
    {
      id: 8,
      title: "Employment Law Updates",
      category: "Employment Law",
      type: "PDF",
      description: "Recent updates to Ethiopian employment law and labor regulations.",
      downloadCount: 380,
      viewCount: 1150,
      dateAdded: "2023-12-25",
    },
    {
      id: 9,
      title: "Banking and Finance Regulations",
      category: "Financial Law",
      type: "PDF",
      description: "Regulatory framework for banking and financial services in Ethiopia.",
      downloadCount: 350,
      viewCount: 980,
      dateAdded: "2023-12-20",
    },
    {
      id: 10,
      title: "Environmental Compliance Guide",
      category: "Environmental Law",
      type: "PDF",
      description: "Environmental regulations and compliance requirements for businesses.",
      downloadCount: 320,
      viewCount: 890,
      dateAdded: "2023-12-18",
    },
    {
      id: 11,
      title: "Arbitration Procedures Manual",
      category: "Dispute Resolution",
      type: "PDF",
      description: "Comprehensive manual on arbitration procedures in Ethiopian law.",
      downloadCount: 290,
      viewCount: 780,
      dateAdded: "2023-12-15",
    },
    {
      id: 12,
      title: "Real Estate Law Handbook",
      category: "Property Law",
      type: "PDF",
      description: "Legal handbook covering real estate transactions and property rights.",
      downloadCount: 260,
      viewCount: 720,
      dateAdded: "2023-12-12",
    },
  ]

  const categories = [
    "All",
    "Legal Framework",
    "Investment",
    "Construction Law",
    "Tax Law",
    "IP Law",
    "Corporate Law",
    "Trade Law",
    "Employment Law",
    "Financial Law",
    "Environmental Law",
    "Dispute Resolution",
    "Property Law",
  ]

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, resources])

  const mostVisited = useMemo(() => {
    return [...resources].sort((a, b) => b.viewCount - a.viewCount).slice(0, 6)
  }, [resources])

  const handleDownload = (resource: Resource) => {
    // Simulate download
    console.log(`Downloading ${resource.title}`)
  }

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
              <Link href="/resources" className="text-teal-500 font-medium">
                Resources
              </Link>
              <Link href="#" className="text-gray-700 hover:text-teal-500">
                News
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-teal-500 text-white p-6 rounded-lg sticky top-8">
              <h1 className="text-3xl font-bold mb-6">RESOURCES</h1>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-200 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-teal-200 focus:bg-white/30"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Folder className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center ${
                        selectedCategory === category
                          ? "bg-white/20 text-white"
                          : "text-teal-100 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{category}</span>
                      {category !== "All" && (
                        <Badge variant="secondary" className="ml-auto bg-white/20 text-teal-100 text-xs">
                          {resources.filter((r) => r.category === category).length}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Most Visited Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
                <h2 className="text-2xl font-bold text-gray-900">Most Visited</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mostVisited.slice(0, 6).map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow border-teal-100">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="bg-orange-500 text-white p-2 rounded-lg mr-3">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{resource.viewCount.toLocaleString()} views</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        className="w-full bg-teal-500 hover:bg-teal-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Results Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Results {searchTerm && `for "${searchTerm}"`}</h2>
                <div className="text-sm text-gray-500">
                  {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} found
                </div>
              </div>

              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredResources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow group">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div className="bg-orange-500 text-white p-4 rounded-lg inline-flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <FileText className="w-8 h-8" />
                          </div>
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                            {resource.type}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                        <div className="flex items-center justify-center text-xs text-gray-500 mb-4 space-x-4">
                          <div className="flex items-center">
                            <Download className="w-3 h-3 mr-1" />
                            {resource.downloadCount}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {resource.viewCount}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleDownload(resource)}
                          className="w-full bg-teal-500 hover:bg-teal-600"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
