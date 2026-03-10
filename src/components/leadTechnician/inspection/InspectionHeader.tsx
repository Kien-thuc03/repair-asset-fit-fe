import { Breadcrumb } from "antd";
import { Calendar, CheckCircle, FileText } from "lucide-react";

export default function InspectionHeader() {
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

      <div className="bg-white shadow rounded-lg p-6 mt-2 mb-4">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Xác nhận biên bản
            </h1>
            <p className="text-gray-600">
              Xem và ký xác nhận các biên bản kiểm tra do Phòng Quản trị gửi đến
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
