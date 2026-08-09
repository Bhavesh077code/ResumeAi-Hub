import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Sparkles, ArrowRight, CheckCircle, Download, Star, X } from "lucide-react";
import { toast } from "react-toastify";

/**
 * TemplateCard Component
 * Displays a resume template card with preview and navigation functionality
 * 
 * @param {Object} props
 * @param {Object} props.template - Template data object
 * @param {string} props.template.slug - Unique identifier for the template
 * @param {string} props.template.name - Template name
 * @param {string} props.template.thumbnail - Thumbnail image URL
 * @param {string} props.template.description - Template description
 * @param {string} props.template.category - Template category
 * @param {boolean} props.template.popular - Popular badge flag
 * @param {boolean} props.template.premium - Premium badge flag
 * @param {boolean} props.template.verified - Verified badge flag
 * @param {number} props.template.downloads - Number of downloads
 * @param {number} props.template.rating - Rating value
 * @param {number} props.template.uses - Number of uses
 * @param {string[]} props.template.features - Array of feature tags
 */
export default function TemplateCard({ template }) {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const timeoutRef = useRef(null);
  const previewRef = useRef(null);
  const cardRef = useRef(null);

  /**
   * Handle navigation to resume builder with template
   */
  const handleUseTemplate = () => {
    if (!template?.slug) {
      console.error("Template slug missing");
      toast.error("Template not found");
      return;
    }
    navigate(`/resume-builder/${template.slug}`);
  };

  /**
   * Handle image loading error with fallback
   */
  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/600x800?text=Template+Preview";
    e.target.onerror = null; // Prevent infinite loop
  };

  /**
   * Handle image load success
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  /**
   * Handle mouse enter with clear timeout
   */
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  /**
   * Handle mouse leave with debounce
   */
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  /**
   * Handle card click - open preview modal
   */
  const handleCardClick = (e) => {
    // Don't open preview if clicking on button
    if (e.target.closest('button')) {
      return;
    }
    setShowPreview(true);
  };

  /**
   * Handle modal background click to close
   */
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPreview(false);
    }
  };

  /**
   * Close preview on ESC key
   */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showPreview) {
        setShowPreview(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [showPreview]);

  /**
   * Prevent body scroll when preview is open
   */
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
      document.body.style.cursor = 'default';
    } else {
      document.body.style.overflow = '';
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.cursor = '';
    };
  }, [showPreview]);

  // Safe template data with defaults
  const templateName = template?.name || "Untitled Template";
  const templateCategory = template?.category || "Resume Template";
  const templateSlug = template?.slug || "";

  return (
    <>
      <div
        ref={cardRef}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View ${templateName} template`}
      >
        {/* Popular Badge */}
        {template?.popular && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg pointer-events-none">
            <Star size={10} className="sm:w-[12px] sm:h-[12px]" fill="currentColor" />
            <span className="hidden xs:inline">Popular</span>
            <span className="xs:hidden">Pop</span>
          </div>
        )}

        {/* Premium Badge */}
        {template?.premium && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-700 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg pointer-events-none">
            <Sparkles size={10} className="sm:w-[12px] sm:h-[12px]" />
            <span className="hidden xs:inline">Premium</span>
            <span className="xs:hidden">Pro</span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={template?.thumbnail || "https://via.placeholder.com/600x800?text=Template"}
            alt={`${templateName} resume template preview`}
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`w-full h-[180px] xs:h-[220px] sm:h-[280px] md:h-[340px] object-cover transition-all duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ willChange: 'transform' }}
            draggable="false"
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
              aria-label={`Preview ${templateName}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className={`transform transition-all duration-500 bg-white/95 backdrop-blur-sm text-gray-900 px-3 sm:px-6 py-1.5 sm:py-3 rounded-full text-[10px] sm:text-sm font-semibold shadow-2xl flex items-center gap-1 sm:gap-2 hover:scale-105 hover:bg-white ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ willChange: 'transform, opacity' }}
            >
              <Eye size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Preview Template</span>
              <span className="xs:hidden">Preview</span>
            </button>
          </div>

          {/* Category Tag */}
          {templateCategory && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white/90 text-[8px] sm:text-[10px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 pointer-events-none">
              {templateCategory}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5 bg-white">
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate flex items-center gap-1 sm:gap-2">
                <span className="truncate">{templateName}</span>
                {template?.verified && (
                  <CheckCircle size={14} className="text-orange-500 flex-shrink-0 sm:w-[16px] sm:h-[16px]" />
                )}
              </h2>
              <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 line-clamp-1 hidden xs:block">
                {template?.description || "Professional Resume Template"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
            {template?.downloads && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Download size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span>{template.downloads.toLocaleString()}</span>
              </div>
            )}
            {template?.rating && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-orange-400 text-[10px] sm:text-xs">★</span>
                <span>{template.rating.toFixed(1)}</span>
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
            aria-label={`Use ${templateName} template`}
            onClick={(e) => {
              e.stopPropagation();
              handleUseTemplate();
            }}
            className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] text-white py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base group/btn relative z-10"
          >
            <span>Use Template</span>
            <ArrowRight size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL - Fully Responsive */}
      {showPreview && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg p-2 sm:p-4"
          style={{ 
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleModalClick}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-all duration-200"
            aria-label="Close preview"
            style={{ cursor: 'pointer' }}
          >
            <X size={18} className="sm:w-[24px] sm:h-[24px]" />
          </button>

          {/* Template Name */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50 pointer-events-none">
            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white select-none">
              {templateName}
            </h3>
            <p className="text-[10px] sm:text-sm text-white/50 select-none">
              {templateCategory}
            </p>
          </div>

          {/* Image */}
          <div className="relative z-10 w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
            <img
              src={template?.thumbnail || "https://via.placeholder.com/600x800?text=Template"}
              alt={`${templateName} preview`}
              onError={handleImageError}
              className="w-full h-auto max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg shadow-2xl select-none"
              draggable="false"
              style={{ 
                pointerEvents: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            />
          </div>

          {/* Bottom Buttons */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-wrap gap-2 sm:gap-4 justify-center w-full px-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-3 sm:px-6 py-1.5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200 text-[10px] sm:text-sm font-medium"
              style={{ cursor: 'pointer' }}
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                handleUseTemplate();
              }}
              className="px-3 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 transition-all duration-200 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm"
              style={{ cursor: 'pointer' }}
            >
              <span>Use This Template</span>
              <ArrowRight size={14} className="sm:w-[16px] sm:h-[16px]" />
            </button>
          </div>

          {/* Hint - Hidden on mobile */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-white/20 text-[10px] sm:text-xs hidden sm:block select-none">
            Click outside to close • ESC to exit
          </div>
        </div>
      )}
    </>
  );
}