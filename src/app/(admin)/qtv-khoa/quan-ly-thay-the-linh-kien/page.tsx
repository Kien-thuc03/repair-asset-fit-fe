"use client"

import { useState, useMemo } from 'react'
import { Breadcrumb, Input, Select, DatePicker, Tag } from 'antd'
import { Search, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { mockReplacementRequestItem } from '@/lib/mockData'
import { ReplacementStatus, ReplacementRequestItem, ComponentFromRequest } from '@/types'
import { Pagination } from '@/components/ui'
import type { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

type SortField = "proposalCode" | "title" | "componentsCount" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | "none"

export default function QtvKhoaQuanLyThayTheLinhKienPage() {
	const [searchText, setSearchText] = useState('')
	const [statusFilter, setStatusFilter] = useState<ReplacementStatus | ''>('')
	const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
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
		const filtered = mockReplacementRequestItem.filter((item: ReplacementRequestItem) => {
			const componentNames = item.components.map((c: ComponentFromRequest) => c.componentName).join(' ')
			const assetNames = item.components.map((c: ComponentFromRequest) => c.assetName).join(' ')
			const ktCodes = item.components.map((c: ComponentFromRequest) => c.ktCode).join(' ')
			
			const matchesSearch = searchText ? 
				[ktCodes, assetNames, componentNames, item.proposalCode, item.title]
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
				case "proposalCode":
					aValue = a.proposalCode
					bValue = b.proposalCode
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
		[ReplacementStatus.ĐÃ_XÁC_MINH]: { 
			color: 'purple', 
			text: 'Đã xác minh' 
		},
		[ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH]: { 
			color: 'geekblue', 
			text: 'Đã lập tờ trình' 
		},
		[ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH]: { 
			color: 'lime', 
			text: 'Đã duyệt tờ trình' 
		},
		[ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH]: { 
			color: 'volcano', 
			text: 'Đã từ chối tờ trình' 
		},
		[ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: { 
			color: 'cyan', 
			text: 'Đã hoàn tất mua sắm' 
		},
	}

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<Breadcrumb
				items={[
					{
						href: '/qtv-khoa',
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
						href: '/qtv-khoa/quan-ly-thay-the-linh-kien',
						title: (
							<div className="flex items-center">
								<span>Danh sách đề xuất</span>
							</div>
						),
					}
				]}
			/>

			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
					Danh sách đề xuất thay thế
				</h1>
				<p className="mt-2 text-gray-600">
					Theo dõi các đề xuất thay thế linh kiện từ kỹ thuật viên.
				</p>
			</div>

			{/* Filters & Search */}
			<div className="bg-white p-4 rounded-lg shadow space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Input
						className='col-span-1'
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
						onChange={(dates) => setDateRange(dates)}
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto bg-white shadow rounded-lg">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								STT
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("proposalCode")}
							>
								<div className="flex items-center uppercase space-x-1">
									<span>Mã đề xuất</span>
									{getSortIcon("proposalCode")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("title")}
							>
								<div className="flex items-center uppercase space-x-1">
									<span>Tiêu đề đề xuất</span>
									{getSortIcon("title")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("componentsCount")}
							>
								<div className="flex items-center uppercase space-x-1">
									<span>Số linh kiện</span>
									{getSortIcon("componentsCount")}
								</div>
							</th>
							<th 
								className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
								onClick={() => handleSort("status")}
							>
								<div className="flex items-center uppercase space-x-1">
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
							<th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-500 tracking-wider">
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{paginatedData.map((record: ReplacementRequestItem, index: number) => {
							const config = statusConfig[record.status as ReplacementStatus] || { 
								color: 'default', 
								text: record.status 
							}
							return (
								<tr key={record.id} className="hover:bg-gray-50">
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
										{(currentPage - 1) * pageSize + index + 1}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
										{record.proposalCode}
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
										<Link href={`/qtv-khoa/quan-ly-thay-the-linh-kien/chi-tiet/${record.id}`}>
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