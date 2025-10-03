import { Modal, Button } from "antd";
import { CheckCircle, User, Calendar } from "lucide-react";

interface SignConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reportTitle: string;
  reportNumber: string;
  isLoading?: boolean;
}

export default function SignConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  reportTitle,
  reportNumber,
  isLoading = false,
}: SignConfirmModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Xác nhận ký biên bản</span>
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
          Xác nhận ký
        </Button>,
      ]}
      width={500}
      className="sign-confirm-modal">
      <div className="py-4">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn ký xác nhận biên bản sau?
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <User className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Số biên bản:
                </div>
                <div className="text-sm text-gray-900">{reportNumber}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Tiêu đề:
                </div>
                <div className="text-sm text-gray-900">{reportTitle}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Thời gian ký:
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
              <strong>Lưu ý:</strong> Sau khi ký xác nhận, trạng thái biên bản
              sẽ được chuyển thành &ldquo;Đã ký&rdquo; và không thể hoàn tác.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
