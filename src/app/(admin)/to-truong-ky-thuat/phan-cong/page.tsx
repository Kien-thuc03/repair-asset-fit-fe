"use client";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  User,
  Building2,
  Edit,
  Save,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Technician } from "@/types";
import { Room } from "@/types/unit";
import { mockTechnicians, mockRooms } from "@/lib/mockData";
import { Breadcrumb } from "antd";

export default function PhanCongPage() {
  const [technicians] = useState<Technician[]>(mockTechnicians);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [activeTab, setActiveTab] = useState<"areas" | "technicians">("areas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Reset mọi scrollbar styling để tránh xung đột */
      html, body {
        overflow: auto;
        scrollbar-gutter: auto;
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Hàm lấy icon sắp xếp với trạng thái rõ ràng hơn
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

  const handleAssignTechnician = (roomId: string, technicianId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, assignedTechnician: technicianId || undefined }
          : room
      )
    );
    setEditingRoom(null);
    setSelectedTechnician("");
  };

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

  const getTechnicianName = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    return tech?.name || "Chưa phân công";
  };

  const filteredRooms = rooms.filter(
    (room) =>
      searchTerm === "" ||
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.building &&
        room.building.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.floor &&
        room.floor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sắp xếp rooms đã lọc
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (!sortField || sortDirection === "none") return 0;

    let aValue: string = "";
    let bValue: string = "";

    switch (sortField) {
      case "name":
        aValue = a.roomNumber;
        bValue = b.roomNumber;
        break;
      case "building":
        aValue = a.building || "";
        bValue = b.building || "";
        break;
      case "floors":
        aValue = a.floor || "";
        bValue = b.floor || "";
        break;
      case "technician":
        aValue = getTechnicianName(a.assignedTechnician || "");
        bValue = getTechnicianName(b.assignedTechnician || "");
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredTechnicians = technicians.filter(
    (tech) =>
      searchTerm === "" ||
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Phân công khu vực</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Phân công khu vực
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và phân công khu vực cho kỹ thuật viên
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("areas")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "areas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <MapPin className="inline h-4 w-4 mr-2" />
              Phân công theo khu vực
            </button>
            <button
              onClick={() => setActiveTab("technicians")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "technicians"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <User className="inline h-4 w-4 mr-2" />
              Quản lý kỹ thuật viên
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
          <p className="text-sm text-gray-500">
            Tìm kiếm và lọc dữ liệu theo các tiêu chí
          </p>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                activeTab === "areas"
                  ? "Tìm theo phòng, tòa nhà, tầng..."
                  : "Tìm theo tên, email kỹ thuật viên..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {activeTab === "areas" ? (
        /* Areas Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Danh sách khu vực ({sortedRooms.length})
            </h2>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("name")}>
                    <div className="flex items-center space-x-1">
                      <span>Phòng/Khu vực</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("building")}>
                    <div className="flex items-center space-x-1">
                      <span>Tòa nhà</span>
                      {getSortIcon("building")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("floors")}>
                    <div className="flex items-center space-x-1">
                      <span>Tầng</span>
                      {getSortIcon("floors")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("technician")}>
                    <div className="flex items-center space-x-1">
                      <span>Kỹ thuật viên phụ trách</span>
                      {getSortIcon("technician")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRooms.length > 0 ? (
                  sortedRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {room.roomNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              Mã: {room.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-900">
                            {room.building || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {room.floor || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingRoom === room.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={selectedTechnician}
                              onChange={(e) =>
                                setSelectedTechnician(e.target.value)
                              }
                              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-0 flex-1">
                              <option value="">Chưa phân công</option>
                              {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                  {tech.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() =>
                                handleAssignTechnician(
                                  room.id,
                                  selectedTechnician
                                )
                              }
                              className="text-green-600 hover:text-green-800 p-1 flex-shrink-0">
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingRoom(null);
                                setSelectedTechnician("");
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {getTechnicianName(
                                  room.assignedTechnician || ""
                                )}
                              </div>
                              {room.assignedTechnician && (
                                <div className="text-sm text-gray-500">
                                  {technicians.find(
                                    (t) => t.id === room.assignedTechnician
                                  )?.email || ""}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setEditingRoom(room.id);
                            setSelectedTechnician(
                              room.assignedTechnician || ""
                            );
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <Edit className="h-4 w-4 mr-1" />
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
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
      ) : (
        /* Technicians Tab */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTechnicians.map((tech) => {
            const assignedRooms = rooms.filter(
              (room) => room.assignedTechnician === tech.id
            );

            return (
              <div
                key={tech.id}
                className="bg-white overflow-hidden shadow rounded-lg">
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
                            className="flex items-center text-xs text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            {room.roomNumber} - {room.floor}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">
                          Chưa có khu vực phụ trách
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
