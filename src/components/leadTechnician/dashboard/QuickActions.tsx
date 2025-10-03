import React from "react";
import Link from "next/link";
import {
  MapPin,
  FileText,
  ClipboardList,
  BarChart3,
  FileCheck,
  Search,
  Calendar,
} from "lucide-react";

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Chức năng chính
        </h3>

        {/* Main Actions - 4 columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/to-truong-ky-thuat/duyet-de-xuat"
            className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors block">
            <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
              <FileCheck className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách đề xuất
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Duyệt đề xuất thay thế thiết bị
              </p>
            </div>
          </Link>

          <Link
            href="/to-truong-ky-thuat/lap-to-trinh"
            className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors block">
            <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
              <FileText className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Quản lý tờ trình
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Tạo và quản lý tờ trình
              </p>
            </div>
          </Link>

          <Link
            href="/to-truong-ky-thuat/bien-ban"
            className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors block">
            <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
              <Calendar className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Biên bản</h3>
              <p className="mt-2 text-sm text-gray-500">
                Quản lý biên bản xác nhận
              </p>
            </div>
          </Link>

          <Link
            href="/to-truong-ky-thuat/phan-cong"
            className="relative group bg-orange-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 rounded-lg hover:bg-orange-100 transition-colors block">
            <span className="rounded-lg inline-flex p-3 bg-orange-600 text-white">
              <MapPin className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Phân công khu vực
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Gán khu vực cho kỹ thuật viên
              </p>
            </div>
          </Link>
        </div>

        {/* Secondary Actions - 3 columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          <Link
            href="/to-truong-ky-thuat/danh-sach-bao-loi"
            className="relative group bg-red-50 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors block">
            <div className="flex items-center">
              <span className="rounded-lg inline-flex p-2 bg-red-600 text-white mr-3">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Danh sách báo lỗi
                </h4>
                <p className="text-xs text-gray-500">
                  Theo dõi các báo cáo lỗi
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/to-truong-ky-thuat/quan-ly-thiet-bi"
            className="relative group bg-indigo-50 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg hover:bg-indigo-100 transition-colors block">
            <div className="flex items-center">
              <span className="rounded-lg inline-flex p-2 bg-indigo-600 text-white mr-3">
                <Search className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Quản lý thiết bị
                </h4>
                <p className="text-xs text-gray-500">
                  Tra cứu và quản lý thiết bị
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/to-truong-ky-thuat/thong-ke-bao-cao"
            className="relative group bg-teal-50 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500 rounded-lg hover:bg-teal-100 transition-colors block">
            <div className="flex items-center">
              <span className="rounded-lg inline-flex p-2 bg-teal-600 text-white mr-3">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Thống kê báo cáo
                </h4>
                <p className="text-xs text-gray-500">Xuất báo cáo tổng hợp</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
