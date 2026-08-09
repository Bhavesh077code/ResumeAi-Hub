/*
import React from 'react'

const Skills = ({
    form,
    setForm,
    addSkill,
    handleSkillChange
}) => {
  return (
    <div>
        
        
            <div>

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Skills
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Add your skills
                  </p>

                </div>

                <button
                  type="button"
                  onClick={addSkill}
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

                {form.skills.map((skill, index) => (

                  <div
                    key={index}
                    className="
border border-slate-200
rounded-3xl
p-6
bg-slate-50/70
"
                  >

                    <input
                      type="text"
                      name="skill"
                      placeholder="Skill"
                      value={skill.skill}
                      onChange={(e) => handleSkillChange(index, e)}
                      className="input"
                    />

                  </div>

                ))}

              </div>

            </div>


    </div>
  )
}

export default Skills

*/

/*
import React, { useState } from "react";

const Skills = () => {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    if (!skill.trim()) return;

    setSkills([...skills, skill]);
    setSkill("");
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200">
      <h2 className="text-2xl font-bold mb-2">Skills</h2>

      <p className="text-slate-500 mb-5">
        Add your professional skills
      </p>

     
      <div className="flex flex-wrap gap-3 mb-5">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="
              bg-black
              text-white
              px-4
              py-2
              rounded-full
              flex
              items-center
              gap-2
            "
          >
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

     
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="
            flex-1
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        <button
          type="button"
          onClick={addSkill}
          className="
            bg-black
            text-white
            px-5
            rounded-xl
            hover:bg-slate-800
            transition
          "
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Skills;

*/


/*
import React, { useState } from "react";

const SkillsLanguages = ({}) => {
  const [skill, setSkill] = useState("");
  const [language, setLanguage] = useState("");

  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);

  const addSkill = () => {
    if (!skill.trim()) return;
    setSkills([...skills, skill]);
    setSkill("");
  };

  const addLanguage = () => {
    if (!language.trim()) return;
    setLanguages([...languages, language]);
    setLanguage("");
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">

      
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <p className="text-slate-500 mb-5">Add your skills</p>

        <div className="flex flex-wrap gap-3 mb-5">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              {skill}
              <button onClick={() => removeSkill(index)}>✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3"
          />

          <button
            type="button"
            onClick={addSkill}
            className="bg-black text-white px-5 rounded-xl"
          >
            Add
          </button>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">Languages</h2>
        <p className="text-slate-500 mb-5">Add languages you know</p>

        <div className="flex flex-wrap gap-3 mb-5">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              {lang}
              <button onClick={() => removeLanguage(index)}>✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add language..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3"
          />

          <button
            type="button"
            onClick={addLanguage}
            className="bg-black text-white px-5 rounded-xl"
          >
            Add
          </button>
        </div>
      </div>

    </div>
  );
};

export default SkillsLanguages;

*/

import React, { useState } from "react";

const SkillsLanguages = ({ form, setForm }) => {
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  // ================= SKILLS =================
  const addSkill = () => {
    if (!skillInput.trim()) return;

    setForm({
      ...form,
      skills: [...form.skills, { skill: skillInput.trim() }],
    });

    setSkillInput("");
  };

  const removeSkill = (index) => {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index),
    });
  };

  // ================= LANGUAGES =================
  const addLanguage = () => {
    if (!languageInput.trim()) return;

    setForm({
      ...form,
      languages: [
        ...form.languages,
        { language: languageInput.trim() },
      ],
    });

    setLanguageInput("");
  };

  const removeLanguage = (index) => {
    setForm({
      ...form,
      languages: form.languages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* ================= SKILLS ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Skills
        </h2>

        <p className="text-slate-500 text-sm mt-1 mb-5">
          Add your professional skills
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-3 mb-5">
          {form.skills.map((item, index) => {
           // if (!item.skill) return null;

            return (
              <div
                key={index}
                className="
                  bg-black
                  text-white
                  px-4
                  py-2
                  rounded-full
                  flex
                  items-center
                  gap-2
                  text-sm
                "
              >
                <span>{item.skill}</span>

                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. JavaScript"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
            className="
              flex-1
              border border-slate-300
              rounded-xl
              px-4 py-3
              outline-none
              focus:ring-2
              focus:ring-black
            "
          />

          <button
            type="button"
            onClick={addSkill}
            className="
              bg-black
              text-white
              px-6
              py-3
              rounded-xl
              hover:bg-slate-800
              transition
            "
          >
            Add
          </button>
        </div>
      </div>

      {/* ================= LANGUAGES ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Languages
        </h2>

        <p className="text-slate-500 text-sm mt-1 mb-5">
          Add languages you know
        </p>

        {/* Language Tags */}
        <div className="flex flex-wrap gap-3 mb-5">
          {form.languages.map((item, index) => {
           // if (!item.language) return null;

            return (
              <div
                key={index}
                className="
                  bg-black
                  text-white
                  px-4
                  py-2
                  rounded-full
                  flex
                  items-center
                  gap-2
                  text-sm
                "
              >
                <span>{item.language}</span>

                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. English"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLanguage())
            }
            className="
              flex-1
              border border-slate-300
              rounded-xl
              px-4 py-3
              outline-none
              focus:ring-2
              focus:ring-black
            "
          />

          <button
            type="button"
            onClick={addLanguage}
            className="
              bg-black
              text-white
              px-6
              py-3
              rounded-xl
              hover:bg-slate-800
              transition
            "
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsLanguages;