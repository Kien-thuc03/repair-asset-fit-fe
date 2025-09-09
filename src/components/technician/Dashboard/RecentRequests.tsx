'use client'

import { mockRepairRequests, repairRequestStatusConfig } from '@/lib/mockData/repairRequests'
import Link from 'next/link'

export default function RecentRequests() {
	const items = mockRepairRequests
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 6)

	return (
		<div className="bg-white shadow rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-medium leading-6 text-gray-900">Yêu cầu gần đây</h3>
					<Link href="/ky-thuat-vien/quan-ly-bao-loi" className="text-sm text-blue-600 hover:underline">
						Xem tất cả
					</Link>
				</div>
				<div className="divide-y">
					{items.map((req) => {
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
			</div>
		</div>
	)
}


