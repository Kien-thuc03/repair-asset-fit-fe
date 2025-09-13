"use client"

import { useState, useMemo } from 'react'
import { Breadcrumb, Input, Select, DatePicker, Tag, Button } from 'antd'
import { Search, Filter, Eye, Package, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { mockReplacementRequestsForTechnician } from '@/lib/mockData/replacementRequests'
import { ReplacementStatus, ReplacementRequestItem } from '@/types'
import { Pagination } from '@/components/ui'

const { RangePicker } = DatePicker
const { Option } = Select

type SortField = "requestCode" | "assetName" | "componentName" | "location" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | "none"

export default function QuanLyThayTheLinhKienPage() {
	const [searchText, setSearchText] = useState('')
	const [statusFilter, setStatusFilter] = useState<ReplacementStatus | ''>('')
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
		const filtered = mockReplacementRequestsForTechnician.filter((item: ReplacementRequestItem) => {
			const matchesSearch = searchText ? 
				[item.assetCode, item.assetName, item.componentName, item.requestCode]
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
				case "componentName":
					aValue = a.componentName
					bValue = b.componentName
					break
				case "location":
					aValue = `${a.buildingName} ${a.roomName}`
					bValue = `${b.buildingName} ${b.roomName}`
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

	// Cấu hình trạng thái
	const statusConfig = {
		[ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: { 
			color: 'orange', 
			text: 'Chờ Tổ trưởng duyệt' 
		},
		[ReplacementStatus.CHỜ_XÁC_MINH]: { 
			color: 'blue', 
			text: 'Chờ xác minh' 
		},
		[ReplacementStatus.ĐÃ_DUYỆT]: { 
			color: 'green', 
			text: 'Đã duyệt' 
		},
		[ReplacementStatus.ĐÃ_TỪ_CHỐI]: { 
			color: 'red', 
			text: 'Đã từ chối' 
		},
		[ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: { 
			color: 'cyan', 
			text: 'Đã hoàn tất mua sắm' 
		},
	}

	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: 'requestCode',
			key: 'requestCode',
			width: 120,
			render: (text: string) => (
				<span className="font-medium text-blue-600">{text}</span>
			),
		},
		{
			title: 'Tài sản',
			key: 'asset',
			width: 200,
			render: (_: any, record: ReplacementRequestItem) => (
				<div>
					<div className="font-medium">{record.assetName}</div>
					<div className="text-xs text-gray-500">Mã: {record.assetCode}</div>
				</div>
			),
		},
		{
			title: 'Linh kiện cần thay',
			key: 'component',
			width: 180,
			render: (_: any, record: ReplacementRequestItem) => (
				<div>
					<div className="font-medium">{record.componentName}</div>
					<div className="text-xs text-gray-500">{record.componentSpecs}</div>
				</div>
			),
		},
		{
			title: 'Vị trí',
			key: 'location',
			width: 120,
			render: (_: any, record: ReplacementRequestItem) => (
				<div>
					<div className="font-medium">{record.buildingName}</div>
					<div className="text-xs text-gray-500">{record.roomName}</div>
				</div>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 140,
			render: (status: ReplacementStatus) => {
				const config = statusConfig[status]
				return <Tag color={config.color}>{config.text}</Tag>
			},
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 110,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 80,
			render: (_: any, record: ReplacementRequestItem) => (
				<Link href={`/ky-thuat-vien/quan-ly-thay-the-linh-kien/chi-tiet/${record.id}`}>
					<button 
					title='Xem chi tiết' 
					className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                        <Eye className="w-4 h-4" />
					</button>
				</Link>
			),
		},
	]

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
								<span>Quản lý thay thế linh kiện</span>
							</div>
						),
					},
				]}
			/>

			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
					Quản lý thay thế linh kiện
				</h1>
				<p className="mt-2 text-gray-600">
					Theo dõi và quản lý các yêu cầu thay thế linh kiện từ báo cáo lỗi.
				</p>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg shadow space-y-4">
				<div className="flex items-center gap-2 mb-3">
					<Filter className="w-4 h-4" />
					<span className="font-medium">Bộ lọc</span>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Input
						placeholder="Tìm kiếm theo mã, tên tài sản, linh kiện..."
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
						<Option value={ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT}>
							Chờ Tổ trưởng duyệt
						</Option>
						<Option value={ReplacementStatus.CHỜ_XÁC_MINH}>
							Chờ xác minh
						</Option>
						<Option value={ReplacementStatus.ĐÃ_DUYỆT}>
							Đã duyệt
						</Option>
						<Option value={ReplacementStatus.ĐÃ_TỪ_CHỐI}>
							Đã từ chối
						</Option>
						<Option value={ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM}>
							Đã hoàn tất mua sắm
						</Option>
					</Select>
					
					<RangePicker
						placeholder={['Từ ngày', 'Đến ngày']}
						format="DD/MM/YYYY"
						value={dateRange}
						onChange={setDateRange}
					/>

					<Button 
						onClick={() => {
							setSearchText('')
							setStatusFilter('')
							setDateRange(null)
							setSortField('')
							setSortDirection('none')
							setCurrentPage(1)
						}}
					>
						Xóa bộ lọc
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto bg-white shadow rounded-lg">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("requestCode")}
							>
								<div className="flex items-center space-x-1">
									<span>Mã yêu cầu</span>
									{getSortIcon("requestCode")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("assetName")}
							>
								<div className="flex items-center space-x-1">
									<span>Tài sản</span>
									{getSortIcon("assetName")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("componentName")}
							>
								<div className="flex items-center space-x-1">
									<span>Linh kiện cần thay</span>
									{getSortIcon("componentName")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("location")}
							>
								<div className="flex items-center space-x-1">
									<span>Vị trí</span>
									{getSortIcon("location")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("status")}
							>
								<div className="flex items-center space-x-1">
									<span>Trạng thái</span>
									{getSortIcon("status")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("createdAt")}
							>
								<div className="flex items-center space-x-1">
									<span>Ngày tạo</span>
									{getSortIcon("createdAt")}
								</div>
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{paginatedData.map((record) => {
							const config = statusConfig[record.status]
							return (
								<tr key={record.id} className="hover:bg-gray-50">
									<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
										{record.requestCode}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
										<div>
											<div className="font-medium">{record.assetName}</div>
											<div className="text-xs text-gray-500">Mã: {record.assetCode}</div>
										</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
										<div>
											<div className="font-medium">{record.componentName}</div>
											{record.componentSpecs && (
												<div className="text-xs text-gray-500">{record.componentSpecs}</div>
											)}
										</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
										<div>
											<div className="font-medium">{record.buildingName}</div>
											<div className="text-xs text-gray-500">{record.roomName}</div>
										</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										<Tag color={config.color}>{config.text}</Tag>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
										{new Date(record.createdAt).toLocaleDateString('vi-VN')}
									</td>
									<td className="px-4 py-3 items-center whitespace-nowrap text-right text-sm">
										<Link href={`/ky-thuat-vien/quan-ly-thay-the-linh-kien/chi-tiet/${record.id}`}>
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
