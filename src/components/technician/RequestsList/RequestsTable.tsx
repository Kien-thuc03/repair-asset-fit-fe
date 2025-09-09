'use client'

import { RepairRequestForList } from '@/types'
import { repairRequestStatusConfig } from '@/lib/mockData/repairRequests'
import Link from 'next/link'

interface Props {
	data: RepairRequestForList[]
}

export default function RequestsTable({ data }: Props) {
	return (
		<div className="overflow-x-auto bg-white shadow rounded-lg">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã yêu cầu</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài sản / Linh kiện</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người báo</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày báo</th>
						<th className="px-4 py-3" />
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{data.map((r) => {
						const cfg = repairRequestStatusConfig[r.status]
						return (
							<tr key={r.id} className="hover:bg-gray-50">
								<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.requestCode}</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
									<div className="flex flex-col">
										<span className="font-medium">{r.assetName}</span>
										{r.componentName ? <span className="text-xs text-gray-500">{r.componentName}</span> : null}
									</div>
								</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.buildingName} • {r.roomName}</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.reporterName}</td>
								<td className="px-4 py-3 whitespace-nowrap">
									<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cfg.color}`}>{cfg.label}</span>
								</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date(r.createdAt).toLocaleString()}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right text-sm">
									<Link href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${r.id}`} className="text-blue-600 hover:underline">Chi tiết</Link>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}


