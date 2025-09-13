"use client";

import { useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import { ArrowLeft, FileText, Printer, Save } from "lucide-react";
import { mockReplacementRequests } from "@/lib/mockData/replacementRequests";
import SaveDraftSuccessModal from "../modal/SaveDraftSuccessModal";
import SubmitReportSuccessModal from "../modal/SubmitReportSuccessModal";

export default function LapToTrinhPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const selectedRequest = useMemo(
    () => mockReplacementRequests.find((r) => r.id === id),
    [id]
  );

  const [reportData, setReportData] = useState({
    submittedBy: "Giảng Thanh Trọn",
    position: "Tổ trưởng kỹ thuật",
    department: "Khoa Công Nghệ Thông Tin",
    recipientDepartment: "Phòng Quản trị",
    subject: "Khoa Công nghệ Thông tin",
    attachments: "()",
    content: "",
    director: "TS. Lê Nhất Duy",
    rector: "TS. Phan Hồng Hải",
  });

  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setReportData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateContent = () => {
    if (!selectedRequest) return "";

    const totalCost = selectedRequest.estimatedCost.toLocaleString("vi-VN");

    return `Phòng Lab H8.1, H8.2, H8.3 của Khoa CNTT đang cần thay thế thiết bị. Hệ điều hành Windows 10 và một số phần mềm chuyên ngành Khoa học máy tính đã lỗi thời. Máy tính hiện tại không đáp ứng được yêu cầu sử dụng phần mềm chuyên ngành phù hợp với giáo trình và học liệu mới. Hệ điều hành cũ, CPU đã quá lạc hậu so với phiên bản mới nhất. Cần nâng cấp phần mềm mới Intel H310, không thể sử dụng được nâng cấp để tối ưu hiệu suất. Ổ đĩa cứng SSD và RAM máy tính vẫn sử dụng hệ thống cũ. Ổ cứng SSD cũ 256GB, và thông số Ram: DDR4 8GB cần được nâng cấp.

Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành nâng cấp thiết bị để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Thông tin thiết bị cần thay thế:
- Mã tài sản: ${selectedRequest.assetCode}
- Tên thiết bị: ${selectedRequest.assetName}
- Vị trí: ${selectedRequest.location}
- Người đề xuất: ${selectedRequest.requestedBy}
- Lý do: ${selectedRequest.reason}
- Chi phí ước tính: ${totalCost} VNĐ

Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.

Trân trọng kính trình.`;
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Tờ trình ${selectedRequest?.id}</title>
              <style>
                body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.5; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .title { font-weight: bold; margin: 10px 0; }
                .content { text-align: justify; margin: 20px 0; }
                .signature { margin-top: 50px; }
                .signature-section { float: right; text-align: center; width: 200px; margin-left: 20px; }
                .signature-left { float: left; text-align: center; width: 200px; margin-right: 20px; }
                .clearfix { clear: both; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSave = () => {
    console.log("Saving report:", {
      requestId: selectedRequest?.id,
      reportData,
      createdAt: new Date().toISOString(),
    });
    setShowSaveDraftModal(true);
  };

  const handleSubmit = () => {
    console.log("Submitting report:", {
      requestId: selectedRequest?.id,
      reportData,
      submittedAt: new Date().toISOString(),
    });
    setShowSubmitModal(true);
  };

  if (!selectedRequest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy đề xuất
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
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
              href: "/to-truong-ky-thuat/lap-to-trinh",
              title: (
                <div className="flex items-center">
                  <span>Lập tờ trình</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Lập tờ trình #{selectedRequest.id}</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">
              Lập tờ trình - {selectedRequest.assetName}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Printer className="h-4 w-4 mr-2" />
            In
          </button>
        </div>
      </div>

      {/* Form and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Thông tin tờ trình
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người đề nghị
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.submittedBy}
                  onChange={(e) =>
                    handleInputChange("submittedBy", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chức vụ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị đề nghị
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tiếp nhận
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.recipientDepartment}
                  onChange={(e) =>
                    handleInputChange("recipientDepartment", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn vị đề nghị (vấn đề)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={reportData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung tờ trình
              </label>
              <textarea
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={reportData.content || generateContent()}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Nội dung tờ trình sẽ được tự động tạo dựa trên thông tin đề xuất"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giám đốc
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.director}
                  onChange={(e) =>
                    handleInputChange("director", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hiệu trưởng
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.rector}
                  onChange={(e) => handleInputChange("rector", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Xem trước tờ trình
          </h4>
          <div
            ref={printRef}
            className="font-serif border border-gray-200 p-6 rounded">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-2">
                <div className="text-sm">TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM</div>
                <div className="text-sm font-semibold">
                  {reportData.department}
                </div>
              </div>
              <div className="text-right text-sm mb-4">
                <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div>Độc lập – Tự do – Hạnh phúc</div>
                <div className="mt-2">
                  TP.HCM, ngày {new Date().getDate()} tháng{" "}
                  {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <div className="font-bold text-lg mb-2">
                PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC
              </div>
              <div className="text-sm">
                <div>Kính gửi: Ban Giám hiệu</div>
                <div>Đơn vị tiếp nhận: {reportData.recipientDepartment}</div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <div className="mb-4">
                <strong>• Đơn vị đề nghị:</strong> {reportData.subject}
              </div>
              <div className="mb-4">
                <strong>• Các văn bản kèm theo:</strong>{" "}
                {reportData.attachments}
              </div>

              <div className="mb-4">
                <strong>1. Tóm tắt nội dung và đề nghị:</strong>
              </div>

              <div className="mb-6 text-justify leading-relaxed text-sm">
                {reportData.content || generateContent()}
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded border text-sm">
                  <strong>Thông tin thiết bị:</strong>
                  <br />
                  <strong>Mã:</strong> {selectedRequest.assetCode}
                  <br />
                  <strong>Tên:</strong> {selectedRequest.assetName}
                  <br />
                  <strong>Chi phí:</strong>{" "}
                  {selectedRequest.estimatedCost.toLocaleString("vi-VN")} VNĐ
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                  <div className="font-semibold">PHÒNG QUẢN TRỊ</div>
                  <div className="text-sm">(Ký tên và đóng dấu)</div>
                  <div className="mt-16 text-sm">{reportData.director}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">BAN GIÁM HIỆU</div>
                  <div className="text-sm">(Ký tên và đóng dấu)</div>
                  <div className="mt-16 text-sm">{reportData.rector}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                  <div className="font-semibold">NGƯỜI LẬP PHIẾU</div>
                  <div className="text-sm">(Ký tên)</div>
                  <div className="mt-16 text-sm">{reportData.submittedBy}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">THỦ TRƯỞNG ĐƠN VỊ</div>
                  <div className="text-sm">(Ký tên và đóng dấu)</div>
                  <div className="mt-16 text-sm"></div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-12">
                <div>Ghi chú:</div>
                <div>
                  - Phiếu này được lập thành 02 bản: 01 bản lưu đơn vị, 01 bản
                  nộp Phòng Quản trị
                </div>
                <div>
                  - Thời hạn giải quyết: 15 ngày kể từ ngày tiếp nhận hồ sơ đầy
                  đủ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-6 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100">
          <Save className="h-4 w-4 mr-2" />
          Lưu nháp
        </button>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Nộp tờ trình
        </button>
      </div>

      {/* Modal notifications */}
      <SaveDraftSuccessModal
        isOpen={showSaveDraftModal}
        onClose={() => setShowSaveDraftModal(false)}
      />
      <SubmitReportSuccessModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          router.push("/to-truong-ky-thuat/lap-to-trinh");
        }}
      />
    </div>
  );
}
