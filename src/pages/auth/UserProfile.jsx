import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit,
  Save,
  X,
  Lock,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronRight,
  Calendar,
  Briefcase,
  FileText,
  Download,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashbordNavbar from "../../components/navbar/DashbordNavbar";
import BASE_URL from "../../api";
import axios from "axios";

function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState("public");
  const [twoFactor, setTwoFactor] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    title: "",
    company: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Stats
  const [stats, setStats] = useState({
    resumes: 0,
    downloads: 0,
    views: 0,
    templates: 0,
  });

  // ============================================================
  // 1. FETCH USER DATA
  // ============================================================
  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const userData = data.user;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
          title: userData.title || "",
          company: userData.company || "",
          website: userData.website || "",
          github: userData.github || "",
          linkedin: userData.linkedin || "",
          twitter: userData.twitter || "",
        });
        if (userData.profileImage) {
          setImagePreview(userData.profileImage);
        }
        // Load settings
        setTheme(userData.theme || "light");
        setNotifications(userData.notifications !== false);
        setPrivacy(userData.privacy || "public");
        setTwoFactor(userData.twoFactor || false);
      } else {
        toast.error(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/user/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // ============================================================
  // 2. UPDATE PROFILE
  // ============================================================
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const res = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        toast.success("Profile updated successfully! 🎉");
        setIsEditing(false);
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // 3. CHANGE PASSWORD
  // ============================================================
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Password changed successfully! 🔐");
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  // ============================================================
  // 4. UPDATE SETTINGS
  // ============================================================
  const updateSettings = async (setting, value) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [setting]: value }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Settings updated!");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  // ============================================================
  // 5. DELETE ACCOUNT
  // ============================================================
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Account deleted successfully");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  // ============================================================
  // 6. HANDLE LOGOUT
  // ============================================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/login"), 500);
  };

  // ============================================================
  // 7. HANDLE IMAGE UPLOAD
  // ============================================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // ============================================================
  // 8. HANDLE FORM CHANGE
  // ============================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <DashbordNavbar />

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={24} className="text-amber-400" />
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm border border-red-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              {/* Profile Image */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                          <span className="text-white text-3xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-14 pb-6 px-6 text-center">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-lg font-bold"
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-sm text-gray-500"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-sm text-gray-500"
                      placeholder="Company"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user?.name || "User"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {user?.title || "Professional"} 
                      {user?.company && ` at ${user.company}`}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{user?.bio || "No bio added yet"}</p>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200/50 px-6 py-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={18} className="text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                    />
                  ) : (
                    <span className="text-gray-600">{user?.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={18} className="text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span className="text-gray-600">{user?.phone || "Not set"}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-gray-600">{user?.location || "Not set"}</span>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200/50 px-6 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Social Links
                </p>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        placeholder="GitHub URL"
                      />
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        placeholder="LinkedIn URL"
                      />
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        placeholder="Twitter URL"
                      />
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        placeholder="Website URL"
                      />
                    </>
                  ) : (
                    <div className="space-y-1 text-sm text-gray-500">
                      {user?.github && <p>🔗 GitHub: {user.github}</p>}
                      {user?.linkedin && <p>🔗 LinkedIn: {user.linkedin}</p>}
                      {user?.twitter && <p>🔗 Twitter: {user.twitter}</p>}
                      {user?.website && <p>🔗 Website: {user.website}</p>}
                      {!user?.github && !user?.linkedin && !user?.twitter && !user?.website && (
                        <p className="text-gray-400">No social links added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit/Save Actions */}
              {isEditing && (
                <div className="border-t border-gray-200/50 px-6 py-4 flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Columns - Settings & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 text-center">
                <FileText size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.resumes}</p>
                <p className="text-xs text-gray-500">Resumes</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 text-center">
                <Download size={24} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.downloads}</p>
                <p className="text-xs text-gray-500">Downloads</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 text-center">
                <Eye size={24} className="text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 text-center">
                <Briefcase size={24} className="text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.templates}</p>
                <p className="text-xs text-gray-500">Templates</p>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/50 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Security</h3>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Change Password</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactor(!twoFactor);
                      updateSettings("twoFactor", !twoFactor);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      twoFactor ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                        twoFactor ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-sm font-medium text-red-600">Delete Account</span>
                  </div>
                  <ChevronRight size={18} className="text-red-400" />
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/50 flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Preferences</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {theme === "light" ? <Sun size={18} className="text-gray-500" /> : <Moon size={18} className="text-gray-500" />}
                    <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => {
                      const newTheme = theme === "light" ? "dark" : "light";
                      setTheme(newTheme);
                      updateSettings("theme", newTheme);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      theme === "dark" ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                        theme === "dark" ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications(!notifications);
                      updateSettings("notifications", !notifications);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      notifications ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                        notifications ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Profile Visibility</span>
                  </div>
                  <select
                    value={privacy}
                    onChange={(e) => {
                      setPrivacy(e.target.value);
                      updateSettings("privacy", e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="contacts">Only Contacts</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          CHANGE PASSWORD MODAL
          ============================================================ */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          DELETE ACCOUNT MODAL
          ============================================================ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-600">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-center py-4">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">Are you sure you want to delete your account?</p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. All your resumes and data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md shadow-red-500/25 transition-all duration-300"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="light"
      />
    </div>
  );
}

export default UserProfile;