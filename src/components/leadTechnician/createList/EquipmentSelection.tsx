import { Computer, User, Building2, Calendar, AlertCircle } from "lucide-react";

interface Equipment {
  id: string;
  assetCode: string;
  assetName: string;
  requestedBy: string;
  location: string;
  requestDate: string;
  estimatedCost?: number;
  reason?: string;
}

interface EquipmentSelectionProps {
  approvedRequests: Equipment[];
  selectedRequests: string[];
  isSubmitting: boolean;
  onSelectRequest: (requestId: string) => void;
  onSelectAll: () => void;
}

export default function EquipmentSelection({
  approvedRequests,
  selectedRequests,
  isSubmitting,
  onSelectRequest,
  onSelectAll,
}: EquipmentSelectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn thiết bị cần thay thế ({approvedRequests.length} thiết bị đã
            duyệt)
          </h3>
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            disabled={isSubmitting}>
            {selectedRequests.length === approvedRequests.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {approvedRequests.length > 0 ? (
          approvedRequests.map((request, index) => (
            <div
              key={request.id}
              className={`p-6 ${
                index < approvedRequests.length - 1
                  ? "border-b border-gray-100"
                  : ""
              } hover:bg-gray-50`}>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded mt-1"
                  checked={selectedRequests.includes(request.id)}
                  onChange={() => onSelectRequest(request.id)}
                  disabled={isSubmitting}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-3">
                    <Computer className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {request.assetCode} - {request.assetName}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {request.estimatedCost?.toLocaleString("vi-VN")} VND
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{request.requestedBy}</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span className="truncate">{request.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(request.requestDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                      <strong>Lý do:</strong> {request.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Không có đề xuất nào đã được duyệt
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
