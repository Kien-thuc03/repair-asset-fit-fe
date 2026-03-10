import React from "react";
import { Input } from "antd";
import { FileText } from "lucide-react";
import { SoftwareProposalForm } from "@/types";

const { TextArea } = Input;

interface ProposalJustificationProps {
  justification: string;
  targetUsers: string;
  educationalPurpose: string;
  onFormDataChange: (field: keyof SoftwareProposalForm, value: string) => void;
}

const ProposalJustification: React.FC<ProposalJustificationProps> = ({
  justification,
  targetUsers,
  educationalPurpose,
  onFormDataChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="block text-sm font-medium text-gray-700">
        Bước 3: Lý do đề xuất và mục đích sử dụng
      </h3>

      <div className="space-y-4">
        {/* Justification */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-1" />
            Lý do đề xuất <span className="text-red-500 ml-1">*</span>
          </label>
          <TextArea
            placeholder="Ví dụ: Phần mềm hiện tại không đáp ứng được yêu cầu giảng dạy, cần cập nhật phiên bản mới..."
            value={justification}
            onChange={(e) => onFormDataChange("justification", e.target.value)}
            rows={3}
            size="large"
          />
        </div>

        {/* Target Users */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-1" />
            Đối tượng sử dụng <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            placeholder="Ví dụ: Sinh viên năm 3, Lớp CNTT K18, Học phần Lập trình Web..."
            value={targetUsers}
            onChange={(e) => onFormDataChange("targetUsers", e.target.value)}
            size="large"
          />
        </div>

        {/* Educational Purpose */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-1" />
            Mục đích giảng dạy <span className="text-red-500 ml-1">*</span>
          </label>
          <TextArea
            placeholder="Ví dụ: Sử dụng cho môn học Thiết kế Web, thực hành lập trình frontend, học tập về công cụ thiết kế..."
            value={educationalPurpose}
            onChange={(e) =>
              onFormDataChange("educationalPurpose", e.target.value)
            }
            rows={3}
            size="large"
          />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium mb-1">Lưu ý quan trọng:</p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Vui lòng mô tả rõ ràng lý do cần thiết cài đặt phần mềm</li>
              <li>• Ghi rõ đối tượng sinh viên sẽ sử dụng</li>
              <li>• Liên kết với học phần/môn học cụ thể</li>
              <li>
                • Đề xuất sẽ được xem xét dựa trên tính cần thiết và tài nguyên
                khả dụng
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalJustification;
