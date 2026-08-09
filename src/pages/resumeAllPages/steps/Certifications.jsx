import React from 'react'

const Certifications = ({
  form,
  handleCertificationChange,
  addCertification,
  removeCertification
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Certifications
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add your professional certifications and credentials
          </p>
        </div>

        <button
          type="button"
          onClick={addCertification}
          className="
      px-5
      py-2.5
      rounded-xl
      border
      border-slate-300
      bg-white
      hover:bg-slate-50
      transition
      text-sm
      font-medium
      "
        >
          Add Certification
        </button>
      </div>

      <div className="space-y-5">
        {form.certifications.map((cert, index) => (
          <div
            key={index}
            className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
        "
          >
            <div className="mb-5">
              <span
                type="button"
                onClick={() => removeCertification(index)}
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
              </span>
            </div>


            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Certificate Name
                </label>

                <input
                  name="name"
                  value={cert.name}
                  onChange={(e) =>
                    handleCertificationChange(index, e)
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Issuer
                </label>

                <input
                  name="issuer"
                  value={cert.issuer}
                  onChange={(e) =>
                    handleCertificationChange(index, e)
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Issue Date
                </label>

                <input
                  name="date"
                  value={cert.date}
                  onChange={(e) =>
                    handleCertificationChange(index, e)
                  }
                  className="input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certifications  