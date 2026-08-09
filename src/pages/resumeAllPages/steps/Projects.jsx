import React from "react";

const Projects = ({ form, addProject, handleProjectChange, removeProject }) => {
  return (
    <div>
      {/* ========================= */}
      {/* PROJECTS */}
      {/* ========================= */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Projects</h2>

            <p className="text-slate-500 text-sm mt-1">
              Showcase your projects
            </p>
          </div>

          <button
            type="button"
            onClick={addProject}
            className="
                  h-12 w-12 rounded-full
                  bg-black text-white
                  text-2xl
                  flex items-center justify-center
                "
          >
            +
          </button>
        </div>

        <div className="space-y-6">
          {form.project.map((pro, index) => (
            <div
              key={index}
              className="
                    border border-slate-200
                    rounded-3xl
                    p-6
                    bg-slate-50/70
                    space-y-4
                  "
            >
              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={() => removeProject(index)}
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

              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={pro.title}
                onChange={(e) => handleProjectChange(index, e)}
                className="input"
              />

              <input
                type="text"
                name="link"
                placeholder="Project Link"
                value={pro.link}
                onChange={(e) => handleProjectChange(index, e)}
                className="input"
              />

              <textarea
                name="desc"
                rows={4}
                placeholder="Project Description"
                value={pro.desc}
                onChange={(e) => handleProjectChange(index, e)}
                className="input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
