"use client";

import { Modal } from "antd";
import { XCircle } from "lucide-react";

interface ExportExcelErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export default function ExportExcelErrorModal({
  isOpen,
  onClose,
  errorMessage,
}: ExportExcelErrorModalProps) {
  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
        <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          Lỗi xuất Excel
        </h3>
        <p className="text-sm sm:text-base text-gray-600">{errorMessage}</p>
      </div>
    </Modal>
  );
}
