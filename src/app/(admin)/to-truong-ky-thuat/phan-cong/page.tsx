"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
      case "busy":
        return "bg-orange-100 text-orange-800";
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
      case "busy":
        return "Bận";
      case "offline":
        return "Offline";
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
    <div className="container mx-auto px-4 py-2">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/to-truong-ky-thuat"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Về trang chủ
        </Link>

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

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={
              activeTab === "areas" ? "Tìm khu vực..." : "Tìm kỹ thuật viên..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("name")}>
                    <div className="flex items-center space-x-1">
                      <span>Phòng</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("building")}>
                    <div className="flex items-center space-x-1">
                      <span>Tòa nhà</span>
                      {getSortIcon("building")}
                    </div>
                  </th>
                  <th
                    className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("floors")}>
                    <div className="flex items-center space-x-1">
                      <span>Tầng</span>
                      {getSortIcon("floors")}
                    </div>
                  </th>
                  <th
                    className="w-56 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("technician")}>
                    <div className="flex items-center space-x-1">
                      <span>Kỹ thuật viên phụ trách</span>
                      {getSortIcon("technician")}
                    </div>
                  </th>
                  <th className="w-24 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap truncate">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {room.roomNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap truncate">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">
                          {room.building || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap truncate">
                      <span
                        className="text-sm text-gray-500 truncate"
                        title={room.floor || ""}>
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
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 min-w-0">
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
                            className="text-green-600 hover:text-green-800 flex-shrink-0">
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRoom(null);
                              setSelectedTechnician("");
                            }}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center min-w-0">
                          <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span
                            className="text-sm text-gray-900 truncate"
                            title={getTechnicianName(
                              room.assignedTechnician || ""
                            )}>
                            {getTechnicianName(room.assignedTechnician || "")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingRoom(room.id);
                          setSelectedTechnician(room.assignedTechnician || "");
                        }}
                        className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
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
