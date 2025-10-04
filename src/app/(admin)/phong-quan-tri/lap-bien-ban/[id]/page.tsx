"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Building,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileCheck,
} from "lucide-react";
import { Breadcrumb, Modal } from "antd";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus } from "@/types/repair";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [showInspectionForm, setShowInspectionForm] = useState(false);

  // Tìm replacement request theo ID
  const request = mockReplacementRequestItem.find((r) => r.id === id);

  const getStatusColor = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt - Cần lập biên bản";
      default:
        return status;
    }
  };

  const handleCreateInspectionReport = () => {
   
    setShowInspectionForm(true);
  };

  const handleCloseInspectionForm = () => {
    
    setShowInspectionForm(false);
  };

  const handleSubmitInspectionReport = () => {
  

    // Đóng modal biên bản trước
    setShowInspectionForm(false);

    // Tăng thời gian chờ để đảm bảo modal đã được đóng hoàn toàn trước khi chuyển trang
    setTimeout(() => {

      router.push("/phong-quan-tri/lap-bien-ban");
    }, 300);
  };

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">
          Không tìm thấy tờ trình
        </h3>
        <p className="text-gray-500">
          Tờ trình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="mb-2">
          <Breadcrumb
            items={[
              {
                href: "/",
                title: (
                  <div className="flex items-center">
                    <span>Trang chủ</span>
                  </div>
                ),
              },
              {
                href: "/phong-quan-tri",
                title: (
                  <div className="flex items-center">
                    <span>Phòng quản trị</span>
                  </div>
                ),
              },
              {
                href: "/phong-quan-tri/lap-bien-ban",
                title: (
                  <div className="flex items-center">
                    <span>Lập biên bản</span>
                  </div>
                ),
              },
              {
                title: (
                  <div className="flex items-center">
                    <span>Chi tiết biên bản {request.proposalCode}</span>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Chi tiết tờ trình thay thế linh kiện
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Mã tờ trình: {request.proposalCode}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    request.status
                  )}`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-2">{getStatusText(request.status)}</span>
                </span>
                <button
                  onClick={handleCreateInspectionReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Lập biên bản
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Request Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin tờ trình
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã tờ trình
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {request.proposalCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tiêu đề
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {request.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <div className="mt-1 flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Người tạo
                    </label>
                    <div className="mt-1 flex items-center text-sm text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {request.createdBy}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {request.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Components List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Danh sách linh kiện cần thay thế ({request.components.length}{" "}
                loại)
              </h3>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phòng/Vị trí
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Linh kiện hiện tại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Linh kiện thay thế
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lý do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {request.components.map((component, index) => (
                      <tr
                        key={component.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 text-gray-400 mr-2" />
                              {component.buildingName} - {component.roomName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Máy: {component.machineLabel}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {component.componentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {component.assetName} ({component.assetCode})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {component.newItemName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {component.newItemSpecs}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {component.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {component.reason}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Ngày tạo:</span>
                  <span className="ml-2">
                    {new Date(request.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Cập nhật lần cuối:</span>
                  <span className="ml-2">
                    {new Date(request.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Người tạo:</span>
                  <span className="ml-2">{request.createdBy}</span>
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>
                  <span className="ml-2">{getStatusText(request.status)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal biên bản kiểm tra */}
        <Modal
          title={null}
          open={showInspectionForm}
          onCancel={handleCloseInspectionForm}
          footer={[
            <button
              key="cancel"
              onClick={handleCloseInspectionForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3">
              Hủy
            </button>,
            <button
              key="submit"
              type="button"
              onClick={() => {
                console.log("Clicked: Gửi biên bản");
                handleSubmitInspectionReport();
              }}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Gửi biên bản
            </button>,
          ]}
          width={1000}
          centered
          className="inspection-report-modal">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                TRƯỜNG ĐẠI HỌC CÔNG
                NGHIỆP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CỘNG
                HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-sm text-gray-600 mb-2">
                THÀNH PHỐ HỒ CHÍ
                MINH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Độc
                lập - Tự do - Hạnh phúc
              </div>
              <div className="text-sm text-gray-600 mb-4">PHÒNG QUẢN TRỊ</div>
              <div className="text-right text-sm text-gray-600 mb-6">
                Thành phố Hồ Chí Minh, ngày ___ tháng ___ năm 2025
              </div>
              <div className="text-xl font-bold text-center mb-2">BIÊN BẢN</div>
              <div className="text-base font-semibold text-center mb-4">
                Kiểm tra tình trạng kỹ thuật cơ sở vật chất hư hỏng hoặc cần cải
                tạo
              </div>
              <div className="text-base font-semibold text-center mb-6">
                để đề xuất giải pháp khắc phục
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Thông tin chung */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Căn cứ đề nghị của: </span>
                  <span className="underline">Khoa CNTT Nam Thăng</span>
                  <span className="ml-4 font-medium">Năm: </span>
                  <span className="underline">2025</span>
                </div>
                <div>
                  <span className="font-medium">Hôm nay, </span>
                  <span className="font-medium">Ngày: </span>
                  <span className="underline">___</span>
                  <span className="font-medium ml-2">Tháng: </span>
                  <span className="underline">___</span>
                  <span className="font-medium ml-2">Năm: </span>
                  <span className="underline">2025</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Tại vị trí: </span>
                  <span className="underline">
                    _________________________________
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Chúng tôi gồm có: </span>
                </div>
                <div className="col-span-2 ml-4">
                  <div className="mb-2">
                    <span className="font-medium">1. Ông: </span>
                    <span className="underline">Giang Thanh Trọn</span>
                    <span className="ml-8 font-medium">đại diện: </span>
                    <span className="underline">Khoa CNTT</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">2. Ông: </span>
                    <span className="underline">Nguyễn Văn Ngã</span>
                    <span className="ml-8 font-medium">đại diện: </span>
                    <span className="underline">Phòng Quản trị</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">
                    Cùng lập biên bản kiểm tra tình trạng kỹ thuật của cơ sở vật
                    chất hư hỏng cần thay thế:{" "}
                  </span>
                </div>
              </div>

              {/* Bảng linh kiện */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        TT
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        Nội dung kiểm tra
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        Số lượng
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        Vị trí
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        Tình trạng
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        Giải pháp khắc phục
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.components.map((component, index) => (
                      <tr key={component.id}>
                        <td className="border border-gray-400 px-2 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          <div className="font-medium">
                            {component.componentName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {component.assetName} ({component.assetCode})
                          </div>
                        </td>
                        <td className="border border-gray-400 px-2 py-2 text-center">
                          {component.quantity}
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          <div className="text-xs">
                            {component.buildingName} - {component.roomName}
                          </div>
                          <div className="text-xs text-gray-600">
                            Máy: {component.machineLabel}
                          </div>
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          Hỏng
                        </td>
                        <td className="border border-gray-400 px-2 py-2">
                          <div className="text-xs">- Đề nghị thay thế:</div>
                          <div className="text-xs font-medium">
                            1. {component.newItemName}
                          </div>
                          <div className="text-xs">
                            2. {component.newItemSpecs}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kết luận */}
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="font-medium">
                    Đại diện các đơn vị tham gia công tác kiểm tra tình trạng kỹ
                    thuật của cơ sở vật chất hư hỏng cùng đồng ý với nội dung
                    trên;{" "}
                  </span>
                  <span className="font-medium">Đồng ý với kỹ sư. </span>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div className="text-center">
                    <div className="font-medium mb-16">Khoa CNTT</div>
                    <div className="font-medium mb-4">Nhân viên Kỹ thuật</div>
                    <div className="text-center">
                      <div className="font-medium">Giang Thanh Trọn</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium mb-16">Phòng Quản trị</div>
                    <div className="font-medium mb-4">Người thực hiện</div>
                    <div className="text-center">
                      <div className="font-medium">Nguyễn Ngã</div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <div className="font-medium mb-4">
                    Ý kiến của Lãnh đạo Phòng Quản trị:
                  </div>
                  <div className="h-16 border-b border-gray-300 mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
