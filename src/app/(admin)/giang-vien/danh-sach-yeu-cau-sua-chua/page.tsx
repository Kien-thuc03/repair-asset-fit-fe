"use client";

import { Breadcrumb } from "antd";
import ProgressTrackingContainer from "@/components/lecturer/progress/ProgressTrackingContainer";

export default function DanhSachYeuCauSuaChuaPage() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Danh sách báo hỏng thiết bị</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      <ProgressTrackingContainer />
    </div>
  );
}
