"use client"

import { useState, useMemo } from 'react'
import { Breadcrumb, Input, Select, DatePicker, Tag, Button } from 'antd'
import { Search, Filter, Eye, Package, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { mockReplacementRequestsForTechnician } from '@/lib/mockData/replacementRequests'
import { ReplacementStatus, ReplacementRequestItem, ReplacementComponent } from '@/types'
import { Pagination } from '@/components/ui'

const { RangePicker } = DatePicker
const { Option } = Select

type SortField = "requestCode" | "title" | "componentsCount" | "totalCost" | "status" | "createdAt"
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
			const componentNames = item.components.map(c => c.componentName).join(' ')
			const assetNames = item.components.map(c => c.assetName).join(' ')
			const assetCodes = item.components.map(c => c.assetCode).join(' ')
			
			const matchesSearch = searchText ? 
				[assetCodes, assetNames, componentNames, item.requestCode, item.title]
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
				case "title":
					aValue = a.title
					bValue = b.title
					break
				case "componentsCount":
					aValue = a.components.length
					bValue = b.components.length
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
			title: 'Tiêu đề đề xuất',
			key: 'title',
			width: 250,
			render: (_: any, record: ReplacementRequestItem) => (
				<div>
					<div className="font-medium">{record.title}</div>
					<div className="text-xs text-gray-500 line-clamp-2">{record.description}</div>
				</div>
			),
		},
		{
			title: 'Số linh kiện',
			key: 'componentsCount',
			width: 100,
			render: (_: any, record: ReplacementRequestItem) => (
				<div className="text-center">
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						{record.components.length} linh kiện
					</span>
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
					Danh sách đề xuất thay thế
				</h1>
				<p className="mt-2 text-gray-600">
					Quản lý và theo dõi các đề xuất thay thế linh kiện đã được tạo.
				</p>
			</div>

			{/* Filters & Search */}
			<div className="bg-white p-4 rounded-lg shadow space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Input
					className='col-span-1 md:col-span-2'
						placeholder="Tìm kiếm theo mã đề xuất, tiêu đề, tên tài sản, linh kiện..."
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
								onClick={() => handleSort("title")}
							>
								<div className="flex items-center space-x-1">
									<span>Tiêu đề đề xuất</span>
									{getSortIcon("title")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("componentsCount")}
							>
								<div className="flex items-center space-x-1">
									<span>Số linh kiện</span>
									{getSortIcon("componentsCount")}
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
									<td className="px-4 py-3 text-sm text-gray-700">
										<div>
											<div className="font-medium">{record.title}</div>
											<div className="text-xs text-gray-500 line-clamp-2 mt-1">{record.description}</div>
										</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{record.components.length} linh kiện
										</span>
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
