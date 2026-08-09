import React from "react";

const Education = ({
  form,
  addEducation,
  handleEducationChange,
  removeEducation,
}) => {
  return (
    <div className="space-y-10">
      <div className="border border-slate-300 rounded-2xl p-4 sm:p-6 bg-white">
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Education</h2>
            <p className="text-slate-500 text-sm mt-1">
              Add your academic background
            </p>
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="
                        h-11 w-11 rounded-full
                        bg-slate-900 text-white
                        text-2xl
                        flex items-center justify-center
                        hover:bg-slate-800 transition
                        shadow-sm
                    "
          >
            +
          </button>
        </div>

        {/* ========================= */}
        {/* EDUCATION LIST */}
        {/* ========================= */}
        <div className="space-y-6">
          {form.education.map((edu, index) => (
            <div
              key={index}
              className="
                            relative
                            border border-slate-200
                            rounded-2xl
                            p-6
                            bg-white
                            shadow-sm
                            hover:shadow-md
                            transition
                        "
            >
              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={() => removeEducation(index)}
                //className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
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

              {/* GRID INPUTS */}
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <input
                  type="text"
                  name="school"
                  placeholder="e.g. School / University Name"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="input"
                />

                <input
                  type="text"
                  name="degree"
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="input"
                />

                <input
                  type="text"
                  name="field"
                  placeholder="e.g. Computer Science"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="input"
                />

                <input
                  type="text"
                  name="year"
                  placeholder="Year (e.g. 2020 - 2024)"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="input"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
