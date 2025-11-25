"use client";

import { Modal, Input, Button } from "antd";
import { FileText, Download } from "lucide-react";
import { SubmissionFormData } from "@/types";

interface SubmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SubmissionFormData;
  onFormDataChange: (data: SubmissionFormData) => void;
  onExport: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function SubmissionFormModal({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onExport,
  onPreview,
  onSubmit,
  isSubmitting = false,
}: SubmissionFormModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <span>Lập tờ trình đề xuất</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: "800px" }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="export"
          icon={<Download className="w-4 h-4" />}
          onClick={onExport}>
          Xuất file
        </Button>,
        <Button
          key="preview"
          onClick={onPreview}
          className="bg-green-600 hover:bg-green-700 text-white">
          Xem trước
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700">
          Gửi tờ trình
        </Button>,
      ]}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người đề nghị <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.submittedBy}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  submittedBy: e.target.value,
                })
              }
              placeholder="Ví dụ: Giảng Thanh Trọn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chức vụ
            </label>
            <Input
              value={formData.position}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  position: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn vị đề nghị
            </label>
            <Input
              value={formData.department}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  department: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn vị tiếp nhận
            </label>
            <Input
              value={formData.recipientDepartment}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  recipientDepartment: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đề nghị
          </label>
          <Input
            value={formData.subject}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                subject: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung tờ trình
          </label>
          <Input.TextArea
            rows={8}
            value={formData.content}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                content: e.target.value,
              })
            }
            placeholder="Nội dung chi tiết của tờ trình..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Văn bản kèm theo
          </label>
          <Input
            value={formData.attachments}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                attachments: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giám đốc
            </label>
            <Input
              value={formData.director}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  director: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hiệu trưởng
            </label>
            <Input
              value={formData.rector}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  rector: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
