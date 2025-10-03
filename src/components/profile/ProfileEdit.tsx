"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileDatabase } from "@/hooks/useProfileDatabase";
import { IUpdateUserRequest } from "@/types/user";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Phone,
  Calendar,
} from "lucide-react";

/**
 * Component cập nhật thông tin cá nhân của user
 */
export function ProfileEditComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const { userDetails, updateProfile, changePassword, isLoading } = useProfileDatabase();

  // Form states - sử dụng dữ liệu từ database
  const [profileData, setProfileData] = useState<IUpdateUserRequest>({
    fullName: userDetails?.fullName || user?.fullName || "",
    email: userDetails?.email || user?.email || "",
    phoneNumber: userDetails?.phoneNumber || "",
    birthDate: userDetails?.birthDate ? userDetails.birthDate.split('T')[0] : "",
  });

  // Update form data khi userDetails thay đổi
  useEffect(() => {
    if (userDetails) {
      setProfileData({
        fullName: userDetails.fullName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber || "",
        birthDate: userDetails.birthDate ? userDetails.birthDate.split('T')[0] : "",
      });
    }
  }, [userDetails]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // UI states
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-500 text-center">
          Vui lòng đăng nhập để cập nhật thông tin cá nhân
        </p>
      </div>
    );
  }

  /**
   * Xử lý cập nhật thông tin cá nhân
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate
      if (!profileData.fullName?.trim()) {
        setErrorMessage("Vui lòng nhập họ và tên");
        return;
      }

      if (!profileData.email?.trim()) {
        setErrorMessage("Vui lòng nhập email");
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        setErrorMessage("Định dạng email không hợp lệ");
        return;
      }

      // Phone number validation (nếu có)
      if (profileData.phoneNumber && profileData.phoneNumber.trim()) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(profileData.phoneNumber)) {
          setErrorMessage("Định dạng số điện thoại không hợp lệ");
          return;
        }
      }

      // Birth date validation (nếu có)
      if (profileData.birthDate) {
        const birthYear = new Date(profileData.birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (birthYear > currentYear || birthYear < 1900) {
          setErrorMessage("Ngày sinh không hợp lệ");
          return;
        }
      }

      await updateProfile(profileData);
      setSuccessMessage("Cập nhật thông tin cá nhân thành công");
      
      // Refresh page after success
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setErrorMessage((error as Error).message || "Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  /**
   * Xử lý thay đổi mật khẩu
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate
      if (!passwordData.currentPassword.trim()) {
        setErrorMessage("Vui lòng nhập mật khẩu hiện tại");
        return;
      }

      if (!passwordData.newPassword.trim()) {
        setErrorMessage("Vui lòng nhập mật khẩu mới");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrorMessage("Xác nhận mật khẩu không khớp");
        return;
      }

      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage("Thay đổi mật khẩu thành công");
      
      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      setErrorMessage((error as Error).message || "Có lỗi xảy ra khi thay đổi mật khẩu");
    }
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Thông tin cá nhân</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Thay đổi mật khẩu</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={profileData.fullName || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={profileData.email || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.phoneNumber || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      title="Ngày sinh"
                      type="date"
                      value={profileData.birthDate || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Username (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={userDetails?.username || user?.username || ""}
                    disabled
                    title="Tên đăng nhập không thể thay đổi"
                    placeholder="Tên đăng nhập"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tên đăng nhập không thể thay đổi
                  </p>
                </div>

                {/* Unit (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn vị
                  </label>
                  <input
                    type="text"
                    value={userDetails?.unitName || user?.unit?.name || "Chưa có thông tin"}
                    disabled
                    title="Đơn vị được phân công bởi quản trị viên"
                    placeholder="Đơn vị"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Đơn vị được phân công bởi quản trị viên
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Cập nhật thông tin
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="max-w-md space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang thay đổi...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Thay đổi mật khẩu
                    </>
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu mật khẩu:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Tối thiểu 6 ký tự</li>
                  <li>• Nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {successMessage && (
        <SuccessModal
          isOpen={!!successMessage}
          onClose={() => setSuccessMessage("")}
          title="Thành công"
          message={successMessage}
        />
      )}

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          onClose={() => setErrorMessage("")}
          title="Có lỗi xảy ra"
          message={errorMessage}
        />
      )}
    </div>
  );
}