'use client'

import { mockRepairHistoryLookup } from '@/lib/mockData/assetsLookup'

interface Props {
	assetId: string
}

export default function HistoryCard({ assetId }: Props) {
	const items = mockRepairHistoryLookup.filter((h) => h.assetId === assetId).slice(0, 8)

	return (
		<div className="bg-white shadow rounded-lg p-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-3">Lịch sử xử lý</h3>
			<div className="divide-y">
				{items.map((i) => (
					<div key={i.id} className="py-3">
						<p className="text-sm font-medium text-gray-900">{i.requestCode} • {i.errorType} • {i.status}</p>
						<p className="text-sm text-gray-600">{i.description}</p>
						<p className="text-xs text-gray-500 mt-1">{new Date(i.reportDate).toLocaleString()} • {i.technicianName}</p>
					</div>
				))}
				{items.length === 0 ? <p className="text-sm text-gray-500">Chưa có lịch sử.</p> : null}
			</div>
		</div>
	)
}


