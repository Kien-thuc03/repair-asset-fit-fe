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
} from "lucide-react";

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "busy" | "offline";
  assignedAreas: string[];
  currentTask?: string;
}

interface Area {
  id: string;
  name: string;
  building: string;
  floors: string[];
  assignedTechnician?: string;
}

const mockTechnicians: Technician[] = [
  {
    id: "tech001",
    name: "Nguyễn Văn A",
    email: "vana@iuh.edu.vn",
    phone: "0123456789",
    status: "active",
    assignedAreas: ["area001", "area002"],
    currentTask: "Sửa máy tính P.A101",
  },
  {
    id: "tech002",
    name: "Trần Thị B",
    email: "tranb@iuh.edu.vn",
    phone: "0987654321",
    status: "busy",
    assignedAreas: ["area003"],
    currentTask: "Bảo trì máy chiếu B204",
  },
  {
    id: "tech003",
    name: "Lê Văn C",
    email: "levanc@iuh.edu.vn",
    phone: "0456789123",
    status: "active",
    assignedAreas: ["area004", "area005"],
  },
  {
    id: "tech004",
    name: "Phạm Thị D",
    email: "phamd@iuh.edu.vn",
    phone: "0321654987",
    status: "offline",
    assignedAreas: [],
  },
];

const mockAreas: Area[] = [
  {
    id: "area001",
    name: "Tòa A - Tầng 1-3",
    building: "Tòa A",
    floors: ["Tầng 1", "Tầng 2", "Tầng 3"],
    assignedTechnician: "tech001",
  },
  {
    id: "area002",
    name: "Tòa A - Tầng 4-6",
    building: "Tòa A",
    floors: ["Tầng 4", "Tầng 5", "Tầng 6"],
    assignedTechnician: "tech001",
  },
  {
    id: "area003",
    name: "Tòa B - Toàn bộ",
    building: "Tòa B",
    floors: ["Tầng 1", "Tầng 2", "Tầng 3", "Tầng 4"],
    assignedTechnician: "tech002",
  },
  {
    id: "area004",
    name: "Tòa C - Tầng 1-2",
    building: "Tòa C",
    floors: ["Tầng 1", "Tầng 2"],
    assignedTechnician: "tech003",
  },
  {
    id: "area005",
    name: "Tòa C - Tầng 3-5",
    building: "Tòa C",
    floors: ["Tầng 3", "Tầng 4", "Tầng 5"],
    assignedTechnician: "tech003",
  },
  {
    id: "area006",
    name: "Tòa D - Lab máy tính",
    building: "Tòa D",
    floors: ["Tầng 1", "Tầng 2"],
  },
];

export default function PhanCongPage() {
  const [technicians] = useState<Technician[]>(mockTechnicians);
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [activeTab, setActiveTab] = useState<"areas" | "technicians">("areas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");

  const handleAssignTechnician = (areaId: string, technicianId: string) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? { ...area, assignedTechnician: technicianId || undefined }
          : area
      )
    );
    setEditingArea(null);
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

  const filteredAreas = areas.filter(
    (area) =>
      searchTerm === "" ||
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTechnicians = technicians.filter(
    (tech) =>
      searchTerm === "" ||
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/to-truong-ky-thuat"
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
              Danh sách khu vực ({filteredAreas.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khu vực
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tòa nhà
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tầng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ thuật viên phụ trách
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAreas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {area.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {area.building}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {area.floors.join(", ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingArea === area.id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedTechnician}
                            onChange={(e) =>
                              setSelectedTechnician(e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
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
                                area.id,
                                selectedTechnician
                              )
                            }
                            className="text-green-600 hover:text-green-800">
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingArea(null);
                              setSelectedTechnician("");
                            }}
                            className="text-gray-400 hover:text-gray-600">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {getTechnicianName(area.assignedTechnician || "")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingArea(area.id);
                          setSelectedTechnician(area.assignedTechnician || "");
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
            const assignedAreas = areas.filter(
              (area) => area.assignedTechnician === tech.id
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
                      Khu vực phụ trách ({assignedAreas.length})
                    </h4>
                    <div className="space-y-1">
                      {assignedAreas.length > 0 ? (
                        assignedAreas.map((area) => (
                          <div
                            key={area.id}
                            className="flex items-center text-xs text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            {area.name}
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
