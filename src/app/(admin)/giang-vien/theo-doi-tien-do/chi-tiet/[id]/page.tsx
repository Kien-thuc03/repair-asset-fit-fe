"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "antd";
import { mockRepairRequests } from "@/lib/mockData";
import { RequestDetailContainer } from "@/components/lecturer/progress";

export default function ChiTietTheoDaoTienDoPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const request = useMemo(
    () => mockRepairRequests.find((r) => r.id === id),
    [id]
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
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
            href: "/giang-vien/theo-doi-tien-do",
            title: (
              <div className="flex items-center">
                <span>Theo dõi tiến độ</span>
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

      <RequestDetailContainer request={request} />
    </div>
  );
}
