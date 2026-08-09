import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  BookOpen,
  HelpCircle,
  LogOut,
  FolderOpen,
  User,
  Camera,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Briefcase,
  Award,
  Settings,
  Shield,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import app from "../../assets/app.png";
import BASE_URL from "../../api";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({
        ...prev,
        photo: imageUrl,
      }));
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.photo = imageUrl;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Menu items with icons
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard", badge: null },
    { name: "My Resumes", icon: <FileText size={20} />, path: "", badge: "4" },
    { name: "Templates", icon: <FolderOpen size={20} />, path: "", badge: null },
    { name: "Cover Letters", icon: <Briefcase size={20} />, path: "", badge: null },
    { name: "Interview Prep", icon: <HelpCircle size={20} />, path: "", badge: null },
    { name: "AI Generator", icon: <Sparkles size={20} />, path: "", badge: "New" },
    { name: "Profile", icon: <User size={20} />, path: "/user-profile", badge: null },
    { name: "Settings", icon: <Settings size={20} />, path: "", badge: null },
  ];

  const quickActions = [
    { name: "Resume Builder", icon: <FileText size={16} />, color: "from-blue-500 to-indigo-600" },
    { name: "AI Optimize", icon: <Sparkles size={16} />, color: "from-fuchsia-500 to-pink-600" },
    { name: "Job Match", icon: <Award size={16} />, color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full h-16 md:h-[72px] bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-50 shadow-sm">
        <div className="h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-gray-900"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-gray-200/80 shadow-md transition-transform duration-300 group-hover:scale-105">
                <img src={app} alt="ResumeAI" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Resume<span className="text-indigo-600">AI</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                  Smart Career Platform
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center ml-6 bg-gray-100/80 rounded-full px-4 py-2 border border-gray-200/50 focus-within:border-indigo-400 focus-within:bg-white transition-all duration-300 min-w-[240px]">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes, templates..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder:text-gray-400"
              />
              <kbd className="hidden xl:block text-[10px] text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded border border-gray-300 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-2 border-r border-gray-200/60 pr-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${action.color} shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center gap-1.5`}
                >
                  {action.icon}
                  <span className="hidden xl:inline">{action.name}</span>
                </button>
              ))}
            </div>


            {/* Notifications 
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button> */}

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center overflow-hidden ring-2 ring-indigo-100">
                  {user?.photo ? (
                    <img src={user.photo} alt="user" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-800 leading-none">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-[10px] text-gray-400">Pro Plan</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.name || "Guest"}</p>
                      <p className="text-xs text-gray-500">{user?.email || "guest@email.com"}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700">
                      <User size={16} />
                      <a href="/user-profile">Profile Settings</a>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700">
                      <Shield size={16} />
                      <span>Privacy & Security</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700">
                      <Award size={16} />
                      <span>Upgrade to Pro</span>
                      <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">New</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm text-red-600 hover:text-red-700"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-screen w-[88%] sm:w-80 lg:w-72 bg-white shadow-2xl z-[60] transition-all duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 md:h-[72px] border-b border-gray-200/50 px-5 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md">
              <img src={app} alt="logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Resume<span className="text-indigo-600">AI</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Pro Platform
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-200/50 flex-shrink-0">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-2xl p-4 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg cursor-pointer group bg-white/10"
                >
                  {user?.photo ? (
                    <img src={user.photo} alt="user" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-bold truncate">
                  {user?.name || "Guest User"}
                </h3>
                <p className="text-xs text-white/70 truncate">
                  {user?.email || "guest@email.com"}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/10 text-[10px] font-medium">
                  <Sparkles size={12} />
                  Pro Plan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-fuchsia-50 transition-all duration-300 text-gray-600 hover:text-gray-900 relative"
            >
              <div className="group-hover:scale-110 transition text-gray-500 group-hover:text-indigo-600">
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.name}</span>
              {item.badge && (
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  item.badge === "New" 
                    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {item.badge}
                </span>
              )}
              {item.name === "Dashboard" && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Upgrade Banner */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-indigo-50/50 to-fuchsia-50/50">
          <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Pro</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Get AI-powered resume optimization & 50+ premium templates
            </p>
            <button className="mt-3 w-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-2 rounded-lg hover:bg-white/30 transition border border-white/20">
              Upgrade Now →
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-gray-200 hover:border-red-200 font-semibold text-sm shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
        />
      )}

      {/* Keyboard shortcut hint - ⌘K */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: slideIn 0.2s ease-out;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </>
  );
}

export default Navbar;