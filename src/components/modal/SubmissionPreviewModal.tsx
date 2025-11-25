"use client";

import { Modal, Button } from "antd";
import { Download } from "lucide-react";
import { SubmissionFormData } from "@/types";
import { ReplacementProposal } from "@/lib/api/replacement-proposals";

interface SubmissionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SubmissionFormData;
  proposal: ReplacementProposal | null;
  onExport: () => void;
  onSubmit: () => void;
  showSubmitButton?: boolean; // Optional prop to show/hide submit button
  isSubmitting?: boolean;
}

export default function SubmissionPreviewModal({
  isOpen,
  onClose,
  formData,
  proposal,
  onExport,
  onSubmit,
  showSubmitButton = true, // Default to true for backward compatibility
  isSubmitting = false,
}: SubmissionPreviewModalProps) {
  // Early return if no proposal or formData
  if (!proposal || !formData) return null;

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="flex flex-row justify-end gap-2 sm:gap-3">
          <Button onClick={onClose} size="small" className="text-xs sm:text-sm">
            Đóng
          </Button>
          <Button
            onClick={onExport}
            size="small"
            icon={<Download className="w-4 h-4" />}
            className="text-xs sm:text-sm">
            Xuất file
          </Button>
          {showSubmitButton && (
            <Button
              type="primary"
              onClick={() => {
                onClose();
                onSubmit();
              }}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="small"
              className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm">
              Gửi tờ trình
            </Button>
          )}
        </div>
      }
      width="90%"
      style={{ maxWidth: 1000 }}
      centered>
      <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            TRƯỜNG ĐẠI HỌC CÔNG
            NGHIỆP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CỘNG
            HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            THÀNH PHỐ HỒ CHÍ
            MINH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Độc
            lập - Tự do - Hạnh phúc
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mb-4">
            {formData.department?.toUpperCase() || ""}
          </div>
          <div className="text-right text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Thành phố Hồ Chí Minh, ngày ___ tháng ___ năm 2025
          </div>
          <div className="text-lg sm:text-xl font-bold text-center mb-2">
            PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC
          </div>
          <div className="text-sm sm:text-base font-semibold text-center mb-4 sm:mb-6">
            {formData.subject}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Thông tin chung */}
          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-medium">Kính gửi: </span>
              <span>{formData.recipientDepartment}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Người đề nghị: </span>
                <span>{formData.submittedBy}</span>
              </div>
              <div>
                <span className="font-medium">Chức vụ: </span>
                <span>{formData.position}</span>
              </div>
            </div>
            <div>
              <span className="font-medium">Đơn vị: </span>
              <span>{formData.department}</span>
            </div>
            <div>
              <span className="font-medium">Đề nghị: </span>
              <span>{formData.subject}</span>
            </div>
            <div>
              <span className="font-medium">Văn bản kèm theo: </span>
              <span>{formData.attachments}</span>
            </div>
          </div>

          {/* Nội dung */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="font-medium text-center">NỘI DUNG</div>
            <div className="whitespace-pre-wrap text-justify">
              {formData.content}
            </div>
          </div>

          {/* Bảng linh kiện */}
          {proposal?.items && proposal.items.length > 0 && (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="font-medium text-xs sm:text-sm mb-2">
                Danh sách linh kiện đề xuất thay thế:
              </div>
              <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                      STT
                    </th>
                    <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                      Linh kiện cũ
                    </th>
                    <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                      Vị trí
                    </th>
                    <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                      SL
                    </th>
                    <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                      Lý do
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                        <div className="font-medium">
                          {item.oldComponent?.name || "Không xác định"}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.oldComponent?.componentSpecs || ""}
                        </div>
                      </td>
                      <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                        {item.oldComponent?.roomLocation || "Chưa xác định"}
                      </td>
                      <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                        {item.reason || "Cần thay thế"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Kết luận và chữ ký */}
          <div className="space-y-4 sm:space-y-6 mt-6">
            <div className="text-xs sm:text-sm">
              <span className="font-medium">
                {formData.department} kính trình Ban Giám hiệu xem xét và phê
                duyệt.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-8">
              <div className="text-center">
                <div className="font-medium mb-12 sm:mb-16 text-xs sm:text-sm">
                  Trưởng phòng
                </div>
                <div className="font-medium text-xs sm:text-sm">
                  {formData.director}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-12 sm:mb-16 text-xs sm:text-sm">
                  Hiệu trưởng
                </div>
                <div className="font-medium text-xs sm:text-sm">
                  {formData.rector}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-2 text-xs sm:text-sm">
                  {formData.position}
                </div>
                <div className="text-xs text-gray-600 mb-10 sm:mb-12">
                  (Ký và ghi rõ họ tên)
                </div>
                <div className="font-medium text-xs sm:text-sm">
                  {formData.submittedBy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
