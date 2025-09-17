"use client";

import { softwareErrorTypes } from "@/lib/mockData";

interface SoftwareErrorTypeSelectorProps {
  errorTypeId: string;
  onErrorTypeChange: (errorTypeId: string) => void;
}

export default function SoftwareErrorTypeSelector({
  errorTypeId,
  onErrorTypeChange,
}: SoftwareErrorTypeSelectorProps) {
  return (
    <div>
      <label
        htmlFor="errorTypeId"
        className="block text-sm font-medium text-gray-700">
        Bước 5: Loại lỗi phần mềm <span className="text-red-500">*</span>
      </label>
      <select
        id="errorTypeId"
        required
        value={errorTypeId}
        onChange={(e) => onErrorTypeChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
        <option value="">Chọn loại lỗi phần mềm</option>
        {softwareErrorTypes.map((errorType) => (
          <option key={errorType.id} value={errorType.id}>
            {errorType.name}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-gray-500">
        Chọn loại lỗi phù hợp nhất với tình trạng hiện tại
      </p>
    </div>
  );
}
