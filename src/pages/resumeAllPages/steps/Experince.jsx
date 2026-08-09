import React from "react";

const Experince = ({
  form,
  handleExperienceChange,
  addExperience,
  removeExperience,
}) => {
  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Experience
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add your work experience and career history
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="
            h-11 sm:h-12
            px-4 sm:px-5
            rounded-xl
            border border-slate-300
            bg-white
            text-sm font-medium
            hover:bg-slate-50
            transition
          "
        >
          + Add
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {form.experience.map((exp, index) => (
          <div
            key={index}
            className=" relative  border border-slate-200  rounded-2xl  p-4 sm:p-6  bg-white  shadow-sm space-y-5"
          >
            {/* REMOVE BUTTON */}
            <button
              type="button"
              onClick={() => removeExperience(index)}
             // className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
              className="
            inline-flex
            items-center
            justify-center
            w-8
            h-8
            rounded-full
            bg-slate-100
            text-sm
            font-semibold
            text-slate-700
            "
            >
            {index + 1} 
            </button>

            {/* INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="company"
                placeholder="e.g. Company Name"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, e)}
                className="input"
              />

              <input
                type="text"
                name="role"
                placeholder="e.g. Job Role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(index, e)}
                className="input"
              />

              <input
                type="text"
                name="startDate"
                placeholder="e.g. Start Date"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, e)}
                className="input"
              />

              <input
                type="text"
                name="endDate"
                placeholder="e.g. end date"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(index, e)}
                className="input"
              />
            </div>

            {/* DESCRIPTION */}
            <textarea
              name="desc"
              rows={4}
              placeholder="e.g. Describe your work experience..."
              value={exp.desc}
              onChange={(e) => handleExperienceChange(index, e)}
              className="input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experince;
