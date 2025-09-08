"use client";
import { Signature } from "lucide-react";
import { InspectionReport } from "@/lib/mockData/inspectionReports";

interface SignConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  selectedReport: InspectionReport | null;
  onConfirmSign: () => void;
}

export default function SignConfirmationModal({
  show,
  onClose,
  selectedReport,
  onConfirmSign,
}: SignConfirmationModalProps) {
  if (!show || !selectedReport) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Signature className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            Xác nhận ký biên bản
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn ký xác nhận biên bản{" "}
              <span className="font-medium">{selectedReport.reportNumber}</span>{" "}
              không?
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Sau khi ký, bạn có thể gửi biên bản lại cho Phòng Quản trị.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none">
                Hủy
              </button>
              <button
                onClick={onConfirmSign}
                className="flex-1 px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none">
                Ký xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
