import React from "react";
import {
  MapPin,
  Building2,
  User,
  Edit,
  CheckSquare,
  Square,
  Search,
} from "lucide-react";
import { Room } from "@/types/unit";
import { Technician } from "@/types";

interface AreasMobileViewProps {
  rooms: Room[];
  technicians: Technician[];
  selectedItems: string[];
  onSelectItem: (itemId: string, checked: boolean) => void;
  onEditRoom: (roomId: string, technicianId: string) => void;
}

const AreasMobileView: React.FC<AreasMobileViewProps> = ({
  rooms,
  technicians,
  selectedItems,
  onSelectItem,
  onEditRoom,
}) => {
  const getTechnicianName = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    return tech?.name || "Chưa phân công";
  };

  return (
    <div className="lg:hidden bg-white shadow rounded-lg">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-medium text-gray-900">
          Danh sách khu vực ({rooms.length})
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              {/* Header with checkbox and room info */}
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Phòng {room.roomNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Building2 className="h-3 w-3" />
                    <span>
                      {room.building} - {room.floor}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    onSelectItem(room.id, !selectedItems.includes(room.id))
                  }
                  className="flex-shrink-0">
                  {selectedItems.includes(room.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Info grid */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">
                      Kỹ thuật viên phụ trách
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      {getTechnicianName(room.assignedTechnician || "")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with edit button */}
              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <button
                  onClick={() =>
                    onEditRoom(room.id, room.assignedTechnician || "")
                  }
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  <Edit className="h-4 w-4" />
                  <span>Phân công</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Không tìm thấy kết quả
            </h3>
            <p className="text-xs text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreasMobileView;
