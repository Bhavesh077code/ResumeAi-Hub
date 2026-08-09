



import React,{ useState} from "react";

import { ToastContainer, toast } from 'react-toastify';


function StepNavigation({ step, setStep, handleSubmit, loading}) {


  return (
    <div className="flex justify-between mt-10">

      {/* Previous Button */}
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

      {/* Next OR Generate */}
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
          onClick={handleSubmit}
          disabled={loading}
          className={`
            px-6 py-2 rounded-lg text-white transition
            ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      )}

    </div>
  );
}

export default StepNavigation;




