"use client";

import React from "react";
import { ProfileEditComponent } from "@/components/profile";

/**
 * Trang cập nhật thông tin cá nhân của user
 * Tất cả user đều có thể truy cập
 */
export default function ProfileEditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Cập nhật thông tin cá nhân
          </h1>
          <p className="text-gray-600 mt-1">
            Chỉnh sửa thông tin tài khoản và thay đổi mật khẩu
          </p>
        </div>
      </div>

      <ProfileEditComponent />
    </div>
  );
}