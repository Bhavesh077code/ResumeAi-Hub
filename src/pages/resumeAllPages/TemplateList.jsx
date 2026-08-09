import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Sparkles, Grid, Layout, FileText, ChevronRight, Briefcase, Shield, ArrowRight, Eye, X } from "lucide-react"

import BASE_URL from "../../api"
import axios from "axios"
import DashbordNavbar from "../../components/navbar/DashbordNavbar"

export default function TemplateList() {
  // Get Category from URL
  const { category } = useParams()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  // Fetch Templates on Category Change
  useEffect(() => {
    fetchTemplates()
  }, [category])

  // Fetch Templates Function
  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/create/templates?category=${category}`)
      setTemplates(res.data.templates)
    } catch (error) {
      console.log("Failed to fetch templates")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Open Preview
  const openPreview = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
    document.body.style.overflow = 'hidden'
    document.body.style.cursor = 'default'
  }

  // Close Preview
  const closePreview = () => {
    setShowPreview(false)
    setSelectedTemplate(null)
    document.body.style.overflow = 'unset'
    document.body.style.cursor = 'auto'
  }

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showPreview) {
        closePreview()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
      document.body.style.cursor = 'auto'
    }
  }, [showPreview])

  // Get category icon and color
  const getCategoryInfo = (cat) => {
    const categories = {
      professional: { icon: <Briefcase size={20} />, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50", label: "Professional" },
      modern: { icon: <Sparkles size={20} />, color: "from-purple-500 to-pink-600", bg: "bg-purple-50", label: "Modern" },
      creative: { icon: <Layout size={20} />, color: "from-orange-500 to-red-600", bg: "bg-orange-50", label: "Creative" },
      simple: { icon: <FileText size={20} />, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", label: "Simple" },
      tech: { icon: <Grid size={20} />, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50", label: "Tech" },
      executive: { icon: <Shield size={20} />, color: "from-gray-700 to-gray-900", bg: "bg-gray-50", label: "Executive" },
      minimalist: { icon: <Grid size={20} />, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50", label: "Minimalist" },
    }
    return categories[cat?.toLowerCase()] || categories.professional
  }

  const categoryInfo = getCategoryInfo(category)

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/600x800?text=Template+Preview"
  }

  // Navigate to builder
  const handleUseTemplate = (template) => {
    if (!template?.slug) {
      console.error("Template slug missing")
      return
    }
    closePreview()
    // Navigate to resume builder
    window.location.href = `/resume-builder/${template.slug}`
  }

  // Template Card Component
  const TemplateCard = ({ template }) => {
    const [isHovered, setIsHovered] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseEnter = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setIsHovered(false), 150)
    }

    return (
      <div
        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => openPreview(template)}
      >
        {/* Popular Badge */}
        {template?.popular && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg pointer-events-none">
            <Star size={10} sm:size={12} fill="currentColor" />
            <span className="hidden xs:inline">Popular</span>
            <span className="xs:hidden">Pop</span>
          </div>
        )}

        {/* Premium Badge */}
        {template?.premium && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-orange-500 to-orange-700 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg pointer-events-none">
            <Sparkles size={10} sm:size={12} />
            <span className="hidden xs:inline">Premium</span>
            <span className="xs:hidden">Pro</span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
          <img
            src={template?.thumbnail}
            alt={template?.name || "Resume Template"}
            loading="lazy"
            onError={handleImageError}
            className={`w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[340px] object-cover transition-all duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            style={{ willChange: 'transform' }}
          />

          {/* Overlay with Preview Button */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 flex items-center justify-center ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ willChange: 'opacity' }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openPreview(template)
              }}
              className={`transform transition-all duration-500 bg-white/95 backdrop-blur-sm text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-1 sm:gap-2 hover:scale-105 hover:bg-white ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <Eye size={16} sm:size={18} />
              <span className="hidden xs:inline">Preview Template</span>
              <span className="xs:hidden">Preview</span>
            </button>
          </div>

          {/* Category Tag */}
          {template?.category && (
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/60 backdrop-blur-sm text-white/90 text-[8px] sm:text-[10px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 pointer-events-none">
              {template.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5 bg-white">
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate flex items-center gap-1 sm:gap-2">
                <span className="truncate">{template?.name || "Untitled Template"}</span>
                {template?.verified && (
                  <CheckCircle size={14} sm:size={16} className="text-orange-500 flex-shrink-0" />
                )}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1 hidden xs:block">
                {template?.description || "Professional Resume Template"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
            {template?.downloads && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Download size={12} sm:size={14} />
                <span>{template.downloads.toLocaleString()}</span>
              </div>
            )}
            {template?.rating && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-orange-400 text-[10px] sm:text-xs">★</span>
                <span>{template.rating}</span>
              </div>
            )}
            {template?.uses && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs">👤</span>
                <span>{template.uses.toLocaleString()} uses</span>
              </div>
            )}
          </div>

          {/* Features Tags */}
          {template?.features && template.features.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
              {template.features.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="text-[8px] sm:text-[10px] font-medium text-orange-700 bg-orange-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-orange-100"
                >
                  {feature}
                </span>
              ))}
              {template.features.length > 2 && (
                <span className="text-[8px] sm:text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-orange-100">
                  +{template.features.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Use Template Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleUseTemplate(template)
            }}
            className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base group/btn relative z-10"
          >
            <span>Use Template</span>
            <ArrowRight size={16} sm:size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <DashbordNavbar />

      <div className="pt-20 pb-10 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* HEADER with Gradient Background */}
        <div className="relative mb-6 sm:mb-8 md:mb-10 overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 md:p-10 shadow-2xl border border-white/5">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 sm:w-48 h-40 sm:h-48 bg-gradient-to-tr from-blue-500/20 to-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 w-full">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/50 mb-2 sm:mb-3 overflow-x-auto scrollbar-hide">
                <Link to="/dashboard" className="hover:text-white transition-colors whitespace-nowrap">Home</Link>
                <ChevronRight size={12} sm:size={14} className="flex-shrink-0" />
                <Link to="/templates" className="hover:text-white transition-colors whitespace-nowrap">Templates</Link>
                <ChevronRight size={12} sm:size={14} className="flex-shrink-0" />
                <span className="text-white/80 font-medium capitalize truncate">{category || "All"}</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${categoryInfo.color} shadow-lg flex-shrink-0`}>
                  {categoryInfo.icon}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white capitalize truncate">
                    {category || "All"} Templates
                  </h1>
                  <p className="text-white/50 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 truncate">
                    {templates.length} premium {category} resume templates
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 border border-white/10 flex-shrink-0">
              <div className="text-center">
                <div className="text-white font-bold text-base sm:text-lg md:text-2xl">{templates.length}</div>
                <div className="text-white/40 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">Templates</div>
              </div>
              <div className="w-px h-6 sm:h-8 md:h-10 bg-white/10"></div>
              <div className="text-center">
                <div className="text-white font-bold text-base sm:text-lg md:text-2xl">4.9</div>
                <div className="text-white/40 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">Rating</div>
              </div>
              <div className="w-px h-6 sm:h-8 md:h-10 bg-white/10"></div>
              <div className="text-center">
                <div className="text-white font-bold text-base sm:text-lg md:text-2xl">10K+</div>
                <div className="text-white/40 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">Downloads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-6 sm:mb-8 overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
          <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
            {['Professional', 'Modern', 'Creative', 'Simple', 'Executive', 'Minimalist'].map((cat) => (
              <Link
                key={cat}
                to={`/templates/${cat.toLowerCase()}`}
                className={`px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  category?.toLowerCase() === cat.toLowerCase()
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-gray-100 border border-gray-200/50 hover:border-orange-200'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 animate-pulse">
                <div className="h-[180px] xs:h-[200px] sm:h-[250px] md:h-[280px] bg-gradient-to-b from-gray-200 to-gray-100"></div>
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 sm:h-10 bg-gray-200 rounded-xl mt-2 sm:mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : templates.length > 0 ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard key={template._id} template={template} />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl sm:rounded-3xl py-12 sm:py-16 md:py-20 text-center shadow-lg">
            <div className="flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-center mb-4">
                <Sparkles size={28} sm:size={36} className="text-orange-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">No templates found</h2>
              <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base max-w-md">
                We couldn't find any templates in this category. Try another category or check back later.
              </p>
              <Link
                to="/templates/professional"
                className="mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                View All Templates
                <ArrowRight size={16} sm:size={18} />
              </Link>
            </div>
          </div>
        )}

        {/* Footer Note */}
        {templates.length > 0 && !loading && (
          <div className="mt-8 sm:mt-10 md:mt-12 text-center">
            <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <span>🚀</span>
              <span>All templates are ATS-friendly and optimized for recruiters</span>
              <span className="hidden xs:inline">•</span>
              <span className="text-orange-500 font-medium">500+ downloads this week</span>
            </p>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL - FIXED */}
      {showPreview && selectedTemplate && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4"
          style={{ cursor: 'default' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePreview()
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-all duration-200"
            style={{ cursor: 'pointer' }}
          >
            <X size={24} />
          </button>

          {/* Template Name */}
          <div className="absolute top-4 left-4 z-50">
            <h3 className="text-xl font-bold text-white select-none">{selectedTemplate?.name || "Template"}</h3>
            <p className="text-sm text-white/50 select-none">{selectedTemplate?.category || "Resume Template"}</p>
          </div>

          {/* Image */}
          <div className="relative z-10 w-full max-w-5xl max-h-[85vh] flex items-center justify-center">
            <img
              src={selectedTemplate?.thumbnail}
              alt={selectedTemplate?.name || "Template Preview"}
              onError={handleImageError}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
              draggable="false"
              style={{ 
                pointerEvents: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            />
          </div>

          {/* Bottom Buttons */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4">
            <button
              onClick={closePreview}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200 text-sm font-medium"
              style={{ cursor: 'pointer' }}
            >
              Close
            </button>
            <button
              onClick={() => handleUseTemplate(selectedTemplate)}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 transition-all duration-200 flex items-center gap-2 text-sm"
              style={{ cursor: 'pointer' }}
            >
              Use This Template
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Hint */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/20 text-xs hidden sm:block select-none">
            Click outside to close • ESC to exit
          </div>
        </div>
      )}

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

// Import missing icons
import { Star, Download, CheckCircle } from "lucide-react"
import { useRef } from "react"