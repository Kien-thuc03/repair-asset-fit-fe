"use client";
import { Modal, Input } from "antd";
import { InspectionFormData } from "@/types";

const { TextArea } = Input;

interface InspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: InspectionFormData;
  onFormDataChange: (data: InspectionFormData) => void;
  onExport: () => void;
  onPreview: () => void;
  onSubmit: () => void;
}

export default function InspectionFormModal({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onExport,
  onPreview,
  onSubmit,
}: InspectionFormModalProps) {
  return (
    <Modal
      title={
        <div className="text-lg sm:text-xl font-semibold">
          Lập biên bản kiểm tra
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="cancel"
          onClick={onClose}
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2">
          Hủy
        </button>,
        <button
          key="export"
          onClick={onExport}
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2">
          Xuất file
        </button>,
        <button
          key="preview"
          onClick={onPreview}
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-600 rounded-md text-xs sm:text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 mr-2">
          Xem trước
        </button>,
        <button
          key="submit"
          onClick={onSubmit}
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Gửi biên bản
        </button>,
      ]}
      width="90%"
      style={{ maxWidth: 900 }}
      centered>
      <div className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto px-2 py-4">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Căn cứ đề nghị của <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.requestedBy}
              onChange={(e) =>
                onFormDataChange({ ...formData, requestedBy: e.target.value })
              }
              placeholder="Ví dụ: Khoa CNTT"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.year}
              onChange={(e) =>
                onFormDataChange({ ...formData, year: e.target.value })
              }
              placeholder="2025"
              className="w-full"
            />
          </div>
        </div>

        {/* Ngày kiểm tra */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày
            </label>
            <Input
              value={formData.inspectionDay}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  inspectionDay: e.target.value,
                })
              }
              placeholder="01"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tháng
            </label>
            <Input
              value={formData.inspectionMonth}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  inspectionMonth: e.target.value,
                })
              }
              placeholder="01"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm
            </label>
            <Input
              value={formData.inspectionYear}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  inspectionYear: e.target.value,
                })
              }
              placeholder="2025"
              className="w-full"
            />
          </div>
        </div>


        {/* Người đại diện */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Người tham gia kiểm tra</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đại diện khoa (Họ tên) <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.departmentRep}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    departmentRep: e.target.value,
                  })
                }
                placeholder="Ví dụ: Giang Thanh Trọn"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.departmentName}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    departmentName: e.target.value,
                  })
                }
                placeholder="Ví dụ: Khoa CNTT"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đại diện Phòng Quản trị (Họ tên){" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.adminRep}
                onChange={(e) =>
                  onFormDataChange({ ...formData, adminRep: e.target.value })
                }
                placeholder="Ví dụ: Nguyễn Văn Ngã"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.adminDepartment}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    adminDepartment: e.target.value,
                  })
                }
                placeholder="Phòng Quản trị"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Ghi chú bổ sung */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú bổ sung (nếu có)
          </label>
          <TextArea
            value={formData.notes}
            onChange={(e) =>
              onFormDataChange({ ...formData, notes: e.target.value })
            }
            placeholder="Thêm ghi chú hoặc nhận xét..."
            rows={4}
            className="w-full"
          />
        </div>

        <div className="text-xs text-gray-500 italic">
          <span className="text-red-500">*</span> Các trường bắt buộc
        </div>
      </div>
    </Modal>
  );
}
