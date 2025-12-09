"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Button, message, Form, Input, Select, Modal } from "antd";
import { FileUp } from "lucide-react";
import { Package } from "lucide-react";
import { 
  addComponentToStock, 
  ComponentType,
  CreateComponentRequest,
} from "@/lib/api/components";
import { getComponentTypeLabel } from "@/types/computer";
import { ComponentExcelImportModal } from "@/components/assetsManagement";
import SuccessModal from "@/components/modal/SuccessModal";

// Allowed component types for stock
const allowedComponentTypes = [
  ComponentType.KEYBOARD,
  ComponentType.MOUSE,
  ComponentType.OTHER,
];

export default function AddComponentToStockPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [importErrors, setImportErrors] = useState<Array<{ 
    index: number; 
    name: string; 
    serialNumber?: string; 
    error: string;
  }>>([]);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const formValues = form.getFieldsValue();

    // Component type validation
    if (!formValues.componentType) {
      newErrors.componentType = "Vui lòng chọn loại linh kiện";
    }

    // Name validation
    if (!formValues.name || !formValues.name.trim()) {
      newErrors.name = "Tên linh kiện là bắt buộc";
    } else if (formValues.name.trim().length > 255) {
      newErrors.name = "Tên linh kiện không được vượt quá 255 ký tự";
    }

    // Component specs validation
    if (formValues.componentSpecs && formValues.componentSpecs.length > 500) {
      newErrors.componentSpecs = "Thông số kỹ thuật không được vượt quá 500 ký tự";
    }

    // Serial number validation
    if (formValues.serialNumber && formValues.serialNumber.length > 100) {
      newErrors.serialNumber = "Số serial không được vượt quá 100 ký tự";
    }

    // Notes validation
    if (formValues.notes && formValues.notes.length > 500) {
      newErrors.notes = "Ghi chú không được vượt quá 500 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (values: {
    componentType: ComponentType;
    name: string;
    componentSpecs?: string;
    serialNumber?: string;
    notes?: string;
  }) => {
    if (!validateForm()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const cleanedData: CreateComponentRequest = {
        computerAssetId: undefined, // Không liên kết với máy tính, chỉ nhập kho
        componentType: values.componentType,
        name: values.name.trim(),
        componentSpecs: values.componentSpecs?.trim() || undefined,
        serialNumber: values.serialNumber?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      };

      await addComponentToStock(cleanedData);
      
      // Hiển thị modal thành công
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number };
      const errorMessage = error.message || 'Có lỗi xảy ra khi thêm linh kiện';

      console.error('Error creating component:', err);

      // Xử lý lỗi conflict (409) - Serial number đã tồn tại
      if (error.statusCode === 409) {
        const fieldErrors: Record<string, string> = {};
        if (errorMessage.includes('serial') || errorMessage.includes('Serial')) {
          fieldErrors.serialNumber = errorMessage;
          setErrors(fieldErrors);
        }
        message.error(errorMessage, 5);
      } 
      // Xử lý lỗi validation (400)
      else if (error.statusCode === 400) {
        const fieldErrors: Record<string, string> = {};
        
        if (errorMessage.toLowerCase().includes('componenttype') || errorMessage.toLowerCase().includes('component type')) {
          fieldErrors.componentType = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('name')) {
          fieldErrors.name = errorMessage;
        }
        if (errorMessage.toLowerCase().includes('serial')) {
          fieldErrors.serialNumber = errorMessage;
        }

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
        
        message.error(errorMessage);
      } 
      // Xử lý các lỗi khác
      else {
        message.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkImport = async (componentsData: CreateComponentRequest[]) => {
    try {
      let successCount = 0;
      let errorCount = 0;
      const importErrors: Array<{ 
        index: number; 
        name: string; 
        serialNumber?: string; 
        error: string;
      }> = [];

      for (let i = 0; i < componentsData.length; i++) {
        const comp = componentsData[i];
        try {
          await addComponentToStock(comp);
          successCount++;
        } catch (error) {
          errorCount++;
          const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
          
          // Thu thập thông tin lỗi chi tiết
          importErrors.push({
            index: i + 1,
            name: comp.name,
            serialNumber: comp.serialNumber,
            error: errorMessage,
          });
          
          console.error(`Error importing component ${i + 1} (${comp.name}):`, error);
        }
      }

      // Hiển thị kết quả
      setImportResult({ success: successCount, failed: errorCount });
      
      if (successCount > 0 && errorCount === 0) {
        // Tất cả thành công
        message.success(`Đã import thành công ${successCount} linh kiện!`);
        setShowImportModal(false);
        router.push('/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien');
      } else if (successCount > 0 && errorCount > 0) {
        // Một phần thành công
        setImportErrors(importErrors);
        setShowErrorModal(true);
        message.warning(`Đã import thành công ${successCount} linh kiện, ${errorCount} linh kiện thất bại. Vui lòng xem chi tiết.`);
        setShowImportModal(false);
      } else {
        // Tất cả thất bại
        setImportErrors(importErrors);
        setShowErrorModal(true);
        message.error('Không thể import linh kiện nào. Vui lòng xem chi tiết lỗi.');
        setShowImportModal(false);
      }
    } catch (error) {
      console.error('Error importing components:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi import linh kiện';
      message.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/ky-thuat-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Quản lý thay thế linh kiện</span>
              </div>
            ),
          },
          {
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien",
            title: (
              <div className="flex items-center">
                <span>Kho linh kiện</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Thêm mới</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-6 h-6 text-green-600" />
            <span>Thêm linh kiện vào kho</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Thêm linh kiện mới vào kho hoặc import từ file Excel
          </p>
        </div>
        <Button
          onClick={() => setShowImportModal(true)}
          icon={<FileUp className="h-4 w-4" />}
          type="default"
          size="large"
        >
          Import Excel
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="p-6 space-y-6"
          autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Loại linh kiện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại linh kiện <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Chọn loại linh kiện"
                className={`w-full ${errors.componentType ? "border-red-500" : ""}`}
                onChange={(value) => {
                  form.setFieldsValue({ componentType: value });
                  if (errors.componentType) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.componentType;
                      return newErrors;
                    });
                  }
                }}
              >
                {allowedComponentTypes.map((type) => (
                  <Select.Option key={type} value={type}>
                    {getComponentTypeLabel(type)}
                  </Select.Option>
                ))}
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Chỉ chấp nhận: Bàn phím, Chuột, hoặc Khác
              </p>
              {errors.componentType && (
                <p className="mt-1 text-sm text-red-600">{errors.componentType}</p>
              )}
            </div>

            {/* Tên linh kiện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên linh kiện <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.getFieldValue('name')}
                onChange={(e) => {
                  form.setFieldsValue({ name: e.target.value });
                  if (errors.name) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.name;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full ${errors.name ? "border-red-500" : ""}`}
                placeholder="Ví dụ: Logitech MX Master 3"
                maxLength={255}
              />
              <p className="mt-1 text-xs text-gray-500">
                Tối đa 255 ký tự
              </p>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Thông số kỹ thuật */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thông số kỹ thuật
              </label>
              <Input.TextArea
                value={form.getFieldValue('componentSpecs')}
                onChange={(e) => {
                  form.setFieldsValue({ componentSpecs: e.target.value });
                  if (errors.componentSpecs) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.componentSpecs;
                      return newErrors;
                    });
                  }
                }}
                rows={3}
                placeholder="Ví dụ: Wireless, 4000 DPI, Bluetooth"
                maxLength={500}
                showCount
                className={errors.componentSpecs ? "border-red-500" : ""}
              />
              <p className="mt-1 text-xs text-gray-500">
                Tối đa 500 ký tự
              </p>
              {errors.componentSpecs && (
                <p className="mt-1 text-sm text-red-600">{errors.componentSpecs}</p>
              )}
            </div>

            {/* Số serial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số serial
              </label>
              <Input
                value={form.getFieldValue('serialNumber')}
                onChange={(e) => {
                  form.setFieldsValue({ serialNumber: e.target.value });
                  if (errors.serialNumber) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.serialNumber;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full ${errors.serialNumber ? "border-red-500" : ""}`}
                placeholder="Nhập số serial nếu có"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                Tối đa 100 ký tự, phải duy nhất
              </p>
              {errors.serialNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <Input.TextArea
                value={form.getFieldValue('notes')}
                onChange={(e) => {
                  form.setFieldsValue({ notes: e.target.value });
                  if (errors.notes) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.notes;
                      return newErrors;
                    });
                  }
                }}
                rows={2}
                placeholder="Ghi chú bổ sung (tùy chọn)"
                maxLength={500}
                showCount
                className={errors.notes ? "border-red-500" : ""}
              />
              <p className="mt-1 text-xs text-gray-500">
                Tối đa 500 ký tự
              </p>
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang thêm..." : "Thêm linh kiện"}
            </button>
          </div>
        </Form>
      </div>

      {/* Excel Import Modal */}
      <ComponentExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBulkImport}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien');
        }}
        title="Thêm linh kiện thành công!"
        message="Linh kiện mới đã được thêm vào kho thành công."
      />

      {/* Import Error Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">
              {importResult && importResult.failed === importResult.success + importResult.failed
                ? 'Lỗi Import'
                : 'Kết quả Import'}
            </span>
          </div>
        }
        open={showErrorModal}
        onCancel={() => {
          setShowErrorModal(false);
          setImportErrors([]);
          setImportResult(null);
          if (importResult && importResult.success > 0) {
            router.push('/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien');
          }
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setShowErrorModal(false);
              setImportErrors([]);
              setImportResult(null);
              if (importResult && importResult.success > 0) {
                router.push('/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien');
              }
            }}>
            Đóng
          </Button>
        ]}
        width={700}>
        <div className="space-y-4">
          {importResult && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-900">
                  {importResult.success}
                </div>
                <div className="text-sm text-green-600">Thành công</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-900">
                  {importResult.failed}
                </div>
                <div className="text-sm text-red-600">Thất bại</div>
              </div>
            </div>
          )}

          {importErrors.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Chi tiết lỗi ({importErrors.length} linh kiện):
              </h4>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {importErrors.map((err, index) => (
                  <div
                    key={index}
                    className="border border-red-200 rounded-lg p-3 bg-red-50">
                    <div className="flex items-start space-x-2">
                      <span className="text-red-600 font-medium">
                        Linh kiện {err.index}:
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {err.name}
                        </div>
                        {err.serialNumber && (
                          <div className="text-sm text-gray-600 mt-1">
                            Serial: <span className="font-mono">{err.serialNumber}</span>
                          </div>
                        )}
                        <div className="text-sm text-red-700 mt-2">
                          <span className="font-medium">Lỗi:</span> {err.error}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
