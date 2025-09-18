import React from "react";
import { Input } from "antd";
import { Package } from "lucide-react";
import { SoftwareProposalForm } from "@/types";

const { TextArea } = Input;

interface SoftwareInfoSelectorProps {
  softwareName: string;
  softwareVersion: string;
  publisher: string;
  description: string;
  onFormDataChange: (field: keyof SoftwareProposalForm, value: string) => void;
}

const SoftwareInfoSelector: React.FC<SoftwareInfoSelectorProps> = ({
  softwareName,
  softwareVersion,
  publisher,
  description,
  onFormDataChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
          2
        </span>
        Thông tin phần mềm đề xuất
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Software Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-1" />
            Tên phần mềm <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            placeholder="Nhập tên phần mềm"
            value={softwareName}
            onChange={(e) => onFormDataChange("softwareName", e.target.value)}
            size="large"
          />
        </div>

        {/* Software Version */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-1" />
            Phiên bản
          </label>
          <Input
            placeholder="Ví dụ: 2024, v1.0.0"
            value={softwareVersion}
            onChange={(e) =>
              onFormDataChange("softwareVersion", e.target.value)
            }
            size="large"
          />
        </div>

        {/* Publisher */}
        <div className="md:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-1" />
            Nhà phát hành
          </label>
          <Input
            placeholder="Ví dụ: Microsoft, Adobe, Google"
            value={publisher}
            onChange={(e) => onFormDataChange("publisher", e.target.value)}
            size="large"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-1" />
            Mô tả phần mềm
          </label>
          <TextArea
            placeholder="Mô tả ngắn gọn về phần mềm và chức năng chính"
            value={description}
            onChange={(e) => onFormDataChange("description", e.target.value)}
            rows={3}
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default SoftwareInfoSelector;
