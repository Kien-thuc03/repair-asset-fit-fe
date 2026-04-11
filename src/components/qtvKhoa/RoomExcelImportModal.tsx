'use client';

import { useState } from 'react';
import { Modal, Upload, Button, Table, Alert, Typography, Divider } from 'antd';
import { Upload as UploadIcon, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { ICreateRoomRequest, RoomStatus } from '@/types/unit';
import { message } from 'antd';
import { useUnits } from '@/hooks/useUnits';
import { getAllRoomsApi } from '@/lib/api/rooms';

const { Text, Title } = Typography;

interface RoomExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rooms: ICreateRoomRequest[]) => Promise<void>;
}

interface ImportRoom extends ICreateRoomRequest {
  row: number;
  errors: string[];
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; errors: string[] }>;
}

export default function RoomExcelImportModal({
  isOpen,
  onClose,
  onImport
}: RoomExcelImportModalProps) {
  const [importData, setImportData] = useState<ImportRoom[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [importing, setImporting] = useState(false);

  const { units, campuses } = useUnits();

  // Helper chuẩn hóa khớp với BE
  const norm = (val: string) => val.trim().replace(/^0+/, '') || '0';
  const normBuilding = (val: string) => val.trim().toUpperCase();

  // Build valid unit IDs/Codes from real data to map `Tên đơn vị` -> `unitId`
  const validUnitIds = units.map(unit => unit.id);
  const unitCodeToIdMap: Record<string, string> = {};
  units.forEach(unit => {
    if (unit.unitCode !== undefined && unit.unitCode !== null) {
      unitCodeToIdMap[unit.unitCode.toString()] = unit.id;
    }
    if (unit.name) {
      unitCodeToIdMap[unit.name.trim().toLowerCase()] = unit.id;
    }
  });

  const handleClose = () => {
    setImportData([]);
    setImportResult(null);
    setCurrentStep('upload');
    setImporting(false);
    onClose();
  };

  const downloadTemplate = async () => {
    try {
      const XLSX = await import('xlsx');
      
      const exampleUnitCode = units.length > 0 && units[0].unitCode ? units[0].unitCode.toString() : '1';
      
      const templateData = [
        {
          'STT': 1,
          'Tòa nhà (Khối) (*)': 'A',
          'Tầng (*)': '3',
          'Số phòng (*)': '3',
          'Mã đơn vị (*)': exampleUnitCode,
          'Trạng thái': 'ACTIVE'
        },
        {
          'STT': 2,
          'Tòa nhà (Khối) (*)': 'H',
          'Tầng (*)': '8',
          'Số phòng (*)': '12',
          'Mã đơn vị (*)': exampleUnitCode,
          'Trạng thái': 'ACTIVE'
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);

      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 20 }, // Tòa nhà
        { wch: 15 }, // Tầng
        { wch: 20 }, // Mã số phòng
        { wch: 20 }, // Mã đơn vị
        { wch: 15 }  // Trạng thái
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      
      // Sheet hướng dẫn
      const instructionsData = [
        { 'Trường': 'Tòa nhà (Khối) (*)', 'Mô tả': 'Chỉ điền 1 chữ cái IN HOA. Vd: A, B, H', 'Ví dụ': 'A' },
        { 'Trường': 'Tầng (*)', 'Mô tả': 'Chỉ điền số tầng (không cần leading zero). Vd: 3, 10', 'Ví dụ': '5' },
        { 'Trường': 'Số phòng (*)', 'Mô tả': 'Chỉ điền số thứ tự phòng trong tầng. Vd: 1, 3, 12', 'Ví dụ': '1' },
        { 'Trường': 'Mã đơn vị (*)', 'Mô tả': 'Nhập Mã số đơn vị (cột "Mã quy định" ở sheet "Mã Đơn Vị") HOẶC Tên đơn vị đầy đủ (cột "Tên hiển thị")', 'Ví dụ': exampleUnitCode },
        { 'Trường': 'Trạng thái', 'Mô tả': 'ACTIVE / INACTIVE / MAINTENANCE (Mặc định: ACTIVE)', 'Ví dụ': 'ACTIVE' },
      ];
      const wsInstructions = XLSX.utils.json_to_sheet(instructionsData);
      wsInstructions['!cols'] = [{ wch: 20 }, { wch: 75 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

      // Sheet Danh mục Đơn Vị
      const unitsData = units.map(unit => {
        let parentName = '';
        if (unit.parentUnitId) {
          const parent = campuses.find(c => c.id === unit.parentUnitId) || units.find(u => u.id === unit.parentUnitId);
          if (parent) parentName = parent.name;
        } 
        if (!parentName && unit.parentUnit && unit.parentUnit.name) {
          parentName = unit.parentUnit.name;
        }

        // Chỉ hiển thị unitCode nếu có, không fallback về UUID
        const unitCodeDisplay = unit.unitCode !== undefined && unit.unitCode !== null
          ? unit.unitCode.toString()
          : '(chưa có mã)';

        return {
          'Mã quy định (unitCode)': unitCodeDisplay,
          'Tên đơn vị (name)': unit.name,
          'Cơ sở trực thuộc': parentName || 'Không có (Cấp cao nhất)',
          'Ghi chú': 'Nhập cột "Mã đơn vị" bằng giá trị cột "Mã quy định" HOẶC "Tên đơn vị"'
        };
      });
      
      const wsUnits = XLSX.utils.json_to_sheet(unitsData);
      wsUnits['!cols'] = [{ wch: 25 }, { wch: 50 }, { wch: 40 }, { wch: 55 }];
      XLSX.utils.book_append_sheet(wb, wsUnits, 'Mã Đơn Vị');

      XLSX.writeFile(wb, 'template-import-phong.xlsx');
      message.success('Đã tải file mẫu thành công');
    } catch (error) {
      console.error('Error downloading template:', error);
      message.error('Có lỗi khi tải file mẫu');
    }
  };

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

      // Fetch rooms real-time to check duplicates
      let existingRoomNumbers = new Set<string>();
      try {
        const response = await getAllRoomsApi();
        if (response) {
          // Chuẩn hóa khớp với BE trước khi đừa vào Set
          response.forEach(r => {
            if (r.building && r.floor && r.roomNumber) {
              existingRoomNumbers.add(
                `${normBuilding(r.building)}-${norm(r.floor)}-${norm(r.roomNumber)}`
              );
            }
          });
        }
      } catch (err) {
         console.warn('Could not fetch existing rooms for validation', err);
      }

      const fileRoomNumbers = new Set<string>();
      const dataRows = jsonData.slice(1);
      
      const importRooms: ImportRoom[] = dataRows.map((row, index) => {
        const rowNumber = index + 2; 
        const errors: string[] = [];
        
        const building = row[1]?.toString().trim() || '';
        const floor = row[2]?.toString().trim() || '';
        const roomNum = row[3]?.toString().trim() || '';
        const unitIdStr = row[4]?.toString().trim() || '';
        const statusStr = row[5]?.toString().trim().toUpperCase() || 'ACTIVE';

        // Chuẩn hóa khớp với BE: bỏ leading zeros, đảm bảo "8" và "08" là 1 phòng
        const finalBuilding = normBuilding(building);
        const finalFloor = norm(floor);
        const finalRoomNum = norm(roomNum);
        // Tên phòng: dùng padStart chỉ cho display, không ảnh hưởng đến logic lưu
        const name = `${finalBuilding}${finalFloor.padStart(2,'0')}.${finalRoomNum.padStart(2,'0')}`;

        // Validate Toà nhà / Tầng
        if (!building) errors.push('Tòa nhà không được để trống');
        if (!floor) errors.push('Tầng không được để trống');

        // Validate mã phòng (roomNumber)
        if (!roomNum) {
          errors.push('Số phòng không được để trống');
        } else if (building && floor) {
          // So sánh sau khi chuẩn hóa (khớp với BE)
          const compKey = `${normBuilding(building)}-${norm(floor)}-${norm(roomNum)}`;
          if (existingRoomNumbers.has(compKey)) {
            errors.push(`Phòng tại Tòa ${normBuilding(building)}, Tầng ${norm(floor)}, Số ${norm(roomNum)} đã tồn tại trong hệ thống`);
          } else if (fileRoomNumbers.has(compKey)) {
            errors.push(`Phòng (Tòa-Tầng-Số) bị trùng lặp bên trong file Excel`);
          }
          fileRoomNumbers.add(compKey);
        }

        // Validate Đơn vị
        let finalUnitId = unitIdStr;
        if (!finalUnitId) {
          errors.push('Mã đơn vị không được để trống');
        } else {
          if (validUnitIds.includes(finalUnitId)) {
            // Hợp lệ uuid
          } else if (unitCodeToIdMap[finalUnitId.trim().toLowerCase()]) {
            finalUnitId = unitCodeToIdMap[finalUnitId.trim().toLowerCase()];
          } else {
            errors.push('Mã đơn vị không tồn tại trong hệ thống');
          }
        }

        // Validate Status
        let finalStatus = RoomStatus.ACTIVE;
        if (['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(statusStr)) {
          finalStatus = statusStr as RoomStatus;
        } else if (statusStr) {
          errors.push('Trạng thái không hợp lệ (Chỉ nhận ACTIVE/INACTIVE/MAINTENANCE)');
        }

        return {
          row: rowNumber,
          name, // đã tự generate
          building: finalBuilding,
          floor: finalFloor, // đã chuẩn hóa (bỏ leading zeros)
          roomNumber: finalRoomNum, // đã chuẩn hóa
          unitId: finalUnitId,
          status: finalStatus,
          errors
        };
      }).filter(r => r.building || r.roomNumber || r.unitId);

      message.destroy('importValidation');

      if (importRooms.length === 0) {
        message.error('Không tìm thấy dữ liệu hợp lệ trong file Excel');
        return false;
      }

      setImportData(importRooms);
      setCurrentStep('preview');
      
    } catch (error) {
      message.destroy('importValidation');
      console.error('Error processing Excel file:', error);
      message.error('Có lỗi khi xử lý file Excel. Kiểm tra định dạng.');
    }

    return false;
  };

  const handleImport = async () => {
    const validRooms = importData.filter(r => r.errors.length === 0);
    if (validRooms.length === 0) {
      message.error('Không có phòng hợp lệ để import');
      return;
    }

    setImporting(true);
    try {
      const requests: ICreateRoomRequest[] = validRooms.map(r => ({
        name: r.name,
        building: r.building,
        floor: r.floor,
        roomNumber: r.roomNumber,
        unitId: r.unitId,
        status: r.status
      }));

      await onImport(requests);
      
      setImportResult({
        total: importData.length,
        success: validRooms.length,
        failed: importData.length - validRooms.length,
        errors: importData.filter(r => r.errors.length > 0).map(r => ({ row: r.row, errors: r.errors }))
      });
      setCurrentStep('result');
    } catch (error) {
      message.error('Có lỗi khi import phòng');
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
                  <div>1. Tải file mẫu và điền thông tin đúng định dạng</div>
                  <div>2. Các trường có dấu (*) là bắt buộc. Tòa nhà, Tầng, Số phòng không được trùng nhau.</div>
                  <div>3. <strong>Tòa nhà:</strong> Điền 1 chữ cái IN HOA (VD: A, B, H).</div>
                  <div>4. <strong>Mã đơn vị:</strong> Có thể nhập <em>Mã số đơn vị</em> (VD: 4) hoặc <em>Tên đơn vị đầy đủ</em> — xem sheet "Mã Đơn Vị" bên trong file mẫu.</div>
                </div>
              }
              type="info" showIcon
            />
            <div className="flex justify-center">
              <Button onClick={downloadTemplate} icon={<Download className="h-4 w-4" />} type="dashed" size="large">
                Tải file mẫu Excel
              </Button>
            </div>
            <Divider />
            <Upload.Dragger name="file" multiple={false} accept=".xlsx,.xls" beforeUpload={handleFileUpload} showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <UploadIcon className="h-12 w-12 mx-auto text-blue-500" />
              </p>
              <p className="ant-upload-text text-lg">Nhấp hoặc kéo file Excel vào đây</p>
            </Upload.Dragger>
          </div>
        );

      case 'preview':
        const validCount = importData.filter(r => r.errors.length === 0).length;
        const invalidCount = importData.length - validCount;

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{importData.length}</div>
                <div className="text-sm text-gray-600">Tổng dòng</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-900">{validCount}</div>
                <div className="text-sm text-green-600">Hợp lệ</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-900">{invalidCount}</div>
                <div className="text-sm text-red-600">Có lỗi</div>
              </div>
            </div>

            <Table
              dataSource={importData}
              rowKey="row"
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              size="small"
              columns={[
                { title: 'Dòng', dataIndex: 'row', width: 60 },
                { title: 'Số phòng', dataIndex: 'roomNumber', width: 100 },
                { title: 'Tên phòng', dataIndex: 'name', width: 150 },
                { title: 'Tòa/Tầng', key: 'pos', width: 100, render: (_, r) => `${r.building} - ${r.floor}` },
                { title: 'Trạng thái', width: 100, render: (_, r) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${r.errors.length === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {r.errors.length === 0 ? <><CheckCircle className="h-3 w-3 mr-1" />Hợp lệ</> : <><AlertCircle className="h-3 w-3 mr-1" />Lỗi</>}
                    </span>
                  )
                },
                { title: 'Lỗi', dataIndex: 'errors', render: (errs) => (errs.length > 0 ? <div className="text-red-600 text-xs">{errs.map((e: string, i: number) => <div key={i}>• {e}</div>)}</div> : null) }
              ]}
            />
          </div>
        );

      case 'result':
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <Title level={3}>Import hoàn tất!</Title>
            <Text type="secondary">Xử lý {importResult?.total} dòng</Text>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-50 p-4 rounded-lg"><div className="text-2xl font-bold text-green-900">{importResult?.success}</div><div className="text-sm text-green-600">Thành công</div></div>
              <div className="bg-red-50 p-4 rounded-lg"><div className="text-2xl font-bold text-red-900">{importResult?.failed}</div><div className="text-sm text-red-600">Thất bại</div></div>
            </div>
            {importResult?.errors && importResult.errors.length > 0 && (
              <Alert message={`${importResult.errors.length} dòng có lỗi`} type="error" description={<div className="text-left max-h-40 overflow-y-auto">{importResult.errors.map((e, i) => <div key={i}><strong>Dòng {e.row}:</strong> <ul className="list-disc ml-4 text-sm">{e.errors.map((msg, mi) => <li key={mi}>{msg}</li>)}</ul></div>)}</div>} />
            )}
          </div>
        );
    }
  };

  const getModalFooter = () => {
    switch (currentStep) {
      case 'upload': return [<Button key="cancel" onClick={handleClose}>Hủy</Button>];
      case 'preview':
        const validCount = importData.filter(r => r.errors.length === 0).length;
        return [
          <Button key="back" onClick={() => setCurrentStep('upload')}>Quay lại</Button>,
          <Button key="cancel" onClick={handleClose}>Hủy</Button>,
          <Button key="import" type="primary" onClick={handleImport} loading={importing} disabled={validCount === 0}>Import {validCount} phòng</Button>
        ];
      case 'result': return [<Button key="close" type="primary" onClick={handleClose}>Đóng</Button>];
    }
  };

  return (
    <Modal
      title={currentStep === 'upload' ? 'Import phòng tự động' : currentStep === 'preview' ? 'Xem trước dữ liệu' : 'Kết quả Import'}
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
