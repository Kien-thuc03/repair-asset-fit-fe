import { Breadcrumb } from "antd";

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

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Xác nhận biên bản
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Xem và ký xác nhận các biên bản kiểm tra do Phòng Quản trị gửi đến
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
