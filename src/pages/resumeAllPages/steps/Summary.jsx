import React from 'react'

const Summary = ({
    form,
    handleChange,
}) => {

  const generateSummary = () => {
     alert("Summary generated with AI is not available yet please write summary manually' we are working on it.");
  }
  return (
    <div>
        
            {/* ========================= */}
            {/* SUMMARY */}
            {/* ========================= */}
            <div
              className="
              border border-violet-200
              bg-gradient-to-br from-violet-50 to-indigo-50
              rounded-3xl
              p-8
            "
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Professional Summary
                  </h2>

                  <p className="text-slate-600 text-sm mt-1">
                    Generate ATS-friendly summary with AI
                  </p>

                </div>

                <button
                  onClick={generateSummary}
                  type="button"
                  className="
                  px-6 py-3 rounded-2xl
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  text-white font-medium
                  hover:scale-105 transition
                "
                >
                  Generate with AI
                </button>

              </div>

              <textarea
                name="summary"
                rows={6}
                placeholder="Write your professional summary..."
                value={form.summary}
                onChange={handleChange}
                className="input bg-white"
              />

            </div>


    </div>
  )
}

export default Summary