"use client"

import { useMemo, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, notification } from 'antd'
import { mockRepairRequests } from '@/lib/mockData/repairRequests'
import { RepairStatus } from '@/types'
import InfoCard from '@/components/technician/RequestDetail/InfoCard'
import ActionPanel from '@/components/technician/RequestDetail/ActionPanel'
import HistoryCard from '@/components/technician/RequestDetail/HistoryCard'


export default function RepairDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)
	const [currentRequest, setCurrentRequest] = useState<any>(null)

	const req = useMemo(() => mockRepairRequests.find((r) => r.id === id), [id])

	// Tự động cập nhật trạng thái khi xem chi tiết
	useEffect(() => {
		if (req && req.status === RepairStatus.CHỜ_TIẾP_NHẬN) {
			// Tự động chuyển trạng thái sang ĐÃ_TIẾP_NHẬN
			const updatedReq = {
				...req,
				status: RepairStatus.ĐÃ_TIẾP_NHẬN,
				acceptedAt: new Date().toISOString()
			}
			setCurrentRequest(updatedReq)
			
			// // Hiển thị thông báo
			// notification.success({
			// 	message: 'Đã tiếp nhận yêu cầu',
			// 	description: 'Yêu cầu sửa chữa đã được tự động chuyển sang trạng thái "Đã tiếp nhận"',
			// 	placement: 'topRight'
			// })
			
			// Trong thực tế, đây sẽ là API call để cập nhật trạng thái
			// await updateRepairRequestStatus(req.id, RepairStatus.ĐÃ_TIẾP_NHẬN)
		} else {
			setCurrentRequest(req)
		}
	}, [req])

	if (!currentRequest) {
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
								<span>Chi tiết • {currentRequest.requestCode}</span>
							</div>
						),
					},
				]}
			/>

			<div>
				<h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu • {currentRequest.requestCode}</h1>
				<p className="mt-2 text-gray-600">Quản lý trạng thái và ghi chú xử lý.</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-6">
					<InfoCard req={currentRequest} />
					<ActionPanel
						initStatus={currentRequest.status}
						onCreateReplacement={(parts) => {
							// In a real app, you'd likely pass this data to the replacement request page
							console.log('Creating replacement request with parts:', parts)
							router.push('/ky-thuat-vien/lap-phieu-yeu-cau-thay-the')
						}}
						onStatusUpdate={(newStatus: RepairStatus, notes: string) => {
							// Cập nhật trạng thái yêu cầu
							const updatedReq = {
								...currentRequest,
								status: newStatus,
								resolutionNotes: notes,
								...(newStatus === RepairStatus.ĐÃ_HOÀN_THÀNH && { completedAt: new Date().toISOString() })
							}
							setCurrentRequest(updatedReq)
							
							// notification.success({
							// 	message: 'Cập nhật thành công',
							// 	description: 'Trạng thái và ghi chú xử lý đã được cập nhật',
							// 	placement: 'topRight'
							// })
						}}
					/>
				</div>
				<div className="lg:col-span-1">
					<HistoryCard assetId={currentRequest.assetId} />
				</div>
			</div>
		</div>
	)
}


