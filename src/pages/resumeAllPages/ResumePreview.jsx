import { MdEditDocument } from "react-icons/md";
import { BsCloudDownloadFill } from "react-icons/bs";
import React, { useEffect, useRef, useState } from "react";

function ResumePreview({ htmlPreview, loading, setStep }) {
  const iframeRef = useRef(null);
  const [pageUsage, setPageUsage] = useState(0);
  const [overflow, setOverflow] = useState(false);
  //Edit Icon click hone par Step 1 par le jaane ke liye
  const handleFormFocusTrigger = () => {
    if (setStep) {
      setStep(1);
      setTimeout(() => {
        const firstField = document.querySelector("input, textarea");
        if (firstField) {
          firstField.focus();
          firstField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  return (
    <div className="hidden lg:flex flex-col bg-[#f8fafc] h-full overflow-hidden">
      {/* Clean Minimal Status Header - Patla aur professional spacing */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-slate-200/50 bg-white/60 backdrop-blur-md flex-shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-green-800">
          Live Resume Preview
        </span>
        {loading && (
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/40 animate-pulse">
            Syncing...
          </span>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={handleFormFocusTrigger}
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
          >
            <MdEditDocument size={18} />
            Edit Resume
          </button>

        </div>
      </div>

      {/* 🚀 FIXED: Resume top par hi rahega (pt-0) aur scroll bilkul normal aur smooth chalega bina scrollbar dikhe */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-0 no-scrollbar">
        <iframe
          srcDoc={htmlPreview}
          className="w-full h-[calc(100vh-100px)] border-none"
          sandbox="allow-scripts"
          title="Resume Live Preview"
        />
      </div>
    </div>
  );
}

export default ResumePreview;
