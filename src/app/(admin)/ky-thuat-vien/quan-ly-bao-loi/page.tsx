"use client"

import { useMemo, useState } from 'react'
import { mockRepairRequestsForList } from '@/lib/mockData/repairRequests'
import RequestsFilters from '@/components/technician/RequestsList/RequestsFilters'
import RequestsTable from '@/components/technician/RequestsList/RequestsTable'

export default function DanhSachBaoLoiPage() {
	const [filters, setFilters] = useState<{ q: string; status: string; dateFrom: string; dateTo: string }>({ q: '', status: '', dateFrom: '', dateTo: '' })

	const data = useMemo(() => {
		return mockRepairRequestsForList.filter((r) => {
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

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Danh sách báo lỗi</h1>
				<p className="mt-2 text-gray-600">Theo dõi, tìm kiếm và lọc các báo lỗi.</p>
			</div>

			<RequestsFilters onFilter={setFilters} />
			<RequestsTable data={data} />
		</div>
	)
}


