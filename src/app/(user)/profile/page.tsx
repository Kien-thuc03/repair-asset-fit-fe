"use client";

import React from "react";
import { ProfileInfoComponent } from "@/components/profile";

/**
 * Trang xem thông tin cá nhân của user
 * Tất cả user đều có thể truy cập
 */
export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 mt-1">
            Xem thông tin tài khoản và đơn vị của bạn
          </p>
        </div>
      </div>

      <ProfileInfoComponent />
    </div>
  );
}