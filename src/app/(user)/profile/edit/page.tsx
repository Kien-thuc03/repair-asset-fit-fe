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
      <ProfileEditComponent />
    </div>
  );
}