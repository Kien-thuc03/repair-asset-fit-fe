import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { ICreateRoomRequest, IUpdateRoomRequest, RoomStatus } from '@/types/unit';
import {
  getAllRoomsApi,
  getRoomByIdApi,
  createRoomApi,
  updateRoomApi,
  deleteRoomApi,
  RoomResponseDto
} from '@/lib/api/rooms';

export interface UseRoomsManagementOptions {
  fetchOnMount?: boolean;
}

export const useRoomsManagement = (options: UseRoomsManagementOptions = {}) => {
  const { fetchOnMount = true } = options;

  // State
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Tải danh sách tất cả phòng từ API
   */
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllRoomsApi();
      setRooms(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu phòng';
      setError(errorMessage);
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tạo phòng mới
   */
  const handleCreateRoom = async (
    roomData: ICreateRoomRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await createRoomApi(roomData);
      await fetchRooms();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo phòng';
      setError(errorMessage);
      console.error('Error creating room:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cập nhật thông tin phòng
   */
  const handleUpdateRoom = async (
    roomId: string,
    updateData: IUpdateRoomRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await updateRoomApi(roomId, updateData);
      await fetchRooms();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật phòng';
      setError(errorMessage);
      console.error('Error updating room:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xóa phòng
   */
  const handleDeleteRoom = async (roomId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteRoomApi(roomId);
      await fetchRooms();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa phòng';
      setError(errorMessage);
      console.error('Error deleting room:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle trạng thái phòng
   */
  const handleToggleStatus = async (roomId: string): Promise<boolean> => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return false;

    const newStatus = room.status === RoomStatus.ACTIVE ? RoomStatus.INACTIVE : RoomStatus.ACTIVE;
    return handleUpdateRoom(roomId, { status: newStatus });
  };

  /**
   * Import bulk rooms từ Excel
   */
  const handleBulkImport = async (
    roomsData: ICreateRoomRequest[]
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Create one by one - fallback cho batch insert không có
      for (const roomData of roomsData) {
        await createRoomApi(roomData);
      }
      await fetchRooms();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi import phòng';
      setError(errorMessage);
      console.error('Error importing rooms:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Grouped data helper (Tối ưu UI Quản lý phòng)
  const groupedRooms = useMemo(() => {
    const groups: Record<string, Record<string, RoomResponseDto[]>> = {};
    
    rooms.forEach(room => {
      const building = room.building || 'Khác';
      const floor = room.floor || 'Tầng khác';

      if (!groups[building]) {
        groups[building] = {};
      }
      if (!groups[building][floor]) {
        groups[building][floor] = [];
      }

      groups[building][floor].push(room);
    });

    return groups;
  }, [rooms]);

  // Effects
  useEffect(() => {
    if (fetchOnMount) {
      fetchRooms();
    }
  }, [fetchOnMount, fetchRooms]);

  return {
    rooms,
    groupedRooms,
    loading,
    error,
    fetchRooms,
    createRoom: handleCreateRoom,
    updateRoom: handleUpdateRoom,
    deleteRoom: handleDeleteRoom,
    toggleRoomStatus: handleToggleStatus,
    bulkImport: handleBulkImport,
    clearError: () => setError(null),
  };
};
