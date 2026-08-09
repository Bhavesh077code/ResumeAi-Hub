import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StepNavigation({
  step,
  setStep,
  handleSubmit,
  loading,
  handleCreateNew,
}) {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  const handleGenerate = async () => {
    if (loading) return;

    const result = await handleSubmit();

    // Agar resume successfully generate hua
    if (result?.success) {
      setResumeUrl(result.resumeUrl);
      setShowSuccess(true);
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      navigate(resumeUrl);
    }
  };

  const handleNewResume = () => {
    setShowSuccess(false);
    setResumeUrl("");

    if (handleCreateNew) {
      handleCreateNew();
    }
  };

  return (
    <>
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">

        {/* Previous */}
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
            disabled={loading}
          >
            Previous
          </button>
        )}

        {/* Next */}
        {step < 8 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            disabled={loading}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className={`
              px-6 py-2 rounded-lg text-white transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {loading
              ? "Generating..."
              : "Generate Resume"}
          </button>
        )}
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 text-center">

            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl">
                🎉
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Resume Generated Successfully!
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-5">
              Your resume has been generated successfully.
            </p>

            <p className="text-sm text-gray-500 leading-6 mb-5">
              Please review your resume carefully. If you find any
              mistakes or want to make changes, you will need to
              create a new resume with the updated information.
            </p>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This generated resume cannot
                be edited after creation.
              </p>
            </div>

            {/* View Resume */}
            <button
              type="button"
              onClick={handleViewResume}
              className="w-full px-5 py-3 mb-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              View Resume
            </button>

            {/* Create New Resume */}
            <button
              type="button"
              onClick={handleNewResume}
              className="w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
            >
              Create New Resume
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default StepNavigation;










