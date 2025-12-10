"use client";

import { useState } from "react";
import { Modal, Input } from "antd";

interface RejectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void | Promise<void>;
  title?: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  defaultReason?: string;
}

const RejectConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận từ chối",
  description = "Bạn có chắc chắn muốn từ chối đề xuất này không?",
  okText = "Từ chối",
  cancelText = "Hủy",
  defaultReason = "",
}: RejectConfirmModalProps) => {
  const [reason, setReason] = useState(defaultReason);
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      setSubmitting(true);
      await onConfirm(reason);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      confirmLoading={submitting}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onOk={handleOk}
      okButtonProps={{ danger: true }}>
      <div className="space-y-3">
        <p className="text-sm text-gray-700">{description}</p>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Lý do từ chối (tùy chọn)
          </label>
          <Input.TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do từ chối nếu cần"
          />
        </div>
      </div>
    </Modal>
  );
};

export default RejectConfirmModal;

