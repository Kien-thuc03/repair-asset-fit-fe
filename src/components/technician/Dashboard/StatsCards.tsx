'use client'

import { mockRepairRequests } from '@/lib/mockData/repairRequests'
import { FileCheck, AlertTriangle, Clock } from 'lucide-react'

function countByStatus(status: string) {
	return mockRepairRequests.filter((r) => r.status === status).length
}

export default function StatsCards() {
	const waitingCount = countByStatus('CHỜ_TIẾP_NHẬN')
	const inProgressCount = countByStatus('ĐANG_XỬ_LÝ')
	const waitingReplacementCount = 0 // Chưa có mẫu trong mock, giữ 0 để hiển thị

	const items = [
		{
			label: 'Chờ tiếp nhận',
			value: waitingCount,
			icon: Clock,
			color: 'bg-yellow-500',
		},
		{
			label: 'Đang xử lý',
			value: inProgressCount,
			icon: AlertTriangle,
			color: 'bg-blue-500',
		},
		{
			label: 'Chờ thay thế',
			value: waitingReplacementCount,
			icon: FileCheck,
			color: 'bg-purple-500',
		},
	]

	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{items.map((item) => (
				<div
					key={item.label}
					className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
				>
					<div className={`absolute rounded-md ${item.color} p-3`}>
						<item.icon className="h-6 w-6 text-white" aria-hidden="true" />
					</div>
					<p className="ml-16 truncate text-sm font-medium text-gray-500">{item.label}</p>
					<div className="ml-16 flex items-baseline">
						<p className="text-2xl font-semibold text-gray-900">{item.value}</p>
					</div>
				</div>
			))}
		</div>
	)
}


