"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Steps, Tag, Card, Divider, Spin, Alert } from "antd";
import {
  Clock,
  User,
  MapPin,
  Wrench,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Settings,
  Package,
  Monitor,
  Info,
  Trash2,
} from "lucide-react";
import { RepairStatus } from "@/types";
import ImageViewer from "@/components/ui/ImageViewer";
import {
  CancelConfirmModal,
  SuccessModal,
  ErrorModal,
} from "@/components/modal";
import { useRepairDetail } from "@/hooks";
import { cancelRepair } from "@/lib/api/repairs";

const repairRequestStatusConfig = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: {
    label: "Chờ tiếp nhận",
    color: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: {
    label: "Đã tiếp nhận",
    color: "border-blue-300 bg-blue-50 text-blue-700",
  },
  [RepairStatus.ĐANG_XỬ_LÝ]: {
    label: "Đang xử lý",
    color: "border-purple-300 bg-purple-50 text-purple-700",
  },
  [RepairStatus.CHỜ_THAY_THẾ]: {
    label: "Chờ thay thế",
    color: "border-orange-300 bg-orange-50 text-orange-700",
  },
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: {
    label: "Đã hoàn thành",
    color: "border-green-300 bg-green-50 text-green-700",
  },
  [RepairStatus.ĐÃ_HỦY]: {
    label: "Đã hủy",
    color: "border-red-300 bg-red-50 text-red-700",
  },
};

export default function ChiTietDanhSachYeuCauSuaChuaPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // Use API hook để lấy chi tiết
  const { data: currentRequest, loading, error } = useRepairDetail(id);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Debug logging
  console.log("🔍 Detail Page - ID:", id);
  console.log("📦 Current Request Data:", currentRequest);
  console.log("⏳ Loading:", loading);
  console.log("❌ Error:", error);

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", minHeight: "400px" }}>
        <Spin size="large">
          <div style={{ paddingTop: "50px" }}>Đang tải dữ liệu...</div>
        </Spin>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ margin: "24px" }}
      />
    );
  }

  // Show not found state
  if (!currentRequest) {
    return (
      <Alert
        message="Không tìm thấy"
        description="Không tìm thấy yêu cầu sửa chữa này."
        type="warning"
        showIcon
        style={{ margin: "24px" }}
      />
    );
  }

  // Hàm mở modal xác nhận hủy
  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  // Hàm hủy yêu cầu
  const handleCancelRequest = async () => {
    try {
      setIsDeleting(true);

      // Call API to cancel repair request
      await cancelRepair(id, "Hủy bởi người dùng");

      setShowCancelModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setShowCancelModal(false);
      setErrorMessage("Có lỗi xảy ra khi hủy yêu cầu. Vui lòng thử lại.");
      setShowErrorModal(true);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hàm xử lý sau khi thành công
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien/danh-sach-yeu-cau-sua-chua");
  };

  // Helper function to get status step
  const getStatusStep = (status: RepairStatus) => {
    const steps = [
      RepairStatus.CHỜ_TIẾP_NHẬN,
      RepairStatus.ĐÃ_TIẾP_NHẬN,
      RepairStatus.ĐANG_XỬ_LÝ,
      RepairStatus.ĐÃ_HOÀN_THÀNH,
    ];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  // Helper function to calculate processing time
  const getProcessingTime = (createdAt: string, completedAt?: string) => {
    const start = new Date(createdAt);
    const end = completedAt ? new Date(completedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} ngày ${diffHours % 24} giờ`;
    }
    return `${diffHours} giờ`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải thông tin yêu cầu...</p>
        </div>
      </div>
    );
  }

  if (!currentRequest) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb for not found */}
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/giang-vien/danh-sach-yeu-cau-sua-chua",
              title: (
                <div className="flex items-center">
                  <span>Danh sách yêu cầu sửa chữa</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết</span>
                </div>
              ),
            },
          ]}
        />
        <Alert
          message="Không tìm thấy yêu cầu"
          description="Yêu cầu sửa chữa không tồn tại hoặc đã bị xóa."
          type="error"
          action={
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline text-sm">
              Quay lại
            </button>
          }
        />
      </div>
    );
  }

  const statusConfig =
    repairRequestStatusConfig[currentRequest.status as RepairStatus];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/giang-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: "/giang-vien/danh-sach-yeu-cau-sua-chua",
            title: (
              <div className="flex items-center">
                <span>Danh sách yêu cầu sửa chữa</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết • {currentRequest.requestCode || "N/A"}</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header with Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              {currentRequest.requestCode}
            </h1>
            <p className="mt-2 text-gray-600 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              {currentRequest.assetName} • {currentRequest.buildingName} -{" "}
              {currentRequest.roomName}
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-2">
              <Tag
                color={
                  statusConfig.color.includes("yellow")
                    ? "orange"
                    : statusConfig.color.includes("blue")
                    ? "blue"
                    : statusConfig.color.includes("green")
                    ? "green"
                    : statusConfig.color.includes("red")
                    ? "red"
                    : "default"
                }
                className="text-sm px-3 py-1">
                {statusConfig.label}
              </Tag>
              {/* Nút hủy yêu cầu - chỉ hiển thị khi trạng thái là Chờ tiếp nhận */}
              {currentRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN && (
                <button
                  onClick={handleOpenCancelModal}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hủy yêu cầu
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Báo lúc:{" "}
              {new Date(currentRequest.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <Divider />
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Tiến độ xử lý
          </h3>
          <Steps
            current={getStatusStep(currentRequest.status)}
            status={
              currentRequest.status === RepairStatus.ĐÃ_HỦY
                ? "error"
                : "process"
            }
            size="small"
            items={[
              {
                title: "Chờ tiếp nhận",
                icon: <Clock className="w-4 h-4" />,
                description:
                  currentRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN
                    ? "Hiện tại"
                    : "",
              },
              {
                title: "Đã tiếp nhận",
                icon: <CheckCircle className="w-4 h-4" />,
                description: currentRequest.acceptedAt
                  ? new Date(currentRequest.acceptedAt).toLocaleDateString(
                      "vi-VN"
                    )
                  : "",
              },
              {
                title: "Đang xử lý",
                icon: <Settings className="w-4 h-4" />,
                description:
                  currentRequest.status === RepairStatus.ĐANG_XỬ_LÝ
                    ? "Hiện tại"
                    : "",
              },
              {
                title: "Hoàn thành",
                icon: <CheckCircle className="w-4 h-4" />,
                description: currentRequest.completedAt
                  ? new Date(currentRequest.completedAt).toLocaleDateString(
                      "vi-VN"
                    )
                  : "",
              },
            ]}
          />
          {/* Status-specific alerts */}
          {currentRequest.status === RepairStatus.CHỜ_THAY_THẾ && (
            <Alert
              className="mt-4"
              message="Đang chờ thay thế linh kiện"
              description="Yêu cầu đang được xử lý thay thế linh kiện. Vui lòng chờ cập nhật từ kỹ thuật viên."
              type="warning"
              icon={<Package />}
              showIcon
            />
          )}
          {currentRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN && (
            <Alert
              className="mt-4"
              message="Yêu cầu chưa được tiếp nhận"
              description="Yêu cầu của bạn đang chờ kỹ thuật viên tiếp nhận và xử lý."
              type="info"
              icon={<Clock />}
              showIcon
            />
          )}
          {currentRequest.status === RepairStatus.ĐÃ_HOÀN_THÀNH && (
            <Alert
              className="mt-4"
              message="Yêu cầu đã hoàn thành"
              description={`Yêu cầu được hoàn thành lúc ${new Date(
                currentRequest.completedAt || ""
              ).toLocaleString("vi-VN")}. Thời gian xử lý: ${getProcessingTime(
                currentRequest.createdAt,
                currentRequest.completedAt
              )}`}
              type="success"
              icon={<CheckCircle />}
              showIcon
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="xl:col-span-2 space-y-6">
          {/* Enhanced Info Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Thông tin báo lỗi</span>
              </div>
            }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Người báo lỗi
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {currentRequest.reporterName}
                    </span>
                    <Tag className="text-xs">{currentRequest.reporterRole}</Tag>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Vị trí chi tiết
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {currentRequest.buildingName} - {currentRequest.roomName}{" "}
                      {currentRequest.machineLabel &&
                        `- Máy ${currentRequest.machineLabel}`}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Tài sản
                  </p>
                  <p className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {currentRequest.ktCode} - {currentRequest.assetName}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Loại lỗi
                  </p>
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="font-medium">
                      {currentRequest.errorTypeName || "Chưa xác định"}
                    </span>
                  </p>
                </div>
                {currentRequest.assignedTechnicianName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Kỹ thuật viên phụ trách
                    </p>
                    <p className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {currentRequest.assignedTechnicianName}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Mô tả chi tiết
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {currentRequest.description}
                    </p>
                  </div>
                </div>

                {/* Thông tin thời gian */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Thông tin thời gian
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Thời gian báo lỗi:</span>
                      <span>
                        {new Date(currentRequest.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    {currentRequest.acceptedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">
                          Thời gian tiếp nhận:
                        </span>
                        <span>
                          {new Date(currentRequest.acceptedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                    {currentRequest.completedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          Thời gian hoàn thành:
                        </span>
                        <span>
                          {new Date(currentRequest.completedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {currentRequest.resolutionNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Ghi chú xử lý
                    </p>
                    <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                      <p className="text-sm">
                        {currentRequest.resolutionNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Media Files */}
            {currentRequest.mediaUrls &&
              currentRequest.mediaUrls.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      Hình ảnh minh họa ({currentRequest.mediaUrls.length} ảnh)
                    </p>
                    <ImageViewer
                      images={currentRequest.mediaUrls}
                      showDownload={true}
                      title="Hình ảnh minh họa lỗi"
                      className="w-full"
                    />
                  </div>
                </>
              )}
          </Card>

          {/* Components Card - Hiển thị linh kiện bị hỏng */}
          {currentRequest.components &&
            currentRequest.components.length > 0 && (
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span>Linh kiện bị hỏng</span>
                    <Tag color="orange">
                      {currentRequest.components.length} linh kiện
                    </Tag>
                  </div>
                }>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentRequest.components.map((component, index) => (
                    <div
                      key={component.id || index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {component.name}
                        </h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Loại:</span>{" "}
                          {component.type}
                        </p>
                        {component.specifications && (
                          <p className="text-gray-600">
                            <span className="font-medium">Thông số:</span>{" "}
                            {component.specifications}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
        </div>
      </div>

      {/* Modals */}
      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
        title="Xác nhận hủy yêu cầu"
        message="Bạn có chắc chắn muốn hủy yêu cầu sửa chữa này không? Hành động này không thể hoàn tác."
        confirmText="Hủy yêu cầu"
        cancelText="Đóng"
        isLoading={isDeleting}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Hủy yêu cầu thành công!"
        message="Yêu cầu sửa chữa đã được hủy thành công."
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Có lỗi xảy ra!"
        message={errorMessage}
        showRetry={false}
      />
    </div>
  );
}
