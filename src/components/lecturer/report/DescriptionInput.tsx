import React from "react";

interface DescriptionInputProps {
  description: string;
  onChange: (description: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700">
        Bước 4: Mô tả chi tiết tình trạng lỗi (tùy chọn)
      </label>
      <textarea
        id="description"
        rows={4}
        value={description}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Mô tả chi tiết về tình trạng lỗi, triệu chứng, thời điểm xảy ra, các bước đã thực hiện... (không bắt buộc)"
      />
      <p className="mt-1 text-sm text-gray-500">
        Thông tin này sẽ giúp kỹ thuật viên hiểu rõ hơn về tình trạng lỗi và xử
        lý nhanh chóng hơn
      </p>
    </div>
  );
};

export default DescriptionInput;
