"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "antd";
import { getRepairRequestWithDetails } from "@/lib/mockData";

import { RequestDetailContainer } from "@/components/lecturer/progress";

export default function ChiTietDanhSachYeuCauSuaChuaPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const request = useMemo(() => {
    const result = getRepairRequestWithDetails(id);
    return result;
  }, [id]);

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
            href: "/giang-vien/danh-sach-yeu-cau-sua-chua",
            title: (
              <div className="flex items-center">
                <span>Danh sách yêu cầu sửa chữa</span>
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
