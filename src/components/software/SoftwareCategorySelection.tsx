"use client";

import { softwareCategories } from "@/lib/mockData";

interface SoftwareCategorySelectionProps {
  softwareCategory: string;
  onSoftwareCategoryChange: (category: string) => void;
}

export default function SoftwareCategorySelection({
  softwareCategory,
  onSoftwareCategoryChange,
}: SoftwareCategorySelectionProps) {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="softwareCategory"
        className="block text-sm font-medium text-gray-700">
        Bước 3: Loại phần mềm <span className="text-red-500">*</span>
      </label>
      <select
        id="softwareCategory"
        required
        value={softwareCategory}
        onChange={(e) => onSoftwareCategoryChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
        <option value="">Chọn loại phần mềm</option>
        {softwareCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-gray-500">
        Chọn loại phần mềm gặp sự cố để hệ thống có thể phân loại và xử lý phù
        hợp
      </p>
    </div>
  );
}
