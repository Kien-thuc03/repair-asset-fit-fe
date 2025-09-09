'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface Props {
	onFilter: (params: { q: string; status: string; dateFrom: string; dateTo: string }) => void
}

const statuses = [
	{ value: '', label: 'Tất cả trạng thái' },
	{ value: 'CHỜ_TIẾP_NHẬN', label: 'Chờ tiếp nhận' },
	{ value: 'ĐANG_XỬ_LÝ', label: 'Đang xử lý' },
	{ value: 'HOÀN_THÀNH', label: 'Đã hoàn thành' },
	{ value: 'HỦY_BỎ', label: 'Đã hủy' },
]

export default function RequestsFilters({ onFilter }: Props) {
	const [q, setQ] = useState('')
	const [status, setStatus] = useState('')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')

	// Real-time filtering effect
	useEffect(() => {
		const timer = setTimeout(() => {
			onFilter({ q, status, dateFrom, dateTo })
		}, 300) // 300ms debounce for search input

		return () => clearTimeout(timer)
	}, [q, status, dateFrom, dateTo, onFilter])

	return (
		<div className="bg-white shadow rounded-lg p-4 grid grid-cols-1 gap-4 md:grid-cols-4">
			<div className="md:col-span-2">
				<label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Mã yêu cầu, tên tài sản, vị trí..."
						className="pl-10 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					/>
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="block w-full h-8 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					title="Chọn trạng thái yêu cầu"
				>
					{statuses.map((s) => (
						<option key={s.value} value={s.value}>{s.label}</option>
					))}
				</select>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
					<input
						type="date"
						value={dateFrom}
						onChange={(e) => setDateFrom(e.target.value)}
						className="block w-full h-8 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
						title="Chọn ngày bắt đầu"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
					<input
						type="date"
						value={dateTo}
						onChange={(e) => setDateTo(e.target.value)}
						className="block w-full h-8 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
						title="Chọn ngày kết thúc"
					/>
				</div>
			</div>
		</div>
	)
}


