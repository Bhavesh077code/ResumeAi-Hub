
function ProgressBar({ step }) {
  const percentage = (step / 8) * 100;

  return (
   <div className="flex items-center gap-4">
  <div className="relative w-16 h-16">
    <svg className="rotate-[-90deg]" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#e5e7eb"
        strokeWidth="8"
        fill="none"
      />
      
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#6366f1"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="251"
        strokeDashoffset={
          251 - (251 * percentage) / 100
        }
      />
    </svg>

    <div className="absolute inset-0 flex items-center justify-center font-bold">
      {Math.round(percentage)}%
    </div>
  </div>

  <div>
    <p className="font-semibold">
      Profile Setup
    </p>
    <p className="text-gray-500">
      Step {step} of 8
    </p>
  </div>
</div>
  );
}

export default ProgressBar;






/*
function ProgressBar({ step }) {
  const steps = 9;

  return (
    <div className="mb-10">
      <div className="flex justify-between mb-6">
        {Array.from({ length: steps }).map((_, i) => {
          const current = i + 1;

          return (
            <div
              key={current}
              className="flex-1 flex items-center"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-medium text-sm transition-all
                  ${
                    current <= step
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {current}
              </div>

              {current !== steps && (
                <div
                  className={`
                    flex-1 h-[2px]
                    ${
                      current < step
                        ? "bg-black"
                        : "bg-gray-200"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-600">
        Complete your profile
      </p>
    </div>
  );
}

*/








