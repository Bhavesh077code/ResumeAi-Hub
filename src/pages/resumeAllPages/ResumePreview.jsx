import { MdEditDocument } from "react-icons/md";
import { BsCloudDownloadFill } from "react-icons/bs";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

function ResumePreview({ htmlPreview, loading, setStep, onDownload }) {
  const iframeRef = useRef(null);
  const [pageUsage, setPageUsage] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  /**
   * Handle Form Focus Trigger
   * Navigates back to step 1 and focuses on the first input field
   */
  const handleFormFocusTrigger = () => {
    if (setStep) {
      setStep(1);
      // Wait for DOM update then focus on first field
      setTimeout(() => {
        const firstField = document.querySelector("input, textarea");
        if (firstField) {
          firstField.focus();
          firstField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  };

  /**
   * Handle Download Resume
   * Triggers the download function passed from parent
   */
  const handleDownload = async () => {
    try {
      if (onDownload) {
        await onDownload();
      } else {
        // Fallback download using iframe content
        const iframe = iframeRef.current;
        if (iframe) {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const content = iframeDoc.documentElement.outerHTML;
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Resume downloaded successfully!");
          }
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download resume");
    }
  };

  /**
   * Check iframe content for overflow
   */
  useEffect(() => {
    const checkOverflow = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc && iframeDoc.body) {
            const hasOverflow = iframeDoc.body.scrollHeight > window.innerHeight;
            setOverflow(hasOverflow);
          }
        } catch (error) {
          // Cross-origin or other errors - ignore
          console.debug("Cannot check iframe overflow:", error);
        }
      }
    };

    // Check after content loads
    const timer = setTimeout(checkOverflow, 1000);
    return () => clearTimeout(timer);
  }, [htmlPreview]);

  /**
   * Handle iframe load event
   */
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <div className="flex flex-col bg-[#f8fafc] h-full overflow-hidden">
      {/* Status Header - Clean and professional */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-3 sm:px-5 py-2 sm:py-3 border-b border-slate-200/50 bg-white/60 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-green-800">
            Live Resume Preview
          </span>
          {loading && (
            <span className="text-[8px] sm:text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-200/40 animate-pulse">
              <span className="hidden xs:inline">Syncing...</span>
              <span className="xs:hidden">⏳</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Edit Resume Button */}
          <button
            onClick={handleFormFocusTrigger}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
          >
            <MdEditDocument size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Edit Resume</span>
            <span className="xs:hidden">Edit</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-sm shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
          >
            <BsCloudDownloadFill size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Download</span>
            <span className="xs:hidden">Save</span>
          </button>
        </div>
      </div>

      {/* Resume Preview Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-2 sm:pb-4 pt-1 sm:pt-0 no-scrollbar">
        {htmlPreview ? (
          <iframe
            ref={iframeRef}
            srcDoc={htmlPreview}
            className="w-full h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)] border-none rounded-lg shadow-inner bg-white"
            sandbox="allow-scripts allow-same-origin allow-modals"
            title="Resume Live Preview"
            onLoad={handleIframeLoad}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-lg border-2 border-dashed border-slate-200">
            <div className="text-center p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">📄</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                No Resume Preview
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
                Fill in your details in the form to see your resume come to life
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Page Usage Indicator - Optional, shown when overflow detected */}
      {overflow && (
        <div className="flex-shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 bg-amber-50 border-t border-amber-200/50">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-amber-700">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Content may exceed one page. Consider adjusting content for better fit.</span>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:flex {
            display: flex;
          }
        }
        @media (min-width: 481px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:flex {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ResumePreview;