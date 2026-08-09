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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // Get user name from localStorage with safe parsing
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    user = userData ? JSON.parse(userData) : {};
  } catch (error) {
    console.error("Error parsing user data:", error);
    user = {};
  }
  const userName = user?.name || "User";

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
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
  const [pageLoading, setPageLoading] = useState(false);

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

  // ============================================================
  // CATEGORIES DATA
  // ============================================================
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

  /**
   * Safely format a number to fixed decimal places
   * Handles null, undefined, string, and number values
   */
  const safeToFixed = (value, decimals = 1) => {
    if (value === null || value === undefined) return "0.0";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return "0.0";
    return num.toFixed(decimals);
  };

  // Stats data with dynamic values - FIXED: safe handling of average
  const stats = [
    { label: "Templates", value: "100+", icon: <Layout size={18} />, color: "text-blue-500" },
    { label: "Users", value: "50+", icon: <Users size={18} />, color: "text-purple-500" },
    { 
      label: "Rating", 
      value: safeToFixed(feedbackStats.average, 1), 
      icon: <Star size={18} />, 
      color: "text-amber-500" 
    },
    { label: "Success Rate", value: "94%", icon: <TrendingUp size={18} />, color: "text-emerald-500" },
  ];

  // ============================================================
  // FETCH ALL FEEDBACK WITH PAGINATION & FILTERS
  // ============================================================
  useEffect(() => {
    fetchAllFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterRating, sortBy]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchAllFeedback();
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  /**
   * Fetch all feedback with pagination and filters
   */
  const fetchAllFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
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
        setFeedbackStats({
          total: data.stats?.total || 0,
          average: data.stats?.average || 0,
          fiveStar: data.stats?.fiveStar || 0,
          fourStar: data.stats?.fourStar || 0,
          threeStar: data.stats?.threeStar || 0,
          twoStar: data.stats?.twoStar || 0,
          oneStar: data.stats?.oneStar || 0,
        });
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
      } else {
        console.error("Error fetching feedback:", data.message);
        if (data.message === "Unauthorized") {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  // ============================================================
  // DELETE FEEDBACK
  // ============================================================
  /**
   * Handle feedback deletion with confirmation
   */
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    
    setDeletingId(feedbackId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await fetch(`${BASE_URL}/feedback/${feedbackId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Feedback deleted successfully");
        // Refresh feedback list
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
  // HELPER FUNCTIONS
  // ============================================================
  /**
   * Get emoji and label based on rating
   */
  const getEmojiByRating = (rating) => {
    if (rating >= 5) return { emoji: "⭐", label: "Excellent", color: "text-emerald-600" };
    if (rating >= 4) return { emoji: "😊", label: "Good", color: "text-blue-600" };
    if (rating >= 3) return { emoji: "😐", label: "Average", color: "text-amber-600" };
    if (rating >= 2) return { emoji: "😕", label: "Below Average", color: "text-orange-600" };
    return { emoji: "😡", label: "Poor", color: "text-red-600" };
  };

  /**
   * Render star rating
   */
  const renderStars = (rating) => {
    if (!rating || rating < 0) return "☆☆☆☆☆";
    const fullStars = Math.min(Math.round(rating), 5);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  };

  /**
   * Format date relative to current time
   */
  const formatDate = (date) => {
    if (!date) return "Recently";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Recently";
      const now = new Date();
      const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diff === 0) return "Today";
      if (diff === 1) return "Yesterday";
      if (diff < 7) return `${diff} days ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return "Recently";
    }
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

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <DashbordNavbar />

      <div className="pt-20 pb-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, <span className="text-blue-600">{userName}</span> 👋
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-0.5 sm:mt-1">
                Choose a template category to start building your professional resume
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1 text-xs sm:text-sm text-gray-500 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-sm border border-gray-200">
                <Sparkles size={14} className="text-amber-400 sm:w-[16px] sm:h-[16px]" />
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`${stat.color} sm:w-[18px] sm:h-[18px]`}>{stat.icon}</div>
                <span className="text-[10px] sm:text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-base sm:text-xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => navigate(`/templates/${cat.slug}`)}
              className={`
                group relative cursor-pointer rounded-2xl p-4 sm:p-6
                bg-white shadow-sm border ${cat.border}
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              `}
            >
              <div className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-xl
                bg-gradient-to-br ${cat.color}
                flex items-center justify-center
                text-white shadow-md
                group-hover:scale-110 group-hover:rotate-3
                transition-all duration-300
              `}>
                {cat.icon}
              </div>
              <div className="mt-3 sm:mt-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 capitalize">
                  {cat.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-all duration-300">
                <span>Explore</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300 sm:w-[16px] sm:h-[16px]" />
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================
            FEEDBACK SECTION - WITH PAGINATION & FILTERS
            ============================================================ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          {/* Feedback Header */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MessageSquare size={18} className="text-blue-600 sm:w-[22px] sm:h-[22px]" />
                <h2 className="text-base sm:text-xl font-bold text-gray-900">User Feedback</h2>
                <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                  {totalItems} total
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <Search size={14} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[16px] sm:h-[16px]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-7 sm:pl-9 pr-2 sm:pr-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm w-full sm:w-32 md:w-48"
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-600"
                >
                  <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                {/* Refresh Button */}
                <button
                  onClick={() => {
                    setPageLoading(true);
                    fetchAllFeedback();
                  }}
                  disabled={loading || pageLoading}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-600 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={`sm:w-[18px] sm:h-[18px] ${(loading || pageLoading) ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Filters Row */}
            {showFilters && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200/50">
                {/* Rating Filter */}
                <select
                  value={filterRating}
                  onChange={(e) => {
                    setFilterRating(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs sm:text-sm bg-white"
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
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs sm:text-sm bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>

                {/* Reset Filters */}
                <button
                  onClick={resetFilters}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Feedback Stats Summary - FIXED: safe toFixed handling */}
          <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50/50 border-b border-gray-200/50">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-medium text-gray-700">⭐ Avg:</span>
                <span className="font-bold text-amber-500">{safeToFixed(feedbackStats.average, 1)}/5</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-gray-300"></div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                <span className="text-emerald-600">5★ {feedbackStats.fiveStar || 0}</span>
                <span className="text-blue-600">4★ {feedbackStats.fourStar || 0}</span>
                <span className="text-amber-600">3★ {feedbackStats.threeStar || 0}</span>
                <span className="text-orange-600">2★ {feedbackStats.twoStar || 0}</span>
                <span className="text-red-600">1★ {feedbackStats.oneStar || 0}</span>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="p-3 sm:p-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader2 size={24} className="animate-spin text-blue-500 sm:w-[32px] sm:h-[32px]" />
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-500">Loading feedback...</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <MessageSquare size={36} className="text-gray-300 mx-auto mb-2 sm:mb-3 sm:w-[48px] sm:h-[48px]" />
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">No Feedback Found</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                  {searchTerm || filterRating !== "all" 
                    ? "Try adjusting your filters" 
                    : "Be the first to share your feedback!"}
                </p>
                {(searchTerm || filterRating !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="mt-2 sm:mt-3 text-blue-600 text-xs sm:text-sm font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {feedbacks.map((fb) => {
                  const emojiInfo = getEmojiByRating(fb.rating);
                  return (
                    <div
                      key={fb._id}
                      className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 sm:p-4 transition-all duration-200 border border-gray-200/50"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        {/* User Avatar */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          {fb.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                              {fb.userId?.name || "Anonymous User"}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-0.5 sm:gap-1">
                              <Clock size={10} className="sm:w-[12px] sm:h-[12px]" />
                              {formatDate(fb.createdAt)}
                            </span>
                            <span className={`text-[10px] sm:text-xs font-medium ${emojiInfo.color} ml-auto`}>
                              {emojiInfo.label}
                            </span>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                            <span className="text-amber-400 text-xs sm:text-sm">
                              {renderStars(fb.rating)}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5 sm:ml-1">
                              ({fb.rating}/5)
                            </span>
                            <span className="text-xs sm:text-sm ml-1 sm:ml-2">
                              {fb.emoji || emojiInfo.emoji}
                            </span>
                          </div>

                          {/* Feedback Text */}
                          {fb.feedback && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-1.5 leading-relaxed">
                              "{fb.feedback}"
                            </p>
                          )}

                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
                            <span className="text-[8px] sm:text-[10px] text-gray-400 bg-white px-1.5 sm:px-2 py-0.5 rounded-full border border-gray-200">
                              📄 {fb.resumeId?.title || "Resume"}
                            </span>
                          </div>
                        </div>

                        {/* Delete Button - Admin only */}
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleDeleteFeedback(fb._id)}
                            disabled={deletingId === fb._id}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 disabled:opacity-50"
                            title="Delete feedback"
                          >
                            {deletingId === fb._id ? (
                              <Loader2 size={14} className="animate-spin sm:w-[16px] sm:h-[16px]" />
                            ) : (
                              <Trash2 size={14} className="sm:w-[16px] sm:h-[16px]" />
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
            <div className="px-3 sm:px-6 py-2 sm:py-3 border-t border-gray-200/50 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                <div className="text-[10px] sm:text-xs text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-sm font-medium transition-all duration-200 ${
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
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pro Tip */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-blue-600 sm:w-[24px] sm:h-[24px]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">💡 Pro Tip</h4>
                <p className="text-[10px] sm:text-sm text-gray-600">Choose a template that matches your industry for better ATS results</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/templates/professional")}
              className="px-4 sm:px-5 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-md shadow-blue-500/20 transition-all duration-300 whitespace-nowrap w-full sm:w-auto"
            >
              View All Templates
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400">
            🚀 Join 50,000+ professionals who landed their dream job with ResumeAI
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="light"
        className="z-50"
      />

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