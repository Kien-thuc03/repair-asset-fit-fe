import { AlertCircle } from "lucide-react";
import { RepairRequest } from "@/types";

interface ErrorDescriptionProps {
  request: RepairRequest;
}

export default function ErrorDescription({ request }: ErrorDescriptionProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Mô tả lỗi
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại lỗi
            </label>
            <p className="text-sm text-gray-900 mt-1 bg-red-50 px-3 py-2 rounded border border-red-200">
              {request.errorTypeName || "Chưa xác định"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chi tiết mô tả
            </label>
            <div className="mt-1 bg-gray-50 px-4 py-3 rounded-lg border">
              <p className="text-sm text-gray-900 leading-relaxed">
                {request.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
