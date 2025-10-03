'use client';

import { useState } from 'react';
import { Modal, Upload, Button, Table, Alert, Typography, Divider } from 'antd';
import { Upload as UploadIcon, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { ICreateUserRequest, UserStatus } from '@/types';
import { message } from 'antd';

const { Text, Title } = Typography;

interface UserExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (users: ICreateUserRequest[]) => Promise<void>;
}

interface ImportUser {
  row: number;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  unitId: string;
  roleIds: string[];
  birthDate?: string;
  status: UserStatus;
  errors: string[];
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; errors: string[] }>;
}

export default function UserExcelImportModal({
  isOpen,
  onClose,
  onImport
}: UserExcelImportModalProps) {
  const [importData, setImportData] = useState<ImportUser[]>([]);
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
          'Họ và tên (*)': 'Nguyễn Văn A',
          'Tên đăng nhập (*)': 'nguyenvana',
          'Email (*)': 'nguyenvana@iuh.edu.vn',
          'Số điện thoại': '0123456789',
          'Mã đơn vị (*)': 'CNTT001',
          'Mã vai trò (*)': 'GIANG_VIEN,KY_THUAT_VIEN',
          'Ngày sinh (DD/MM/YYYY)': '01/01/1990'
        },
        {
          'STT': 2,
          'Họ và tên (*)': 'Trần Thị B',
          'Tên đăng nhập (*)': 'tranthib',
          'Email (*)': 'tranthib@iuh.edu.vn',
          'Số điện thoại': '0987654321',
          'Mã đơn vị (*)': 'QTRI001',
          'Mã vai trò (*)': 'PHONG_QUAN_TRI',
          'Ngày sinh (DD/MM/YYYY)': '15/03/1985'
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);

      // Thêm ghi chú vào worksheet
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 20 }, // Họ và tên
        { wch: 15 }, // Tên đăng nhập
        { wch: 25 }, // Email
        { wch: 15 }, // Số điện thoại
        { wch: 12 }, // Mã đơn vị
        { wch: 20 }, // Mã vai trò
        { wch: 20 }  // Ngày sinh
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      XLSX.writeFile(wb, 'template-import-nguoi-dung.xlsx');
      
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
      
      const importUsers: ImportUser[] = dataRows.map((row, index) => {
        const rowNumber = index + 2; // +2 vì bỏ qua header và index bắt đầu từ 0
        const errors: string[] = [];
        
        // Lấy dữ liệu từ các cột
        const fullName = row[1]?.toString().trim() || '';
        const username = row[2]?.toString().trim() || '';
        const email = row[3]?.toString().trim() || '';
        const phoneNumber = row[4]?.toString().trim() || '';
        const unitId = row[5]?.toString().trim() || '';
        const roleCodesStr = row[6]?.toString().trim() || '';
        const birthDateStr = row[7]?.toString().trim() || '';

        // Validate required fields
        if (!fullName) errors.push('Họ và tên không được để trống');
        if (!username) errors.push('Tên đăng nhập không được để trống');
        if (!email) errors.push('Email không được để trống');
        if (!unitId) errors.push('Mã đơn vị không được để trống');
        if (!roleCodesStr) errors.push('Mã vai trò không được để trống');

        // Validate email format
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push('Email không đúng định dạng');
        }

        // Parse role IDs
        const roleCodes = roleCodesStr.split(',').map((code: string) => code.trim()).filter(Boolean);
        if (roleCodes.length === 0) {
          errors.push('Ít nhất một vai trò phải được chỉ định');
        }
        
        // Validate role codes (convert codes to IDs)
        const validRoleCodes = ['GIANG_VIEN', 'KY_THUAT_VIEN', 'TO_TRUONG_KY_THUAT', 'PHONG_QUAN_TRI', 'QTV_KHOA'];
        const invalidRoles = roleCodes.filter(code => !validRoleCodes.includes(code));
        if (invalidRoles.length > 0) {
          errors.push(`Mã vai trò không hợp lệ: ${invalidRoles.join(', ')}`);
        }
        
        // Map role codes to role IDs
        const roleCodeToIdMap: Record<string, string> = {
          'GIANG_VIEN': 'role-1',
          'KY_THUAT_VIEN': 'role-2', 
          'TO_TRUONG_KY_THUAT': 'role-3',
          'PHONG_QUAN_TRI': 'role-4',
          'QTV_KHOA': 'role-5'
        };
        const roleIds = roleCodes
          .filter(code => validRoleCodes.includes(code))
          .map(code => roleCodeToIdMap[code]);

        return {
          row: rowNumber,
          fullName,
          username,
          email,
          phoneNumber: phoneNumber || undefined,
          unitId,
          roleIds,
          birthDate: birthDateStr || undefined,
          status: UserStatus.ACTIVE, // Mặc định luôn là ACTIVE
          errors
        };
      }).filter(user => 
        // Lọc bỏ các dòng trống (không có dữ liệu quan trọng)
        user.fullName || user.username || user.email
      );

      if (importUsers.length === 0) {
        message.error('Không tìm thấy dữ liệu hợp lệ trong file Excel');
        return;
      }

      setImportData(importUsers);
      setCurrentStep('preview');
      
    } catch (error) {
      console.error('Error processing Excel file:', error);
      message.error('Có lỗi khi xử lý file Excel. Vui lòng kiểm tra định dạng file.');
    }

    return false; // Prevent automatic upload
  };

  // Thực hiện import
  const handleImport = async () => {
    const validUsers = importData.filter(user => user.errors.length === 0);
    
    if (validUsers.length === 0) {
      message.error('Không có người dùng hợp lệ để import');
      return;
    }

    setImporting(true);
    
    try {
      const createRequests: ICreateUserRequest[] = validUsers.map(user => ({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        unitId: user.unitId,
        roleIds: user.roleIds,
        birthDate: user.birthDate,
        password: '123456' // TODO: Generate secure password
        // Status mặc định sẽ được xử lý trong backend/mock data
      }));

      await onImport(createRequests);
      
      setImportResult({
        total: importData.length,
        success: validUsers.length,
        failed: importData.length - validUsers.length,
        errors: importData
          .filter(user => user.errors.length > 0)
          .map(user => ({ row: user.row, errors: user.errors }))
      });
      
      setCurrentStep('result');
      
    } catch (error) {
      console.error('Error importing users:', error);
      message.error('Có lỗi khi import người dùng');
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
                  <div>3. Mã vai trò có thể nhập nhiều, cách nhau bởi dấu phẩy (,)</div>
                  <div>4. Ngày sinh theo định dạng DD/MM/YYYY</div>
                  <div>5. Tất cả tài khoản được tạo sẽ có trạng thái HOẠT ĐỘNG</div>
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
        const validUsers = importData.filter(user => user.errors.length === 0);
        const invalidUsers = importData.filter(user => user.errors.length > 0);

        const columns = [
          {
            title: 'Dòng',
            dataIndex: 'row',
            key: 'row',
            width: 60,
          },
          {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
          },
          {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            width: 120,
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
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
                <div className="text-2xl font-bold text-green-900">{validUsers.length}</div>
                <div className="text-sm text-green-600">Hợp lệ</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-900">{invalidUsers.length}</div>
                <div className="text-sm text-red-600">Có lỗi</div>
              </div>
            </div>

            {invalidUsers.length > 0 && (
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
      case 'upload': return 'Import người dùng từ Excel';
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
        const validUsers = importData.filter(user => user.errors.length === 0);
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
            disabled={validUsers.length === 0}
          >
            Import {validUsers.length} người dùng
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
      width={800}
      destroyOnHidden
      maskClosable={false}
    >
      {renderStepContent()}
    </Modal>
  );
}