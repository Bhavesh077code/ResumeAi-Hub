/*
import { useNavigate } from "react-router-dom"

export default function Dashboard() {

  const navigate = useNavigate()

  const categories = [
    "simple",
    "professional",
    "creative",
    "tech"
  ]

  return (
  <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4">

    <h1 className="text-4xl font-bold text-slate-800 mb-10 tracking-wide">
      Resume Categories
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">

      {
        categories.map((cat) => (

          <button
            key={cat}
            onClick={() => navigate(`/templates/${cat}`)}
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              p-6
              text-xl
              font-semibold
              capitalize
              text-slate-700
              shadow-md
              hover:shadow-2xl
              hover:-translate-y-1
              hover:bg-gradient-to-r
              hover:from-blue-600
              hover:to-indigo-600
              hover:text-white
              transition-all
              duration-300
            "
          >
            {cat}
          </button>

        ))
      }

    </div>

  </div>
)
}

*/




import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  FileText, Briefcase, Palette, Code, Sparkles, ArrowRight, 
  Layout, Eye, Users, Star, TrendingUp, Award, MessageSquare, 
  ThumbsUp, Heart, Smile, Meh, Frown, 
  ChevronRight, Clock, User as UserIcon, Search, Filter,
  ChevronLeft, ChevronDown, Trash2, CheckCircle, XCircle,
  AlertCircle, Loader2, RefreshCw
} from "lucide-react";
import DashbordNavbar from "../../components/navbar/DashbordNavbar";
import BASE_URL from "../../api";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();

  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "User";

  // Feedback state
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    average: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    {
      name: "Simple",
      slug: "simple",
      desc: "Clean and minimal resume style",
      icon: <FileText size={24} />,
      color: "from-gray-600 to-gray-800",
      iconColor: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200"
    },
    {
      name: "Professional",
      slug: "professional",
      desc: "Corporate and job-ready design",
      icon: <Briefcase size={24} />,
      color: "from-blue-500 to-indigo-600",
      iconColor: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      name: "Creative",
      slug: "creative",
      desc: "Modern and eye-catching layouts",
      icon: <Palette size={24} />,
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
    {
      name: "Tech",
      slug: "tech",
      desc: "Developer focused resume style",
      icon: <Code size={24} />,
      color: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    },
  ];

  const stats = [
    { label: "Templates", value: "100+", icon: <Layout size={18} />, color: "text-blue-500" },
    { label: "Users", value: "50+", icon: <Users size={18} />, color: "text-purple-500" },
    { label: "Rating", value: feedbackStats.average || "3.9", icon: <Star size={18} />, color: "text-amber-500" },
    { label: "Success Rate", value: "94%", icon: <TrendingUp size={18} />, color: "text-emerald-500" },
  ];

  // ============================================================
  // FETCH ALL FEEDBACK WITH PAGINATION & FILTERS
  // ============================================================
  useEffect(() => {
    fetchAllFeedback();
  }, [currentPage, filterRating, sortBy, searchTerm]);

  const fetchAllFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Build query params
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);
      params.append("sort", sortBy);
      if (filterRating !== "all") params.append("rating", filterRating);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`${BASE_URL}/feedback/all?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedbacks(data.feedbacks || []);
        setFeedbackStats(data.stats || {
          total: 0,
          average: 0,
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        });
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
      } else {
        console.error("Error fetching feedback:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DELETE FEEDBACK
  // ============================================================
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    
    setDeletingId(feedbackId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/feedback/${feedbackId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Feedback deleted successfully");
        fetchAllFeedback();
      } else {
        toast.error(data.message || "Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete feedback");
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // GET EMOJI BY RATING
  // ============================================================
  const getEmojiByRating = (rating) => {
    if (rating >= 5) return { emoji: "⭐", label: "Excellent", color: "text-emerald-600" };
    if (rating >= 4) return { emoji: "😊", label: "Good", color: "text-blue-600" };
    if (rating >= 3) return { emoji: "😐", label: "Average", color: "text-amber-600" };
    if (rating >= 2) return { emoji: "😕", label: "Below Average", color: "text-orange-600" };
    return { emoji: "😡", label: "Poor", color: "text-red-600" };
  };

  // ============================================================
  // GET STAR DISPLAY
  // ============================================================
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  // ============================================================
  // PAGINATION HANDLERS
  // ============================================================
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // ============================================================
  // RESET FILTERS
  // ============================================================
  const resetFilters = () => {
    setSearchTerm("");
    setFilterRating("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <DashbordNavbar />

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, <span className="text-blue-600">{userName}</span> 👋
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Choose a template category to start building your professional resume
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <Sparkles size={16} className="text-amber-400" />
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-gray-900 mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => navigate(`/templates/${cat.slug}`)}
              className={`
                group relative cursor-pointer rounded-2xl p-6
                bg-white shadow-sm border ${cat.border}
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              `}
            >
              <div className={`
                w-12 h-12 rounded-xl
                bg-gradient-to-br ${cat.color}
                flex items-center justify-center
                text-white shadow-md
                group-hover:scale-110 group-hover:rotate-3
                transition-all duration-300
              `}>
                {cat.icon}
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-bold text-gray-900 capitalize">
                  {cat.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-all duration-300">
                <span>Explore</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================
            FEEDBACK SECTION - WITH PAGINATION & FILTERS
            ============================================================ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          {/* Feedback Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={22} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">User Feedback</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {totalItems} total
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm w-32 sm:w-48"
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-600"
                >
                  <Filter size={18} />
                </button>

                {/* Refresh Button */}
                <button
                  onClick={fetchAllFeedback}
                  disabled={loading}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-600 disabled:opacity-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Filters Row */}
            {showFilters && (
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-200/50">
                {/* Rating Filter */}
                <select
                  value={filterRating}
                  onChange={(e) => {
                    setFilterRating(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">⭐ 5 Star</option>
                  <option value="4">⭐ 4 Star</option>
                  <option value="3">⭐ 3 Star</option>
                  <option value="2">⭐ 2 Star</option>
                  <option value="1">⭐ 1 Star</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>

                {/* Reset Filters */}
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Feedback Stats Summary */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50/50 border-b border-gray-200/50">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">⭐ Avg:</span>
                <span className="font-bold text-amber-500">{feedbackStats.average || 0}/5</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600">5★ {feedbackStats.fiveStar}</span>
                <span className="text-blue-600">4★ {feedbackStats.fourStar}</span>
                <span className="text-amber-600">3★ {feedbackStats.threeStar}</span>
                <span className="text-orange-600">2★ {feedbackStats.twoStar}</span>
                <span className="text-red-600">1★ {feedbackStats.oneStar}</span>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="p-4 sm:p-6 max-h-[600px] overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <span className="ml-3 text-gray-500">Loading feedback...</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-700">No Feedback Found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || filterRating !== "all" 
                    ? "Try adjusting your filters" 
                    : "Be the first to share your feedback!"}
                </p>
                {(searchTerm || filterRating !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((fb) => {
                  const emojiInfo = getEmojiByRating(fb.rating);
                  return (
                    <div
                      key={fb._id}
                      className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 border border-gray-200/50"
                    >
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {fb.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">
                              {fb.userId?.name || "Anonymous User"}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(fb.createdAt)}
                            </span>
                            <span className={`text-xs font-medium ${emojiInfo.color} ml-auto`}>
                              {emojiInfo.label}
                            </span>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-amber-400 text-sm">
                              {renderStars(fb.rating)}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              ({fb.rating}/5)
                            </span>
                            <span className="text-sm ml-2">
                              {fb.emoji || emojiInfo.emoji}
                            </span>
                          </div>

                          {/* Feedback Text */}
                          {fb.feedback && (
                            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                              "{fb.feedback}"
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                              📄 {fb.resumeId?.title || "Resume"}
                            </span>
                          </div>
                        </div>

                        {/* Delete Button - Admin only */}
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleDeleteFeedback(fb._id)}
                            disabled={deletingId === fb._id}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 disabled:opacity-50"
                            title="Delete feedback"
                          >
                            {deletingId === fb._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-200/50 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === currentPage
                          ? "bg-blue-600 text-white shadow-sm"
                          : "hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pro Tip */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">💡 Pro Tip</h4>
                <p className="text-sm text-gray-600">Choose a template that matches your industry for better ATS results</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/templates/professional")}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-500/20 transition-all duration-300 whitespace-nowrap"
            >
              View All Templates
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            🚀 Join 50,000+ professionals who landed their dream job with ResumeAI
          </p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}