"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import { ArrowLeft, FileText, Printer, Save } from "lucide-react";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus, SubmissionFormData } from "@/types/repair";
import { users } from "@/lib/mockData/users";
import { SuccessModal } from "@/components/modal";
import {
  saveSubmissionForm,
  updateReplacementRequestStatus,
  generateSubmissionFormUrl,
  validateSubmissionFormData,
} from "@/lib/api/submissionForm";

export default function LapToTrinhPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // Lấy đề xuất thay thế đã được duyệt (ĐÃ_DUYỆT) để lập tờ trình
  // Lấy đề xuất thay thế đã được duyệt (ĐÃ_DUYỆT) để lập tờ trình
  const selectedRequest = useMemo(() => {
    return mockReplacementRequestItem.find(
      (request) =>
        request.id === id && request.status === ReplacementStatus.ĐÃ_DUYỆT
    );
  }, [id]);

  // Lấy thông tin từ các components trong đề xuất để hiển thị
  const proposalInfo = useMemo(() => {
    if (!selectedRequest) return null;

    // Lấy thông tin người đề xuất
    const proposer = users.find((u) => u.id === selectedRequest.proposerId);

    // Tính toán thông tin tổng hợp từ components
    const firstComponent = selectedRequest.components[0];
    const allAssetCodes = [
      ...new Set(selectedRequest.components.map((c) => c.assetCode)),
    ];
    const allAssetNames = [
      ...new Set(selectedRequest.components.map((c) => c.assetName)),
    ];
    const allLocations = [
      ...new Set(
        selectedRequest.components.map(
          (c) => `${c.buildingName} - ${c.roomName}`
        )
      ),
    ];
    const allReasons = [
      ...new Set(selectedRequest.components.map((c) => c.reason)),
    ];

    return {
      assetCodes: allAssetCodes.join(", "),
      assetNames: allAssetNames.join(", "),
      locations: allLocations.join(", "),
      proposerName: proposer?.fullName || "Không xác định",
      reasons: allReasons.join("; "),
      primaryAssetCode: firstComponent?.assetCode || "",
      primaryAssetName: firstComponent?.assetName || "",
    };
  }, [selectedRequest]);

  const [reportData, setReportData] = useState<SubmissionFormData>({
    submittedBy: "Giảng Thanh Trọn", // Sẽ được cập nhật khi proposalInfo có sẵn
    position: "Tổ trưởng kỹ thuật",
    department: "Khoa Công Nghệ Thông Tin",
    recipientDepartment: "Phòng Quản trị",
    subject: "Đề xuất thay thế linh kiện thiết bị",
    attachments: selectedRequest?.proposalCode
      ? `Đề xuất ${selectedRequest.proposalCode}`
      : "()",
    content: "",
    director: "TS. Lê Nhất Duy",
    rector: "TS. Phan Hồng Hải",
  });

  // Cập nhật thông tin khi proposalInfo có sẵn
  useEffect(() => {
    if (
      proposalInfo?.proposerName &&
      reportData.submittedBy === "Giảng Thanh Trọn"
    ) {
      setReportData((prev) => ({
        ...prev,
        submittedBy: proposalInfo.proposerName,
      }));
    }
  }, [proposalInfo, reportData.submittedBy]);

  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    field: keyof SubmissionFormData,
    value: string
  ) => {
    setReportData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateContent = () => {
    if (!selectedRequest || !proposalInfo) return "";

    // Tạo danh sách chi tiết các linh kiện cần thay thế
    const componentsList = selectedRequest.components
      .map(
        (comp) =>
          `- ${comp.componentName} (${comp.assetCode}) tại ${comp.roomName}: ${comp.reason} → Thay thế bằng ${comp.newItemName} (${comp.newItemSpecs})`
      )
      .join("\n");

    return `Phòng Lab ${proposalInfo.locations} của Khoa CNTT đang cần thay thế thiết bị. Một số linh kiện máy tính đã hư hỏng và cần được thay thế để đảm bảo hoạt động ổn định của hệ thống.

Thông tin chi tiết về đề xuất thay thế:

${componentsList}

Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành thay thế các linh kiện để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Thông tin tổng hợp:
- Mã đề xuất: ${selectedRequest.proposalCode}
- Tiêu đề: ${selectedRequest.title}
- Người đề xuất: ${proposalInfo.proposerName}
- Tổng số linh kiện cần thay: ${selectedRequest.components.length}
- Lý do chung: ${proposalInfo.reasons}

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
                table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                th, td { border: 1px solid #000; padding: 4px 6px; font-size: 12px; }
                th { background-color: #f5f5f5; font-weight: bold; text-align: center; }
                .text-center { text-align: center; }
                .font-mono { font-family: monospace; }
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

  const handleSubmit = async () => {
    if (!selectedRequest || isSubmitting) return;

    // Validate form data trước khi submit
    const validationErrors = validateSubmissionFormData(reportData);
    if (validationErrors.length > 0) {
      console.error("❌ Validation errors:", validationErrors);
      // TODO: Show validation errors to user
      alert("Vui lòng điền đầy đủ thông tin:\n" + validationErrors.join("\n"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate đường dẫn tờ trình
      const submissionFormUrl = generateSubmissionFormUrl(
        selectedRequest.proposalCode
      );

      console.log("📝 Submitting report with status update:", {
        requestId: selectedRequest.id,
        oldStatus: selectedRequest.status,
        newStatus: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
        submissionFormUrl: submissionFormUrl,
        reportData,
        submittedAt: new Date().toISOString(),
      });

      // TODO: Get current user ID (tổ trưởng kỹ thuật)
      const currentUserId = "user-leadtech-01"; // Mock user ID

      // 1. Lưu thông tin tờ trình vào database
      const submissionForm = await saveSubmissionForm({
        proposalId: selectedRequest.id,
        proposalCode: selectedRequest.proposalCode,
        submissionFormUrl: submissionFormUrl,
        formData: reportData,
        submittedBy: currentUserId,
      });

      console.log("✅ Submission form saved:", submissionForm);

      // 2. Cập nhật trạng thái đề xuất từ ĐÃ_DUYỆT thành ĐÃ_LẬP_TỜ_TRÌNH
      const updateSuccess = await updateReplacementRequestStatus(
        selectedRequest.id,
        {
          status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
          submissionFormUrl: submissionFormUrl,
          updatedAt: new Date().toISOString(),
        }
      );

      if (updateSuccess) {
        console.log("✅ Replacement request status updated successfully");
        setShowSubmitModal(true);
      } else {
        console.error("❌ Failed to update replacement request status");
        alert("Có lỗi xảy ra khi cập nhật trạng thái đề xuất");
      }
    } catch (error) {
      console.error("❌ Error submitting report:", error);
      alert("Có lỗi xảy ra khi nộp tờ trình. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <span>Lập tờ trình #{selectedRequest.proposalCode}</span>
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
              Lập tờ trình - {selectedRequest.title}
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
                <div className="text-sm">
                  <strong>Thông tin đề xuất:</strong> {selectedRequest.title}
                </div>
                <div className="mt-3">
                  <table className="w-full border-collapse border border-gray-400 text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-2 py-1 text-left">
                          STT
                        </th>
                        <th className="border border-gray-400 px-2 py-1 text-left">
                          Tên linh kiện
                        </th>
                        <th className="border border-gray-400 px-2 py-1 text-left">
                          Mã tài sản
                        </th>
                        <th className="border border-gray-400 px-2 py-1 text-left">
                          Vị trí
                        </th>
                        <th className="border border-gray-400 px-2 py-1 text-left">
                          Lý do thay thế
                        </th>
                        <th className="border border-gray-400 px-2 py-1 text-left">
                          Linh kiện thay thế
                        </th>
                        <th className="border border-gray-400 px-2 py-1 text-center">
                          SL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.components.map((component, index) => (
                        <tr key={component.id}>
                          <td className="border border-gray-400 px-2 py-1 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {component.componentName}
                          </td>
                          <td className="border border-gray-400 px-2 py-1 font-mono">
                            {component.assetCode}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {component.buildingName} - {component.roomName}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            {component.reason}
                          </td>
                          <td className="border border-gray-400 px-2 py-1">
                            <div>{component.newItemName}</div>
                            <div className="text-gray-600 text-xs">
                              {component.newItemSpecs}
                            </div>
                          </td>
                          <td className="border border-gray-400 px-2 py-1 text-center">
                            {component.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          disabled={isSubmitting}
          className={`inline-flex items-center px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Đang nộp...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Nộp tờ trình
            </>
          )}
        </button>
      </div>

      {/* Modal notifications */}
      <SuccessModal
        isOpen={showSaveDraftModal}
        onClose={() => setShowSaveDraftModal(false)}
        title="Lưu nháp thành công!"
        message="Tờ trình đã được lưu vào nháp. Bạn có thể tiếp tục chỉnh sửa sau."
      />
      <SuccessModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          router.push("/to-truong-ky-thuat/lap-to-trinh");
        }}
        title="Nộp tờ trình thành công!"
        message="Tờ trình đã được nộp thành công và đang chờ xét duyệt."
      />
    </div>
  );
}
