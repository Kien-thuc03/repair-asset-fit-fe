import React from "react";
import { Package } from "lucide-react";

interface ProposalHeaderProps {
  isEditMode?: boolean;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  isEditMode = false,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode
              ? "Chỉnh sửa đề xuất phần mềm"
              : "Đề xuất phần mềm"}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Cập nhật thông tin đề xuất cài đặt phần mềm"
              : "Tạo đề xuất cài đặt phần mềm cho máy tính trong phòng học"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalHeader;
