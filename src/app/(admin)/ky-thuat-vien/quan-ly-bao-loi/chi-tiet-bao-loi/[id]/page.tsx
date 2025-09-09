"use client"

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb } from 'antd'
import { mockRepairRequests } from '@/lib/mockData/repairRequests'
import InfoCard from '@/components/technician/RequestDetail/InfoCard'
import ActionPanel from '@/components/technician/RequestDetail/ActionPanel'
import HistoryCard from '@/components/technician/RequestDetail/HistoryCard'


export default function RepairDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)

	const req = useMemo(() => mockRepairRequests.find((r) => r.id === id), [id])

	if (!req) {
		return (
			<div className="space-y-4">
				{/* Breadcrumb for not found */}
				<Breadcrumb
					items={[
						{
							href: '/ky-thuat-vien',
							title: (
								<div className="flex items-center">
									<span>Trang chủ</span>
								</div>
							),
						},
						{
							href: '/ky-thuat-vien/quan-ly-bao-loi',
							title: (
								<div className="flex items-center">
									<span>Quản lý báo lỗi</span>
								</div>
							),
						},
						{
							title: (
								<div className="flex items-center">
									<span>Chi tiết</span>
								</div>
							),
						},
					]}
				/>
				<h1 className="text-2xl font-bold text-gray-900">Không tìm thấy yêu cầu</h1>
				<button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">Quay lại</button>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<Breadcrumb
				items={[
					{
						href: '/ky-thuat-vien',
						title: (
							<div className="flex items-center">
								<span>Trang chủ</span>
							</div>
						),
					},
					{
						href: '/ky-thuat-vien/quan-ly-bao-loi',
						title: (
							<div className="flex items-center">
								<span>Quản lý báo lỗi</span>
							</div>
						),
					},
					{
						title: (
							<div className="flex items-center">
								<span>Chi tiết • {req.requestCode}</span>
							</div>
						),
					},
				]}
			/>

			<div>
				<h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu • {req.requestCode}</h1>
				<p className="mt-2 text-gray-600">Quản lý trạng thái và ghi chú xử lý.</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-6">
					<InfoCard req={req} />
					<ActionPanel
						initStatus={req.status}
						onCreateReplacement={() => router.push('/ky-thuat-vien/lap-phieu-yeu-cau-thay-the')}
					/>
				</div>
				<div className="lg:col-span-1">
					<HistoryCard assetId={req.assetId} />
				</div>
			</div>
		</div>
	)
}


