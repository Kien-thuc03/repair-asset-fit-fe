'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { Breadcrumb, Button, message } from 'antd';
import { ICreateRoomRequest, RoomStatus } from "@/types/unit";
import { useRoomsManagement } from "@/hooks/useRoomsManagement";
import { useUnits } from "@/hooks/useUnits";
import { RoomExcelImportModal } from "@/components/qtvKhoa";
import SuccessModal from "@/components/modal/SuccessModal";

export default function CreateRoomPage() {
  const router = useRouter();
  const { createRoom, bulkImport, groupedRooms } = useRoomsManagement();
  const { units, campuses, loading: unitsLoading } = useUnits();

  // ----- Helper: chuẩn hóa giá trị như BE (bỏ leading zeros) -----
  const norm = (val: string) => val.trim().replace(/^0+/, '') || '0';
  const normBuilding = (val: string) => val.trim().toUpperCase();

  // Danh sách các vị trí phòng đã tồn tại (lấy từ groupedRooms) để check real-time
  // Key: "building-floor-roomNumber" sau khi đã chuẩn hóa
  const existingRoomNumbers = new Set<string>();
  Object.values(groupedRooms).forEach(buildingRooms => {
    Object.values(buildingRooms).forEach(rooms => {
      rooms.forEach(r =>
        existingRoomNumbers.add(
          `${normBuilding(r.building)}-${norm(r.floor)}-${norm(r.roomNumber)}`
        )
      );
    });
  });
  const [formData, setFormData] = useState<ICreateRoomRequest>({
    name: "",
    building: "",
    floor: "",
    roomNumber: "",
    unitId: "",
    status: RoomStatus.ACTIVE,
  });

  // Tự động generate name (giống logic BE: padStart 2 chữ số)
  useEffect(() => {
    if (formData.building && formData.floor && formData.roomNumber) {
      const b = normBuilding(formData.building);
      const f = norm(formData.floor).padStart(2, '0');
      const r = norm(formData.roomNumber).padStart(2, '0');
      
      const newName = `${b}${f}.${r}`;
      if (formData.name !== newName) {
        setFormData(p => ({ ...p, name: newName }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.building, formData.floor, formData.roomNumber]);

  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter units based on campus
  const filteredUnits = selectedCampusId 
    ? units.filter(unit => {
        const parentCampus = campuses.find(campus => 
          campus.childUnits?.some(child => child.id === unit.id)
        );
        return parentCampus?.id === selectedCampusId;
      })
    : [];

  const handleCampusChange = (campusId: string) => {
    setSelectedCampusId(campusId);
    setFormData(prev => ({ ...prev, unitId: "" })); // reset unitId
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.building) {
      newErrors.building = "Tòa nhà là bắt buộc";
    }

    if (!formData.floor) {
      newErrors.floor = "Tầng là bắt buộc";
    }

    if (!formData.roomNumber) {
      newErrors.roomNumber = "Số phòng là bắt buộc";
    } else if (formData.building && formData.floor) {
      // So sánh sau khi đã chuẩn hóa (bỏ leading zeros), khớp với cách BE lưu
      const key = `${normBuilding(formData.building)}-${norm(formData.floor)}-${norm(formData.roomNumber)}`;
      if (existingRoomNumbers.has(key)) {
        newErrors.roomNumber = `Phòng tại Tòa ${normBuilding(formData.building)}, Tầng ${norm(formData.floor)}, Số phòng ${norm(formData.roomNumber)} đã tồn tại`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Gửi dữ liệu đã chuẩn hóa đến BE (BE cũng sẽ chuẩn hóa lại, nhưng FE chuẩn hóa trước cho nhất quán)
      const cleanedData: ICreateRoomRequest = {
        name: formData.name.trim(),
        building: normBuilding(formData.building),
        floor: norm(formData.floor),
        roomNumber: norm(formData.roomNumber),
        status: formData.status,
      };

      if (formData.unitId && formData.unitId.trim()) {
        cleanedData.unitId = formData.unitId.trim();
      }

      await createRoom(cleanedData);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo phòng mới';
      // Hiển thị lỗi từ BE (ví dụ: trùng roomCode, trùng vị trí)
      if (errorMessage.includes('Phòng tại') || errorMessage.includes('Tòa')) {
        setErrors(prev => ({ ...prev, roomNumber: errorMessage }));
      } else if (errorMessage.includes('Mã phòng') || errorMessage.includes('roomCode')) {
        setErrors(prev => ({ ...prev, roomNumber: errorMessage }));
      } else {
        message.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async (roomsData: ICreateRoomRequest[]) => {
    try {
      await bulkImport(roomsData);
      message.success(`Đã import thành công ${roomsData.length} phòng!`);
      setShowImportModal(false);
      router.push('/qtv-khoa/quan-ly-phong');
    } catch (error) {
      console.error('Error importing rooms:', error);
      message.error('Có lỗi xảy ra khi import phòng');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { href: '/qtv-khoa', title: 'Trang chủ' },
          { href: '/qtv-khoa/quan-ly-phong', title: 'Quản lý phòng' },
          { title: 'Thêm mới' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm phòng mới</h1>
          <p className="mt-1 text-sm text-gray-600">
            Khai báo phòng chức năng mới hoặc import file Excel
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tên phòng */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên phòng chức năng (Tự động tạo)
              </label>
              <input
                type="text"
                value={formData.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                placeholder="VD: A03.03"
              />
              <p className="mt-1 text-xs text-gray-500">Tên phòng và Mã phòng sẽ được hệ thống phát sinh tự động dựa vào Tòa nhà, Tầng và Số phòng.</p>
            </div>

            {/* Tòa nhà */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tòa nhà (Khối) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData(p => ({ ...p, building: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                  errors.building ? "border-red-500" : ""
                }`}
                placeholder="VD: A, B, H, X"
              />
              {errors.building && <p className="mt-1 text-sm text-red-600">{errors.building}</p>}
            </div>

            {/* Tầng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tầng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData(p => ({ ...p, floor: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.floor ? "border-red-500" : ""
                }`}
                placeholder="VD: 3, 10, G"
              />
              {errors.floor && <p className="mt-1 text-sm text-red-600">{errors.floor}</p>}
            </div>

            {/* Mã phòng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số thứ tự phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData(p => ({ ...p, roomNumber: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.roomNumber ? "border-red-500" : ""
                }`}
                placeholder="VD: 3, 15"
              />
              {errors.roomNumber && <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as RoomStatus }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={RoomStatus.ACTIVE}>Hoạt động</option>
                <option value={RoomStatus.INACTIVE}>Không hoạt động</option>
                <option value={RoomStatus.MAINTENANCE}>Đang bảo trì</option>
              </select>
            </div>

            {/* Campus Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cơ sở</label>
              <select
                value={selectedCampusId}
                onChange={(e) => handleCampusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={unitsLoading}
              >
                <option value="">{unitsLoading ? "Đang tải..." : "Chọn cơ sở (Tùy chọn)"}</option>
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị quản lý</label>
              <select
                value={formData.unitId}
                onChange={(e) => setFormData(p => ({ ...p, unitId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedCampusId || unitsLoading}
              >
                <option value="">{!selectedCampusId ? "Chọn cơ sở trước" : "Chọn đơn vị quản lý (Tùy chọn)"}</option>
                {filteredUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.displayName}</option>)}
              </select>
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Đang tạo..." : "Xác nhận tạo phòng"}
            </button>
          </div>
        </form>
      </div>

      <RoomExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBulkImport}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/qtv-khoa/quan-ly-phong');
        }}
        title="Tạo phòng thành công!"
        message="Phòng đã được cấu hình thành công trong sơ đồ."
      />
    </div>
  );
}
