import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../api";
import Dashboard from "./Dashboard";
import PersonalInfo from "./steps/PersonalInfo";
import Experince from "./steps/Experince";
import Education from "./steps/Education";
import Skills from "./steps/Skills";
import Projects from "./steps/Projects";
import SocialLinks from "./steps/SocialLinks";
import Certifications from "./steps/Certifications";
import Summary from "./steps/Summary";
import StepNavigation from "../../components/templateCard/resume/StepNavigation";
import ProgressBar from "../../components/templateCard/resume/ProgressBar";
import DashbordNavbar from "../../components/navbar/DashbordNavbar";
import ResumePreview from "./ResumePreview";
import { ToastContainer, toast } from "react-toastify";

function ResumeBuilder() {
  // 🚀 URL se 'id' (optional parameter) nikalenge edit mode check karne ke liye
  const { category: urlCategory, slug, id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const notify = () => toast("Wow so easy!");

  const [form, setForm] = useState({
    title: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    image: null,
    summary: "",
    experience: [
      { company: "", role: "", startDate: "", endDate: "", desc: "" },
    ],
    education: [{ school: "", degree: "", field: "", year: "" }],
    project: [{ title: "", link: "", desc: "" }],
    links: [
      { github: "", linkedin: "", portfolio: "", twitter: "", website: "" },
    ],
    skills: [{ skill: "" }],
    certifications: [{ name: "", issuer: "", date: "" }],
    languages: [{ language: "" }],
  });

  const [imagePreview, setImagePreview] = useState("");

  const getCategoryBySlug = (templateSlug) => {
    if (!templateSlug) return "professional";
    const lowerSlug = templateSlug.toLowerCase();
    if (lowerSlug.startsWith("tech")) return "tech";
    if (lowerSlug.startsWith("simple")) return "simple";
    if (lowerSlug.startsWith("creative")) return "creative";
    return "professional";
  };

  // 🚀 EDIT MODE: Agar id milti hai to backend se saved data lake form me fill karo
  useEffect(() => {
    const fetchExistingResume = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/resume/update/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (res.ok && result.success) {
          const resumeData = result.data;
          const content = resumeData.content;

          setForm({
            fullName: content.fullName || "",
            email: content.email || "",
            phone: content.phone || "",
            location: content.location || "",
            summary: content.summary || "",
            image: null,
            experience: content.experience?.length
              ? content.experience
              : [
                  {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    desc: "",
                  },
                ],
            education: content.education?.length
              ? content.education
              : [{ school: "", degree: "", field: "", year: "" }],
            project: content.project?.length
              ? content.project
              : [{ title: "", link: "", desc: "" }],
            links: content.links
              ? [content.links]
              : [
                  {
                    github: "",
                    linkedin: "",
                    portfolio: "",
                    twitter: "",
                    website: "",
                  },
                ],
            skills: content.skills?.map((s) => ({ skill: s })) || [
              { skill: "" },
            ],
            certifications: content.certification || [
              { name: "", issuer: "", date: "" },
            ],
            languages: content.languages?.map((l) => ({ language: l })) || [
              { language: "" },
            ],
          });

          if (resumeData.image) {
            setImagePreview(resumeData.image);
          }
        }
      } catch (error) {
        console.error("Data load karne me dikkat aayi:", error);
      }
    };

    fetchExistingResume();
  }, [id]);

  // Live preview update cycle
  useEffect(() => {
    const fetchPreview = async () => {
      if (!slug) return;
      try {
        setPreviewLoading(true);
        const detectedCategory = urlCategory || getCategoryBySlug(slug);

        const content = {
          fullName: form.fullName || "",
          email: form.email || "",
          phone: form.phone || "",
          location: form.location || "",
          summary: form.summary || "",
          image: imagePreview || "",
          experience: form.experience || [],
          education: form.education || [],
          project: form.project || [],
          certification: form.certifications || [],
          skills: (form.skills || []).map((s) => s?.skill || ""),
          languages: (form.languages || []).map((l) => l?.language || ""),
          links: form.links?.[0] || {},
        };

        const res = await fetch(`${BASE_URL}/create/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: detectedCategory,
            slug,
            data: content,
          }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          setHtmlPreview(result.html);
        }
      } catch (error) {
        console.error("Preview Fetch Error:", error);
      } finally {
        setPreviewLoading(false);
      }
    };

    const timer = setTimeout(fetchPreview, 500);
    return () => clearTimeout(timer);
  }, [form, slug, imagePreview, urlCategory]);

  // ================= HANDLERS =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleExperienceChange = (index, e) => {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, experience: updated });
  };
  const addExperience = () =>
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { company: "", role: "", startDate: "", endDate: "", desc: "" },
      ],
    });
  const removeExperience = (index) =>
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));

  const handleEducationChange = (index, e) => {
    const updated = [...form.education];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, education: updated });
  };
  const addEducation = () =>
    setForm({
      ...form,
      education: [
        ...form.education,
        { school: "", degree: "", field: "", year: "" },
      ],
    });
  const removeEducation = (index) =>
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));

  const handleProjectChange = (index, e) => {
    const updated = [...form.project];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, project: updated });
  };
  const addProject = () =>
    setForm({
      ...form,
      project: [...form.project, { title: "", link: "", desc: "" }],
    });
  const removeProject = (index) =>
    setForm((prev) => ({
      ...prev,
      project: prev.project.filter((_, i) => i !== index),
    }));

  const handleSkillChange = (index, e) => {
    const updated = [...form.skills];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, skills: updated });
  };
  const addSkill = () =>
    setForm({ ...form, skills: [...form.skills, { skill: "" }] });
  const removeSkill = (index) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));

  const handleLanguageChange = (index, e) => {
    const updated = [...form.languages];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, languages: updated });
  };
  const addLanguage = () =>
    setForm({ ...form, languages: [...form.languages, { language: "" }] });
  const removeLanguage = (index) =>
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));

  const handleCertificationChange = (index, e) => {
    const updated = [...form.certifications];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, certifications: updated });
  };
  const addCertification = () =>
    setForm({
      ...form,
      certifications: [
        ...form.certifications,
        { name: "", issuer: "", date: "" },
      ],
    });
  const removeCertification = (index) =>
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));

  const handleLinksChange = (index, e) => {
    const updated = [...form.links];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setForm({ ...form, links: updated });
  };

  // ================= DYNAMIC SUBMIT ENGINE (Handles Post vs Put Automatically) =================
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // data.append("title", form.fullName ? `${form.fullName}'s Resume` : "Resume");
      data.append(
        "title",
        form.title?.trim() ||
          (form.fullName ? `${form.fullName}'s Resume` : "Resume"),
      );
      data.append("templateSlug", slug);

      const content = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        summary: form.summary,
        experience: form.experience,
        education: form.education,
        project: form.project,
        certification: form.certifications,
        skills: form.skills.map((s) => s.skill),
        languages: form.languages.map((l) => l.language),
        links: form.links[0],
      };

      data.append("content", JSON.stringify(content));
      if (form.image) data.append("image", form.image);

      // 🚀 Agar URL me id hai to Update controller ko touch karega, nahi to create ko
      const apiUrl = id
        ? `${BASE_URL}/resume/update/${id}`
        : `${BASE_URL}/resume/create`;
      const apiMethod = id ? "PUT" : "POST";

      const PdfUrl = id
        ? `${BASE_URL}/resume/pdf/${id}`
        : `${BASE_URL}/resume/pdf`;

      /*
       const res = await fetch(apiUrl, {
                method: apiMethod,
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });
            console.log(res);

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Error saving data"); */
      // ... baaki submit ka code upar bilkul same rahega

      const res = await fetch(apiUrl, {
        method: apiMethod,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Error saving data");
      }

      // 🚀 FIXED: Ab dashboard bhejiyega nahi, direct naye full resume screen par bhejega!
      const finalId = id || result.resume?._id || result.data?._id;
      const detectedCategory = urlCategory || getCategoryBySlug(slug);

      navigate(`/resume-view/${detectedCategory}/${slug}/${finalId}`);
      toast.success("Resume saved successfully!");
    } catch (error) {
      toast.error(error.message || "Resume save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white antialiased">
      <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

      <DashbordNavbar />

      <div className="flex-1 w-full flex flex-col min-h-0">
        <div className="w-full bg-white border-b border-slate-100 px-6 py-3 flex-shrink-0">
          <ProgressBar step={step} />
        </div>

        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-[42%_58%] min-h-0">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white px-6 md:px-10 py-6 overflow-y-auto h-full flex flex-col justify-between border-r border-slate-200/60 no-scrollbar"
          >
            <div className="space-y-6 flex-1">
              {step === 1 && (
                <PersonalInfo
                  form={form}
                  handleChange={handleChange}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setForm={setForm}
                />
              )}
              {step === 2 && (
                <Experince
                  form={form}
                  handleExperienceChange={handleExperienceChange}
                  addExperience={addExperience}
                  removeExperience={removeExperience}
                />
              )}
              {step === 3 && (
                <Education
                  form={form}
                  handleEducationChange={handleEducationChange}
                  addEducation={addEducation}
                  removeEducation={removeEducation}
                />
              )}
              {step === 4 && (
                <Skills
                  form={form}
                  setForm={setForm}
                  handleSkillChange={handleSkillChange}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                />
              )}
              {step === 5 && (
                <Projects
                  form={form}
                  handleProjectChange={handleProjectChange}
                  addProject={addProject}
                  removeProject={removeProject}
                />
              )}
              {step === 6 && (
                <SocialLinks
                  form={form}
                  handleLinksChange={handleLinksChange}
                />
              )}
              {step === 7 && (
                <Certifications
                  form={form}
                  handleCertificationChange={handleCertificationChange}
                  addCertification={addCertification}
                  removeCertification={removeCertification}
                />
              )}
              {step === 8 && (
                <Summary form={form} handleChange={handleChange} />
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 bg-white sticky bottom-0">
              <StepNavigation
                step={step}
                setStep={setStep}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </form>

          {/* 🚀 Preview section ko control state forward karenge */}
          <ResumePreview
            htmlPreview={htmlPreview}
            loading={loading}
            setStep={setStep}
          />
        </div>

        <div>
          <button onClick={notify}></button>
          <ToastContainer
            className="z-50"
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            theme="light"
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
