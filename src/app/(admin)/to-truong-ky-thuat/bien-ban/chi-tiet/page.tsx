"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  Send,
  ArrowLeft,
  FileText,
  Settings,
  MapPin,
  Signature,
} from "lucide-react";
import {
  mockInspectionReports,
  InspectionReport,
} from "@/lib/mockData/inspectionReports";
import { Breadcrumb } from "antd";

export default function ChiTietBienBanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);

  useEffect(() => {
    if (reportId) {
      // Tìm report từ mock data
      const foundReport = mockInspectionReports.find(
        (rep) => rep.id === reportId
      );
      setReport(foundReport || null);
    }
    setLoading(false);
  }, [reportId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "signed":
        return "bg-green-100 text-green-800";
      case "sent_back":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ ký";
      case "signed":
        return "Đã ký";
      case "sent_back":
        return "Đã gửi lại";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "signed":
        return <CheckCircle className="h-5 w-5" />;
      case "sent_back":
        return <Send className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const handleSignReport = () => {
    setShowSignModal(true);
  };

  const confirmSign = () => {
    if (report) {
      const updatedReport = {
        ...report,
        status: "signed" as const,
        leaderSignature: "Nguyễn Thanh Tú",
        leaderSignedAt: new Date().toISOString(),
      };
      setReport(updatedReport);

      // Cập nhật vào mock data (trong thực tế sẽ gọi API)
      const reportIndex = mockInspectionReports.findIndex(
        (rep) => rep.id === report.id
      );
      if (reportIndex !== -1) {
        mockInspectionReports[reportIndex] = updatedReport;
      }

      setShowSignModal(false);
    }
  };

  const handleSendBack = () => {
    if (report) {
      const updatedReport = {
        ...report,
        status: "sent_back" as const,
      };
      setReport(updatedReport);

      // Cập nhật vào mock data (trong thực tế sẽ gọi API)
      const reportIndex = mockInspectionReports.findIndex(
        (rep) => rep.id === report.id
      );
      if (reportIndex !== -1) {
        mockInspectionReports[reportIndex] = updatedReport;
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy biên bản
          </h2>
          <p className="text-gray-600 mb-4">
            Biên bản bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/to-truong-ky-thuat/bien-ban",
              title: (
                <div className="flex items-center">
                  <span>Xác nhận biên bản</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết biên bản</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết biên bản {report.reportNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết về biên bản kiểm tra
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(report.status)}
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                report.status
              )}`}>
              {getStatusText(report.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Thông tin biên bản
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số biên bản
                  </label>
                  <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-3 py-2 rounded">
                    {report.reportNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tiêu đề biên bản
                  </label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
                    {report.title}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tờ trình liên quan
                  </label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
                    {report.relatedReportTitle}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày kiểm tra
                  </label>
                  <div className="flex items-center mt-1 bg-gray-50 px-3 py-2 rounded">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {new Date(report.inspectionDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phòng ban
                  </label>
                  <div className="flex items-center mt-1 bg-gray-50 px-3 py-2 rounded">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {report.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Danh sách thiết bị kiểm tra
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã tài sản
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên thiết bị
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vị trí
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tình trạng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giải pháp đề xuất
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chi phí ước tính
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.assetCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.assetName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.proposedSolution}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.estimatedCost.toLocaleString("vi-VN")} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {report.notes && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Ghi chú
                  </label>
                  <div className="mt-1 bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {report.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Người lập biên bản
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ tên
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {report.createdBy}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày lập biên bản
                  </label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {new Date(report.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Information */}
          {report.leaderSignature && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Signature className="h-5 w-5 mr-2" />
                  Thông tin ký duyệt
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Người ký
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {report.leaderSignature}
                    </p>
                  </div>
                  {report.leaderSignedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thời gian ký
                      </label>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(report.leaderSignedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Panel */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Thao tác</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {report.status === "pending" && (
                  <button
                    onClick={handleSignReport}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <Signature className="h-4 w-4 mr-2 inline" />
                    Ký xác nhận
                  </button>
                )}
                {report.status === "signed" && (
                  <button
                    onClick={handleSendBack}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Send className="h-4 w-4 mr-2 inline" />
                    Gửi lại
                  </button>
                )}
                <button
                  onClick={() => router.back()}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Quay lại danh sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Confirmation Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Signature className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Xác nhận ký biên bản
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn ký xác nhận biên bản{" "}
                  <span className="font-medium">{report.reportNumber}</span>?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmSign}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                  Xác nhận ký
                </button>
                <button
                  onClick={() => setShowSignModal(false)}
                  className="mt-3 px-4 py-2 bg-white text-gray-900 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
