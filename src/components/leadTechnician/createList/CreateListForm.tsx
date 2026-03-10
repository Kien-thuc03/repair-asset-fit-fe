interface CreateListFormProps {
  title: string;
  description: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function CreateListForm({
  title,
  description,
  isSubmitting,
  onTitleChange,
  onDescriptionChange,
}: CreateListFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Thông tin danh sách
        </h3>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề danh sách <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tiêu đề cho danh sách đề xuất..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả (tùy chọn)
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mô tả chi tiết về danh sách đề xuất này..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
