"use client"

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, Card, Tag, Descriptions, Button, Space, Timeline, Alert } from 'antd'
import { Package, ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { mockReplacementRequestsForTechnician } from '@/lib/mockData/replacementRequests'
import { ReplacementStatus, ReplacementRequestItem } from '@/types'

export default function ChiTietThayThePage() {
	const params = useParams()
	const router = useRouter()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)

	const request = useMemo(() => 
		mockReplacementRequestsForTechnician.find((item) => item.id === id), 
		[id]
	)

	if (!request) {
		return (
			<div className="space-y-4">
				<Breadcrumb
					items={[
						{ href: '/ky-thuat-vien', title: 'Trang chủ' },
						{ href: '/ky-thuat-vien/quan-ly-thay-the-linh-kien', title: 'Quản lý thay thế linh kiện' },
						{ title: 'Chi tiết' },
					]}
				/>
				<h1 className="text-2xl font-bold text-gray-900">Không tìm thấy đề xuất</h1>
			</div>
		)
	}

	// Cấu hình trạng thái
	const statusConfig = {
		[ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: { 
			color: 'orange', 
			text: 'Chờ Tổ trưởng duyệt',
			icon: Clock
		},
		[ReplacementStatus.CHỜ_XÁC_MINH]: { 
			color: 'blue', 
			text: 'Chờ xác minh',
			icon: AlertTriangle
		},
		[ReplacementStatus.ĐÃ_DUYỆT]: { 
			color: 'green', 
			text: 'Đã duyệt',
			icon: CheckCircle
		},
		[ReplacementStatus.ĐÃ_TỪ_CHỐI]: { 
			color: 'red', 
			text: 'Đã từ chối',
			icon: XCircle
		},
		[ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: { 
			color: 'cyan', 
			text: 'Đã hoàn tất mua sắm',
			icon: CheckCircle
		},
	}

	const currentStatus = statusConfig[request.status]

	// Timeline items
	const timelineItems = [
		{
			color: 'blue',
			children: (
				<div>
					<p className="font-medium">Tạo đề xuất thay thế</p>
					<p className="text-sm text-gray-500">
						{new Date(request.createdAt).toLocaleString('vi-VN')}
					</p>
				</div>
			),
		},
		...(request.status !== ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT ? [{
			color: request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI ? 'red' : 'green',
			children: (
				<div>
					<p className="font-medium">
						{request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI ? 'Từ chối đề xuất' : 'Chấp thuận đề xuất'}
					</p>
					<p className="text-sm text-gray-500">
						{request.approvedBy && `Người duyệt: ${request.approvedBy}`}
					</p>
					<p className="text-sm text-gray-500">
						{new Date(request.updatedAt).toLocaleString('vi-VN')}
					</p>
				</div>
			),
		}] : []),
		...(request.status === ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM ? [{
			color: 'green',
			children: (
				<div>
					<p className="font-medium">Hoàn tất mua sắm</p>
					<p className="text-sm text-gray-500">Linh kiện đã sẵn sàng để thay thế</p>
				</div>
			),
		}] : []),
	]

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<Breadcrumb
				items={[
					{
						href: '/ky-thuat-vien',
						title: 'Trang chủ',
					},
					{
						href: '/ky-thuat-vien/quan-ly-thay-the-linh-kien',
						title: (
							<div className="flex items-center gap-1">
								<Package className="w-4 h-4" />
								<span>Quản lý thay thế linh kiện</span>
							</div>
						),
					},
					{
						title: `Chi tiết • ${request.requestCode}`,
					},
				]}
			/>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
						<Package className="w-6 h-6" />
						Chi tiết đề xuất • {request.requestCode}
					</h1>
					<p className="mt-2 text-gray-600">
						Thông tin chi tiết về đề xuất thay thế linh kiện
					</p>
				</div>
			</div>

			{/* Status Alert */}
			{request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI && request.rejectedReason && (
				<Alert
					message="Đề xuất đã bị từ chối"
					description={request.rejectedReason}
					type="error"
					showIcon
				/>
			)}

			{request.status === ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM && (
				<Alert
					message="Linh kiện đã sẵn sàng"
					description="Linh kiện đã được mua sắm và sẵn sàng để thay thế. Vui lòng liên hệ để lấy linh kiện và tiến hành thay thế."
					type="success"
					showIcon
				/>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Basic Info */}
					<Card title="Thông tin cơ bản" className="shadow">
						<Descriptions column={2} bordered>
							<Descriptions.Item label="Mã đề xuất" span={1}>
								<span className="font-mono font-medium text-blue-600">
									{request.requestCode}
								</span>
							</Descriptions.Item>
							<Descriptions.Item label="Trạng thái">
								<Tag 
									color={currentStatus.color} 
									icon={<currentStatus.icon className="w-3 h-3" />}
								>
									{currentStatus.text}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Tài sản" span={2}>
								<div>
									<div className="font-medium">{request.assetName}</div>
									<div className="text-sm text-gray-500">Mã: {request.assetCode}</div>
								</div>
							</Descriptions.Item>
							<Descriptions.Item label="Vị trí" span={2}>
								<div>
									<div className="font-medium">{request.buildingName} - {request.roomName}</div>
									<div className="text-sm text-gray-500">{request.unit}</div>
								</div>
							</Descriptions.Item>
							<Descriptions.Item label="Linh kiện cần thay" span={2}>
								<div>
									<div className="font-medium">{request.componentName}</div>
									{request.componentSpecs && (
										<div className="text-sm text-gray-500">{request.componentSpecs}</div>
									)}
								</div>
							</Descriptions.Item>
						</Descriptions>
					</Card>

					{/* Reason */}
					<Card title="Lý do thay thế" className="shadow">
						<p className="text-gray-700 leading-relaxed">{request.reason}</p>
					</Card>
				</div>

				{/* Timeline */}
				<div className="lg:col-span-1">
					<Card title="Tiến trình xử lý" className="shadow">
						<Timeline items={timelineItems} />
					</Card>
				</div>
			</div>
		</div>
	)
}
