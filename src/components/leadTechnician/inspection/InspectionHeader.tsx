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

      <div className="mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Xác nhận biên bản
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Xem và ký xác nhận các biên bản kiểm tra do Phòng Quản trị gửi đến
          </p>
        </div>
      </div>
    </>
  );
}
