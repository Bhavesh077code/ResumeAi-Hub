import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import app from "../../assets/app.png";

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-3 font-semibold text-xl text-gray-900 tracking-tight group cursor-pointer">
                    <div className="relative w-9 h-9 overflow-hidden rounded-full border border-gray-200/80 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <img
                            className="w-full h-full object-cover"
                            src={app}
                            alt="ResumeAI Logo"
                        />
                    </div>
                    <span className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent">
                        Resume<span className="text-blue-600">AI</span>
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <a href="/" className="hover:text-indigo-600 transition-colors duration-200 relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a href="/templates" className="hover:text-indigo-600 transition-colors duration-200 relative group">
                        Templates
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a href="/pricing" className="hover:text-indigo-600 transition-colors duration-200 relative group">
                        Pricing
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a href="/about" className="hover:text-indigo-600 transition-colors duration-200 relative group">
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                </div>

                {/* CTA Buttons (Desktop) */}
                <div className="hidden md:flex gap-3 items-center">
                    <a 
                        href="/login" 
                        className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                    >
                        Login
                    </a>
                    <a 
                        href="/register" 
                        className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-fuchsia-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-indigo-50"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden px-4 pb-6 pt-2 space-y-4 text-sm text-gray-600 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
                    <a href="/" className="block hover:text-indigo-600 transition-colors font-medium py-1 hover:pl-2 transition-all">
                        Home
                    </a>
                    <a href="/templates" className="block hover:text-indigo-600 transition-colors font-medium py-1 hover:pl-2 transition-all">
                        Templates
                    </a>
                    <a href="/pricing" className="block hover:text-indigo-600 transition-colors font-medium py-1 hover:pl-2 transition-all">
                        Pricing
                    </a>
                    <a href="/about" className="block hover:text-indigo-600 transition-colors font-medium py-1 hover:pl-2 transition-all">
                        About
                    </a>

                    <div className="pt-3 space-y-3 border-t border-gray-200/50">
                        <a
                            href="/login"
                            className="w-full block text-center py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-all"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            className="w-full block text-center py-2.5 bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;