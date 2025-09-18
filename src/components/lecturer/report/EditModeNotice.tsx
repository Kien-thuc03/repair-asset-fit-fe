import React from "react";
import { AlertTriangle } from "lucide-react";

interface EditModeNoticeProps {
  isEditMode: boolean;
}

const EditModeNotice: React.FC<EditModeNoticeProps> = ({ isEditMode }) => {
  if (!isEditMode) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-900">
            Đang chỉnh sửa yêu cầu
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            Thông tin từ yêu cầu trước đó đã được tự động điền vào form. Bạn có
            thể thay đổi các thông tin cần thiết và gửi lại.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditModeNotice;
