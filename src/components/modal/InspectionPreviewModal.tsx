"use client";
import { Modal } from "antd";
import { InspectionFormData } from "@/types";
import { ReplacementProposal } from "@/lib/api/replacement-proposals";

interface InspectionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: InspectionFormData;
  proposal: ReplacementProposal | null;
  onExport: () => void;
  onSubmit: () => void;
}

export default function InspectionPreviewModal({
  isOpen,
  onClose,
  formData,
  proposal,
  onExport,
  onSubmit,
}: InspectionPreviewModalProps) {
  if (!proposal) return null;

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Đóng
          </button>
          <button
            onClick={onExport}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Xuất file
          </button>
          <button
            onClick={onSubmit}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Gửi biên bản
          </button>
        </div>
      }
      width="90%"
      style={{ maxWidth: 1000 }}
      centered
      className="inspection-report-modal">
      <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            TRƯỜNG ĐẠI HỌC CÔNG
            NGHIỆP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CỘNG
            HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            THÀNH PHỐ HỒ CHÍ
            MINH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Độc
            lập - Tự do - Hạnh phúc
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mb-4">
            PHÒNG QUẢN TRỊ
          </div>
          <div className="text-right text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Thành phố Hồ Chí Minh, ngày {formData.inspectionDay || "___"} tháng{" "}
            {formData.inspectionMonth || "___"} năm{" "}
            {formData.inspectionYear || "2025"}
          </div>
          <div className="text-lg sm:text-xl font-bold text-center mb-2">
            BIÊN BẢN
          </div>
          <div className="text-sm sm:text-base font-semibold text-center mb-2 sm:mb-4">
            Kiểm tra tình trạng kỹ thuật cơ sở vật chất hư hỏng hoặc cần cải tạo
          </div>
          <div className="text-sm sm:text-base font-semibold text-center mb-4 sm:mb-6">
            để đề xuất giải pháp khắc phục
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Thông tin chung */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="col-span-1 sm:col-span-2">
              <span className="font-medium">Căn cứ đề nghị của: </span>
              <span className="underline">{formData.requestedBy}</span>
              <span className="ml-2 sm:ml-4 font-medium">Năm: </span>
              <span className="underline">{formData.year}</span>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <span className="font-medium">Hôm nay, </span>
              <span className="font-medium">Ngày: </span>
              <span className="underline">
                {formData.inspectionDay || "___"}
              </span>
              <span className="font-medium ml-2">Tháng: </span>
              <span className="underline">
                {formData.inspectionMonth || "___"}
              </span>
              <span className="font-medium ml-2">Năm: </span>
              <span className="underline">
                {formData.inspectionYear || "2025"}
              </span>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <span className="font-medium">Chúng tôi gồm có: </span>
            </div>
            <div className="col-span-1 sm:col-span-2 ml-2 sm:ml-4">
              <div className="mb-2">
                <span className="font-medium">1. Ông: </span>
                <span className="underline">{formData.departmentRep}</span>
                <span className="ml-4 sm:ml-8 font-medium">đại diện: </span>
                <span className="underline">{formData.departmentName}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">2. Ông: </span>
                <span className="underline">
                  {proposal?.adminVerifier?.fullName ||
                    formData.adminRep ||
                    "Chưa xác định"}
                </span>
                <span className="ml-4 sm:ml-8 font-medium">đại diện: </span>
                <span className="underline">
                  {formData.adminDepartment || "Phòng Quản trị"}
                </span>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <span className="font-medium">
                Cùng lập biên bản kiểm tra tình trạng kỹ thuật của cơ sở vật
                chất hư hỏng cần thay thế:{" "}
              </span>
            </div>
          </div>

          {/* Bảng linh kiện */}
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                    TT
                  </th>
                  <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                    Nội dung kiểm tra
                  </th>
                  <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                    SL
                  </th>
                  <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                    Vị trí
                  </th>
                  <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                    Tình trạng
                  </th>
                  <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                    Giải pháp
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposal.items?.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                      <div className="font-medium">
                        {item.oldComponent?.componentType || "Không xác định"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.oldComponent?.name || "N/A"}
                      </div>
                    </td>
                    <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                      <div className="text-xs">
                        {item.oldComponent?.roomLocation || "Chưa xác định"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.oldComponent?.componentSpecs || "N/A"}
                      </div>
                    </td>
                    <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                      Hỏng
                    </td>
                    <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                      <div className="text-xs">- Đề nghị thay thế:</div>
                      <div className="text-xs font-medium">
                        1. {item.newItemName || "Không xác định"}
                      </div>
                      <div className="text-xs">
                        2. {item.newItemSpecs || "N/A"}
                      </div>
                    </td>
                  </tr>
                )) || []}
              </tbody>
            </table>
          </div>

          {/* Kết luận */}
          <div className="space-y-3 sm:space-y-4">
            <div className="text-xs sm:text-sm">
              <span className="font-medium">
                Đại diện các đơn vị tham gia công tác kiểm tra tình trạng kỹ
                thuật của cơ sở vật chất hư hỏng cùng đồng ý với nội dung trên;{" "}
              </span>
              <span className="font-medium">Đồng ý với kỹ sư. </span>
            </div>

            {formData.notes && (
              <div className="text-xs sm:text-sm">
                <span className="font-medium">Ghi chú: </span>
                <span>{formData.notes}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
              <div className="text-center">
                <div className="font-medium mb-12 sm:mb-16 text-xs sm:text-sm">
                  {formData.departmentName}
                </div>
                <div className="font-medium mb-3 sm:mb-4 text-xs sm:text-sm">
                  Tổ trưởng Kỹ thuật
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs sm:text-sm">
                    {formData.departmentRep}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-12 sm:mb-16 text-xs sm:text-sm">
                  {formData.adminDepartment || "Phòng Quản trị"}
                </div>
                <div className="font-medium mb-3 sm:mb-4 text-xs sm:text-sm">
                  Người thực hiện
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs sm:text-sm">
                    {proposal?.adminVerifier?.fullName ||
                      formData.adminRep ||
                      "Chưa xác định"}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <div className="font-medium mb-3 sm:mb-4 text-xs sm:text-sm">
                Ý kiến của Lãnh đạo Phòng Quản trị:
              </div>
              <div className="h-12 sm:h-16 border-b border-gray-300 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
