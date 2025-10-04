import React from "react";
import {
  MapPin,
  Building2,
  User,
  Edit,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
  Search,
} from "lucide-react";
import { Room } from "@/types/unit";
import { Technician } from "@/types";

interface AreasTableProps {
  rooms: Room[];
  technicians: Technician[];
  selectedItems: string[];
  selectAll: boolean;
  editingRoom: string | null;
  selectedTechnician: string;
  sortField: string;
  sortDirection: "asc" | "desc" | "none";
  onSort: (field: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onEditRoom: (roomId: string, technicianId: string) => void;
  onAssignTechnician: (roomId: string, technicianId: string) => void;
  onCancelEdit: () => void;
  onSetSelectedTechnician: (technicianId: string) => void;
}

const AreasTable: React.FC<AreasTableProps> = ({
  rooms,
  technicians,
  selectedItems,
  selectAll,
  editingRoom,
  selectedTechnician,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectItem,
  onEditRoom,
  onAssignTechnician,
  onCancelEdit,
  onSetSelectedTechnician,
}) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const getTechnicianName = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    return tech?.name || "Chưa phân công";
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Danh sách khu vực ({rooms.length})
        </h2>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-3 text-left w-12">
                <button
                  onClick={() => onSelectAll(!selectAll)}
                  className="text-gray-400 hover:text-gray-600">
                  {selectAll ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-1/4"
                onClick={() => onSort("name")}>
                <div className="flex items-center space-x-1">
                  <span>Phòng/Khu vực</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-32"
                onClick={() => onSort("building")}>
                <div className="flex items-center space-x-1">
                  <span>Tòa nhà</span>
                  {getSortIcon("building")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-24"
                onClick={() => onSort("floors")}>
                <div className="flex items-center space-x-1">
                  <span>Tầng</span>
                  {getSortIcon("floors")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-80"
                onClick={() => onSort("technician")}>
                <div className="flex items-center space-x-1">
                  <span>Kỹ thuật viên phụ trách</span>
                  {getSortIcon("technician")}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 w-12">
                    <button
                      onClick={() =>
                        onSelectItem(room.id, !selectedItems.includes(room.id))
                      }
                      className="text-gray-400 hover:text-gray-600">
                      {selectedItems.includes(room.id) ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {room.roomNumber}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          Mã: {room.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-32">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900 truncate">
                        {room.building || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-24">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {room.floor || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-80">
                    {editingRoom === room.id ? (
                      <div className="flex items-center space-x-1 min-h-[2.5rem]">
                        <select
                          value={selectedTechnician}
                          onChange={(e) =>
                            onSetSelectedTechnician(e.target.value)
                          }
                          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Chưa phân công</option>
                          {technicians.map((tech) => (
                            <option key={tech.id} value={tech.id}>
                              {tech.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            onAssignTechnician(room.id, selectedTechnician)
                          }
                          className="inline-flex items-center p-2 border border-transparent rounded text-green-600 hover:bg-green-100 flex-shrink-0">
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={onCancelEdit}
                          className="inline-flex items-center p-2 border border-transparent rounded text-red-600 hover:bg-red-100 flex-shrink-0">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center min-h-[2.5rem]">
                        <User className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                        <span
                          className={`text-sm truncate ${
                            room.assignedTechnician
                              ? "text-gray-900 font-medium"
                              : "text-gray-500 italic"
                          }`}>
                          {getTechnicianName(room.assignedTechnician || "")}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center w-32">
                    <button
                      onClick={() =>
                        onEditRoom(room.id, room.assignedTechnician || "")
                      }
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <Edit className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-sm text-gray-500">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AreasTable;
