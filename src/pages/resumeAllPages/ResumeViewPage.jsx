import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdEditDocument,
  MdArrowBack,
  MdContentCopy,
  MdCheck,
  MdStar,
  MdStarBorder,
  MdSend,
} from "react-icons/md";
import { BsCloudDownloadFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { FiUser, FiCalendar, FiFileText } from "react-icons/fi";
import { Sparkles, Loader2, AlertCircle, Eye, Download } from "lucide-react";
import BASE_URL from "../../api";
import DashbordNavbar from "../../components/navbar/DashbordNavbar";
import { toast } from "react-toastify";

function ResumeViewPage() {
  const { category: urlCategory, templateSlug, slug: urlSlug, id } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  // State variables
  const [htmlPreview, setHtmlPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Feedback states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmoji, setFeedbackEmoji] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  /**
   * Get category by slug
   */
  const getCategoryBySlug = (tSlug) => {
    if (!tSlug) return "professional";
    const lowerSlug = tSlug.toLowerCase();
    if (lowerSlug.startsWith("tech")) return "tech";
    if (lowerSlug.startsWith("simple")) return "simple";
    if (lowerSlug.startsWith("creative")) return "creative";
    return "professional";
  };

  // ============================================================
  // 1. LOAD RESUME DATA
  // ============================================================
  useEffect(() => {
    const fetchSavedResumeHTML = async () => {
      if (!id) {
        toast.error("Resume ID not found");
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view this resume");
          navigate("/login");
          return;
        }

        const res = await fetch(`${BASE_URL}/resume/resume/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            toast.error("Resume not found");
          } else if (res.status === 401) {
            toast.error("Please login again");
            navigate("/login");
          } else {
            toast.error(`Error: ${res.status}`);
          }
          setLoading(false);
          return;
        }

        const result = await res.json();

        if (result.success && result.data) {
          const resumeData = result.data;

          setResumeTitle(resumeData.title || "My Resume");
          setOwnerName(resumeData.content?.fullName || "User");
          setCreatedAt(resumeData.createdAt || new Date().toISOString());

          const finalSlug = resumeData.templateSlug || urlSlug || templateSlug || "simple";
          const detectedCategory = urlCategory || getCategoryBySlug(finalSlug);

          setPdfUrl(resumeData.pdfUrl || "");

          // Generate preview
          const previewRes = await fetch(`${BASE_URL}/create/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: detectedCategory,
              slug: finalSlug,
              data: {
                ...resumeData.content,
                image: resumeData.image || "",
              },
            }),
          });

          const previewResult = await previewRes.json();
          if (previewRes.ok && previewResult.success) {
            const rawHtml = previewResult.html;

            const cleanHtml = rawHtml.includes("</head>")
              ? rawHtml.replace(
                  "</head>",
                  `<style>
                    ::-webkit-scrollbar { display: none !important; } 
                    html, body { 
                      margin: 0 !important; 
                      padding: 0 !important; 
                      overflow-y: auto !important;
                      overflow-x: hidden !important;
                      scrollbar-width: none;
                      -ms-overflow-style: none;
                      background: white !important;
                    }
                  </style></head>`
                )
              : `<style>
                  ::-webkit-scrollbar { display: none !important; } 
                  html, body { overflow-y: auto !important; overflow-x: hidden !important; scrollbar-width: none; }
                </style>${rawHtml}`;

            setHtmlPreview(cleanHtml);
          } else {
            toast.error("Failed to generate preview");
          }
        } else {
          toast.error(result.message || "Failed to load resume");
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        toast.error("Failed to load resume. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedResumeHTML();
  }, [id, urlSlug, templateSlug, urlCategory, navigate]);

  // ============================================================
  // 2. DOWNLOAD RESUME AS HTML/PDF
  // ============================================================
  /**
   * Download resume as HTML file
   */
  const downloadResumeHTML = async () => {
    if (!htmlPreview) {
      toast.error("No content to download");
      return;
    }

    setDownloading(true);
    try {
      // Create download link
      const blob = new Blob([htmlPreview], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeTitle || 'resume'}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Resume downloaded successfully! 📄");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download resume");
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Download resume as PDF (using print)
   */
  const downloadResumePDF = () => {
    if (!htmlPreview) {
      toast.error("No content to download");
      return;
    }

    setDownloading(true);
    try {
      // Open print dialog for PDF
      const iframe = document.getElementById('resume-iframe');
      if (iframe) {
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
          iframeWindow.focus();
          iframeWindow.print();
          toast.info("Use 'Save as PDF' in the print dialog");
        }
      }
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  /**
   * Download using PDF URL if available
   */
  const downloadResumePDFUrl = async () => {
    if (!pdfUrl) {
      toast.error("PDF not available");
      return;
    }

    setDownloading(true);
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeTitle || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully! 📄");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // 3. COPY PDF LINK
  // ============================================================
  const copyPdfLink = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl);
      setCopySuccess(true);
      toast.success("PDF link copied!");
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link");
    }
  };

  // ============================================================
  // 4. SUBMIT FEEDBACK
  // ============================================================
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.warning("Please give a rating!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to submit feedback");
        navigate("/login");
        return;
      }

      const res = await fetch(`${BASE_URL}/feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeId: id,
          rating,
          feedback: feedbackText,
          emoji: feedbackEmoji,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedbackSubmitted(true);
        toast.success("Thank you for your feedback! 🙏");
      } else {
        toast.error(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // 5. EMOJI OPTIONS
  // ============================================================
  const emojiOptions = [
    { emoji: "😍", label: "Love it" },
    { emoji: "😊", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😕", label: "Not good" },
    { emoji: "😡", label: "Bad" },
  ];

  // ============================================================
  // 6. LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-500 text-sm font-medium">Loading your resume...</div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 7. MAIN RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <DashbordNavbar />

      <div className="pt-20 pb-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-xl bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all duration-300 shadow-sm border border-gray-200/50"
              aria-label="Go back to dashboard"
            >
              <MdArrowBack size={18} className="sm:w-[20px] sm:h-[20px]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={20} className="text-amber-400 flex-shrink-0 sm:w-[24px] sm:h-[24px]" />
                <span className="truncate">{resumeTitle || "My Resume"}</span>
              </h1>
              <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1">
                  <FiUser size={12} className="sm:w-[14px] sm:h-[14px]" />
                  {ownerName || "User"}
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} className="sm:w-[14px] sm:h-[14px]" />
                  {createdAt ? new Date(createdAt).toLocaleDateString() : "Recent"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left - Resume Preview */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 py-2 sm:py-3 bg-gray-50/50 border-b border-gray-200/50">
                <div className="flex items-center gap-2">
                  <FiFileText size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Resume Preview</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-0">A4 Format</span>
              </div>
              <div className="p-2 sm:p-4 bg-gray-100/50 flex items-center justify-center max-h-[600px] sm:max-h-[800px] overflow-y-auto no-scrollbar">
                <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-lg overflow-hidden">
                  {htmlPreview ? (
                    <iframe
                      id="resume-iframe"
                      ref={iframeRef}
                      srcDoc={htmlPreview}
                      className="w-full h-[600px] sm:h-[800px] lg:h-[900px] border-none"
                      sandbox="allow-scripts allow-print"
                      title="Resume Preview"
                      style={{ background: 'white' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] sm:h-[600px] text-gray-400">
                      <AlertCircle size={36} className="sm:w-[48px] sm:h-[48px]" />
                      <p className="mt-3 sm:mt-4 text-xs sm:text-sm">Preview not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Controls Panel */}
          <div className="lg:w-[320px] xl:w-[340px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden sticky top-24">
              {/* Panel Header */}
              <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                <div className="flex items-center gap-2">
                  <IoSettingsOutline className="text-gray-600" />
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm">Document Controls</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                {/* Download Options */}
                <div>
                  <label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 sm:mb-3">
                    Download Resume
                  </label>
                  
                  <div className="space-y-2">
                    {/* Download HTML */}
                    <button
                      onClick={downloadResumeHTML}
                      disabled={downloading || !htmlPreview}
                      className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <BsCloudDownloadFill size={16} />
                      )}
                      {downloading ? "Downloading..." : "Download HTML"}
                    </button>

                    {/* Download PDF - Option 1: Print */}
                    <button
                      onClick={downloadResumePDF}
                      disabled={downloading || !htmlPreview}
                      className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {downloading ? "Generating..." : "Save as PDF"}
                    </button>

                    {/* Download PDF - Option 2: From URL */}
                    {pdfUrl && (
                      <button
                        onClick={downloadResumePDFUrl}
                        disabled={downloading}
                        className="w-full py-2 sm:py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-gray-500/25 hover:shadow-gray-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <MdContentCopy size={16} />
                        )}
                        {downloading ? "Downloading..." : "Download PDF (Server)"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200/50"></div>

                {/* PDF Link Options */}
                {pdfUrl && (
                  <div>
                    <label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 sm:mb-3">
                      Share & Link
                    </label>
                    
                    <div className="bg-gray-50 rounded-xl p-2 sm:p-3 mb-2 sm:mb-3">
                      <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium mb-1">PDF URL</p>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-[10px] sm:text-xs break-all hover:underline"
                      >
                        {pdfUrl}
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={openPdfInBrowser}
                        className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                      >
                        <Eye size={14} />
                        Open PDF
                      </button>
                      <button
                        onClick={copyPdfLink}
                        className="flex-1 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                      >
                        {copySuccess ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                        {copySuccess ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200/50"></div>

                {/* ============================================================
                    USER FEEDBACK SECTION
                    ============================================================ */}
                <div>
                  <label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2 sm:mb-3">
                    Share Your Feedback
                  </label>

                  {feedbackSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 text-center">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🙏</div>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-700">Thank You!</p>
                      <p className="text-[10px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-1">Your feedback helps us improve</p>
                    </div>
                  ) : (
                    <>
                      {/* Rating Stars */}
                      <div className="mb-2 sm:mb-3">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">How would you rate this template?</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="text-xl sm:text-2xl transition-all duration-200 hover:scale-110 focus:outline-none"
                              aria-label={`Rate ${star} stars`}
                            >
                              {star <= (hoverRating || rating) ? (
                                <MdStar className="text-amber-400" />
                              ) : (
                                <MdStarBorder className="text-gray-300" />
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5 sm:mt-1">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent!"}
                        </p>
                      </div>

                      {/* Emoji Feedback */}
                      <div className="mb-2 sm:mb-3">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">How do you feel about this resume?</p>
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          {emojiOptions.map((item) => (
                            <button
                              key={item.emoji}
                              onClick={() => setFeedbackEmoji(item.emoji)}
                              className={`p-1.5 sm:p-2 rounded-lg text-base sm:text-xl transition-all duration-200 ${
                                feedbackEmoji === item.emoji
                                  ? "bg-blue-100 border-2 border-blue-400 scale-110"
                                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                              }`}
                              title={item.label}
                              aria-label={item.label}
                            >
                              {item.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback Text */}
                      <div className="mb-2 sm:mb-3">
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="What do you think? Any suggestions for improvement?"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm resize-none"
                          rows="2 sm:rows-3"
                          maxLength="500"
                        />
                        <p className="text-[8px] sm:text-[10px] text-gray-400 text-right">
                          {feedbackText.length}/500
                        </p>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={isSubmitting || rating === 0}
                        className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <MdSend size={16} />
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                      </button>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200/50"></div>

                {/* Back to Dashboard */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <MdArrowBack size={16} />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-[10px] sm:text-sm text-gray-400 flex items-center justify-center gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Your link is safe
          </p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        iframe { background: white; }
        
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default ResumeViewPage;