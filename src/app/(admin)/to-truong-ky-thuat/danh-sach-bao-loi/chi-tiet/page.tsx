"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "antd";
import { getRepairRequestWithDetails } from "@/lib/mockData";
import { RequestDetailContainer } from "@/components/lecturer/progress";

export default function ChiTietBaoLoiPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  const request = useMemo(() => {
    if (!requestId) return null;
    return getRepairRequestWithDetails(requestId);
  }, [requestId]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/to-truong-ky-thuat",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: "/to-truong-ky-thuat/danh-sach-bao-loi",
            title: (
              <div className="flex items-center">
                <span>Danh sách báo lỗi</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết • {request?.requestCode || "N/A"}</span>
              </div>
            ),
          },
        ]}
      />

      <RequestDetailContainer
        request={request}
        backUrl="/to-truong-ky-thuat/danh-sach-bao-loi"
      />
    </div>
  );
}
