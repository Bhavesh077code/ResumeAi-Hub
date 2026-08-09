
/*
import React from 'react'

const Languages = ({
    form,
    addLanguage,
    handleLanguageChange,
}) => {
  return (
    <div>
        
    
            <div>

              <div className="flex items-center justify-between mb-8">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Languages</h2>
                  <p className="text-slate-500 text-sm mt-1">Add languages</p>
                </div>

                <button
                  type="button"
                  onClick={addLanguage}

                  className="h-12 w-12 rounded-full bg-black text-white text-2xl flex items-center justify-center"
                >
                  +
                </button>

              </div>

              <div className="space-y-6">

                {form.languages.map((l, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-3xl p-6 bg-slate-50/70 space-y-5"
                  >

                    <div className="grid md:grid-cols-2 gap-4">

                      <input
                        type="text"
                        name="language"
                        placeholder="Language"
                        value={l.language}
                        onChange={(e) => handleLanguageChange(index, e)}
                        className="input"
                      />

                    </div>

                  </div>
                ))}

              </div>

            </div>


    </div>
  )
}

export default Languages

*/



/*
import React, { useState } from "react";

const Languages = () => {
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState([]);

  const addLanguage = () => {
    if (!language.trim()) return;

    setLanguages([...languages, language]);
    setLanguage("");
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200">
      <h2 className="text-2xl font-bold mb-2">Languages</h2>
      <p className="text-slate-500 mb-5">
        Add languages you know
      </p>

      
      <div className="flex flex-wrap gap-3 mb-5">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            {lang}

            <button
              onClick={() => removeLanguage(index)}
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
  );
};

export default Languages;

*/








