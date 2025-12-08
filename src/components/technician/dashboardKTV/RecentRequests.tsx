'use client'

import { repairRequestStatusConfig } from '@/lib/constants/repairStatus'
import { RepairRequest } from '@/types'
import Link from 'next/link'
import { Card, Empty, Spin } from 'antd'

type Props = {
	items: RepairRequest[]
	loading?: boolean
	error?: string | null
}

export default function RecentRequests({ items, loading, error }: Props) {
	return (
		<Card>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Yêu cầu gần đây</h3>
				<Link href="/ky-thuat-vien/quan-ly-bao-loi" className="text-sm text-blue-600 hover:underline">
					Xem tất cả
				</Link>
			</div>
			{loading ? (
				<div className="flex items-center justify-center py-6">
					<Spin />
				</div>
			) : error ? (
				<Empty description={error} />
			) : items.length === 0 ? (
				<Empty description="Chưa có yêu cầu nào" />
			) : (
				<div className="divide-y divide-gray-300">
					{items.map((req: RepairRequest) => {
						const cfg = repairRequestStatusConfig[req.status]
						return (
							<Link key={req.id} href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${req.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50">
								<div>
									<p className="text-sm font-medium text-gray-900">{req.requestCode} • {req.assetName}</p>
									<p className="text-xs text-gray-500">{req.roomName} • {new Date(req.createdAt).toLocaleString()}</p>
								</div>
								<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cfg.color}`}>
									{cfg.label}
								</span>
							</Link>
						)
					})}
				</div>
			)}
		</Card>
	)
}
