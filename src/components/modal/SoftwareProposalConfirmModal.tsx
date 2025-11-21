"use client";

import { Modal, Button } from "antd";
import { CheckCircle, XCircle, AlertCircle, LucideIcon } from "lucide-react";

type ActionType = "approve" | "reject";

interface SoftwareProposalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  proposalCode: string;
  actionType: ActionType;
  isLoading?: boolean;
}

export default function SoftwareProposalConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  proposalCode,
  actionType,
  isLoading = false,
}: SoftwareProposalConfirmModalProps) {
  const isApprove = actionType === "approve";

  const config = {
    approve: {
      title: "Xác nhận duyệt đề xuất",
      description: "Bạn có chắc chắn muốn duyệt đề xuất phần mềm này?",
      confirmText: "Xác nhận duyệt",
      warning:
        'Sau khi duyệt, trạng thái đề xuất sẽ được chuyển thành "Đã duyệt" và không thể hoàn tác.',
      icon: CheckCircle,
      buttonClass: "bg-green-600 hover:bg-green-700",
      iconColor: "text-green-600",
    },
    reject: {
      title: "Xác nhận từ chối đề xuất",
      description: "Bạn có chắc chắn muốn từ chối đề xuất phần mềm này?",
      confirmText: "Xác nhận từ chối",
      warning:
        'Sau khi từ chối, trạng thái đề xuất sẽ được chuyển thành "Đã từ chối" và không thể hoàn tác.',
      icon: XCircle,
      buttonClass: "bg-red-600 hover:bg-red-700",
      iconColor: "text-red-600",
    },
  };

  const currentConfig = config[actionType];
  const IconComponent = currentConfig.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error đã được xử lý trong onConfirm
      throw error;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <IconComponent className={`h-5 w-5 ${currentConfig.iconColor}`} />
          <span>{currentConfig.title}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          loading={isLoading}
          danger={!isApprove}
          className={isApprove ? currentConfig.buttonClass : ""}>
          {currentConfig.confirmText}
        </Button>,
      ]}
      width={500}
      className="software-proposal-confirm-modal"
      centered>
      <div className="py-4">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">{currentConfig.description}</p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Mã đề xuất:
                </div>
                <div className="text-sm text-gray-900 font-semibold">
                  {proposalCode}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-yellow-800 text-sm">
              <strong>Lưu ý:</strong> {currentConfig.warning}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

