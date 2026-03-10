import { User, Calendar } from "lucide-react";
import { RepairRequest } from "@/types";

interface ReporterInfoProps {
  request: RepairRequest;
}

export default function ReporterInfo({ request }: ReporterInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Người báo cáo
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ tên
            </label>
            <p className="text-sm text-gray-900 mt-1">{request.reporterName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <p className="text-sm text-gray-900 mt-1">{request.reporterRole}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày báo cáo
            </label>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">
                {new Date(request.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
