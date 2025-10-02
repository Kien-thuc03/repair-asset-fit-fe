'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Users, Shield, Calendar, Mail, Phone, Building, Edit } from "lucide-react";
import { Breadcrumb } from 'antd';
import { IUserWithRoles } from "@/types";
import { useUsersManagement } from "@/hooks/useUsersManagement";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const { users, loading } = useUsersManagement();
  const [user, setUser] = useState<IUserWithRoles | null>(null);

  useEffect(() => {
    if (users.length > 0 && userId) {
      const foundUser = users.find(u => u.id === userId);
      setUser(foundUser || null);
    }
  }, [users, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
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
          <Users className="mx-auto h-12 w-12 text-gray-400" />
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
                <span>Chi tiết người dùng</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h1>
            <p className="mt-1 text-sm text-gray-600">
              Thông tin chi tiết của người dùng trong hệ thống
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/qtv-khoa/quan-ly-nguoi-dung/chinh-sua/${user.id}`)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </button>
      </div>

      {/* User Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h4>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{user.email || 'Chưa cập nhật'}</p>
                </div>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="text-gray-900">{user.phoneNumber}</p>
                  </div>
                </div>
              )}

              {user.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày sinh</p>
                    <p className="text-gray-900">
                      {new Date(user.birthDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}

              {user.unit && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Đơn vị</p>
                    <p className="text-gray-900">{user.unit.name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Vai trò và quyền</h4>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Vai trò</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.roles.map(role => (
                      <span 
                        key={role.id}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {user.permissions && user.permissions.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Quyền hạn</p>
                    <div className="mt-1 space-y-1">
                      {user.permissions.map(permission => (
                        <div key={permission.id} className="text-sm text-gray-700">
                          • {permission.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin hoạt động</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Ngày tạo</p>
                <p className="text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
              {user.updatedAt && (
                <div>
                  <p className="text-gray-600">Cập nhật lần cuối</p>
                  <p className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}