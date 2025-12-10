"use client"

import { useState, useMemo } from 'react'
import { Breadcrumb, Input, Select, DatePicker, Button, message, Spin, Alert } from 'antd'
import type { Dayjs } from 'dayjs'
import { Search, ChevronUp, ChevronDown, Eye, Download } from 'lucide-react'
import Link from 'next/link'
import { repairRequestStatusConfig } from '@/lib/constants/repairStatus'
import { RepairStatus, RepairRequest } from '@/types'
import { Pagination } from '@/components/common'
import { useProfile } from '@/hooks/useProfile'
import { useRepairsByTechnician } from '@/hooks/useRepairsByTechnician'

const { RangePicker } = DatePicker
const { Option } = Select

type SortField = "requestCode" | "assetName" | "location" | "reporterName" | "errorTypeName" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | "none"
type RangeValue = [Dayjs | null, Dayjs | null] | null

export default function DanhSachBaoLoiPage() {
	// Hooks để lấy dữ liệu từ API
	const { userDetails, isLoading: profileLoading } = useProfile()
	const { repairs, loading: repairsLoading, error: repairsError } = useRepairsByTechnician(userDetails?.id)

	// State cho filters và UI
	const [searchText, setSearchText] = useState('')
	const [statusFilter, setStatusFilter] = useState<RepairStatus | ''>('')
	const [dateRange, setDateRange] = useState<RangeValue>(null)
	const [sortField, setSortField] = useState<SortField | "">("")
	const [sortDirection, setSortDirection] = useState<SortDirection>("none")
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

	// Tổng trạng thái loading
	const isLoading = profileLoading || repairsLoading

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

	// Hàm xử lý chọn hàng
	const handleRowSelect = (id: string, selected: boolean) => {
		if (selected) {
			setSelectedRowKeys(prev => [...prev, id])
		} else {
			setSelectedRowKeys(prev => prev.filter(key => key !== id))
		}
	}

	// Hàm xử lý chọn tất cả
	const handleSelectAll = (selected: boolean) => {
		if (selected) {
			const currentPageKeys = paginatedData.map(row => row.id)
			setSelectedRowKeys(prev => [...prev, ...currentPageKeys])
		} else {
			const currentPageKeys = paginatedData.map(row => row.id)
			setSelectedRowKeys(prev => prev.filter(key => !currentPageKeys.includes(key)))
		}
	}

	// Hàm xuất Excel
	const handleExportExcel = async () => {
		const selectedData = filteredAndSortedData.filter(item => selectedRowKeys.includes(item.id))
		
		if (selectedData.length === 0) {
			message.warning('Vui lòng chọn ít nhất một báo lỗi để xuất Excel')
			return
		}

		try {
			// Dynamic import để tránh lỗi SSR
			const XLSX = await import('xlsx')
			
			// Tạo dữ liệu Excel
			const excelData = selectedData.map((item, index) => ({
				'STT': index + 1,
				'Mã yêu cầu': item.requestCode,
				'Tên tài sản': item.assetName || 'Chưa xác định',
				'Mã tài sản': item.ktCode || 'Chưa xác định',
				'Linh kiện': item.componentName || 'Chưa xác định',
				'Vị trí': `${item.buildingName || 'Chưa xác định'} - ${item.roomName || 'Chưa xác định'}`,
				'Máy': `Máy ${item.machineLabel || 'Chưa xác định'}`,
				'Người báo': item.reporterName || 'Chưa xác định',
				'Loại lỗi': item.errorTypeName || 'Chưa xác định',
				'Mô tả lỗi': item.description || '',
				'Trạng thái': repairRequestStatusConfig[item.status].label,
				'Ngày báo': new Date(item.createdAt).toLocaleDateString('vi-VN')
			}))

			// Tạo workbook và worksheet
			const wb = XLSX.utils.book_new()
			const ws = XLSX.utils.json_to_sheet(excelData)

			// Thêm worksheet vào workbook
			XLSX.utils.book_append_sheet(wb, ws, 'Danh sách báo lỗi')

			// Xuất file
			const fileName = `danh-sach-bao-loi-${new Date().toISOString().split('T')[0]}.xlsx`
			XLSX.writeFile(wb, fileName)

			message.success(`Đã xuất ${selectedData.length} báo lỗi ra file ${fileName}`)
			
			// Reset selection sau khi xuất
			setSelectedRowKeys([])
		} catch (error) {
			console.error('Lỗi xuất Excel:', error)
			message.error('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	// Lọc và sắp xếp dữ liệu
	const filteredAndSortedData = useMemo(() => {
		// Reset về trang 1 khi filter thay đổi
		setCurrentPage(1)

		// Lọc dữ liệu từ API
		const filtered = repairs.filter((item: RepairRequest) => {
			const matchesSearch = searchText ? 
				[item.requestCode, item.assetName, item.ktCode, item.componentName, item.errorTypeName, item.roomName, item.buildingName]
					.filter(Boolean)
					.join(' ')
					.toLowerCase()
					.includes(searchText.toLowerCase()) : true

			const matchesStatus = statusFilter ? item.status === statusFilter : true

			const createdAt = new Date(item.createdAt)
			const matchesDateRange = dateRange && dateRange[0] && dateRange[1] ? 
				createdAt >= dateRange[0].toDate() && createdAt <= dateRange[1].toDate() : true

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
					aValue = a.assetName || ""
					bValue = b.assetName || ""
					break
				case "location":
					aValue = `${a.buildingName || ""} ${a.roomName || ""}`
					bValue = `${b.buildingName || ""} ${b.roomName || ""}`
					break
				case "reporterName":
					aValue = a.reporterName || ""
					bValue = b.reporterName || ""
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
	}, [repairs, searchText, statusFilter, dateRange, sortField, sortDirection])

	// Dữ liệu phân trang
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize
		const endIndex = startIndex + pageSize
		return filteredAndSortedData.slice(startIndex, endIndex)
	}, [filteredAndSortedData, currentPage, pageSize])

	return (
		<div className="space-y-6">
			{/* Error State */}
			{repairsError && !isLoading && (
				<Alert
					message="Lỗi tải dữ liệu"
					description={repairsError}
					type="error"
					showIcon
					closable
				/>
			)}

			{/* Main Content - Only show when not loading and no error */}
			{!repairsError && (
				<>
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
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

					<Button
						type="primary"
						icon={<Download className="w-4 h-4" />}
						onClick={handleExportExcel}
						disabled={selectedRowKeys.length === 0}
					>
						Xuất Excel ({selectedRowKeys.length})
					</Button>
				</div>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="bg-white shadow rounded-lg flex justify-center items-center py-12">
					<Spin size="large" tip="Đang tải danh sách..." />
				</div>
			) : (
				<div className="overflow-x-auto bg-white shadow rounded-lg">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									<div className="flex items-center space-x-1">
										<input
											type="checkbox"
											className="rounded border-gray-300"
											checked={paginatedData.length > 0 && paginatedData.every(row => selectedRowKeys.includes(row.id))}
											onChange={(e) => handleSelectAll(e.target.checked)}
											aria-label="Chọn tất cả báo lỗi"
										/>
										<span className="hidden sm:inline">STT</span>
									</div>
								</th>
								<th 
									className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
									onClick={() => handleSort("requestCode")}
								>
									<div className="flex items-center uppercase space-x-1 whitespace-nowrap">
										<span>Mã YC</span>
										{getSortIcon("requestCode")}
									</div>
								</th>
								<th 
									className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
									onClick={() => handleSort("assetName")}
								>
									<div className="flex items-center uppercase space-x-1 whitespace-nowrap">
										<span>Tài sản & Linh kiện</span>
										{getSortIcon("assetName")}
									</div>
								</th>
								<th 
									className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
									onClick={() => handleSort("location")}
								>
									<div className="flex items-center uppercase space-x-1 whitespace-nowrap">
										<span>Vị trí</span>
										{getSortIcon("location")}
									</div>
								</th>
								<th 
									className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group hidden xl:table-cell"
									onClick={() => handleSort("errorTypeName")}
								>
									<div className="flex items-center uppercase space-x-1 whitespace-nowrap">
										<span>Loại lỗi</span>
										{getSortIcon("errorTypeName")}
									</div>
								</th>
								<th 
									className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
									onClick={() => handleSort("status")}
								>
									<div className="flex items-center uppercase space-x-1 whitespace-nowrap">
										<span>Trạng thái</span>
										{getSortIcon("status")}
									</div>
								</th>
								<th 
									className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group hidden lg:table-cell"
									onClick={() => handleSort("createdAt")}
								>
									<div className="flex items-center uppercase space-x-1 whitespace-nowrap">
										<span>Ngày báo</span>
										{getSortIcon("createdAt")}
									</div>
								</th>
								<th className="px-1 py-2 text-center text-xs uppercase font-medium text-gray-500 tracking-wider w-10">
									
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{paginatedData.map((record, index) => {
								const config = repairRequestStatusConfig[record.status]
								return (
									<tr key={record.id} className="hover:bg-gray-50">
										<td className="px-2 py-2 text-sm text-gray-700">
											<div className="flex items-center space-x-1">
												<input
													type="checkbox"
													className="rounded border-gray-300"
													checked={selectedRowKeys.includes(record.id)}
													onChange={(e) => handleRowSelect(record.id, e.target.checked)}
													aria-label={`Chọn báo lỗi ${record.requestCode}`}
												/>
												<span className="hidden sm:inline whitespace-nowrap">{(currentPage - 1) * pageSize + index + 1}</span>
											</div>
										</td>
										<td className="px-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
											<Link href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.id}`}>
												<div className="whitespace-nowrap" title={record.requestCode}>
													{record.requestCode}
												</div>
											</Link>
										</td>
										<td className="px-2 py-2 text-sm text-gray-700">
											<div className="min-w-[180px] max-w-[250px]">
												<div className="font-medium truncate" title={record.assetName || 'Chưa xác định'}>
													{record.assetName || 'Chưa xác định'}
												</div>
												<div className="text-xs text-gray-500 truncate" title={record.componentName || 'Chưa xác định'}>
													{record.componentName || 'Chưa xác định'}
												</div>
											</div>
										</td>
										<td className="px-2 py-2 text-sm text-gray-700">
											<div className="min-w-[100px] max-w-[140px]">
												<div className="font-medium truncate" title={`${record.buildingName || 'N/A'} - ${record.roomName || 'N/A'}`}>
													{record.buildingName || 'N/A'} - {record.roomName || 'N/A'}
												</div>
												<div className="text-xs text-gray-500 truncate" title={`Máy ${record.machineLabel || 'N/A'}`}>
													Máy {record.machineLabel || 'N/A'}
												</div>
											</div>
										</td>
										<td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">
											<div className="max-w-[130px] truncate" title={record.errorTypeName || "Chưa xác định"}>
												{record.errorTypeName || "Chưa xác định"}
											</div>
										</td>
										<td className="px-2 py-2">
											<span 
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${config.color} whitespace-nowrap`} 
												title={config.label}
											>
												<span className="truncate">{config.label}</span>
											</span>
										</td>
										<td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
											<div className="whitespace-nowrap" title={new Date(record.createdAt).toLocaleDateString('vi-VN')}>
												{new Date(record.createdAt).toLocaleDateString('vi-VN')}
											</div>
										</td>
										<td className="px-1 py-2 text-center w-10">
											<Link href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.id}`}>
												<button 
													title='Xem chi tiết' 
													className="text-blue-600 hover:text-blue-900 inline-flex items-center p-1 hover:bg-blue-50 rounded"
												>
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
			)}
				</>
			)}
		</div>
	)
}



