'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, message } from 'antd';
import { IUpdateUserRequest } from "@/types";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { updateUser as updateUserApi } from "@/lib/api/users";
import { useRoles } from "@/hooks/useRoles";
import { useUnits } from "@/hooks/useUnits";
import type { UnitResponseDto } from "@/lib/api/units";
import SuccessModal from "@/components/modal/SuccessModal";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const { currentUser, loading } = useUsersManagement({ userId });
  const { roles, loading: rolesLoading } = useRoles();
  const { units, campuses, loading: unitsLoading, getUnitById } = useUnits();
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [unitDetails, setUnitDetails] = useState<UnitResponseDto | null>(null);
  const [loadingUnitDetails, setLoadingUnitDetails] = useState(false);

  const [formData, setFormData] = useState<IUpdateUserRequest>({
    fullName: "",
    email: "",
    unitId: "",
    phoneNumber: "",
    birthDate: "",
    roleIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**
   * Cuộn đến input đầu tiên có lỗi
   */
  const scrollToFirstError = useCallback(() => {
    // Thứ tự ưu tiên các trường có lỗi (trang chỉnh sửa không có username và password)
    const errorFieldOrder = [
      'fullName',
      'email',
      'phoneNumber',
      'birthDate',
      'unitId',
      'roles',
    ];

    // Tìm trường đầu tiên có lỗi theo thứ tự ưu tiên
    const firstErrorField = errorFieldOrder.find(field => errors[field]);

    if (firstErrorField) {
      // Tìm input element tương ứng
      let inputElement: HTMLElement | null = null;

      if (firstErrorField === 'fullName') {
        // Tìm input fullName
        const inputs = document.querySelectorAll('input[type="text"]');
        inputElement = Array.from(inputs).find(input => {
          const placeholder = (input as HTMLInputElement).placeholder?.toLowerCase() || '';
          return placeholder.includes('nguyễn văn a') || placeholder.includes('họ và tên');
        }) as HTMLElement;
      } else if (firstErrorField === 'email') {
        inputElement = document.querySelector('input[type="email"]') as HTMLElement;
      } else if (firstErrorField === 'phoneNumber') {
        inputElement = document.querySelector('input[type="tel"]') as HTMLElement;
      } else if (firstErrorField === 'birthDate') {
        inputElement = document.querySelector('input[type="date"]') as HTMLElement;
      } else if (firstErrorField === 'unitId') {
        // Tìm select đơn vị - tìm select thứ 2 (sau select cơ sở)
        const selects = document.querySelectorAll('select');
        if (selects.length >= 2) {
          inputElement = selects[1] as HTMLElement;
        } else {
          inputElement = document.querySelector('select[title*="đơn vị"]') as HTMLElement;
        }
      } else if (firstErrorField === 'roles') {
        // Cuộn đến phần roles - tìm container chứa checkboxes
        const roleSection = document.querySelector('label[class*="cursor-pointer"]')?.closest('div');
        if (roleSection) {
          inputElement = roleSection as HTMLElement;
        } else {
          inputElement = document.querySelector('input[type="checkbox"]')?.closest('div') as HTMLElement;
        }
      }

      // Nếu vẫn không tìm thấy, tìm element có class chứa error (border-red-500)
      if (!inputElement) {
        const errorElements = document.querySelectorAll('.border-red-500');
        if (errorElements.length > 0) {
          inputElement = errorElements[0] as HTMLElement;
        }
      }

      if (inputElement) {
        // Cuộn đến element với smooth behavior
        inputElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // Focus vào input sau một chút delay để đảm bảo scroll đã hoàn thành
        setTimeout(() => {
          if (inputElement) {
            if (inputElement.tagName === 'INPUT' || inputElement.tagName === 'SELECT') {
              (inputElement as HTMLInputElement | HTMLSelectElement).focus();
            } else {
              // Nếu là container, tìm input bên trong
              const innerInput = inputElement.querySelector('input, select') as HTMLInputElement | HTMLSelectElement | null;
              if (innerInput) {
                innerInput.focus();
              }
            }
          }
        }, 300);
      }
    }
  }, [errors]);

  // Tự động cuộn đến input có lỗi khi errors thay đổi
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Delay một chút để đảm bảo DOM đã render xong
      const timer = setTimeout(() => {
        scrollToFirstError();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [errors, scrollToFirstError]);

  // Lấy thông tin chi tiết của đơn vị người dùng để tìm campus
  useEffect(() => {
    const fetchUnitDetails = async () => {
      if (currentUser?.unit?.id) {
        setLoadingUnitDetails(true);
        try {
          // Lấy thông tin đầy đủ của unit
          const unitData = await getUnitById(currentUser.unit.id);
          setUnitDetails(unitData);
          
          // Nếu unit có parentUnitId, đó chính là campusId
          if (unitData.parentUnitId) {
            setSelectedCampusId(unitData.parentUnitId);
          }
        } catch (err) {
          console.error('Error fetching unit details:', err);
          setUnitDetails(null);
        } finally {
          setLoadingUnitDetails(false);
        }
      }
    };

    fetchUnitDetails();
  }, [currentUser?.unit?.id, getUnitById]);

  // Filter units based on selected campus
  const filteredUnits = useMemo(() => {
    if (!selectedCampusId) return [];
    
    return units.filter(unit => {
      // Find the campus that contains this unit
      const parentCampus = campuses.find(campus => 
        campus.childUnits?.some(child => child.id === unit.id)
      );
      return parentCampus?.id === selectedCampusId;
    });
  }, [selectedCampusId, units, campuses]);

  // Handle campus selection - reset unit when campus changes
  const handleCampusChange = (campusId: string) => {
    setSelectedCampusId(campusId);
    // Reset unitId when campus changes
    setFormData(prev => ({ ...prev, unitId: "" }));
  };

  useEffect(() => {
    if (currentUser) {
      // Ưu tiên lấy từ currentUser.unit.id nếu có, fallback về unitId
      const unitIdToUse = currentUser.unit?.id || currentUser.unitId || "";
      
      setFormData({
        fullName: currentUser.fullName,
        email: currentUser.email || "",
        unitId: unitIdToUse,
        phoneNumber: currentUser.phoneNumber || "",
        birthDate: currentUser.birthDate || "",
        roleIds: currentUser.roles.map(r => r.id),
      });
    }
  }, [currentUser]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = "Họ và tên không được vượt quá 100 ký tự";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email không được vượt quá 100 ký tự";
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Phone number validation (optional but must be valid if provided)
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const cleanedPhone = formData.phoneNumber.replace(/[\s()-]/g, '');
      if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(cleanedPhone)) {
        newErrors.phoneNumber = "Số điện thoại không đúng định dạng Việt Nam (VD: 0901234567, +84901234567)";
      }
    }

    // Birth date validation (optional but must be valid if provided)
    if (formData.birthDate && formData.birthDate.trim()) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      
      // Reset time parts for accurate comparison
      today.setHours(0, 0, 0, 0);
      birthDate.setHours(0, 0, 0, 0);

      if (isNaN(birthDate.getTime())) {
        newErrors.birthDate = "Ngày sinh không hợp lệ";
      } else if (birthDate > today) {
        newErrors.birthDate = "Ngày sinh không được là ngày trong tương lai";
      } else if (birthDate.getFullYear() < 1900) {
        newErrors.birthDate = "Năm sinh phải từ 1900 trở đi";
      } else {
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < 18) {
          newErrors.birthDate = "Người dùng phải đủ 18 tuổi";
        } else if (age > 100) {
          newErrors.birthDate = "Tuổi không được vượt quá 100";
        }
      }
    }

    // Roles validation
    if (!formData.roleIds || formData.roleIds.length === 0) {
      newErrors.roles = "Phải chọn ít nhất một vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Clean and prepare data before sending
      const cleanedData: IUpdateUserRequest = {
        fullName: (formData.fullName || "").trim(),
        email: (formData.email || "").trim().toLowerCase(),
        roleIds: formData.roleIds || [],
      };

      // Add optional fields only if they have values
      if (formData.unitId && formData.unitId.trim()) {
        cleanedData.unitId = formData.unitId.trim();
      }

      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        // Clean phone number: remove spaces, parentheses, hyphens
        cleanedData.phoneNumber = formData.phoneNumber.replace(/[\s()-]/g, '');
      }

      if (formData.birthDate && formData.birthDate.trim()) {
        // Ensure birthDate is in YYYY-MM-DD format
        const birthDate = formData.birthDate.split('T')[0];
        cleanedData.birthDate = birthDate;
      }

      await updateUserApi(userId, cleanedData);
      
      // Hiển thị modal thành công
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number };
      const errorStatus = error.statusCode;
      const errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật người dùng';

      console.log('Error caught in handleSubmit:', { errorStatus, errorMessage, error });

      // Xử lý lỗi conflict (409) - Username hoặc Email đã tồn tại
      if (errorStatus === 409) {
        const fieldErrors: Record<string, string> = {};
        
        // Kiểm tra message để xác định field bị lỗi
        const lowerMessage = errorMessage.toLowerCase();
        if (errorMessage.includes('Tên đăng nhập') || lowerMessage.includes('username') || lowerMessage.includes('tên đăng nhập')) {
          fieldErrors.username = errorMessage;
          setErrors(fieldErrors);
          message.error(errorMessage, 5); // Hiển thị 5 giây
        } else if (errorMessage.includes('Email') || lowerMessage.includes('email')) {
          fieldErrors.email = errorMessage;
          setErrors(fieldErrors);
          message.error(errorMessage, 5); // Hiển thị 5 giây
        } else {
          // Nếu không xác định được field, hiển thị lỗi chung
          message.error(errorMessage, 5);
        }
      } 
      // Xử lý lỗi validation (400) - Dữ liệu không hợp lệ
      else if (errorStatus === 400) {
        // Nếu error message chứa thông tin về các trường cụ thể, có thể parse và hiển thị
        const fieldErrors: Record<string, string> = {};
        
        // Kiểm tra các trường phổ biến trong validation errors
        if (errorMessage.toLowerCase().includes('username')) {
          fieldErrors.username = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('email')) {
          fieldErrors.email = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('password')) {
          fieldErrors.password = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('fullname') || errorMessage.toLowerCase().includes('full name')) {
          fieldErrors.fullName = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('phone')) {
          fieldErrors.phoneNumber = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('birth') || errorMessage.toLowerCase().includes('birthdate')) {
          fieldErrors.birthDate = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('role')) {
          fieldErrors.roles = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('unit')) {
          fieldErrors.unitId = errorMessage;
        }

        // Nếu có field errors cụ thể, set vào errors state
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
        
        message.error(errorMessage);
      } 
      // Xử lý các lỗi khác
      else {
        message.error(errorMessage);
        console.error('Error updating user:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: (prev.roleIds || []).includes(roleId)
        ? (prev.roleIds || []).filter(id => id !== roleId)
        : [...(prev.roleIds || []), roleId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
        <div className="text-center py-12">
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Không tìm thấy người dùng
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Người dùng có ID {userId} không tồn tại trong hệ thống.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/qtv-khoa',
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: '/qtv-khoa/quan-ly-nguoi-dung',
            title: (
              <div className="flex items-center">
                <span>Quản lý người dùng</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chỉnh sửa người dùng</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
          <p className="mt-1 text-sm text-gray-600">
            Cập nhật thông tin cho người dùng: {currentUser.fullName} (@{currentUser.username})
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={currentUser.username}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                title="Tên đăng nhập không thể thay đổi"
              />
              <p className="mt-1 text-xs text-gray-500">Tên đăng nhập không thể thay đổi</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : ""
                }`}
                placeholder="VD: Nguyễn Văn A"
                minLength={2}
                maxLength={100}
                title="Nhập họ và tên đầy đủ"
              />
              <p className="mt-1 text-xs text-gray-500">Từ 2-100 ký tự, chỉ chữ cái và khoảng trắng</p>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="VD: user@example.com"
                maxLength={100}
                title="Nhập địa chỉ email hợp lệ"
              />
              <p className="mt-1 text-xs text-gray-500">Email hợp lệ, tối đa 100 ký tự</p>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
                placeholder="VD: 0901234567 hoặc +84901234567"
                pattern="(\+84|84|0)(3|5|7|8|9)[0-9]{8}"
                title="Số điện thoại Việt Nam"
              />
              <p className="mt-1 text-xs text-gray-500">Số điện thoại Việt Nam (10-12 số, bắt đầu 03/05/07/08/09)</p>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.birthDate ? "border-red-500" : ""
                }`}
                min="1900-01-01"
                max={new Date().toISOString().split('T')[0]}
                title="Chọn ngày sinh"
              />
              <p className="mt-1 text-xs text-gray-500">Tối thiểu 18 tuổi, tối đa 100 tuổi</p>
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
              )}
            </div>

            {/* Campus Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cơ sở
              </label>
              <select
                value={selectedCampusId}
                onChange={(e) => handleCampusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Chọn cơ sở"
                disabled={unitsLoading}
              >
                <option value="">
                  {unitsLoading ? "Đang tải..." : "Chọn cơ sở"}
                </option>
                {campuses.map(campus => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Chọn cơ sở trước để hiển thị danh sách đơn vị</p>
            </div>

            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị
              </label>
              <select
                value={formData.unitId}
                onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Chọn đơn vị"
                disabled={!selectedCampusId || unitsLoading}
              >
                <option value="">
                  {!selectedCampusId 
                    ? "Vui lòng chọn cơ sở trước" 
                    : unitsLoading 
                      ? "Đang tải..." 
                      : "Chọn đơn vị"}
                </option>
                {filteredUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.displayName}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {!selectedCampusId 
                  ? "Chọn cơ sở để xem danh sách đơn vị" 
                  : `${filteredUnits.length} đơn vị khả dụng`}
              </p>
            </div>
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Vai trò <span className="text-red-500">*</span>
            </label>
            {rolesLoading ? (
              <div className="text-sm text-gray-500">Đang tải vai trò...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map(role => (
                  <label key={role.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.roleIds?.includes(role.id) || false}
                      onChange={() => handleRoleToggle(role.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{role.name}</span>
                  </label>
                ))}
              </div>
            )}
            {errors.roles && (
              <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Chuyển hướng sau khi đóng modal
          router.push('/qtv-khoa/quan-ly-nguoi-dung');
        }}
        title="Cập nhật người dùng thành công!"
        message="Thông tin người dùng đã được cập nhật thành công trong hệ thống."
      />
    </div>
  );
}