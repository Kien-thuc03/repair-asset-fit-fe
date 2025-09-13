"use client"

import { useCallback, useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { mockRepairRequests } from '@/lib/mockData/repairRequests'
import RequestsFilters from '@/components/technician/RequestsList/RequestsFilters'
import RequestsTable from '@/components/technician/RequestsList/RequestsTable'
import { Pagination } from '@/components/ui'

export default function DanhSachBaoLoiPage() {
	const [filters, setFilters] = useState<{ q: string; status: string; dateFrom: string; dateTo: string }>({ q: '', status: '', dateFrom: '', dateTo: '' })
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const handleFilter = useCallback((newFilters: { q: string; status: string; dateFrom: string; dateTo: string }) => {
		setFilters(newFilters)
		setCurrentPage(1) // Reset về trang 1 khi filter thay đổi
	}, [])

	// Dữ liệu đã lọc
	const filteredData = useMemo(() => {
		return mockRepairRequests.filter((r) => {
			const matchesQ = filters.q
				? [r.requestCode, r.assetName, r.roomName, r.buildingName, r.assetCode]
					.filter(Boolean)
					.join(' ') 
					.toLowerCase()
					.includes(filters.q.toLowerCase())
				: true
			const matchesStatus = filters.status ? r.status === filters.status : true
			const createdAt = new Date(r.createdAt)
			const matchesFrom = filters.dateFrom ? createdAt >= new Date(filters.dateFrom) : true
			const matchesTo = filters.dateTo ? createdAt <= new Date(filters.dateTo) : true
			return matchesQ && matchesStatus && matchesFrom && matchesTo
		})
	}, [filters])

	// Dữ liệu phân trang
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize
		const endIndex = startIndex + pageSize
		return filteredData.slice(startIndex, endIndex)
	}, [filteredData, currentPage, pageSize])

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

			<div>
				<h1 className="text-2xl font-bold text-gray-900">Danh sách báo lỗi</h1>
				<p className="mt-2 text-gray-600">
					Theo dõi, tìm kiếm và lọc các báo lỗi. 
				</p>
			</div>

			<RequestsFilters onFilter={handleFilter} />
			<div className="space-y-0">
				<RequestsTable data={paginatedData} />
				<Pagination
					currentPage={currentPage}
					pageSize={pageSize}
					total={filteredData.length}
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


