import React from "react";
import { FileCheck, MapPin, ClipboardList, FileText } from "lucide-react";

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <FileCheck className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-900">
                        Đã <span className="font-medium">phê duyệt</span> đề
                        xuất thay thế máy tính
                      </p>
                      <p className="text-xs text-gray-500">10 phút trước</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Mã tài sản: PC001 - Phòng A101
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-900">
                        Phân công{" "}
                        <span className="font-medium">Trần Văn B</span> phụ
                        trách tòa A
                      </p>
                      <p className="text-xs text-gray-500">30 phút trước</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                    <ClipboardList className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-900">
                        Có{" "}
                        <span className="font-medium">2 báo cáo lỗi mới</span>{" "}
                        cần xử lý
                      </p>
                      <p className="text-xs text-gray-500">1 giờ trước</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Máy chiếu P304, Máy in P202
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-900">
                        Gửi{" "}
                        <span className="font-medium">
                          tờ trình thay thế thiết bị
                        </span>{" "}
                        lên Phòng Quản trị
                      </p>
                      <p className="text-xs text-gray-500">2 giờ trước</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Đề xuất mua 5 máy tính mới cho phòng máy
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
