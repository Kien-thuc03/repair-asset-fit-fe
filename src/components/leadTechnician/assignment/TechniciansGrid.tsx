import React from "react";
import { User } from "lucide-react";
import { Technician } from "@/types";
import { Room } from "@/types/unit";

interface TechniciansGridProps {
  technicians: Technician[];
  rooms: Room[];
  selectedItems: string[];
  onSelectItem: (itemId: string, checked: boolean) => void;
}

const TechniciansGrid: React.FC<TechniciansGridProps> = ({
  technicians,
  rooms,

}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Sẵn sàng";
      case "offline":
        return "Nghỉ";
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {technicians.map((tech) => {
        const assignedRooms = rooms.filter(
          (room) => room.assignedTechnician === tech.id
        );

        return (
          <div
            key={tech.id}
            className="bg-white overflow-hidden shadow rounded-lg relative">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tech.email}</p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                      tech.status
                    )}`}>
                    {getStatusText(tech.status)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Điện thoại:</strong> {tech.phone}
                </p>
                {tech.currentTask && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Nhiệm vụ hiện tại:</strong> {tech.currentTask}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Khu vực phụ trách ({assignedRooms.length})
                </h4>
                <div className="space-y-1">
                  {assignedRooms.length > 0 ? (
                    assignedRooms.map((room) => (
                      <div
                        key={room.id}
                        className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {room.roomNumber} - {room.building}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Chưa được phân công khu vực
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechniciansGrid;
