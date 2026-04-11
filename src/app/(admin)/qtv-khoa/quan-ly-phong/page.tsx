'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Tag, Empty, Spin, Tooltip, Badge } from 'antd';
import { Plus, Search, MapPin, Building, Activity, SlidersHorizontal, DoorOpen } from 'lucide-react';
import { useRoomsManagement } from '@/hooks/useRoomsManagement';
import { RoomStatus } from '@/types/unit';
import { RoomResponseDto } from '@/lib/api/rooms';

export default function RoomManagementPage() {
  const router = useRouter();
  const { rooms, groupedRooms, loading, toggleRoomStatus, deleteRoom } = useRoomsManagement();
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc dữ liệu hiển thị theo search term
  const filterRooms = (group: Record<string, Record<string, RoomResponseDto[]>>) => {
    if (!searchTerm) return group;
    const term = searchTerm.toLowerCase();
    
    const filtered: Record<string, Record<string, RoomResponseDto[]>> = {};
    Object.entries(group).forEach(([building, floors]) => {
      Object.entries(floors).forEach(([floor, roomList]) => {
        const matches = roomList.filter(r => 
          r.name.toLowerCase().includes(term) || 
          r.roomNumber.toLowerCase().includes(term) ||
          r.unit?.name.toLowerCase().includes(term)
        );
        if (matches.length > 0) {
          if (!filtered[building]) filtered[building] = {};
          filtered[building][floor] = matches;
        }
      });
    });
    return filtered;
  };

  const displayedGroups = filterRooms(groupedRooms);
  
  // Tính Stats
  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(r => r.status === RoomStatus.ACTIVE).length;
  const maintenanceRooms = rooms.filter(r => r.status === RoomStatus.MAINTENANCE).length;

  const renderStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.ACTIVE:
        return <Badge status="success" text={<span className="text-green-600 font-medium">Hoạt động</span>} />;
      case RoomStatus.MAINTENANCE:
        return <Badge status="warning" text={<span className="text-orange-600 font-medium">Bảo trì</span>} />;
      case RoomStatus.INACTIVE:
        return <Badge status="error" text={<span className="text-red-600 font-medium">Tạm ngưng</span>} />;
      default:
        return <Badge status="default" text="Không rõ" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-b-4 border-blue-600 inline-block pb-1">
            Sơ đồ Phòng
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý sơ đồ định danh phòng học, cơ sở vật chất của các tòa nhà.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button type="default" icon={<SlidersHorizontal className="h-4 w-4" />}>
            Bộ lọc
          </Button>
          <Button
            type="primary"
            icon={<Plus className="h-5 w-5" />}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 font-medium"
            onClick={() => router.push('/qtv-khoa/quan-ly-phong/tao-moi')}
          >
            Thêm Phòng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng số phòng</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{totalRooms}</h3>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
            <DoorOpen className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Đang hoạt động</p>
            <h3 className="text-3xl font-extrabold text-green-600">{activeRooms}</h3>
          </div>
          <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Đang bảo trì / Hư hỏng</p>
            <h3 className="text-3xl font-extrabold text-orange-500">{maintenanceRooms}</h3>
          </div>
          <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Tìm kiếm theo mã phòng, tên phòng hoặc đơn vị quản lý..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2.5 rounded-lg w-full"
            size="large"
            allowClear
          />
        </div>
      </div>

      {/* Room Grouping Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spin size="large" />
            <p className="text-gray-500">Đang tải cấu trúc tòa nhà...</p>
          </div>
        ) : Object.keys(displayedGroups).length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
            <Empty
              description={
                <span className="text-gray-500 font-medium block mt-2">
                  {searchTerm ? "Không tìm thấy phòng nào phù hợp với từ khóa" : "Hệ thống chưa có dữ liệu phòng học nào"}
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            {!searchTerm && (
              <Button 
                type="primary" 
                className="mt-6 font-medium bg-blue-600 hover:bg-blue-700" 
                onClick={() => router.push('/qtv-khoa/quan-ly-phong/tao-moi')}
              >
                Nhập phòng ngay
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(displayedGroups).map(([building, floors]) => (
              <div key={building} className="space-y-4">
                {/* Building Title */}
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building className="h-6 w-6 text-blue-700" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Tòa {building}</h2>
                </div>

                <div className="ml-2 pl-4 border-l-2 border-gray-200 space-y-6">
                  {Object.entries(floors).map(([floor, roomList]) => (
                    <div key={`${building}-${floor}`} className="pt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tầng {floor}</h3>
                        <div className="h-px bg-gray-200 flex-1 ml-4"></div>
                        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">{roomList.length} phòng</span>
                      </div>
                      
                      {/* Room Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {roomList.map(room => (
                          <div 
                            key={room.id}
                            className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col"
                          >
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-start">
                              <div>
                                <h4 className="font-extrabold text-lg text-gray-900 leading-tight">
                                  {room.roomNumber}
                                </h4>
                                <p className="text-blue-600 font-medium text-sm line-clamp-1 mt-0.5" title={room.name}>
                                  {room.name}
                                </p>
                              </div>
                              <Tooltip title="Chuyển trạng thái hoạt động">
                                <button 
                                  className="focus:outline-none flex-shrink-0"
                                  onClick={() => toggleRoomStatus(room.id)}
                                >
                                  {renderStatusBadge(room.status)}
                                </button>
                              </Tooltip>
                            </div>
                            
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div>
                                  <span className="text-xs text-gray-400 block mb-0.5">Đơn vị quản lý</span>
                                  {room.unit ? (
                                    <Tag color="cyan" className="rounded border-none m-0 bg-blue-50 text-blue-700 text-xs font-semibold py-0.5 px-2">
                                      {room.unit.name.length > 28 ? `${room.unit.name.substring(0, 28)}...` : room.unit.name}
                                    </Tag>
                                  ) : (
                                    <span className="text-gray-400 text-sm italic">Không trực thuộc</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-400">ID: {room.id.substring(0, 8)}...</span>
                                <div className="space-x-2">
                                  <Button size="small" type="text" className="text-gray-500 hover:text-blue-600">Sửa</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
