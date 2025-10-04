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
      <ProfileInfoComponent />
    </div>
  );
}