import React from "react";
import { Send } from "lucide-react";

interface ReportFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

const ReportFormActions: React.FC<ReportFormActionsProps> = ({
  isSubmitting,
  isEditMode,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Hủy
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {isEditMode ? "Đang cập nhật..." : "Đang gửi..."}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {isEditMode ? "Cập nhật báo cáo" : "Gửi báo cáo"}
          </>
        )}
      </button>
    </div>
  );
};

export default ReportFormActions;
