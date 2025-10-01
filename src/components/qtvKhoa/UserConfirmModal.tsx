import { IUserWithRoles, UserStatus } from "@/types";

interface UserConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: IUserWithRoles;
  action: "toggle-status" | "delete";
}

export default function UserConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  action,
}: UserConfirmModalProps) {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (action) {
      case "toggle-status":
        return {
          title: user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa tài khoản",
          message: user.status === UserStatus.ACTIVE 
            ? `Bạn có chắc chắn muốn khóa tài khoản của "${user.fullName}"? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản của "${user.fullName}"? Người dùng này sẽ có thể đăng nhập vào hệ thống.`,
          confirmText: user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa",
          confirmClass: user.status === UserStatus.ACTIVE ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700",
        };
      case "delete":
        return {
          title: "Xóa tài khoản",
          message: `Bạn có chắc chắn muốn xóa tài khoản của "${user.fullName}"? Hành động này không thể hoàn tác.`,
          confirmText: "Xóa tài khoản",
          confirmClass: "bg-red-600 hover:bg-red-700",
        };
      default:
        return {
          title: "Xác nhận",
          message: "Bạn có chắc chắn muốn thực hiện hành động này?",
          confirmText: "Xác nhận",
          confirmClass: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{content.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700">{content.message}</p>
          
          {/* User info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.fullName}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${content.confirmClass}`}
          >
            {content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}