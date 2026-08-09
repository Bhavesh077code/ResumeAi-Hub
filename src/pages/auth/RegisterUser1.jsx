import React, { useState } from "react";
import Navbar1 from "../../components/navbar/Navbar1";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../../api";
import app from "../../assets/app.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        return;
      }

      // Save Token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Save User
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Display Success Message
      setMessage("Account created successfully! Redirecting...");

      // Redirect after delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar1 />
      <div className="min-h-screen bg-[#F3F0FF] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative orbs */}
        <div className="absolute w-[420px] h-[420px] bg-gradient-to-r from-violet-300 to-fuchsia-300 rounded-full blur-[80px] opacity-50 top-[-10%] left-[-8%] pointer-events-none"></div>
        <div className="absolute w-[460px] h-[460px] bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full blur-[80px] opacity-50 bottom-[-12%] right-[-6%] pointer-events-none"></div>
        <div className="absolute w-[240px] h-[240px] bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-[80px] opacity-30 top-[40%] left-[30%] pointer-events-none"></div>

        {/* Main Glass Card */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/30 bg-white/65 backdrop-blur-[16px] border border-white/35">
          {/* LEFT - Registration Form */}
          <div className="lg:w-[52%] p-6 lg:p-10 flex items-center justify-center bg-white/30 backdrop-blur-sm order-2 lg:order-1">
            <div className="w-full max-w-sm mx-auto">
              {/* Mobile Logo */}
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

              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight text-gray-800">
                  Create your account ✨
                </h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  Start building ATS-friendly resume in 2 minutes. Free forever.
                </p>
              </div>

              {/* Status/Error Message Banner */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-xl text-sm font-medium border ${
                    message.includes("successfully")
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full h-12 px-4 rounded-xl text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    className="w-full h-12 px-4 rounded-xl text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full h-12 px-4 pr-14 rounded-xl text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-violet-500 hover:text-violet-700 transition bg-white/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/30"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500 leading-5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-white font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#4f46e5] bg-[length:200%_200%] hover:bg-[position:right_center] hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg shadow-violet-400/40 hover:shadow-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Account Free <span className="text-lg">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200/70"></div>
                <span className="text-xs text-gray-400 font-medium tracking-wider">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200/70"></div>
              </div>

              <button
                type="button"
                className="w-full h-12 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-3 transition-all bg-white/80 backdrop-blur-sm border border-gray-200/40 hover:bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-400/10"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="google"
                />
                Sign up with Google
              </button>

              <p className="mt-6 text-center text-sm text-gray-500">
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

          {/* RIGHT - Branding Panel */}
          <div className="relative lg:w-[48%] p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden order-1 lg:order-2">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDAgMCA0MCAyMCAyMCAwIDAgMCAwLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-10"></div>
            <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/5 blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-indigo-400/10 blur-3xl"></div>

            <div className="relative z-10">
              {/* Logo with app image */}
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

              <div className="mt-12 lg:mt-16">
                <h2 className="text-4xl lg:text-5xl xl:text-5xl font-black leading-[1.05]">
                  Your resume
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
                    deserves AI.
                  </span>
                </h2>

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

                <div className="mt-10 flex items-center -space-x-2">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] ring-2 ring-white/10"
                    alt="user"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=32"
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] ring-2 ring-white/10"
                    alt="user"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=5"
                    className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] ring-2 ring-white/10"
                    alt="user"
                  />
                  <div className="w-10 h-10 rounded-full bg-white text-gray-900 border-2 border-[#1a1a2e] flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                    +2k
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 lg:mt-0 flex items-center justify-between">
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
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}