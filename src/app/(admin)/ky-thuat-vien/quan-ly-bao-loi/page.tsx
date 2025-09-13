"use client"

import { useState, useMemo } from 'react'
import { Breadcrumb, Input, Select, DatePicker, Tag } from 'antd'
import { Search, ChevronUp, ChevronDown, Eye } from 'lucide-react'
import Link from 'next/link'
import { mockRepairRequests, repairRequestStatusConfig } from '@/lib/mockData/repairRequests'
import { RepairStatus, RepairRequest } from '@/types'
import { Pagination } from '@/components/ui'

const { RangePicker } = DatePicker
const { Option } = Select

type SortField = "requestCode" | "assetName" | "location" | "reporterName" | "errorTypeName" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | "none"

export default function DanhSachBaoLoiPage() {
	const [searchText, setSearchText] = useState('')
	const [statusFilter, setStatusFilter] = useState<RepairStatus | ''>('')
	const [dateRange, setDateRange] = useState<[any, any] | null>(null)
	const [sortField, setSortField] = useState<SortField | "">("")
	const [sortDirection, setSortDirection] = useState<SortDirection>("none")
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	// Hàm xử lý sắp xếp 3 trạng thái
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			if (sortDirection === "asc") {
				setSortDirection("desc")
			} else if (sortDirection === "desc") {
				setSortDirection("none")
				setSortField("")
			} else {
				setSortDirection("asc")
			}
		} else {
			setSortField(field)
			setSortDirection("asc")
		}
	}

	// Hàm lấy icon sắp xếp
	const getSortIcon = (field: SortField) => {
		if (sortField !== field || sortDirection === "none") {
			return (
				<div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
					<ChevronUp className="h-3 w-3 text-gray-400" />
					<ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
				</div>
			)
		}

		return (
			<div className="flex flex-col">
				<ChevronUp
					className={`h-3 w-3 ${sortDirection === "asc" ? "text-blue-600" : "text-gray-300"}`}
				/>
				<ChevronDown
					className={`h-3 w-3 -mt-1 ${sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
				/>
			</div>
		)
	}

	// Lọc và sắp xếp dữ liệu
	const filteredAndSortedData = useMemo(() => {
		// Reset về trang 1 khi filter thay đổi
		setCurrentPage(1)

		// Lọc dữ liệu
		const filtered = mockRepairRequests.filter((item: RepairRequest) => {
			const matchesSearch = searchText ? 
				[item.requestCode, item.assetName, item.assetCode, item.componentName, item.errorTypeName, item.roomName, item.buildingName]
					.filter(Boolean)
					.join(' ')
					.toLowerCase()
					.includes(searchText.toLowerCase()) : true

			const matchesStatus = statusFilter ? item.status === statusFilter : true

			const createdAt = new Date(item.createdAt)
			const matchesDateRange = dateRange ? 
				createdAt >= dateRange[0]?.toDate() && createdAt <= dateRange[1]?.toDate() : true

			return matchesSearch && matchesStatus && matchesDateRange
		})

		// Sắp xếp dữ liệu
		if (!sortField || sortDirection === "none") return filtered

		return [...filtered].sort((a, b) => {
			let aValue: string | Date | number = ""
			let bValue: string | Date | number = ""

			switch (sortField) {
				case "requestCode":
					aValue = a.requestCode
					bValue = b.requestCode
					break
				case "assetName":
					aValue = a.assetName
					bValue = b.assetName
					break
				case "location":
					aValue = `${a.buildingName} ${a.roomName}`
					bValue = `${b.buildingName} ${b.roomName}`
					break
				case "reporterName":
					aValue = a.reporterName
					bValue = b.reporterName
					break
				case "errorTypeName":
					aValue = a.errorTypeName || ""
					bValue = b.errorTypeName || ""
					break
				case "status":
					aValue = a.status
					bValue = b.status
					break
				case "createdAt":
					aValue = new Date(a.createdAt)
					bValue = new Date(b.createdAt)
					break
				default:
					return 0
			}

			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
			return 0
		})
	}, [searchText, statusFilter, dateRange, sortField, sortDirection])

	// Dữ liệu phân trang
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize
		const endIndex = startIndex + pageSize
		return filteredAndSortedData.slice(startIndex, endIndex)
	}, [filteredAndSortedData, currentPage, pageSize])

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<Breadcrumb
				items={[
					{
						href: '/ky-thuat-vien',
						title: (
							<div className="flex items-center">
								<span>Trang chủ</span>
							</div>
						),
					},
					{
						title: (
							<div className="flex items-center">
								<span>Quản lý báo lỗi</span>
							</div>
						),
					},
				]}
			/>

			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
					Quản lý báo lỗi
				</h1>
				<p className="mt-2 text-gray-600">
					Theo dõi và quản lý các báo cáo lỗi từ giảng viên và kỹ thuật viên.
				</p>
			</div>

			{/* Filters & Search */}
			<div className="bg-white p-4 rounded-lg shadow space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Input
						className='col-span-1 md:col-span-2'
						placeholder="Tìm kiếm theo mã, tên tài sản, linh kiện, loại lỗi, vị trí..."
						prefix={<Search className="w-4 h-4" />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					
					<Select
						placeholder="Chọn trạng thái"
						value={statusFilter}
						onChange={setStatusFilter}
						allowClear
					>
						<Option value="">Tất cả trạng thái</Option>
						<Option value={RepairStatus.CHỜ_TIẾP_NHẬN}>
							Chờ tiếp nhận
						</Option>
						<Option value={RepairStatus.ĐÃ_TIẾP_NHẬN}>
							Đã tiếp nhận
						</Option>
						<Option value={RepairStatus.ĐANG_XỬ_LÝ}>
							Đang xử lý
						</Option>
						<Option value={RepairStatus.CHỜ_THAY_THẾ}>
							Chờ thay thế
						</Option>
						<Option value={RepairStatus.ĐÃ_HOÀN_THÀNH}>
							Đã hoàn thành
						</Option>
						<Option value={RepairStatus.ĐÃ_HỦY}>
							Đã hủy
						</Option>
					</Select>
					
					<RangePicker
						placeholder={['Từ ngày', 'Đến ngày']}
						format="DD/MM/YYYY"
						value={dateRange}
						onChange={setDateRange}
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto bg-white shadow rounded-lg">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-24"
								onClick={() => handleSort("requestCode")}
							>
								<div className="flex items-center space-x-1">
									<span>Mã YC</span>
									{getSortIcon("requestCode")}
								</div>
							</th>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-40"
								onClick={() => handleSort("assetName")}
							>
								<div className="flex items-center space-x-1">
									<span>Tài sản</span>
									{getSortIcon("assetName")}
								</div>
							</th>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-32"
								onClick={() => handleSort("location")}
							>
								<div className="flex items-center space-x-1">
									<span>Vị trí</span>
									{getSortIcon("location")}
								</div>
							</th>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-28"
								onClick={() => handleSort("reporterName")}
							>
								<div className="flex items-center space-x-1">
									<span>Người báo</span>
									{getSortIcon("reporterName")}
								</div>
							</th>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-32"
								onClick={() => handleSort("errorTypeName")}
							>
								<div className="flex items-center space-x-1">
									<span>Loại lỗi</span>
									{getSortIcon("errorTypeName")}
								</div>
							</th>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-28"
								onClick={() => handleSort("status")}
							>
								<div className="flex items-center space-x-1">
									<span>Trạng thái</span>
									{getSortIcon("status")}
								</div>
							</th>
							<th 
								className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-24"
								onClick={() => handleSort("createdAt")}
							>
								<div className="flex items-center space-x-1">
									<span>Ngày báo</span>
									{getSortIcon("createdAt")}
								</div>
							</th>
							<th className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-16">
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{paginatedData.map((record) => {
							const config = repairRequestStatusConfig[record.status]
							return (
								<tr key={record.id} className="hover:bg-gray-50">
									<td className="px-2 py-3 text-sm font-medium text-blue-600 w-24">
										<div className="truncate" title={record.requestCode}>
											{record.requestCode}
										</div>
									</td>
									<td className="px-2 py-3 text-sm text-gray-700 w-40">
										<div>
											<div className="font-medium truncate" title={record.assetName}>
												{record.assetName}
											</div>
											<div className="text-xs text-gray-500 truncate" title={record.componentName || "Linh kiện chưa xác định"}>
												{record.componentName ? record.componentName : "Chưa xác định"}
											</div>
										</div>
									</td>
									<td className="px-2 py-3 text-sm text-gray-700 w-32">
										<div>
											<div className="font-medium truncate" title={record.buildingName}>
												{record.buildingName}
											</div>
											<div className="text-xs text-gray-500 truncate" title={`${record.roomName} - Máy ${record.machineLabel}`}>
												{record.roomName} - M{record.machineLabel}
											</div>
										</div>
									</td>
									<td className="px-2 py-3 text-sm text-gray-700 w-28">
										<div className="truncate" title={record.reporterName}>
											{record.reporterName}
										</div>
									</td>
									<td className="px-2 py-3 text-sm text-gray-700 w-32">
										<div className="truncate" title={record.errorTypeName || "Chưa xác định"}>
											{record.errorTypeName || "Chưa xác định"}
										</div>
									</td>
									<td className="px-2 py-3 w-28">
										<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${config.color} truncate`} title={config.label}>
											{config.label}
										</span>
									</td>
									<td className="px-2 py-3 text-sm text-gray-700 w-24">
										<div className="truncate" title={new Date(record.createdAt).toLocaleDateString('vi-VN')}>
											{new Date(record.createdAt).toLocaleDateString('vi-VN')}
										</div>
									</td>
									<td className="px-2 py-3 text-center w-16">
										<Link href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.id}`}>
											<button 
											title='Xem chi tiết' 
											className="text-blue-600 hover:text-blue-900 inline-flex items-center">
												<Eye className="w-4 h-4" />
											</button>
										</Link>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				
				<Pagination
					currentPage={currentPage}
					pageSize={pageSize}
					total={filteredAndSortedData.length}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
					showSizeChanger={true}
					pageSizeOptions={[10, 20, 50, 100]}
					showQuickJumper={true}
					showTotal={true}
				/>
			</div>
		</div>
	)
}


