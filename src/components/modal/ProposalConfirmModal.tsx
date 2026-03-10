import { Modal, Button } from "antd";
import { FileText, AlertCircle, CheckCircle, X } from "lucide-react";

interface ProposalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCreate: () => void; // Xác nhận lập phiếu đề xuất
  onConfirmReturn: () => void; // Xác nhận trở về danh sách
  requestCode: string;
  assetName?: string;
  isLoading?: boolean;
}

export default function ProposalConfirmModal({
  isOpen,
  onClose,
  onConfirmCreate,
  onConfirmReturn,
  requestCode,
  assetName,
  isLoading = false,
}: ProposalConfirmModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Xác nhận sau khi xử lý</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>,
        <Button
          key="return"
          onClick={onConfirmReturn}
          disabled={isLoading}
          className="bg-gray-500 hover:bg-gray-600 text-white"
          icon={<X className="w-4 h-4" />}
        >
          Trở về danh sách
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={onConfirmCreate}
          loading={isLoading}
          className="bg-green-600 hover:bg-green-700"
          icon={<FileText className="w-4 h-4" />}
        >
          Lập phiếu đề xuất
        </Button>,
      ]}
      width={600}
      className="proposal-confirm-modal"
    >
      <div className="py-4">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bạn đã hoàn thành việc xử lý yêu cầu sửa chữa. Bạn có muốn lập phiếu đề xuất thay thế linh kiện không?
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Mã yêu cầu:
                </div>
                <div className="text-sm text-gray-900">{requestCode}</div>
              </div>
            </div>

            {assetName && (
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Tài sản:
                  </div>
                  <div className="text-sm text-gray-900">{assetName}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-blue-800 text-sm">
              <strong>Lưu ý:</strong> Bạn có thể lập phiếu đề xuất bất cứ lúc nào từ trang quản lý thay thế linh kiện.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}