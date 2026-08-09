
/*
import { useNavigate } from "react-router-dom"

export default function TemplateCard({ template }) {

  const navigate = useNavigate()

  const handleUseTemplate = () => {

    // Navigate to builder with template slug
    navigate("/resume-builder", {
      state: {
        templateSlug: template.slug
      }
    })
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        margin: "10px"
      }}
    >

      <img
        src={template.thumbnail}
        alt={template.name}
        width="250"
      />

      <h2>{template.name}</h2>

      <button onClick={handleUseTemplate}>
        Use Template
      </button>

    </div>
  )
}
  */



/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TemplateCard({ template }) {

  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const handleUseTemplate = () => {
    if(!template?.slug) return
    navigate(`/resume-builder/${template.slug}`, {
    });
  };

  return (

    <>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100  hover:shadow-lg transition ">

    
        <div className="relative">

          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-[300px] object-cover"
          />

          
          <button
            onClick={() => setShowPreview(true)}
            className="
              absolute inset-0
              flex items-center justify-center
              bg-black/0 hover:bg-black/40
              text-white
              transition
            "
          >
            <span className="
              bg-black/90
              text-white
              px-4 py-2.5
              rounded-full
              text-sm
            
            ">
              Tap to Preview
            </span>
          </button>

        </div>


        <div className="p-5">

          
          <h2 className="
            text-lg
            bg-green-100
            text-green-800
            px-20 py-1
            rounded-full
            font-semibold
            text-slate-900
            tracking-tight
            truncate
          ">
            {template.name}
          </h2>

        
          <button
            onClick={handleUseTemplate}
            className="
              mt-4 w-full
              bg-orange-600
              text-white
              py-3
              rounded-xl
              font-semibold
              shadow-md
              active:scale-95
              hover:from-orange-700 hover:to-blue-800
              transition
            "
          >
            Use Template
          </button>

        </div>

      </div>

    
      {showPreview && (

        <div className="
          fixed inset-0
          bg-black/80
          flex items-center justify-center
          z-50
          p-4
        ">

          <div
            onClick={() => setShowPreview(false)}
            className="absolute inset-0"
          />

          <div className="
            relative
            max-w-4xl
            w-full
            bg-white
            rounded-2xl
            overflow-hidden
            shadow-2xl
            z-10
          ">

            <button
              onClick={() => setShowPreview(false)}
              className="
                absolute top-3 right-3
                bg-white
                text-black
                w-10 h-10
                rounded-full
                shadow-md
                font-bold
              "
            >
              ✕
            </button>

            <img
              src={template.thumbnail}
              alt={template.name}
              className="
                w-full
                max-h-[85vh]
                object-contain
                bg-white
              "
            />

          </div>

        </div>

      )}

    </>

  );
}
*/








import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Sparkles, ArrowRight, CheckCircle, Download, Star, X } from "lucide-react";

export default function TemplateCard({ template }) {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const previewRef = useRef(null);

  // SAFETY CHECK + CLEAN NAVIGATION
  const handleUseTemplate = () => {
    if (!template?.slug) {
      console.error("Template slug missing");
      return;
    }
    navigate(`/resume-builder/${template.slug}`);
  };

  // SAFETY CHECK FOR IMAGE
  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/600x800?text=Template+Preview";
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  // Handle card click - open preview
  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return;
    }
    setShowPreview(true);
  };

  // Close preview on ESC key
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
      }
    };
  }, [showPreview]);

  // Prevent body scroll and fix cursor when preview is open
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
      document.body.style.cursor = 'default';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.cursor = 'auto';
    };
  }, [showPreview]);

  return (
    <>
      <div
        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
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
              aria-label={`Preview ${template?.name}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className={`transform transition-all duration-500 bg-white/95 backdrop-blur-sm text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-1 sm:gap-2 hover:scale-105 hover:bg-white ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ willChange: 'transform, opacity' }}
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
            aria-label={`Use ${template?.name} template`}
            onClick={(e) => {
              e.stopPropagation();
              handleUseTemplate();
            }}
            className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base group/btn relative z-10"
          >
            <span>Use Template</span>
            <ArrowRight size={16} sm:size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL - 100% FIXED */}
      {showPreview && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg p-4"
          style={{ 
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPreview(false);
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-all duration-200"
            style={{ cursor: 'pointer' }}
          >
            <X size={24} />
          </button>

          {/* Template Name */}
          <div className="absolute top-4 left-4 z-50">
            <h3 className="text-xl font-bold text-white select-none">{template?.name || "Template"}</h3>
            <p className="text-sm text-white/50 select-none">{template?.category || "Resume Template"}</p>
          </div>

          {/* Image */}
          <div className="relative z-10 w-full max-w-5xl max-h-[85vh] flex items-center justify-center">
            <img
              src={template?.thumbnail}
              alt={template?.name || "Template Preview"}
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
              onClick={() => setShowPreview(false)}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200 text-sm font-medium"
              style={{ cursor: 'pointer' }}
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                handleUseTemplate();
              }}
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
    </>
  );
}