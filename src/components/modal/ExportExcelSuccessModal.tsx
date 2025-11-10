"use client";

import { Modal } from "antd";
import { CheckCircle } from "lucide-react";

interface ExportExcelSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  recordCount: number;
}

export default function ExportExcelSuccessModal({
  isOpen,
  onClose,
  fileName,
  recordCount,
}: ExportExcelSuccessModalProps) {
  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          style={{
            border: "none",
            borderRadius: "6px",
            fontWeight: "500",
          }}>
          Đóng
        </button>,
      ]}
      centered
      width="90%"
      style={{ maxWidth: "500px" }}>
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          Xuất Excel thành công!
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-1">
          File <span className="font-medium">&ldquo;{fileName}&rdquo;</span> đã
          được tải xuống
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          <span className="font-medium">({recordCount} bản ghi)</span>
        </p>
      </div>
    </Modal>
  );
}
