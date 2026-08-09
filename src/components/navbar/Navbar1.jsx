import React, { useState } from 'react';
import { Menu, X } from "lucide-react";
import app from "../../assets/app.png";

const Navbar1 = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 lg:px-0 mt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/80 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3 font-semibold text-xl text-gray-900 tracking-tight group cursor-pointer">
              <div className="relative w-9 h-9 overflow-hidden rounded-full border border-gray-200/80 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img
                  className="w-full h-full object-cover"
                  src={app}
                  alt="ResumeAI Logo"
                />
              </div>
              <span className="font-bold tracking-tight text-gray-900 hidden sm:block">
                Resume<span className="text-indigo-600">AI</span>
              </span>
            </div>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="/" className="hover:text-indigo-600 transition-colors duration-200 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="" className="hover:text-indigo-600 transition-colors duration-200 relative group">
              Templates
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="" className="hover:text-indigo-600 transition-colors duration-200 relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="" className="hover:text-indigo-600 transition-colors duration-200 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="/login" 
              className="px-6 py-2.5 rounded-xl bg-gray-200/80 hover:bg-gray-200 text-gray-800 font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Login
            </a>
            <a 
              href="/register" 
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold shadow-lg shadow-violet-200 hover:scale-[1.02] hover:shadow-violet-300 transition-all duration-300"
            >
              Get started free
            </a>
          </div>

          {/* Mobile Buttons + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <a 
              href="/register" 
              className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold shadow-md shadow-violet-200 hover:scale-[1.02] transition-all duration-300"
            >
              Get started
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-indigo-50"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100/80 p-4 space-y-3 text-sm text-gray-600">
            <a href="/" className="block hover:text-indigo-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-indigo-50">
              Home
            </a>
            <a href="" className="block hover:text-indigo-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-indigo-50">
              Templates
            </a>
            <a href="" className="block hover:text-indigo-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-indigo-50">
              Pricing
            </a>
            <a href="/about" className="block hover:text-indigo-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-indigo-50">
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
                Get Started Free
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar1;