import React, { useState } from "react";
import Navbar1 from "../../components/navbar/Navbar1";
import app from "../../assets/app.png";
import BASE_URL from "../../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

    // Handle Login
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.email || !form.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(`${BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // Save Token + User
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Token:", data.token);

            // Success message
            toast.success("Login successful! 🎉");

            // Clear form
            setForm({
                email: "",
                password: "",
            });

            // Redirect
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F0FF]">
            <Navbar1 />
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
                {/* Background decorative orbs - Responsive sizes */}
                <div className="absolute w-[200px] sm:w-[300px] md:w-[420px] h-[200px] sm:h-[300px] md:h-[420px] bg-gradient-to-r from-violet-300 to-fuchsia-300 rounded-full blur-[60px] sm:blur-[80px] opacity-50 top-[-10%] left-[-8%] pointer-events-none"></div>
                <div className="absolute w-[220px] sm:w-[350px] md:w-[460px] h-[220px] sm:h-[350px] md:h-[460px] bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full blur-[60px] sm:blur-[80px] opacity-50 bottom-[-12%] right-[-6%] pointer-events-none"></div>
                <div className="absolute w-[150px] sm:w-[200px] md:w-[240px] h-[150px] sm:h-[200px] md:h-[240px] bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-[60px] sm:blur-[80px] opacity-30 top-[40%] left-[30%] pointer-events-none"></div>

                {/* Main Glass Card */}
                <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/30 bg-white/65 backdrop-blur-[16px] border border-white/35">
                    
                    {/* LEFT - Branding Panel - Hidden on mobile, visible on lg+ */}
                    <div className="hidden lg:flex lg:w-[48%] p-8 xl:p-12 flex-col justify-between bg-gradient-to-br from-[#6d28d9] via-[#a21caf] to-[#4338ca] text-white overflow-hidden relative">
                        {/* Decorative elements */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDAgMCA0MCAyMCAyMCAwIDAgMCAwLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-20"></div>
                        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/5 blur-2xl"></div>
                        <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-fuchsia-400/10 blur-3xl"></div>

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

                            <div className="mt-12 xl:mt-16 space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 text-xs font-medium tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                                    Trusted by 12,000+ job seekers
                                </div>
                                <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-black leading-[1.1] tracking-tight">
                                    Land your <br className="hidden sm:block" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                                        dream job
                                    </span>{" "}
                                    <br />
                                    faster.
                                </h1>
                                <p className="text-white/80 max-w-sm text-base leading-relaxed">
                                    AI rewrites your resume to beat ATS and impress recruiters.
                                    <span className="font-semibold text-white/90">
                                        {" "}
                                        2,347+ hired this month.
                                    </span>
                                </p>
                            </div>

                            {/* ATS Score Card */}
                            <div className="mt-10 bg-white/15 backdrop-blur-[14px] rounded-2xl p-4 max-w-xs border border-white/20 animate-[pulse-soft_4s_infinite_alternate]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                                        📈
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-2xl tracking-wide">
                                            98<span className="text-lg font-medium">/100</span>
                                        </div>
                                        <div className="text-xs text-white/70 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block"></span>{" "}
                                            ATS Score · Excellent
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 xl:mt-0 flex items-center justify-between">
                            <div className="text-xs text-white/40 flex items-center gap-4">
                                <span>© 2026 ResumeAI</span>
                                <span className="w-px h-4 bg-white/10"></span>
                                <span>v3.0 · AI powered</span>
                            </div>
                            {/* Back to Home Button */}
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                <span>🏠</span>
                                <span className="hidden xl:inline">Back to Home</span>
                                <span className="xl:hidden">Home</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT - Login Form */}
                    <div className="w-full lg:w-[52%] p-4 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                        <div className="w-full max-w-xs sm:max-w-sm mx-auto">
                            {/* Mobile Logo - Visible on small screens */}
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

                            <div className="mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-800">
                                    Welcome back ✨
                                </h2>
                                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                    Login to continue building your resume
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base sm:text-lg">
                                            ✉
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="you@company.com"
                                            className="w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl text-sm sm:text-base text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                            Password
                                        </label>
                                        <a
                                            href="#"
                                            className="text-xs sm:text-sm font-medium text-violet-600 hover:text-violet-800 transition flex items-center gap-1"
                                        >
                                            🔑 Forgot?
                                        </a>
                                    </div>
                                    <div className="mt-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base sm:text-lg">
                                            🔒
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-16 sm:pr-14 rounded-xl text-sm sm:text-base text-gray-800 placeholder:text-gray-400 bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:bg-white/90 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                                            required
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-10 sm:h-12 rounded-xl text-white font-bold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#4f46e5] bg-[length:200%_200%] hover:bg-[position:right_center] hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg shadow-violet-400/40 hover:shadow-violet-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            Login <span className="text-base sm:text-lg">→</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="my-5 sm:my-7 flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200/70"></div>
                                <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider">
                                    OR
                                </span>
                                <div className="flex-1 h-px bg-gray-200/70"></div>
                            </div>

                            <button className="w-full h-10 sm:h-12 rounded-xl font-medium text-gray-700 text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 transition-all bg-white/80 backdrop-blur-sm border border-gray-200/40 hover:bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-400/10">
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    alt="google"
                                />
                                Continue with Google
                            </button>

                            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
                                Don't have an account?
                                <a
                                    href="/register"
                                    className="font-bold text-violet-600 hover:text-violet-800 transition border-b border-violet-200/50 pb-0.5 ml-1"
                                >
                                    Sign Up
                                </a>
                            </p>

                            <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-gray-400/70">
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                                secure · 256-bit encrypted
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes pulse-soft {
                        0% { opacity: 0.7; transform: scale(0.98); }
                        100% { opacity: 1; transform: scale(1.02); }
                    }
                `}</style>
            </div>
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
    );
}