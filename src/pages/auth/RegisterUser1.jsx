import React, { useState } from "react";
import Navbar1 from "../../components/navbar/Navbar1";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../../api";
import app from "../../assets/app.png";

export default function Register() {
  // State management for form fields
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Form data state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  /**
   * Handle input field changes
   * Updates form state dynamically based on input name
   */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle form submission for user registration
   * Validates terms agreement, sends data to backend, and handles response
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate terms agreement
    if (!agreeTerms) {
      setMessage("Please agree to the Terms and Privacy Policy");
      return;
    }

    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // Handle Backend Validation/Error Response
      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Save Token if available
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Save User if available
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Display Success Message
      setMessage("Account created successfully! Redirecting...");

      // Clear form after successful registration
      setForm({
        name: "",
        email: "",
        password: "",
      });
      setAgreeTerms(false);

      // Redirect to login page after delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0FF]">
      {/* Navigation Bar */}
      <Navbar1 />
      
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
        {/* Background decorative orbs - Responsive sizes */}
        <div className="absolute w-[200px] sm:w-[300px] md:w-[420px] h-[200px] sm:h-[300px] md:h-[420px] bg-gradient-to-r from-violet-300 to-fuchsia-300 rounded-full blur-[60px] sm:blur-[80px] opacity-50 top-[-10%] left-[-8%] pointer-events-none"></div>
        <div className="absolute w-[220px] sm:w-[350px] md:w-[460px] h-[220px] sm:h-[350px] md:h-[460px] bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full blur-[60px] sm:blur-[80px] opacity-50 bottom-[-12%] right-[-6%] pointer-events-none"></div>
        <div className="absolute w-[150px] sm:w-[200px] md:w-[240px] h-[150px] sm:h-[200px] md:h-[240px] bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-[60px] sm:blur-[80px] opacity-30 top-[40%] left-[30%] pointer-events-none"></div>

        {/* Main Glass Card */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/30 bg-white/65 backdrop-blur-[16px] border border-white/35">
          
          {/* LEFT - Registration Form */}
          <div className="w-full lg:w-[52%] p-4 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center bg-white/30 backdrop-blur-sm order-2 lg:order-1">
            <div className="w-full max-w-xs sm:max-w-sm mx-auto">
              {/* Mobile Logo - Visible only on small screens */}
              <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-6 text-indigo-700">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={app}
                    alt="ResumeAI Logo"
                  />
                </div>
                ResumeAI
              </div>

              {/* Header Section */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-800">
                  Create your account ✨
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Start building ATS-friendly resume in 2 minutes. Free forever.
                </p>
              </div>

              {/* Status/Error Message Banner */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs sm:text-sm font-medium border ${
                    message.includes("successfully") || message.includes("created")
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Full Name Input */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl text-sm sm:text-base text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all mt-1"
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl text-sm sm:text-base text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all mt-1"
                    required
                  />
                </div>

                {/* Password Input with Show/Hide */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 pr-16 sm:pr-14 rounded-xl text-sm sm:text-base text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                      required
                      minLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-sm font-medium text-violet-500 hover:text-violet-700 transition bg-white/40 px-1.5 sm:px-2 py-1 rounded-lg backdrop-blur-sm border border-white/30"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start gap-2 text-[10px] sm:text-xs text-gray-500 leading-5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 sm:mt-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    required
                  />
                  <span>
                    I agree to{" "}
                    <a
                      href="#"
                      className="text-violet-600 font-medium hover:text-violet-800 transition"
                    >
                      Terms
                    </a>{" "}
                    &{" "}
                    <a
                      href="#"
                      className="text-violet-600 font-medium hover:text-violet-800 transition"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 sm:h-12 rounded-xl text-white font-bold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#4f46e5] bg-[length:200%_200%] hover:bg-[position:right_center] hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg shadow-violet-400/40 hover:shadow-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account Free <span className="text-base sm:text-lg">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 sm:my-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200/70"></div>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200/70"></div>
              </div>

              {/* Google Sign Up Button */}
              <button
                type="button"
                className="w-full h-10 sm:h-12 rounded-xl font-medium text-gray-700 text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 transition-all bg-white/80 backdrop-blur-sm border border-gray-200/40 hover:bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-400/10"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  alt="Google"
                />
                Sign up with Google
              </button>

              {/* Login Link */}
              <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-violet-600 hover:text-violet-800 transition border-b border-violet-200/50 pb-0.5"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT - Branding Panel - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex lg:w-[48%] p-8 xl:p-12 flex-col justify-between bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden order-1 lg:order-2 relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDAgMCA0MCAyMCAyMCAwIDAgMCAwLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-10"></div>
            <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/5 blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-indigo-400/10 blur-3xl"></div>

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 font-semibold text-xl text-white tracking-tight group cursor-pointer">
                <div className="relative w-9 h-9 overflow-hidden rounded-full border border-white/30 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <img
                    className="w-full h-full object-cover"
                    src={app}
                    alt="ResumeAI Logo"
                  />
                </div>
                <span className="text-white">
                  Resume<span className="font-light">AI</span>
                </span>
              </div>

              {/* Branding Content */}
              <div className="mt-12 xl:mt-16">
                <h2 className="text-4xl xl:text-5xl font-black leading-[1.05]">
                  Your resume
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
                    deserves AI.
                  </span>
                </h2>

                {/* Feature List */}
                <div className="mt-8 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-white/90">
                      AI rewrites 12 bullet points instantly
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-white/90">
                      100% ATS-friendly templates
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-white/90">One-click PDF export</span>
                  </div>
                </div>

                {/* User Avatars */}
                <div className="mt-10 flex items-center -space-x-2">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] ring-2 ring-white/10"
                    alt="User avatar"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=32"
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] ring-2 ring-white/10"
                    alt="User avatar"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=5"
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] ring-2 ring-white/10"
                    alt="User avatar"
                  />
                  <div className="w-10 h-10 rounded-full bg-white text-gray-900 border-2 border-[#1a1a2e] flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                    +2k
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="relative z-10 mt-8 xl:mt-0 flex items-center justify-between">
              {/* Testimonial Card */}
              <div className="bg-white/10 backdrop-blur-[14px] rounded-2xl p-4 border border-white/10 flex-1 mr-4">
                <div className="text-sm text-white/90 leading-relaxed">
                  “ResumeAI helped me land interviews at Google. The AI
                  suggestions are insane!”
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-400 to-indigo-400 flex items-center justify-center text-[10px] font-bold">
                    SJ
                  </span>
                  — Sarah J., Product Manager
                </div>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
              >
                <span>🏠</span>
                <span className="hidden xl:inline">Back to Home</span>
                <span className="xl:hidden">Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}