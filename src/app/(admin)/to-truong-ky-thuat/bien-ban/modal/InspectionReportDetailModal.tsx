"use client";
import React from "react";
import { X, Signature, Send } from "lucide-react";
import { InspectionReport } from "@/lib/mockData/inspectionReports";

interface InspectionReportDetailModalProps {
  show: boolean;
  onClose: () => void;
  selectedReport: InspectionReport | null;
  onSignReport: (report: InspectionReport) => void;
  onSendBack: (reportId: string) => void;
  getStatusBadge: (status: string) => string;
  getStatusText: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement;
}

export default function InspectionReportDetailModal({
  show,
  onClose,
  selectedReport,
  onSignReport,
  onSendBack,
  getStatusBadge,
  getStatusText,
  getStatusIcon,
}: InspectionReportDetailModalProps) {
  if (!show || !selectedReport) return null;

  const handleSignReport = () => {
    onClose();
    onSignReport(selectedReport);
  };

  const handleSendBack = () => {
    onClose();
    onSendBack(selectedReport.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-3 sm:p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết biên bản #{selectedReport.reportNumber}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              title="Đóng">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Report Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Thông tin biên bản
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Số biên bản:</span>
                  <p className="font-medium">{selectedReport.reportNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tờ trình liên quan:</span>
                  <p className="font-medium">
                    {selectedReport.relatedReportTitle}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Ngày kiểm tra:</span>
                  <p className="font-medium">
                    {new Date(selectedReport.inspectionDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Người kiểm tra:</span>
                  <p className="font-medium">{selectedReport.createdBy}</p>
                </div>
                <div>
                  <span className="text-gray-600">Đơn vị:</span>
                  <p className="font-medium">{selectedReport.department}</p>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                      selectedReport.status
                    )}`}>
                    {getStatusIcon(selectedReport.status)}
                    <span className="ml-1">
                      {getStatusText(selectedReport.status)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900 uppercase">
                {selectedReport.title}
              </h2>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Danh sách thiết bị kiểm tra ({selectedReport.items.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                        TT
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                        Nội dung kiểm tra
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                        Số lượng
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                        Vị trí
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                        Tình trạng
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                        Giải pháp khắc phục
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedReport.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border border-gray-300 text-center">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                          <div className="font-medium">{item.assetName}</div>
                          <div className="text-xs text-gray-500">
                            Mã: {item.assetCode}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border border-gray-300 text-center">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                          {item.location}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                          <span className="text-red-600 font-medium">
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                          <div>{item.proposedSolution}</div>
                          <div className="text-xs text-green-600 font-medium mt-1">
                            Chi phí:{" "}
                            {item.estimatedCost.toLocaleString("vi-VN")} VNĐ
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedReport.notes && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú:</h4>
                <p className="text-sm text-gray-700">{selectedReport.notes}</p>
              </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">
                  Phòng Quản trị
                </h4>
                <div className="text-sm text-gray-600 mb-4">
                  Nhân viên Kỹ thuật
                </div>
                {selectedReport.inspectorSignature && (
                  <div className="border border-dashed border-gray-300 p-4 min-h-[80px] flex items-center justify-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedReport.inspectorName}
                      </div>
                      <div className="text-xs text-gray-500">Đã ký</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">Khoa CNTT</h4>
                <div className="text-sm text-gray-600 mb-4">
                  Tổ trưởng Kỹ thuật
                </div>
                <div className="border border-dashed border-gray-300 p-4 min-h-[80px] flex items-center justify-center">
                  {selectedReport.leaderSignature ? (
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedReport.leaderSignature}
                      </div>
                      <div className="text-xs text-gray-500">
                        Đã ký:{" "}
                        {new Date(
                          selectedReport.leaderSignedAt!
                        ).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Chờ ký xác nhận</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
              Đóng
            </button>
            {selectedReport.status === "pending" && (
              <button
                onClick={handleSignReport}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                <Signature className="h-4 w-4 mr-2" />
                Ký xác nhận
              </button>
            )}
            {selectedReport.status === "signed" && (
              <button
                onClick={handleSendBack}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Gửi lại Phòng Quản trị
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
