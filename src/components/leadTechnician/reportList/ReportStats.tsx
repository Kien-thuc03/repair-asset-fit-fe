import { Clock, AlertCircle, CheckCircle, Calculator } from "lucide-react";
import { RepairRequest, RepairStatus } from "@/types";

interface ReportStatsProps {
  requests: RepairRequest[];
}

export default function ReportStats({ requests }: ReportStatsProps) {
  const pendingCount = requests.filter(
    (r) => r.status === RepairStatus.CHỜ_TIẾP_NHẬN
  ).length;

  const processingCount = requests.filter(
    (r) => r.status === RepairStatus.ĐANG_XỬ_LÝ
  ).length;

  const completedCount = requests.filter(
    (r) => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH
  ).length;

  const totalCount = requests.length;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Chờ tiếp nhận
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {pendingCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Đang xử lý
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {processingCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Hoàn thành
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {completedCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calculator className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Tổng cộng
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
