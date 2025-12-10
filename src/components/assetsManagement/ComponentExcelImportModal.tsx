'use client';

import { useState } from 'react';
import { Modal, Upload, Button, Table, Alert, Typography, Divider, Tag } from 'antd';
import { Upload as UploadIcon, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { CreateComponentRequest, ComponentType } from '@/lib/api/components';
import { getComponentTypeLabel } from '@/types/computer';
import { message } from 'antd';

const { Text, Title } = Typography;

interface ComponentExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (components: CreateComponentRequest[]) => Promise<void>;
}

interface ImportComponent {
  row: number;
  componentType: ComponentType | string;
  name: string;
  componentSpecs?: string;
  serialNumber?: string;
  notes?: string;
  errors: string[];
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; errors: string[] }>;
}

// Allowed component types for stock
const allowedComponentTypes = [
  ComponentType.KEYBOARD,
  ComponentType.MOUSE,
  ComponentType.OTHER,
];

const componentTypeMap: Record<string, ComponentType> = {
  'KEYBOARD': ComponentType.KEYBOARD,
  'BÀN PHÍM': ComponentType.KEYBOARD,
  'BAN PHIM': ComponentType.KEYBOARD,
  'MOUSE': ComponentType.MOUSE,
  'CHUỘT': ComponentType.MOUSE,
  'CHUOT': ComponentType.MOUSE,
  'OTHER': ComponentType.OTHER,
  'KHÁC': ComponentType.OTHER,
  'KHAC': ComponentType.OTHER,
};

export default function ComponentExcelImportModal({
  isOpen,
  onClose,
  onImport
}: ComponentExcelImportModalProps) {
  const [importData, setImportData] = useState<ImportComponent[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [importing, setImporting] = useState(false);

  // Đặt lại state khi đóng modal
  const handleClose = () => {
    setImportData([]);
    setImportResult(null);
    setCurrentStep('upload');
    setImporting(false);
    onClose();
  };

  // Tải file mẫu Excel
  const downloadTemplate = async () => {
    try {
      const XLSX = await import('xlsx');
      
      const templateData = [
        {
          'STT': 1,
          'Loại linh kiện (*)': 'KEYBOARD',
          'Tên linh kiện (*)': 'Logitech MX Master 3',
          'Thông số kỹ thuật': 'Wireless, 4000 DPI, Bluetooth',
          'Số serial': 'SN123456789',
          'Ghi chú': 'Linh kiện mới nhập kho'
        },
        {
          'STT': 2,
          'Loại linh kiện (*)': 'MOUSE',
          'Tên linh kiện (*)': 'Razer DeathAdder V3',
          'Thông số kỹ thuật': 'Wireless, 30000 DPI',
          'Số serial': 'SN987654321',
          'Ghi chú': ''
        },
        {
          'STT': 3,
          'Loại linh kiện (*)': 'OTHER',
          'Tên linh kiện (*)': 'Pin CMOS',
          'Thông số kỹ thuật': '10000mAh, 3.7V, 1.5W',
          'Số serial': '',
          'Ghi chú': 'Linh kiện mới nhập kho'
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);

      // Thêm ghi chú vào worksheet
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 20 }, // Loại linh kiện
        { wch: 30 }, // Tên linh kiện
        { wch: 40 }, // Thông số kỹ thuật
        { wch: 20 }, // Số serial
        { wch: 30 }, // Ghi chú
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      
      // Thêm sheet hướng dẫn
      const instructionsData = [
        { 'Trường': 'Loại linh kiện (*)', 'Mô tả': 'KEYBOARD, MOUSE, hoặc OTHER (hoặc tiếng Việt: BÀN PHÍM, CHUỘT, KHÁC)', 'Ví dụ': 'KEYBOARD' },
        { 'Trường': 'Tên linh kiện (*)', 'Mô tả': 'Tên/model của linh kiện, tối đa 255 ký tự', 'Ví dụ': 'Logitech MX Master 3' },
        { 'Trường': 'Thông số kỹ thuật', 'Mô tả': 'Thông số chi tiết, tối đa 500 ký tự', 'Ví dụ': 'Wireless, 4000 DPI, Bluetooth' },
        { 'Trường': 'Số serial', 'Mô tả': 'Số serial nếu có, tối đa 100 ký tự, phải duy nhất', 'Ví dụ': 'SN123456789' },
        { 'Trường': 'Ghi chú', 'Mô tả': 'Ghi chú bổ sung, tối đa 500 ký tự', 'Ví dụ': 'Linh kiện mới nhập kho' },
      ];
      const wsInstructions = XLSX.utils.json_to_sheet(instructionsData);
      wsInstructions['!cols'] = [
        { wch: 25 },
        { wch: 60 },
        { wch: 30 }
      ];
      XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

      XLSX.writeFile(wb, 'template-import-linh-kien.xlsx');
      
      message.success('Đã tải file mẫu thành công');
    } catch (error) {
      console.error('Error downloading template:', error);
      message.error('Có lỗi khi tải file mẫu');
    }
  };

  // Xử lý file upload
  const handleFileUpload = async (file: File) => {
    try {
      const XLSX = await import('xlsx');
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

      if (jsonData.length < 2) {
        message.error('File Excel không có dữ liệu');
        return;
      }

      // Bỏ qua dòng header (dòng đầu tiên)
      const dataRows = jsonData.slice(1);
      
      const importComponents: ImportComponent[] = dataRows.map((row, index) => {
        const rowNumber = index + 2; // +2 vì bỏ qua header và index bắt đầu từ 0
        const errors: string[] = [];
        
        // Lấy dữ liệu từ các cột
        const componentTypeStr = row[1]?.toString().trim().toUpperCase() || '';
        const name = row[2]?.toString().trim() || '';
        const componentSpecs = row[3]?.toString().trim() || '';
        const serialNumber = row[4]?.toString().trim() || '';
        const notes = row[5]?.toString().trim() || '';

        // Validate component type
        let componentType: ComponentType | string = '';
        if (!componentTypeStr) {
          errors.push('Loại linh kiện không được để trống');
        } else {
          // Map component type (support both English and Vietnamese)
          const mappedType = componentTypeMap[componentTypeStr];
          if (mappedType) {
            componentType = mappedType;
          } else if (allowedComponentTypes.includes(componentTypeStr as ComponentType)) {
            componentType = componentTypeStr as ComponentType;
          } else {
            errors.push(`Loại linh kiện không hợp lệ: ${componentTypeStr}. Chỉ chấp nhận: KEYBOARD, MOUSE, OTHER`);
          }
        }

        // Validate name
        if (!name) {
          errors.push('Tên linh kiện không được để trống');
        } else if (name.length > 255) {
          errors.push('Tên linh kiện không được vượt quá 255 ký tự');
        }

        // Validate componentSpecs
        if (componentSpecs && componentSpecs.length > 500) {
          errors.push('Thông số kỹ thuật không được vượt quá 500 ký tự');
        }

        // Validate serialNumber
        if (serialNumber && serialNumber.length > 100) {
          errors.push('Số serial không được vượt quá 100 ký tự');
        }

        // Validate notes
        if (notes && notes.length > 500) {
          errors.push('Ghi chú không được vượt quá 500 ký tự');
        }

        return {
          row: rowNumber,
          componentType,
          name,
          componentSpecs: componentSpecs || undefined,
          serialNumber: serialNumber || undefined,
          notes: notes || undefined,
          errors
        };
      }).filter(comp => 
        // Lọc bỏ các dòng trống (không có dữ liệu quan trọng)
        comp.name || comp.componentType
      );

      if (importComponents.length === 0) {
        message.error('Không tìm thấy dữ liệu hợp lệ trong file Excel');
        return;
      }

      setImportData(importComponents);
      setCurrentStep('preview');
      
    } catch (error) {
      console.error('Error processing Excel file:', error);
      message.error('Có lỗi khi xử lý file Excel. Vui lòng kiểm tra định dạng file.');
    }

    return false; // Prevent automatic upload
  };

  // Thực hiện import
  const handleImport = async () => {
    const validComponents = importData.filter(comp => comp.errors.length === 0);
    
    if (validComponents.length === 0) {
      message.error('Không có linh kiện hợp lệ để import');
      return;
    }

    setImporting(true);
    
    try {
      const createRequests: CreateComponentRequest[] = validComponents.map(comp => ({
        computerAssetId: undefined, // Không liên kết với máy tính, chỉ nhập kho
        componentType: comp.componentType as ComponentType,
        name: comp.name.trim(),
        componentSpecs: comp.componentSpecs?.trim() || undefined,
        serialNumber: comp.serialNumber?.trim() || undefined,
        notes: comp.notes?.trim() || undefined,
      }));

      await onImport(createRequests);
      
      setImportResult({
        total: importData.length,
        success: validComponents.length,
        failed: importData.length - validComponents.length,
        errors: importData
          .filter(comp => comp.errors.length > 0)
          .map(comp => ({ row: comp.row, errors: comp.errors }))
      });
      
      setCurrentStep('result');
      
    } catch (error) {
      console.error('Error importing components:', error);
      message.error('Có lỗi khi import linh kiện');
    } finally {
      setImporting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <Alert
              message="Hướng dẫn import file Excel"
              description={
                <div className="space-y-2">
                  <div>1. Tải file mẫu và điền thông tin theo đúng định dạng</div>
                  <div>2. Các trường có dấu (*) là bắt buộc</div>
                  <div>3. <strong>Loại linh kiện:</strong> Chỉ chấp nhận KEYBOARD, MOUSE, hoặc OTHER (hoặc tiếng Việt: BÀN PHÍM, CHUỘT, KHÁC)</div>
                  <div>4. <strong>Tên linh kiện:</strong> Tối đa 255 ký tự</div>
                  <div>5. <strong>Thông số kỹ thuật:</strong> Tối đa 500 ký tự (tùy chọn)</div>
                  <div>6. <strong>Số serial:</strong> Tối đa 100 ký tự, phải duy nhất (tùy chọn)</div>
                  <div>7. <strong>Ghi chú:</strong> Tối đa 500 ký tự (tùy chọn)</div>
                </div>
              }
              type="info"
              showIcon
            />

            <div className="flex justify-center">
              <Button
                onClick={downloadTemplate}
                icon={<Download className="h-4 w-4" />}
                type="dashed"
                size="large"
              >
                Tải file mẫu Excel
              </Button>
            </div>

            <Divider />

            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".xlsx,.xls"
              beforeUpload={handleFileUpload}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon className="h-12 w-12 mx-auto text-blue-500" />
              </p>
              <p className="ant-upload-text text-lg">
                Nhấp hoặc kéo file Excel vào đây để upload
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ file .xlsx, .xls
              </p>
            </Upload.Dragger>
          </div>
        );

      case 'preview':
        const validComponents = importData.filter(comp => comp.errors.length === 0);
        const invalidComponents = importData.filter(comp => comp.errors.length > 0);

        const columns = [
          {
            title: 'Dòng',
            dataIndex: 'row',
            key: 'row',
            width: 60,
          },
          {
            title: 'Loại linh kiện',
            dataIndex: 'componentType',
            key: 'componentType',
            width: 120,
            render: (type: ComponentType | string) => (
              <Tag color="blue">
                {getComponentTypeLabel(type as ComponentType)}
              </Tag>
            ),
          },
          {
            title: 'Tên linh kiện',
            dataIndex: 'name',
            key: 'name',
            width: 200,
          },
          {
            title: 'Thông số',
            dataIndex: 'componentSpecs',
            key: 'componentSpecs',
            width: 150,
            render: (specs: string) => specs || '-',
          },
          {
            title: 'Số serial',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 120,
            render: (serial: string) => serial || '-',
          },
          {
            title: 'Trạng thái',
            dataIndex: 'errors',
            key: 'status',
            width: 100,
            render: (errors: string[]) => (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                errors.length === 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {errors.length === 0 ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Hợp lệ
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Lỗi
                  </>
                )}
              </span>
            ),
          },
          {
            title: 'Lỗi',
            dataIndex: 'errors',
            key: 'errors',
            render: (errors: string[]) => (
              errors.length > 0 ? (
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-red-600 text-xs">
                      • {error}
                    </div>
                  ))}
                </div>
              ) : null
            ),
          },
        ];

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{importData.length}</div>
                <div className="text-sm text-gray-600">Tổng số dòng</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-900">{validComponents.length}</div>
                <div className="text-sm text-green-600">Hợp lệ</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-900">{invalidComponents.length}</div>
                <div className="text-sm text-red-600">Có lỗi</div>
              </div>
            </div>

            {invalidComponents.length > 0 && (
              <Alert
                message="Có dữ liệu không hợp lệ"
                description="Vui lòng kiểm tra và sửa các lỗi trước khi import"
                type="warning"
                showIcon
              />
            )}

            <Table
              columns={columns}
              dataSource={importData}
              rowKey="row"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              size="small"
            />
          </div>
        );

      case 'result':
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <Title level={3}>Import hoàn tất!</Title>
              <Text type="secondary">
                Đã xử lý {importResult?.total} dòng dữ liệu
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {importResult?.success}
                </div>
                <div className="text-sm text-green-600">Thành công</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-900">
                  {importResult?.failed}
                </div>
                <div className="text-sm text-red-600">Thất bại</div>
              </div>
            </div>

            {importResult?.errors && importResult.errors.length > 0 && (
              <Alert
                message={`${importResult.errors.length} dòng có lỗi`}
                description={
                  <div className="text-left max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="mb-2">
                        <strong>Dòng {error.row}:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {error.errors.map((msg, msgIndex) => (
                            <li key={msgIndex} className="text-sm">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                }
                type="error"
                showIcon
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case 'upload': return 'Import linh kiện từ Excel';
      case 'preview': return 'Xem trước dữ liệu';
      case 'result': return 'Kết quả Import';
      default: return 'Import Excel';
    }
  };

  const getModalFooter = () => {
    switch (currentStep) {
      case 'upload':
        return [
          <Button key="cancel" onClick={handleClose}>
            Hủy
          </Button>
        ];

      case 'preview':
        const validComponents = importData.filter(comp => comp.errors.length === 0);
        return [
          <Button key="back" onClick={() => setCurrentStep('upload')}>
            Quay lại
          </Button>,
          <Button key="cancel" onClick={handleClose}>
            Hủy
          </Button>,
          <Button
            key="import"
            type="primary"
            onClick={handleImport}
            loading={importing}
            disabled={validComponents.length === 0}
          >
            Import {validComponents.length} linh kiện
          </Button>
        ];

      case 'result':
        return [
          <Button key="close" type="primary" onClick={handleClose}>
            Đóng
          </Button>
        ];

      default:
        return [];
    }
  };

  return (
    <Modal
      title={getModalTitle()}
      open={isOpen}
      onCancel={handleClose}
      footer={getModalFooter()}
      width={900}
      destroyOnHidden
      maskClosable={false}
    >
      {renderStepContent()}
    </Modal>
  );
}

