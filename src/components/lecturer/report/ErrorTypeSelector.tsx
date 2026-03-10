import React from "react";
import { ErrorType, getErrorTypeOptions } from "@/types";

interface ErrorTypeSelectorProps {
  errorType?: ErrorType;
  onChange: (errorType: ErrorType) => void;
}

const ErrorTypeSelector: React.FC<ErrorTypeSelectorProps> = ({
  errorType,
  onChange,
}) => {
  const errorTypeOptions = getErrorTypeOptions();
  
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="errorType"
        className="block text-sm font-medium text-gray-700">
        Bước 3: Chọn loại lỗi từ danh sách{" "}
        <span className="text-red-500">*</span>
      </label>
      <select
        id="errorType"
        required
        value={errorType || ""}
        onChange={(e) => onChange(e.target.value as ErrorType)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
        <option value="">Chọn loại lỗi phổ biến</option>
        {errorTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-gray-500">
        Chọn loại lỗi phù hợp để hệ thống có thể phân loại và xử lý nhanh chóng
      </p>
    </div>
  );
};

export default ErrorTypeSelector;
