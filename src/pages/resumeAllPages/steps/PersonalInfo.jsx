
/*
import React from 'react'

const PersonalInfo = ({
    form,
    handleChange,
    imagePreview,
    setImagePreview,
    setForm,
}) => {
    return (
  <div className="space-y-8">

 
  <div>
    <h2 className="text-xl px-4  sm:text-2xl font-semibold text-slate-900">
      Personal Information
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Enter your basic details and profile picture.
    </p>
  </div>

  <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-white">
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">

      
      <div className="w-24 h-24 mx-auto sm:mx-0 rounded-full overflow-hidden border border-slate-200">
        {imagePreview ? (
          <img
            src={imagePreview}
            className="w-full h-full object-cover"
            alt="preview"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            Photo
          </div>
        )}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setImagePreview(url);
              setForm({ ...form, image: file });
            }
          }}
          className="block w-full text-sm"
        />

        <p className="text-xs text-slate-500 mt-2">
          JPG, PNG up to 5MB
        </p>
      </div>

    </div>
  </div>


  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

    {[
      { label: "Title", name: "title", type: "text" , placeholder: "e.g. Software Engineer"},
      { label: "Full Name", name: "fullName", type: "text" , placeholder: "e.g. John Doe"},
      { label: "Email Address", name: "email", type: "email", placeholder: "e.g. 4V5oJ@example.com"},
      { label: "Phone Number", name: "phone", type: "text", placeholder: "e.g. +1 (123) 456-7890" },
      { label: "Location", name: "location", type: "text", placeholder: "e.g. Nepal, India, USA etc" },
    ].map((field) => (
      <div key={field.name}>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {field.label}
        </label>

        <input
          placeholder={field.placeholder}
          type={field.type}
          name={field.name}
          value={form[field.name]}
          onChange={handleChange}
          className="
            w-full
            h-12
            px-4
            rounded-xl
            border border-slate-300
            bg-white
            text-sm
            focus:outline-none
            focus:ring-4
            focus:ring-slate-100
            focus:border-slate-900
            transition
          "
        />
      </div>
    ))}

  </div>

</div>
    )
}

export default PersonalInfo

*/


import React from "react";

const PersonalInfo = ({
  form,
  handleChange,
  imagePreview,
  setImagePreview,
  setForm,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl px-4 sm:text-2xl font-semibold text-slate-900">
          Personal Information
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Enter your basic details and profile picture.
        </p>
      </div>

      {/* Profile Section */}
      <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Image Preview */}
          <div className="w-24 h-24 mx-auto sm:mx-0 rounded-full overflow-hidden border border-slate-200">
            {imagePreview ? (
              <img
                src={imagePreview}
                className="w-full h-full object-cover"
                alt="preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                Photo
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="flex-1 text-center sm:text-left">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  const url = URL.createObjectURL(file);
                  setImagePreview(url);
                  setForm((prev) => ({
                    ...prev,
                    image: file,
                  }));
                }
              }}
              className="block w-full text-sm"
            />

            <p className="text-xs text-slate-500 mt-2">
              JPG, PNG up to 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[
          {
            label: "Resume Title",
            name: "title",
            type: "text",
            placeholder: "e.g. Software Engineer Resume",
          },
          {
            label: "Full Name",
            name: "fullName",
            type: "text",
            placeholder: "e.g. John Doe",
          },
          {
            label: "Email Address",
            name: "email",
            type: "email",
            placeholder: "e.g. john@example.com",
          },
          {
            label: "Phone Number",
            name: "phone",
            type: "text",
            placeholder: "e.g. +1 (123) 456-7890",
          },
          {
            label: "Location",
            name: "location",
            type: "text",
            placeholder: "e.g. Nepal, India, USA",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
            </label>

            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form?.[field.name] ?? ""}
              onChange={handleChange}
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border border-slate-300
                bg-white
                text-sm
                focus:outline-none
                focus:ring-4
                focus:ring-slate-100
                focus:border-slate-900
                transition
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;