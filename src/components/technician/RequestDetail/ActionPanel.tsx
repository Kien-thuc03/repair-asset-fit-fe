'use client'

import { EnhancedRepairRequest, RepairStatus } from '@/types'
import { useState } from 'react'

interface Props {
	initStatus: RepairStatus
	onCreateReplacement: () => void
}

export default function ActionPanel({ initStatus, onCreateReplacement }: Props) {
	const [status, setStatus] = useState<RepairStatus>(initStatus)
	const [notes, setNotes] = useState('')

	return (
		<div className="bg-white shadow rounded-lg p-4 space-y-4">
			<h3 className="text-lg font-semibold text-gray-900">Hành động</h3>
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => setStatus(RepairStatus.ĐÃ_TIẾP_NHẬN)}
					className={`px-3 py-2 text-sm rounded-md border ${status === RepairStatus.ĐÃ_TIẾP_NHẬN ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700'}`}
				>
					Tiếp nhận xử lý
				</button>
				<button
					onClick={() => setStatus(RepairStatus.ĐANG_XỬ_LÝ)}
					className={`px-3 py-2 text-sm rounded-md border ${status === RepairStatus.ĐANG_XỬ_LÝ ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700'}`}
				>
					Bắt đầu xử lý
				</button>
				<button
					onClick={() => setStatus(RepairStatus.CHỜ_THAY_THẾ)}
					className={`px-3 py-2 text-sm rounded-md border ${status === RepairStatus.CHỜ_THAY_THẾ ? 'bg-purple-600 text-white border-purple-700' : 'bg-white text-gray-700'}`}
				>
					Chờ thay thế
				</button>
				<button
					onClick={() => setStatus(RepairStatus.ĐÃ_HOÀN_THÀNH)}
					className={`px-3 py-2 text-sm rounded-md border ${status === RepairStatus.ĐÃ_HOÀN_THÀNH ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-700'}`}
				>
					Hoàn thành
				</button>
				<button
					onClick={() => setStatus(RepairStatus.ĐÃ_HỦY)}
					className={`px-3 py-2 text-sm rounded-md border ${status === RepairStatus.ĐÃ_HỦY ? 'bg-gray-600 text-white border-gray-700' : 'bg-white text-gray-700'}`}
				>
					Hủy yêu cầu
				</button>
				<button
					onClick={onCreateReplacement}
					className="px-3 py-2 text-sm rounded-md border bg-purple-600 text-white border-purple-700"
				>
					Tạo Đề xuất Thay thế
				</button>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Ghi chú xử lý</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					rows={4}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					placeholder="Các bước đã thực hiện, kết quả kiểm tra..."
				/>
			</div>
		</div>
	)
}


