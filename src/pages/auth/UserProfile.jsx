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
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronRight,
  Briefcase,
  FileText,
  Download,
  Share2,
  Eye,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashbordNavbar from "../../components/navbar/DashbordNavbar";
import BASE_URL from "../../api";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch user profile data from API
   */
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

  /**
   * Fetch user statistics from API
   */
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/user/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // ============================================================
  // 2. UPDATE PROFILE
  // ============================================================
  /**
   * Handle profile update submission
   */
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

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
  /**
   * Handle password change submission
   */
  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

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
      if (!token) {
        toast.error("Please login again");
        return;
      }

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
  /**
   * Update user settings
   */
  const updateSettings = async (setting, value) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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
  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

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
  /**
   * Handle user logout
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/login"), 500);
  };

  // ============================================================
  // 7. HANDLE IMAGE UPLOAD
  // ============================================================
  /**
   * Handle profile image upload
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
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
  /**
   * Handle form input changes
   */
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

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <DashbordNavbar />

      <div className="pt-20 pb-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400 flex-shrink-0" />
              <span>My Profile</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden xs:inline">Edit Profile</span>
                <span className="xs:hidden">Edit</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm border border-red-200"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Logout</span>
              <span className="xs:hidden">Exit</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              {/* Profile Image Header */}
              <div className="relative">
                <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2">
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                          <span className="text-white text-2xl sm:text-3xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera size={20} className="text-white sm:w-[24px] sm:h-[24px]" />
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
              <div className="pt-12 sm:pt-14 pb-4 sm:pb-6 px-4 sm:px-6 text-center">
                {isEditing ? (
                  <div className="space-y-2 sm:space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-base sm:text-lg font-bold"
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-xs sm:text-sm text-gray-500"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-xs sm:text-sm text-gray-500"
                      placeholder="Company"
                    />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-center text-xs sm:text-sm text-gray-500 resize-none"
                      placeholder="Bio"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {user?.name || "User"}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {user?.title || "Professional"} 
                      {user?.company && ` at ${user.company}`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      {user?.bio || "No bio added yet"}
                    </p>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Mail size={16} className="text-gray-400 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                    />
                  ) : (
                    <span className="text-gray-600 truncate">{user?.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Phone size={16} className="text-gray-400 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span className="text-gray-600">{user?.phone || "Not set"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-gray-600">{user?.location || "Not set"}</span>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
                  Social Links
                </p>
                <div className="space-y-1.5 sm:space-y-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                        placeholder="GitHub URL"
                      />
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                        placeholder="LinkedIn URL"
                      />
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                        placeholder="Twitter URL"
                      />
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                        placeholder="Website URL"
                      />
                    </>
                  ) : (
                    <div className="space-y-1 text-xs sm:text-sm text-gray-500">
                      {user?.github && <p className="truncate">🔗 GitHub: {user.github}</p>}
                      {user?.linkedin && <p className="truncate">🔗 LinkedIn: {user.linkedin}</p>}
                      {user?.twitter && <p className="truncate">🔗 Twitter: {user.twitter}</p>}
                      {user?.website && <p className="truncate">🔗 Website: {user.website}</p>}
                      {!user?.github && !user?.linkedin && !user?.twitter && !user?.website && (
                        <p className="text-gray-400">No social links added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit/Save Actions */}
              {isEditing && (
                <div className="border-t border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Columns - Settings & Stats */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: FileText, label: "Resumes", value: stats.resumes, color: "text-blue-500" },
                { icon: Download, label: "Downloads", value: stats.downloads, color: "text-emerald-500" },
                { icon: Eye, label: "Views", value: stats.views, color: "text-purple-500" },
                { icon: Briefcase, label: "Templates", value: stats.templates, color: "text-orange-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-3 sm:p-4 text-center">
                  <stat.icon size={20} className={`${stat.color} mx-auto mb-1 sm:mb-2 sm:w-[24px] sm:h-[24px]`} />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 flex items-center gap-2">
                <Shield size={18} className="text-blue-600 sm:w-[20px] sm:h-[20px]" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Security</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Lock size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Change Password</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 sm:w-[18px] sm:h-[18px]" />
                </button>

                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Shield size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Two-Factor Auth</span>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactor(!twoFactor);
                      updateSettings("twoFactor", !twoFactor);
                    }}
                    className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                      twoFactor ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-white transition-all duration-300 ${
                        twoFactor ? "right-0.5 sm:right-1" : "left-0.5 sm:left-1"
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <AlertCircle size={16} className="text-red-500 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium text-red-600">Delete Account</span>
                  </div>
                  <ChevronRight size={16} className="text-red-400 sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 flex items-center gap-2">
                <Bell size={18} className="text-blue-600 sm:w-[20px] sm:h-[20px]" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Preferences</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {theme === "light" ? 
                      <Sun size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" /> : 
                      <Moon size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
                    }
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => {
                      const newTheme = theme === "light" ? "dark" : "light";
                      setTheme(newTheme);
                      updateSettings("theme", newTheme);
                    }}
                    className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                      theme === "dark" ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-white transition-all duration-300 ${
                        theme === "dark" ? "right-0.5 sm:right-1" : "left-0.5 sm:left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Bell size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications(!notifications);
                      updateSettings("notifications", !notifications);
                    }}
                    className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                      notifications ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 sm:top-1 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-white transition-all duration-300 ${
                        notifications ? "right-0.5 sm:right-1" : "left-0.5 sm:left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Globe size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Profile Visibility</span>
                  </div>
                  <select
                    value={privacy}
                    onChange={(e) => {
                      setPrivacy(e.target.value);
                      updateSettings("privacy", e.target.value);
                    }}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-xs sm:text-sm bg-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-red-600">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </div>
            <div className="text-center py-3 sm:py-4">
              <AlertCircle size={40} className="text-red-500 mx-auto mb-2 sm:mb-3 sm:w-[48px] sm:h-[48px]" />
              <p className="text-sm sm:text-base text-gray-700 font-medium">Are you sure you want to delete your account?</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
                This action cannot be undone. All your resumes and data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md shadow-red-500/25 transition-all duration-300 text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="light"
        className="z-50"
      />
    </div>
  );
}

export default UserProfile;