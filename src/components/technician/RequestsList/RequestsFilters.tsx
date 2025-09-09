'use client'

import { useMemo, useState } from 'react'

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

	return (
		<div className="bg-white shadow rounded-lg p-4 grid grid-cols-1 gap-4 md:grid-cols-5">
			<div className="md:col-span-2">
				<label className="block text-sm font-medium text-gray-700">Tìm kiếm</label>
				<input
					type="text"
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="Mã yêu cầu, tên tài sản, vị trí"
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Trạng thái</label>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					title="Chọn trạng thái yêu cầu"
				>
					{statuses.map((s) => (
						<option key={s.value} value={s.value}>{s.label}</option>
					))}
				</select>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Từ ngày</label>
				<input
					type="date"
					value={dateFrom}
					onChange={(e) => setDateFrom(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					title="Chọn ngày bắt đầu"
					placeholder="yyyy-mm-dd"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Đến ngày</label>
				<input
					type="date"
					value={dateTo}
					onChange={(e) => setDateTo(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					title="Chọn ngày kết thúc"
					placeholder="yyyy-mm-dd"
				/>
			</div>
			<div className="flex items-end">
				<button
					onClick={() => onFilter({ q, status, dateFrom, dateTo })}
					className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Áp dụng
				</button>
			</div>
		</div>
	)
}


