"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { RoleInfo } from "@/types/repair";
import { UserRole } from "@/types/repair";
import {
  User,
  Mail,
  Building,
  Shield,
  Calendar,
  Edit3,
  ArrowLeft,
  Phone,
  Clock,
} from "lucide-react";

/**
 * Component hiển thị thông tin cá nhân của user với dữ liệu đầy đủ từ database
 */
export function ProfileInfoComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const { userDetails, isLoading } = useProfile();

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-500 text-center">
          Vui lòng đăng nhập để xem thông tin cá nhân
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        
        <div className="flex items-center justify-between gap-4">
          <button
          onClick={() => router.back()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Thông tin cá nhân
            </h1>
            <p className="text-gray-600 mt-1">
              Xem thông tin tài khoản và đơn vị của bạn
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/profile/edit")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Cập nhật thông tin
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user.fullName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">
                {user.fullName}
              </h2>
              <p className="text-blue-100 text-sm">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                <User className="h-4 w-4" />
                <span>Họ và tên</span>
              </div>
              <p className="text-gray-900 font-medium">
                {userDetails?.fullName || user.fullName}
              </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                <User className="h-4 w-4" />
                <span>Tên đăng nhập</span>
              </div>
              <p className="text-gray-900 font-medium">
                @{userDetails?.username || user.username}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-gray-900">{userDetails?.email || user.email}</p>
            </div>

            {/* Phone Number */}
            {userDetails?.phoneNumber && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>Số điện thoại</span>
                </div>
                <p className="text-gray-900">{userDetails.phoneNumber}</p>
              </div>
            )}

            {/* Birth Date */}
            {userDetails?.birthDate && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Ngày sinh</span>
                </div>
                <p className="text-gray-900">
                  {new Date(userDetails.birthDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Trạng thái</span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  userDetails?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  userDetails?.status === 'ACTIVE' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {userDetails?.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* Unit Information */}
          {(userDetails?.unitName || user.unit) && (
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-4">
                <Building className="h-4 w-4" />
                <span>Thông tin đơn vị</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Tên đơn vị:</span>
                    <p className="text-gray-900 mt-1">
                      {userDetails?.unitName || user.unit?.name || "Chưa có thông tin"}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Loại đơn vị:</span>
                    <p className="text-gray-900 mt-1">
                      {userDetails?.unitType ? 
                        userDetails.unitType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                        (user.unit?.type || "Chưa có thông tin")
                      }
                    </p>
                  </div>

                  {userDetails?.unitPhone && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Điện thoại đơn vị:</span>
                      <p className="text-gray-900 mt-1">{userDetails.unitPhone}</p>
                    </div>
                  )}

                  {userDetails?.unitEmail && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email đơn vị:</span>
                      <p className="text-gray-900 mt-1">{userDetails.unitEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Roles Section */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-4">
              <Shield className="h-4 w-4" />
              <span>Vai trò & Quyền hạn</span>
            </div>

            <div className="space-y-4">
              {/* Active Role */}
              {user.activeRole && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-green-800">
                        Vai trò hiện tại
                      </h4>
                      <p className="text-green-700 mt-1">
                        {user.activeRole.name || 
                         (user.activeRole.code && RoleInfo[user.activeRole.code as UserRole]?.name) ||
                         "Vai trò không xác định"
                        }
                      </p>
                    </div>
                    <div className="bg-green-100 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-green-800">
                        Đang sử dụng
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* All Roles */}
              {user.roles && user.roles.length > 1 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Tất cả vai trò ({user.roles.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.roles.map((role) => (
                      <div
                        key={role.id}
                        className={`border rounded-lg p-3 ${
                          role.code === user.activeRole?.code
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">
                            {role.name || 
                             (role.code && RoleInfo[role.code as UserRole]?.name) ||
                             "Vai trò không xác định"
                            }
                          </span>
                          {role.code === user.activeRole?.code && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-4">
              <Clock className="h-4 w-4" />
              <span>Thông tin tài khoản</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Loại tài khoản:</span>
                  <p className="font-medium text-gray-900 mt-1">
                    Tài khoản hệ thống
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-500">Trạng thái:</span>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      userDetails?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`font-medium ${
                      userDetails?.status === 'ACTIVE' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {userDetails?.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>

                {userDetails?.createdAt && (
                  <div>
                    <span className="text-gray-500">Ngày tạo:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(userDetails.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}

                {userDetails?.updatedAt && (
                  <div>
                    <span className="text-gray-500">Cập nhật lần cuối:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(userDetails.updatedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}