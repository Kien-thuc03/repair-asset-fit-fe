import React from "react";

interface ErrorType {
  id: string;
  name: string;
}

interface ErrorTypeSelectorProps {
  errorTypeId: string;
  errorTypes: ErrorType[];
  onChange: (errorTypeId: string) => void;
}

const ErrorTypeSelector: React.FC<ErrorTypeSelectorProps> = ({
  errorTypeId,
  errorTypes,
  onChange,
}) => {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="errorTypeId"
        className="block text-sm font-medium text-gray-700">
        Bước 3: Chọn loại lỗi từ danh sách{" "}
        <span className="text-red-500">*</span>
      </label>
      <select
        id="errorTypeId"
        required
        value={errorTypeId}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
        <option value="">Chọn loại lỗi phổ biến</option>
        {errorTypes.map((errorType) => (
          <option key={errorType.id} value={errorType.id}>
            {errorType.name}
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
