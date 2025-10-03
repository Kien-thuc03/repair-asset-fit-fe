import { Modal, Button } from "antd";
import { CheckCircle, User, Calendar, LucideIcon } from "lucide-react";

type ActionType = "sign" | "approve";

interface SignConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reportTitle: string;
  reportNumber: string;
  isLoading?: boolean;
  actionType?: ActionType; // Thêm prop để xác định loại hành động
  customTitle?: string; // Tùy chỉnh tiêu đề modal
  customConfirmText?: string; // Tùy chỉnh text nút xác nhận
  customDescription?: string; // Tùy chỉnh mô tả
  customWarning?: string; // Tùy chỉnh cảnh báo
  icon?: LucideIcon; // Tùy chỉnh icon
}

export default function SignConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  reportTitle,
  reportNumber,
  isLoading = false,
  actionType = "sign",
  customTitle,
  customConfirmText,
  customDescription,
  customWarning,
  icon: IconComponent,
}: SignConfirmModalProps) {
  // Cấu hình mặc định theo actionType
  const getActionConfig = () => {
    switch (actionType) {
      case "approve":
        return {
          title: "Xác nhận duyệt tờ trình",
          confirmText: "Xác nhận duyệt",
          description: "Bạn có chắc chắn muốn duyệt tờ trình sau?",
          warning:
            'Sau khi duyệt, trạng thái tờ trình sẽ được chuyển thành "Đã duyệt" và không thể hoàn tác.',
          icon: CheckCircle,
          numberLabel: "Mã tờ trình:",
          titleLabel: "Tiêu đề:",
          timeLabel: "Thời gian duyệt:",
        };
      case "sign":
      default:
        return {
          title: "Xác nhận ký biên bản",
          confirmText: "Xác nhận ký",
          description: "Bạn có chắc chắn muốn ký xác nhận biên bản sau?",
          warning:
            'Sau khi ký xác nhận, trạng thái biên bản sẽ được chuyển thành "Đã ký" và không thể hoàn tác.',
          icon: CheckCircle,
          numberLabel: "Số biên bản:",
          titleLabel: "Tiêu đề:",
          timeLabel: "Thời gian ký:",
        };
    }
  };

  const config = getActionConfig();
  const FinalIcon = IconComponent || config.icon;
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <FinalIcon className="h-5 w-5 text-green-600" />
          <span>{customTitle || config.title}</span>
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
          onClick={onConfirm}
          loading={isLoading}
          className="bg-green-600 hover:bg-green-700">
          {customConfirmText || config.confirmText}
        </Button>,
      ]}
      width={500}
      className="sign-confirm-modal">
      <div className="py-4">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            {customDescription || config.description}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <User className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {config.numberLabel}
                </div>
                <div className="text-sm text-gray-900">{reportNumber}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {config.titleLabel}
                </div>
                <div className="text-sm text-gray-900">{reportTitle}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {config.timeLabel}
                </div>
                <div className="text-sm text-gray-900">
                  {new Date().toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600 text-sm">⚠️</div>
            <div className="text-yellow-800 text-sm">
              <strong>Lưu ý:</strong> {customWarning || config.warning}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
