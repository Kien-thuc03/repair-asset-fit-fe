'use client'

import { getRepairRequestsByStatus } from '@/lib/mockData'
import { RepairStatus } from '@/types'
import { FileCheck, AlertTriangle, Clock } from 'lucide-react'

export default function StatsCards() {
	const waitingCount = getRepairRequestsByStatus(RepairStatus.CHỜ_TIẾP_NHẬN).length
	const inProgressCount = getRepairRequestsByStatus(RepairStatus.ĐANG_XỬ_LÝ).length
	const waitingReplacementCount = getRepairRequestsByStatus(RepairStatus.CHỜ_THAY_THẾ).length

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