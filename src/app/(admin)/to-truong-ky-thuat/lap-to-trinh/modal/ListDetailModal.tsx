"use client";
import { FileText, Calendar, User, Building2, Computer, X } from "lucide-react";
import { ReplacementList } from "@/lib/mockData/replacementLists";

interface ListDetailModalProps {
  show: boolean;
  onClose: () => void;
  selectedList: ReplacementList | null;
  onCreateReport: (listId: string) => void;
}

export default function ListDetailModal({
  show,
  onClose,
  selectedList,
  onCreateReport,
}: ListDetailModalProps) {
  if (!show || !selectedList) return null;

  const handleCreateReport = () => {
    onClose();
    onCreateReport(selectedList.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-8 mx-auto p-3 sm:p-5 border w-11/12 sm:w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết danh sách #{selectedList.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              title="Đóng">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* List Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Thông tin chung
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tiêu đề:</span>
                  <p className="font-medium">{selectedList.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">Người tạo:</span>
                  <p className="font-medium">{selectedList.createdBy}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tổng thiết bị:</span>
                  <p className="font-medium">
                    {selectedList.totalItems} thiết bị
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Chi phí ước tính:</span>
                  <p className="font-medium text-green-600">
                    {selectedList.totalCost.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>
              {selectedList.description && (
                <div className="mt-3">
                  <span className="text-gray-600">Mô tả:</span>
                  <p className="text-sm mt-1">{selectedList.description}</p>
                </div>
              )}
            </div>

            {/* Equipment List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Danh sách thiết bị ({selectedList.requests.length})
              </h4>
              <div className="space-y-3">
                {selectedList.requests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Computer className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-sm">
                          {request.assetCode} - {request.assetName}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {request.estimatedCost.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{request.requestedBy}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        <span className="truncate">{request.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(request.requestDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                      <strong>Lý do:</strong> {request.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
              Đóng
            </button>
            <button
              onClick={handleCreateReport}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Lập tờ trình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
