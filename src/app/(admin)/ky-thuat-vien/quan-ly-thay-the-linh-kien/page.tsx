"use client"

import { useState, useMemo } from 'react'
import { Breadcrumb, Input, Select, DatePicker, Table, Tag, Button, Space } from 'antd'
import { Search, Filter, Eye, Package } from 'lucide-react'
import Link from 'next/link'
import { mockReplacementRequestsForTechnician } from '@/lib/mockData/replacementRequests'
import { ReplacementStatus, ReplacementRequestItem } from '@/types'

const { RangePicker } = DatePicker
const { Option } = Select

export default function QuanLyThayTheLinhKienPage() {
	const [searchText, setSearchText] = useState('')
	const [statusFilter, setStatusFilter] = useState<ReplacementStatus | ''>('')
	const [dateRange, setDateRange] = useState<[any, any] | null>(null)

	// Lọc dữ liệu
	const filteredData = useMemo(() => {
		return mockReplacementRequestsForTechnician.filter((item: ReplacementRequestItem) => {
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
	}, [searchText, statusFilter, dateRange])

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
					<Button size="small" icon={<Eye className="w-4 h-4" />}>
						Chi tiết
					</Button>
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
								<Package className="w-4 h-4 mr-1" />
								<span>Quản lý thay thế linh kiện</span>
							</div>
						),
					},
				]}
			/>

			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
					<Package className="w-6 h-6" />
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
						}}
					>
						Xóa bộ lọc
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white shadow rounded-lg">
				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey="id"
					pagination={{
						total: filteredData.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) => 
							`${range[0]}-${range[1]} của ${total} yêu cầu`,
					}}
					scroll={{ x: 1200 }}
				/>
			</div>
		</div>
	)
}
