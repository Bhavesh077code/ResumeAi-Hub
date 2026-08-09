import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../api";
import PersonalInfo from "./steps/PersonalInfo";
import Experience from "./steps/Experince";
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
import "react-toastify/dist/ReactToastify.css";

function ResumeBuilder() {
  const { category: urlCategory, slug, id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewTimeoutRef = useRef(null);

  // Initial form state
  const initialFormState = {
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
  };

  const [form, setForm] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState("");

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const getCategoryBySlug = (templateSlug) => {
    if (!templateSlug) return "professional";
    const lowerSlug = templateSlug.toLowerCase();
    if (lowerSlug.startsWith("tech")) return "tech";
    if (lowerSlug.startsWith("simple")) return "simple";
    if (lowerSlug.startsWith("creative")) return "creative";
    return "professional";
  };

  // ============================================================
  // FETCH EXISTING RESUME (EDIT MODE)
  // ============================================================
  useEffect(() => {
    const fetchExistingResume = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to edit resume");
          navigate("/login");
          return;
        }

        const res = await fetch(`${BASE_URL}/resume/resume/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            toast.error("Resume not found");
            navigate("/dashboard");
          } else if (res.status === 401) {
            toast.error("Please login again");
            navigate("/login");
          } else {
            toast.error("Failed to load resume");
          }
          return;
        }

        const result = await res.json();

        if (res.ok && result.success) {
          const resumeData = result.data;
          const content = resumeData.content || {};

          setForm({
            title: resumeData.title || "",
            fullName: content.fullName || "",
            email: content.email || "",
            phone: content.phone || "",
            location: content.location || "",
            summary: content.summary || "",
            image: null,
            experience: content.experience?.length
              ? content.experience
              : [{ company: "", role: "", startDate: "", endDate: "", desc: "" }],
            education: content.education?.length
              ? content.education
              : [{ school: "", degree: "", field: "", year: "" }],
            project: content.project?.length
              ? content.project
              : [{ title: "", link: "", desc: "" }],
            links: content.links
              ? [content.links]
              : [{ github: "", linkedin: "", portfolio: "", twitter: "", website: "" }],
            skills: content.skills?.map((s) => ({ skill: s })) || [{ skill: "" }],
            certifications: content.certification?.length
              ? content.certification
              : [{ name: "", issuer: "", date: "" }],
            languages: content.languages?.map((l) => ({ language: l })) || [{ language: "" }],
          });

          if (resumeData.image) {
            setImagePreview(resumeData.image);
          }
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        toast.error("Failed to load resume data");
      }
    };

    fetchExistingResume();
  }, [id, navigate]);

  // ============================================================
  // LIVE PREVIEW UPDATE
  // ============================================================
  const fetchPreview = useCallback(async () => {
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
      } else {
        console.error("Preview error:", result.message);
      }
    } catch (error) {
      console.error("Preview Fetch Error:", error);
    } finally {
      setPreviewLoading(false);
    }
  }, [form, slug, imagePreview, urlCategory]);

  // Debounced preview update
  useEffect(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    previewTimeoutRef.current = setTimeout(() => {
      fetchPreview();
    }, 500);

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [fetchPreview]);

  // ============================================================
  // FORM HANDLERS
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Experience Handlers
  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", startDate: "", endDate: "", desc: "" },
      ],
    }));
  };

  const removeExperience = (index) => {
    if (form.experience.length <= 1) {
      toast.warning("At least one experience is required");
      return;
    }
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Education Handlers
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", field: "", year: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    if (form.education.length <= 1) {
      toast.warning("At least one education is required");
      return;
    }
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Project Handlers
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.project];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, project: updated };
    });
  };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      project: [...prev.project, { title: "", link: "", desc: "" }],
    }));
  };

  const removeProject = (index) => {
    setForm((prev) => ({
      ...prev,
      project: prev.project.filter((_, i) => i !== index),
    }));
  };

  // Skill Handlers
  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.skills];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, skills: updated };
    });
  };

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, { skill: "" }],
    }));
  };

  const removeSkill = (index) => {
    if (form.skills.length <= 1) {
      toast.warning("At least one skill is required");
      return;
    }
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Language Handlers
  const handleLanguageChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.languages];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, languages: updated };
    });
  };

  const addLanguage = () => {
    setForm((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "" }],
    }));
  };

  const removeLanguage = (index) => {
    if (form.languages.length <= 1) {
      toast.warning("At least one language is required");
      return;
    }
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  // Certification Handlers
  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, certifications: updated };
    });
  };

  const addCertification = () => {
    setForm((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", date: "" },
      ],
    }));
  };

  const removeCertification = (index) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Links Handler
  const handleLinksChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = [...prev.links];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, links: updated };
    });
  };

  // ============================================================
  // SUBMIT RESUME
  // ============================================================
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validate required fields
    if (!form.fullName || !form.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setIsSaving(true);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to save resume");
        navigate("/login");
        return;
      }

      const data = new FormData();

      // Add title
      const title = form.title?.trim() || 
                    (form.fullName ? `${form.fullName}'s Resume` : "My Resume");
      data.append("title", title);
      data.append("templateSlug", slug || "professional");

      // Prepare content
      const content = {
        fullName: form.fullName || "",
        email: form.email || "",
        phone: form.phone || "",
        location: form.location || "",
        summary: form.summary || "",
        experience: form.experience || [],
        education: form.education || [],
        project: form.project || [],
        certification: form.certifications || [],
        skills: (form.skills || []).map((s) => s?.skill || "").filter(Boolean),
        languages: (form.languages || []).map((l) => l?.language || "").filter(Boolean),
        links: form.links?.[0] || {},
      };

      data.append("content", JSON.stringify(content));
      
      // Add image if present
      if (form.image) {
        data.append("image", form.image);
      }

      // Determine API endpoint and method
      const apiUrl = id
        ? `${BASE_URL}/resume/update/${id}`
        : `${BASE_URL}/resume/create`;
      const apiMethod = id ? "PUT" : "POST";

      const res = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error saving resume");
      }

      // Get the resume ID from response
      const finalId = id || result.resume?._id || result.data?._id;
      
      if (!finalId) {
        throw new Error("Failed to get resume ID");
      }

      // Navigate to resume view
      const detectedCategory = urlCategory || getCategoryBySlug(slug || "professional");
      
      toast.success("Resume saved successfully! 🎉");
      
      // Small delay before navigation
      setTimeout(() => {
        navigate(`/resume-view/${detectedCategory}/${slug || "professional"}/${finalId}`);
      }, 500);

    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save resume. Please try again.");
    } finally {
      setLoading(false);
      setIsSaving(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white antialiased">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <DashbordNavbar />

      <div className="flex-1 w-full flex flex-col min-h-0">
        {/* Progress Bar */}
        <div className="w-full bg-white border-b border-slate-100 px-4 sm:px-6 py-2 sm:py-3 flex-shrink-0">
          <ProgressBar step={step} />
        </div>

        {/* Main Content */}
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-[42%_58%] min-h-0">
          {/* Left - Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white px-4 sm:px-6 md:px-10 py-4 sm:py-6 overflow-y-auto h-full flex flex-col justify-between border-r border-slate-200/60 no-scrollbar"
          >
            <div className="space-y-4 sm:space-y-6 flex-1">
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
                <Experience
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

            {/* Navigation - Fixed at bottom */}
            <div className="mt-4 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 bg-white sticky bottom-0">
              <StepNavigation
                step={step}
                setStep={setStep}
                handleSubmit={handleSubmit}
                loading={loading || isSaving}
              />
            </div>
          </form>

          {/* Right - Preview */}
          <ResumePreview
            htmlPreview={htmlPreview}
            loading={previewLoading}
            setStep={setStep}
          />
        </div>
      </div>

      <ToastContainer
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
        className="z-50"
      />
    </div>
  );
}

export default ResumeBuilder;