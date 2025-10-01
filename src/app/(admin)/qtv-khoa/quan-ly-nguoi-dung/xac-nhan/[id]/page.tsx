'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertTriangle, Lock, Unlock, Trash2 } from "lucide-react";
import { Breadcrumb } from 'antd';
import { IUserWithRoles, UserStatus } from "@/types";
import { useUsersManagement } from "@/hooks/useUsersManagement";

export default function UserConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const userId = params.id as string;
  const action = searchParams.get('action') as 'toggle-status' | 'delete';
  
  const { users, toggleUserStatus, deleteUser, loading } = useUsersManagement();
  const [user, setUser] = useState<IUserWithRoles | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (users.length > 0 && userId) {
      const foundUser = users.find(u => u.id === userId);
      setUser(foundUser || null);
    }
  }, [users, userId]);

  const getActionConfig = () => {
    if (!user || !action) return null;

    switch (action) {
      case 'toggle-status':
        return {
          title: user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa tài khoản",
          description: user.status === UserStatus.ACTIVE 
            ? `Bạn có chắc chắn muốn khóa tài khoản của "${user.fullName}"? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản của "${user.fullName}"? Người dùng này sẽ có thể đăng nhập vào hệ thống.`,
          confirmText: user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa",
          confirmClass: user.status === UserStatus.ACTIVE ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700",
          icon: user.status === UserStatus.ACTIVE ? Lock : Unlock,
        };
      case 'delete':
        return {
          title: "Xóa tài khoản",
          description: `Bạn có chắc chắn muốn xóa tài khoản của "${user.fullName}"? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu liên quan.`,
          confirmText: "Xóa tài khoản",
          confirmClass: "bg-red-600 hover:bg-red-700",
          icon: Trash2,
        };
      default:
        return null;
    }
  };

  const handleConfirm = async () => {
    if (!user || !action) return;

    setIsSubmitting(true);
    try {
      let success = false;
      
      if (action === 'toggle-status') {
        success = await toggleUserStatus(user.id);
      } else if (action === 'delete') {
        success = await deleteUser(user.id);
      }

      if (success) {
        router.push('/qtv-khoa/quan-ly-nguoi-dung');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !action) {
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
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Yêu cầu không hợp lệ
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy người dùng hoặc hành động không được chỉ định.
          </p>
        </div>
      </div>
    );
  }

  const actionConfig = getActionConfig();
  if (!actionConfig) {
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
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Hành động không hợp lệ
          </h3>
        </div>
      </div>
    );
  }

  const Icon = actionConfig.icon;

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
                <span>Xác nhận hành động</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{actionConfig.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Xác nhận hành động sẽ thực hiện
          </p>
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-white shadow rounded-lg max-w-2xl">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center space-x-4 mb-6">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              action === 'delete' ? 'bg-red-100' : 
              user.status === UserStatus.ACTIVE ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <Icon className={`h-6 w-6 ${
                action === 'delete' ? 'text-red-600' : 
                user.status === UserStatus.ACTIVE ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{actionConfig.title}</h2>
              <p className="text-gray-600">Hành động với tài khoản người dùng</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700">{actionConfig.description}</p>
          </div>
          
          {/* User info */}
          <div className="p-4 bg-gray-50 rounded-md mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.fullName}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === UserStatus.ACTIVE 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === UserStatus.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for delete action */}
          {action === 'delete' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Cảnh báo: Hành động không thể hoàn tác
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    Việc xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu liên quan. 
                    Thay vào đó, bạn có thể khóa tài khoản để tạm thời vô hiệu hóa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${actionConfig.confirmClass}`}
            >
              {isSubmitting ? "Đang xử lý..." : actionConfig.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}