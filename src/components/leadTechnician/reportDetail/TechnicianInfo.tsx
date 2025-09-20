import { Settings, Clock, CheckCircle } from "lucide-react";
import { RepairRequest } from "@/types";

interface TechnicianInfoProps {
  request: RepairRequest;
}

export default function TechnicianInfo({ request }: TechnicianInfoProps) {
  if (!request.assignedTechnicianName) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Kỹ thuật viên
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ tên
            </label>
            <p className="text-sm text-gray-900 mt-1">
              {request.assignedTechnicianName}
            </p>
          </div>
          {request.acceptedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thời gian tiếp nhận
              </label>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {new Date(request.acceptedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          )}
          {request.completedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thời gian hoàn thành
              </label>
              <div className="flex items-center mt-1">
                <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {new Date(request.completedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
