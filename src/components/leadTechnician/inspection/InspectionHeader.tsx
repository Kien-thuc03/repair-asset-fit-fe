import { Download } from "lucide-react";
import { Breadcrumb } from "antd";

interface InspectionHeaderProps {
  onExportExcel: () => void;
}

export default function InspectionHeader({
  onExportExcel,
}: InspectionHeaderProps) {
  return (
    <>
      <div className="mb-2">
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
              title: (
                <div className="flex items-center">
                  <span>Xác nhận biên bản</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Xác nhận biên bản
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Xem và ký xác nhận các biên bản kiểm tra do Phòng Quản trị gửi đến
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onExportExcel}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
