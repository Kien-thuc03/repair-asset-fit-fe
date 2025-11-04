"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
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
  Shield,
} from "lucide-react";

/**
 * Component cập nhật thông tin cá nhân của user
 */
export function ProfileEditComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const { userDetails, updateProfile, changePassword, isLoading } = useProfile();

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
      // === VALIDATE FULL NAME ===
      if (!profileData.fullName?.trim()) {
        setErrorMessage("Vui lòng nhập họ và tên");
        return;
      }

      if (profileData.fullName.trim().length < 2) {
        setErrorMessage("Họ và tên phải có ít nhất 2 ký tự");
        return;
      }

      if (profileData.fullName.trim().length > 100) {
        setErrorMessage("Họ và tên không được vượt quá 100 ký tự");
        return;
      }

      // Kiểm tra họ tên chỉ chứa chữ cái, dấu cách và các ký tự tiếng Việt
      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(profileData.fullName.trim())) {
        setErrorMessage("Họ và tên chỉ được chứa chữ cái và khoảng trắng");
        return;
      }

      // === VALIDATE EMAIL ===
      if (!profileData.email?.trim()) {
        setErrorMessage("Vui lòng nhập email");
        return;
      }

      if (profileData.email.trim().length > 100) {
        setErrorMessage("Email không được vượt quá 100 ký tự");
        return;
      }

      // Email format validation - chuẩn RFC 5322
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(profileData.email.trim())) {
        setErrorMessage("Định dạng email không hợp lệ");
        return;
      }

      // === VALIDATE PHONE NUMBER (nếu có) ===
      if (profileData.phoneNumber && profileData.phoneNumber.trim()) {
        const phoneNumber = profileData.phoneNumber.trim();
        
        // Định dạng số điện thoại Việt Nam: +84 hoặc 0, theo sau là 9-10 chữ số
        const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
        
        // Loại bỏ khoảng trắng, dấu ngoặc, dấu gạch ngang
        const cleanPhone = phoneNumber.replace(/[\s()-]/g, '');
        
        if (!phoneRegex.test(cleanPhone)) {
          setErrorMessage("Số điện thoại không hợp lệ (định dạng Việt Nam: 0xxx xxx xxx hoặc +84xxx xxx xxx)");
          return;
        }

        if (cleanPhone.length < 10 || cleanPhone.length > 12) {
          setErrorMessage("Số điện thoại phải từ 10-12 chữ số");
          return;
        }
      }

      // === VALIDATE BIRTH DATE (nếu có) ===
      if (profileData.birthDate && profileData.birthDate.trim()) {
        const birthDate = new Date(profileData.birthDate);
        const today = new Date();
        
        // Kiểm tra ngày hợp lệ
        if (isNaN(birthDate.getTime())) {
          setErrorMessage("Ngày sinh không hợp lệ");
          return;
        }

        const birthYear = birthDate.getFullYear();
        const currentYear = today.getFullYear();
        
        // Kiểm tra năm sinh
        if (birthYear < 1900) {
          setErrorMessage("Năm sinh không được trước năm 1900");
          return;
        }

        if (birthYear > currentYear) {
          setErrorMessage("Năm sinh không được là tương lai");
          return;
        }

        // Kiểm tra ngày sinh không được là tương lai
        if (birthDate > today) {
          setErrorMessage("Ngày sinh không được là ngày trong tương lai");
          return;
        }

        // Kiểm tra tuổi tối thiểu (ví dụ: 18 tuổi)
        const age = currentYear - birthYear;
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        let actualAge = age;
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          actualAge--;
        }

        if (actualAge < 18) {
          setErrorMessage("Người dùng phải đủ 18 tuổi trở lên");
          return;
        }

        if (actualAge > 100) {
          setErrorMessage("Tuổi không hợp lệ (vượt quá 100 tuổi)");
          return;
        }
      }

      // Chuẩn bị dữ liệu để gửi - chỉ gửi những field có giá trị
      const dataToUpdate: IUpdateUserRequest = {
        fullName: profileData.fullName.trim(),
        email: profileData.email.trim(),
      };

      // Thêm phoneNumber nếu có
      if (profileData.phoneNumber && profileData.phoneNumber.trim()) {
        // Chuẩn hóa số điện thoại về format backend yêu cầu
        const cleanPhone = profileData.phoneNumber.trim().replace(/[\s()-]/g, '');
        dataToUpdate.phoneNumber = cleanPhone;
      }

      // Thêm birthDate nếu có và đảm bảo format YYYY-MM-DD
      if (profileData.birthDate && profileData.birthDate.trim()) {
        // Đảm bảo chỉ lấy phần date, không có time
        dataToUpdate.birthDate = profileData.birthDate.split('T')[0];
      }

      await updateProfile(dataToUpdate);
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
      // === VALIDATE CURRENT PASSWORD ===
      if (!passwordData.currentPassword.trim()) {
        setErrorMessage("Vui lòng nhập mật khẩu hiện tại");
        return;
      }

      if (passwordData.currentPassword.length < 6) {
        setErrorMessage("Mật khẩu hiện tại phải có ít nhất 6 ký tự");
        return;
      }

      // === VALIDATE NEW PASSWORD ===
      if (!passwordData.newPassword.trim()) {
        setErrorMessage("Vui lòng nhập mật khẩu mới");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      if (passwordData.newPassword.length > 50) {
        setErrorMessage("Mật khẩu mới không được vượt quá 50 ký tự");
        return;
      }

      // Kiểm tra mật khẩu mới không được giống mật khẩu cũ
      if (passwordData.newPassword === passwordData.currentPassword) {
        setErrorMessage("Mật khẩu mới phải khác mật khẩu hiện tại");
        return;
      }

      // Kiểm tra độ mạnh mật khẩu (tùy chọn - có thể bật/tắt)
      const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
      const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
      const hasNumber = /[0-9]/.test(passwordData.newPassword);
      const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{}|;:'",.<>\\/]/.test(passwordData.newPassword);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        setErrorMessage("Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt");
        return;
      }


      // Kiểm tra không chứa khoảng trắng
      if (/\s/.test(passwordData.newPassword)) {
        setErrorMessage("Mật khẩu không được chứa khoảng trắng");
        return;
      }

      // Kiểm tra không chứa thông tin cá nhân dễ đoán
      if (userDetails) {
        const lowerPassword = passwordData.newPassword.toLowerCase();
        const userName = userDetails.username?.toLowerCase() || '';
        const fullName = userDetails.fullName?.toLowerCase() || '';
        
        if (lowerPassword.includes(userName) && userName.length > 0) {
          setErrorMessage("Mật khẩu không được chứa tên đăng nhập");
          return;
        }

        // Kiểm tra từng từ trong họ tên
        const nameWords = fullName.split(' ').filter(word => word.length > 2);
        for (const word of nameWords) {
          if (lowerPassword.includes(word)) {
            setErrorMessage("Mật khẩu không được chứa tên của bạn");
            return;
          }
        }
      }

      // === VALIDATE CONFIRM PASSWORD ===
      if (!passwordData.confirmPassword.trim()) {
        setErrorMessage("Vui lòng xác nhận mật khẩu mới");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrorMessage("Xác nhận mật khẩu không khớp với mật khẩu mới");
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
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Chỉnh sửa thông tin cá nhân
          </h1>
          <p className="text-sm text-gray-500">
            Cập nhật thông tin tài khoản của bạn
          </p>
        </div>
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
                      minLength={2}
                      maxLength={100}
                      value={profileData.fullName || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Từ 2-100 ký tự, chỉ chữ cái và khoảng trắng
                  </p>
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
                      maxLength={100}
                      value={profileData.email || ""}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="example@domain.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email hợp lệ, tối đa 100 ký tự
                  </p>
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
                      placeholder="0901234567 hoặc +84901234567"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Số điện thoại Việt Nam (10-12 số)
                  </p>
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
                      max={new Date().toISOString().split('T')[0]}
                      min="1900-01-01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tối thiểu 18 tuổi, tối đa 100 tuổi
                  </p>
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Yêu cầu mật khẩu:
                </h4>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span><strong>Độ dài:</strong> Tối thiểu 6 ký tự, tối đa 50 ký tự</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span><strong>Bắt buộc:</strong> Ít nhất 1 chữ hoa (A-Z), 1 chữ thường (a-z), 1 số (0-9)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span><strong>Khuyến nghị:</strong> Sử dụng ký tự đặc biệt (@, $, !, %, *, ?, &, #, ...)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span><strong>Không được:</strong> Chứa khoảng trắng, tên đăng nhập, hoặc tên của bạn</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span><strong>Khác biệt:</strong> Mật khẩu mới phải khác mật khẩu hiện tại</span>
                  </li>
                </ul>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Gợi ý:</strong> Sử dụng cụm từ dễ nhớ kết hợp với số và ký tự đặc biệt. 
                    Ví dụ: &ldquo;MyP@ssw0rd2024!&rdquo;
                  </p>
                </div>
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