import { Eye, CheckCircle, XCircle, Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReplacementRequestForList, ReplacementStatus } from "@/types";
import StatusBadge, { getComponentInfo, getUserRole } from "./ApprovalHelpers";

interface ApprovalMobileCardsProps {
  filteredRequests: ReplacementRequestForList[];
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export default function ApprovalMobileCards({
  filteredRequests,
  selectedItems,
  onSelectItem,
  onApprove,
  onReject,
}: ApprovalMobileCardsProps) {
  const router = useRouter();

  return (
    <div className="block sm:hidden flex-1 overflow-y-auto">
      <div className="p-3 space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded mr-2 mt-1 flex-shrink-0"
                    checked={selectedItems.includes(request.id)}
                    onChange={() => onSelectItem(request.id)}
                  />
                  <Package className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {getComponentInfo().componentName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {getComponentInfo().componentSpecs}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => {
                      router.push(
                        `/to-truong-ky-thuat/duyet-de-xuat/chi-tiet/${request.id}`
                      );
                    }}
                    className="text-indigo-600 hover:text-indigo-900 p-1">
                    <Eye className="h-4 w-4" />
                  </button>
                  {(request.status === ReplacementStatus.CHỜ_XÁC_MINH ||
                    request.status ===
                      ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT) && (
                    <>
                      <button
                        onClick={() => onApprove(request.id)}
                        className="text-green-600 hover:text-green-900 p-1">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onReject(request.id)}
                        className="text-red-600 hover:text-red-900 p-1">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Người yêu cầu</div>
                  <div className="text-gray-900 font-medium">
                    {request.requestedBy}
                  </div>
                  <div className="text-gray-500 text-xs">{getUserRole()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Vị trí</div>
                  <div className="text-gray-900 font-medium truncate">
                    {request.location}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Trạng thái</div>
                  <StatusBadge status={request.status} />
                </div>
                <div>
                  <div className="text-gray-500">Chi phí ước tính</div>
                  <div className="text-gray-900 font-medium">
                    {request.estimatedCost.toLocaleString("vi-VN")} VND
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {new Date(request.requestDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Không tìm thấy kết quả
            </h3>
            <p className="text-xs text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
