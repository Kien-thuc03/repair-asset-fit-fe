"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Input,
  message,
  Breadcrumb,
  Select,
  Card,
  Row,
  Col,
  Tag,
} from "antd";
import { SearchOutlined, SyncOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  getStockComponents, 
  StockComponentDto, 
  ComponentType,
} from "@/lib/api/components";
import { getComponentTypeLabel } from "@/types/computer";
import Pagination from "@/components/common/Pagination";

type SortField = "componentType" | "name" | "installedAt" | "serialNumber";
type SortDirection = "asc" | "desc" | "none";

export default function ComponentStockPage() {
  const router = useRouter();
  const [allComponents, setAllComponents] = useState<StockComponentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Filter states
  const [componentTypeFilter, setComponentTypeFilter] = useState<string[]>([]);

  // Fetch stock components
  const fetchStockComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStockComponents();
      setAllComponents(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi khi tải danh sách linh kiện";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockComponents();
  }, []);


  // Filter và sort components
  const filteredAndSortedComponents = useMemo(() => {
    let filtered = [...allComponents];

    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (comp) =>
          comp.name.toLowerCase().includes(searchLower) ||
          comp.componentSpecs?.toLowerCase().includes(searchLower) ||
          comp.serialNumber?.toLowerCase().includes(searchLower) ||
          comp.computer?.asset?.name.toLowerCase().includes(searchLower) ||
          comp.computer?.asset?.ktCode.toLowerCase().includes(searchLower) ||
          comp.computer?.room?.name.toLowerCase().includes(searchLower)
      );
    }

    // Component type filter
    if (componentTypeFilter.length > 0) {
      filtered = filtered.filter((comp) =>
        componentTypeFilter.includes(comp.componentType)
      );
    }

    // Sort
    if (sortField && sortDirection !== "none") {
      filtered.sort((a, b) => {
        let aValue: string | number | Date | undefined;
        let bValue: string | number | Date | undefined;

        switch (sortField) {
          case "componentType":
            aValue = a.componentType;
            bValue = b.componentType;
            break;
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "installedAt":
            aValue = new Date(a.installedAt).getTime();
            bValue = new Date(b.installedAt).getTime();
            break;
          case "serialNumber":
            aValue = a.serialNumber || "";
            bValue = b.serialNumber || "";
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [
    allComponents,
    searchText,
    componentTypeFilter,
    sortField,
    sortDirection,
  ]);

  // Paginate
  const paginatedComponents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedComponents.slice(start, end);
  }, [filteredAndSortedComponents, currentPage, pageSize]);

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: SortField) => {
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
    setCurrentPage(1);
  };

  // Hàm lấy icon sắp xếp
  const getSortIcon = (field: SortField) => {
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

  // Đếm số lượng filters đang active
  const activeFiltersCount = [
    componentTypeFilter.length > 0,
    searchText,
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setComponentTypeFilter([]);
    setSearchText("");
    setCurrentPage(1);
    setSelectedRowKeys([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Row selection helpers
  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const allFilteredIds = filteredAndSortedComponents.map((item) => item.id);
    if (checked) {
      setSelectedRowKeys(Array.from(new Set([...allFilteredIds])));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const isAllSelected =
    filteredAndSortedComponents.length > 0 &&
    filteredAndSortedComponents.every((item) => selectedRowKeys.includes(item.id));

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Export Excel
  const handleExportExcel = async () => {
    const exportData =
      selectedRowKeys.length > 0
        ? filteredAndSortedComponents.filter((item) =>
            selectedRowKeys.includes(item.id)
          )
        : filteredAndSortedComponents;

    if (exportData.length === 0) {
      message.warning("Vui lòng chọn ít nhất một linh kiện để xuất Excel");
      return;
    }

    try {
      const XLSX = await import("xlsx");

      const excelData = exportData.map((comp, index) => ({
        STT: index + 1,
        "Loại linh kiện": getComponentTypeLabel(comp.componentType as ComponentType),
        "Tên linh kiện": comp.name,
        "Thông số kỹ thuật": comp.componentSpecs || "",
        "Số serial": comp.serialNumber || "",
        "Trạng thái": comp.status,
        "Ngày nhập kho": formatDate(comp.installedAt),
        "Ghi chú": comp.notes || "",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, "Kho linh kiện");

      const fileName = `kho-linh-kien-${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      message.success("Xuất file Excel thành công!");
    } catch (err) {
      console.error("Export error:", err);
      message.error("Xuất file Excel thất bại. Vui lòng thử lại.");
    }
  };


  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/ky-thuat-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Quản lý thay thế linh kiện</span>
              </div>
            ),
          },
          {
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien",
            title: (
              <div className="flex items-center">
                <span>Kho linh kiện</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Kho linh kiện</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi linh kiện có sẵn trong kho
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien/them-moi")}
            size="large">
            Thêm linh kiện
          </Button>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            size="large"
            disabled={
              selectedRowKeys.length === 0 &&
              filteredAndSortedComponents.length === 0
            }>
            Xuất Excel{" "}
            {selectedRowKeys.length > 0
              ? `(${selectedRowKeys.length} đã chọn)`
              : `(${filteredAndSortedComponents.length})`}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={15}>
            <Input
              placeholder="Tìm kiếm theo tên linh kiện, thông số, serial..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Tất cả loại linh kiện"
              value={componentTypeFilter}
              onChange={(value) => {
                setComponentTypeFilter(value);
                setCurrentPage(1);
              }}
              style={{ width: "100%" }}
              maxTagCount="responsive">
              {Object.entries(ComponentType).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {getComponentTypeLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={1}>
            <Button
              type="default"
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
              icon={<SyncOutlined />}
              block>
            </Button>
            </Col>
        </Row>
      </div>


      {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          {error ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">❌ {error}</p>
                <Button onClick={() => window.location.reload()}>Thử lại</Button>
              </div>
            </div>
          ) : filteredAndSortedComponents.length === 0 && !loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">
                {allComponents.length === 0
                  ? "Không có linh kiện nào trong kho"
                  : "Không tìm thấy linh kiện nào phù hợp với bộ lọc"}
              </p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={isAllSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          aria-label="Chọn tất cả"
                        />
                        <span>STT</span>
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("componentType")}>
                      <div className="flex items-center uppercase space-x-1">
                        <span>Loại linh kiện</span>
                        {getSortIcon("componentType")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("name")}>
                      <div className="flex items-center uppercase space-x-1">
                        <span>Tên linh kiện</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông số kỹ thuật
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("serialNumber")}>
                      <div className="flex items-center uppercase space-x-1">
                        <span>Số serial</span>
                        {getSortIcon("serialNumber")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("installedAt")}>
                      <div className="flex items-center uppercase space-x-1">
                        <span>Ngày nhập kho</span>
                        {getSortIcon("installedAt")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vị trí
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center">
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedComponents.map((comp, index) => (
                      <tr key={comp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedRowKeys.includes(comp.id)}
                              onChange={(e) => handleRowSelect(comp.id, e.target.checked)}
                              aria-label={`Chọn linh kiện ${comp.name}`}
                            />
                            <span>{(currentPage - 1) * pageSize + index + 1}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Tag color="blue">
                            {getComponentTypeLabel(comp.componentType as ComponentType)}
                          </Tag>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="font-medium">{comp.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {comp.componentSpecs || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="font-mono text-xs">
                            {comp.serialNumber || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Tag color="green">Trong kho</Tag>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(comp.installedAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {comp.notes || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {comp.computer?.room ? (
                            <div>
                              <div className="font-medium">
                                {comp.computer.room.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {comp.computer.room.building} - Tầng {comp.computer.room.floor}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={filteredAndSortedComponents.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showSizeChanger={true}
                pageSizeOptions={[10, 20, 50, 100]}
                showQuickJumper={true}
                showTotal={true}
              />
            </>
          )}
        </div>
    </div>
  );
}

