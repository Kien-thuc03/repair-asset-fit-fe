'use client';

import { useState } from 'react';
import { Modal, Upload, Button, Table, Alert, Typography, Divider } from 'antd';
import { Upload as UploadIcon, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { ICreateUserRequest, UserStatus } from '@/types';
import { message } from 'antd';
import { useRoles } from '@/hooks/useRoles';
import { useUnits } from '@/hooks/useUnits';
import { getUsers } from '@/lib/api/users';

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
  password: string;
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

  // Fetch real data from API
  const { roles } = useRoles();
  const { units, campuses } = useUnits();

  // Build role code to ID mapping from real data
  const roleCodeToIdMap: Record<string, string> = {};
  const validRoleCodes: string[] = [];
  
  roles.forEach(role => {
    // Sử dụng code từ database hoặc fallback sang name map
    const code = role.code || role.name.toUpperCase().replace(/\s+/g, '_');
    roleCodeToIdMap[code] = role.id;
    validRoleCodes.push(code);
  });

  // Build valid unit IDs/Codes from real data
  const validUnitIds = units.map(unit => unit.id);
  const unitCodeToIdMap: Record<string, string> = {};
  const validUnitCodes: string[] = [];
  
  units.forEach(unit => {
    if (unit.unitCode !== undefined && unit.unitCode !== null) {
      unitCodeToIdMap[unit.unitCode.toString()] = unit.id;
      validUnitCodes.push(unit.unitCode.toString());
    }
    // Hỗ trợ tìm qua tên đơn vị (tuỳ chọn thêm cho thân thiện)
    if (unit.name) {
      unitCodeToIdMap[unit.name.trim().toLowerCase()] = unit.id;
    }
  });

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
      
      // Lấy ví dụ unitCode và role codes từ dữ liệu thực
      const exampleUnitCode = units.length > 0 && units[0].unitCode ? units[0].unitCode.toString() : '4';
      const exampleRoleCode1 = roles.length > 0 ? (roles[0].code || roles[0].name.toUpperCase().replace(/\s+/g, '_')) : 'QTV_KHOA';
      const exampleRoleCode2 = roles.length > 1 ? (roles[1].code || roles[1].name.toUpperCase().replace(/\s+/g, '_')) : 'GIANG_VIEN';
      
      const templateData = [
        {
          'STT': 1,
          'Họ và tên (*)': 'Nguyễn Văn A',
          'Tên đăng nhập (*)': '21020011',
          'Email (*)': 'nguyenvana@iuh.edu.vn',
          'Số điện thoại': '0901234567',
          'Mã đơn vị hoặc Tên (*)': exampleUnitCode,
          'Mã vai trò (*)': exampleRoleCode1,
          'Ngày sinh (YYYY-MM-DD)': '1990-01-15',
          'Mật khẩu (*)': 'Pass@123'
        },
        {
          'STT': 2,
          'Họ và tên (*)': 'Trần Thị B',
          'Tên đăng nhập (*)': '21020012',
          'Email (*)': 'tranthib@iuh.edu.vn',
          'Số điện thoại': '0987654321',
          'Mã đơn vị hoặc Tên (*)': exampleUnitCode,
          'Mã vai trò (*)': `${exampleRoleCode1}, ${exampleRoleCode2}`,
          'Ngày sinh (YYYY-MM-DD)': '1985-03-15',
          'Mật khẩu (*)': 'Pass@123'
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
        { wch: 15 }, // Mã đơn vị
        { wch: 25 }, // Mã vai trò
        { wch: 20 }, // Ngày sinh
        { wch: 15 }  // Mật khẩu
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      
      // Thêm sheet hướng dẫn
      const instructionsData = [
        { 'Trường': 'Họ và tên (*)', 'Mô tả': 'Từ 2-100 ký tự, chỉ chữ cái và khoảng trắng', 'Ví dụ': 'Nguyễn Văn A' },
        { 'Trường': 'Tên đăng nhập (*)', 'Mô tả': 'Đúng 8 chữ số (thường là mã nhân viên/giảng viên)', 'Ví dụ': '10000001' },
        { 'Trường': 'Email (*)', 'Mô tả': 'Email hợp lệ, tối đa 100 ký tự', 'Ví dụ': 'user@example.com' },
        { 'Trường': 'Số điện thoại', 'Mô tả': 'Định dạng Việt Nam (10-12 số)', 'Ví dụ': '0901234567' },
        { 'Trường': 'Mã đơn vị hoặc Tên (*)', 'Mô tả': 'Mã ID, Định danh số (unitCode), hoặc Tên đơn vị', 'Ví dụ': exampleUnitCode },
        { 'Trường': 'Mã vai trò (*)', 'Mô tả': 'Mã vai trò (có thể nhiều, cách nhau bởi phẩy)', 'Ví dụ': exampleRoleCode1 },
        { 'Trường': 'Ngày sinh', 'Mô tả': 'Định dạng YYYY-MM-DD, tuổi 16-100', 'Ví dụ': '1990-01-15' },
        { 'Trường': 'Mật khẩu (*)', 'Mô tả': 'Tối thiểu 6 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt', 'Ví dụ': 'Pass@123' },
      ];
      const wsInstructions = XLSX.utils.json_to_sheet(instructionsData);
      wsInstructions['!cols'] = [
        { wch: 20 },
        { wch: 50 },
        { wch: 25 }
      ];
      XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

      // Thêm sheet Danh mục Mã Vai Trò
      const rolesData = roles.map(role => ({
        'Mã quy định (Code)': role.code || role.name.toUpperCase().replace(/\s+/g, '_'),
        'Tên hiển thị': role.name
      }));
      const wsRoles = XLSX.utils.json_to_sheet(rolesData);
      wsRoles['!cols'] = [
        { wch: 30 }, // Mã quy định (Code)
        { wch: 50 }  // Tên hiển thị
      ];
      XLSX.utils.book_append_sheet(wb, wsRoles, 'Mã Vai Trò');
      
      // Thêm sheet Danh mục Mã Đơn Vị
      const unitsData = units.map(unit => {
        // Tìm tên Cơ sở/Đơn vị cha
        let parentName = '';
        if (unit.parentUnitId) {
          // Tìm trong danh sách Cơ sở trước (do đơn vị con thường thuộc Cơ sở), hoặc kho đơn vị
          const parent = campuses.find(c => c.id === unit.parentUnitId) || units.find(u => u.id === unit.parentUnitId);
          if (parent) parentName = parent.name;
        } 
        
        // Fallback
        if (!parentName && unit.parentUnit && unit.parentUnit.name) {
          parentName = unit.parentUnit.name;
        }

        return {
          'Mã quy định (Code)': unit.unitCode?.toString() || unit.id,
          'Tên hiển thị': unit.name,
          'Đơn vị cha/Cơ sở': parentName || 'Không có (Cấp cao nhất)'
        };
      });
      
      const wsUnits = XLSX.utils.json_to_sheet(unitsData);
      wsUnits['!cols'] = [
        { wch: 30 }, // Mã quy định (Code)
        { wch: 50 }, // Tên hiển thị
        { wch: 40 }  // Cơ sở / Đơn vị cha
      ];
      XLSX.utils.book_append_sheet(wb, wsUnits, 'Mã Đơn Vị');

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
      message.loading({ content: 'Đang kiểm tra dữ liệu với hệ thống...', key: 'importValidation', duration: 0 });
      const XLSX = await import('xlsx');
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

      if (jsonData.length < 2) {
        message.destroy('importValidation');
        message.error('File Excel không có dữ liệu');
        return false;
      }

      // Fetch users real-time to check duplicates (chia nhỏ request vì BE max limit 100)
      let existingEmails = new Set<string>();
      let existingUsernames = new Set<string>();
      try {
        const firstPageResponse = await getUsers({ limit: 100, page: 1 });
        if (firstPageResponse && firstPageResponse.data) {
          firstPageResponse.data.forEach(u => {
            existingEmails.add(u.email.toLowerCase());
            existingUsernames.add(u.username);
          });
          
          // Lấy tiếp các trang còn lại nếu có
          const { totalPages } = firstPageResponse;
          if (totalPages > 1) {
            const subsequentPromises = [];
            for (let i = 2; i <= totalPages; i++) {
              subsequentPromises.push(getUsers({ limit: 100, page: i }));
            }
            
            const subsequentResponses = await Promise.all(subsequentPromises);
            subsequentResponses.forEach(res => {
              if (res && res.data) {
                res.data.forEach(u => {
                  existingEmails.add(u.email.toLowerCase());
                  existingUsernames.add(u.username);
                });
              }
            });
          }
        }
      } catch (err) {
         console.warn('Could not fetch existing users for validation', err);
      }

      const fileEmails = new Set<string>();
      const fileUsernames = new Set<string>();

      // Bỏ qua dòng header (dòng đầu tiên)
      const dataRows = jsonData.slice(1);
      
      const importUsers: ImportUser[] = dataRows.map((row, index) => {
        const rowNumber = index + 2; // +2 vì bỏ qua header và index bắt đầu từ 0
        const errors: string[] = [];
        
        // Lấy dữ liệu từ các cột (Excel columns: 0=STT, 1=FullName, 2=Username, etc.)
        const fullName = row[1]?.toString().trim() || '';
        const username = row[2]?.toString().trim() || '';
        const email = row[3]?.toString().trim() || '';
        const phoneNumber = row[4]?.toString().trim() || '';
        const unitId = row[5]?.toString().trim() || '';
        const roleCodesStr = row[6]?.toString().trim() || '';
        const birthDateStr = row[7]?.toString().trim() || '';
        const password = row[8]?.toString().trim() || '';

        console.log(`Row ${rowNumber}:`, {
          fullName,
          username,
          email,
          phoneNumber,
          unitId,
          roleCodesStr,
          birthDateStr,
          password
        });

        // Validate required fields
        if (!fullName) {
          errors.push('Họ và tên không được để trống');
        } else if (fullName.length < 2) {
          errors.push('Họ và tên phải có ít nhất 2 ký tự');
        } else if (fullName.length > 100) {
          errors.push('Họ và tên không được vượt quá 100 ký tự');
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
          errors.push('Họ và tên chỉ được chứa chữ cái và khoảng trắng');
        }

        // Username validation
        if (!username) {
          errors.push('Tên đăng nhập không được để trống');
        } else if (!/^[0-9]{8}$/.test(username)) {
          errors.push('Tên đăng nhập phải là chuỗi gồm đúng 8 chữ số');
        } else {
          if (existingUsernames.has(username)) {
            errors.push('Tên đăng nhập đã tồn tại trong hệ thống');
          } else if (fileUsernames.has(username)) {
            errors.push('Tên đăng nhập bị trùng lặp trong file upload');
          }
          fileUsernames.add(username);
        }

        // Email validation
        if (!email) {
          errors.push('Email không được để trống');
        } else if (email.length > 100) {
          errors.push('Email không được vượt quá 100 ký tự');
        } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
          errors.push('Email không hợp lệ');
        } else {
          const emailLower = email.toLowerCase();
          if (existingEmails.has(emailLower)) {
            errors.push('Email đã tồn tại trong hệ thống');
          } else if (fileEmails.has(emailLower)) {
            errors.push('Email bị trùng lặp trong file upload');
          }
          fileEmails.add(emailLower);
        }

        // Password validation
        if (!password) {
          errors.push('Mật khẩu không được để trống');
        } else if (password.length < 6) {
          errors.push('Mật khẩu phải có ít nhất 6 ký tự');
        } else if (password.length > 50) {
          errors.push('Mật khẩu không được vượt quá 50 ký tự');
        } else {
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialChar = /[@$!%*?&]/.test(password);
          const hasWhitespace = /\s/.test(password);

          if (hasWhitespace) {
            errors.push('Mật khẩu không được chứa khoảng trắng');
          } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
            errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)');
          }

          if (username && password.toLowerCase().includes(username.toLowerCase())) {
            errors.push('Mật khẩu không được chứa tên đăng nhập');
          }
        }

        // Phone number validation (optional)
        if (phoneNumber) {
          const cleanedPhone = phoneNumber.replace(/[\s()-]/g, '');
          if (!/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(cleanedPhone)) {
            errors.push('Số điện thoại không đúng định dạng Việt Nam');
          }
        }

        // Birth date validation (optional)
        if (birthDateStr) {
          const birthDate = new Date(birthDateStr);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          birthDate.setHours(0, 0, 0, 0);

          if (isNaN(birthDate.getTime())) {
            errors.push('Ngày sinh không hợp lệ');
          } else if (birthDate > today) {
            errors.push('Ngày sinh không được là ngày trong tương lai');
          } else if (birthDate.getFullYear() < 1900) {
            errors.push('Năm sinh phải từ 1900 trở đi');
          } else {
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              age--;
            }

            if (age < 16) {
              errors.push('Người dùng phải đủ 16 tuổi');
            } else if (age > 100) {
              errors.push('Tuổi không được vượt quá 100');
            }
          }
        }

        // Unit Code / Unit ID validation
        let finalUnitId = unitId; // Có thể là mã đơn vị, ID, hoặc tên đơn vị
        if (!finalUnitId) {
          errors.push('Mã đơn vị không được để trống');
        } else {
          // Nếu người dùng nhập ID trực tiếp
          if (validUnitIds.includes(finalUnitId)) {
            // Hợp lệ, giữ nguyên
          } 
          // Nếu nằm trong map code/name
          else if (unitCodeToIdMap[finalUnitId.trim().toLowerCase()]) {
            finalUnitId = unitCodeToIdMap[finalUnitId.trim().toLowerCase()];
          }
          // Không tìm thấy
          else {
            errors.push('Mã (hoặc tên) đơn vị không tồn tại trong hệ thống');
          }
        }

        // Role codes/IDs validation
        if (!roleCodesStr) {
          errors.push('Mã vai trò không được để trống');
        }

        const roleCodes = roleCodesStr.split(',').map((code: string) => code.trim()).filter(Boolean);
        if (roleCodes.length === 0) {
          errors.push('Ít nhất một vai trò phải được chỉ định');
        }
        
        // Support both UUID and role codes
        const roleIds: string[] = [];
        const invalidRoles: string[] = [];
        
        roleCodes.forEach(code => {
          // Check if it's a valid UUID (role ID)
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);
          
          if (isUUID) {
            // It's a UUID - check if it exists in roles
            const roleExists = roles.some(role => role.id === code);
            if (roleExists) {
              roleIds.push(code);
            } else {
              invalidRoles.push(code);
            }
          } else {
            // It's a role code - try to map to ID
            if (validRoleCodes.includes(code)) {
              const roleId = roleCodeToIdMap[code];
              if (roleId) {
                roleIds.push(roleId);
              }
            } else {
              invalidRoles.push(code);
            }
          }
        });
        
        if (invalidRoles.length > 0) {
          errors.push(`Mã vai trò không hợp lệ: ${invalidRoles.join(', ')}`);
        }

        return {
          row: rowNumber,
          fullName,
          username,
          email,
          password,
          phoneNumber: phoneNumber || undefined,
          unitId: finalUnitId,
          roleIds,
          birthDate: birthDateStr || undefined,
          status: UserStatus.ACTIVE,
          errors
        };
      }).filter(user => 
        // Lọc bỏ các dòng trống (không có dữ liệu quan trọng)
        user.fullName || user.username || user.email
      );

      message.destroy('importValidation');

      if (importUsers.length === 0) {
        message.error('Không tìm thấy dữ liệu hợp lệ trong file Excel');
        return false;
      }

      setImportData(importUsers);
      setCurrentStep('preview');
      
    } catch (error) {
      message.destroy('importValidation');
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
        email: user.email.toLowerCase(), // Normalize email
        password: user.password,
        phoneNumber: user.phoneNumber ? user.phoneNumber.replace(/[\s()-]/g, '') : undefined, // Clean phone
        unitId: user.unitId,
        roleIds: user.roleIds,
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : undefined, // Ensure YYYY-MM-DD
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
                  <div>2. Các trường có dấu (*) là bắt buộc. Tên đăng nhập phải là chuỗi đúng 8 chữ số.</div>
                  <div>3. <strong>Mã vai trò:</strong> Nhập mã dạng chữ của vai trò (VD: QTV_KHOA, ADMIN) (có thể nhiều, cách nhau bởi dấu phẩy)</div>
                  <div>4. <strong>Mã đơn vị:</strong> Mã số (unitCode) hoặc Tên đầy đủ của đơn vị đều được chấp nhận. UUID vẫn có thể dùng.</div>
                  <div>5. Ngày sinh theo định dạng YYYY-MM-DD (VD: 1990-01-15)</div>
                  <div>6. Mật khẩu tối thiểu 6 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)</div>
                  <div>7. Số điện thoại định dạng Việt Nam (VD: 0901234567)</div>
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