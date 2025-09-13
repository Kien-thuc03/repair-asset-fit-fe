"use client"

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, Card, Tag, Descriptions, Button, Space, Timeline, Alert, Table } from 'antd'
import { Package, ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { mockReplacementRequestsForTechnician } from '@/lib/mockData/replacementRequests'
import { ReplacementStatus, ReplacementRequestItem, ReplacementComponent } from '@/types'

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

	// Cấu hình cột cho bảng linh kiện
	const componentColumns = [
		{
			title: 'STT',
			key: 'index',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên linh kiện',
			dataIndex: 'componentName',
			key: 'componentName',
			render: (text: string, record: ReplacementComponent) => (
				<div>
					<div className="font-medium">{text}</div>
					{record.componentSpecs && (
						<div className="text-sm text-gray-500">{record.componentSpecs}</div>
					)}
				</div>
			),
		},
		{
			title: 'Tài sản',
			key: 'asset',
			render: (record: ReplacementComponent) => (
				<div>
					<div className="font-medium">{record.assetName}</div>
					<div className="text-sm text-gray-500">Mã: {record.assetCode}</div>
				</div>
			),
		},
		{
			title: 'Vị trí',
			key: 'location',
			render: (record: ReplacementComponent) => (
				<div>
					<div className="font-medium">{record.buildingName} - {record.roomName}</div>
				</div>
			),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
			width: 100,
			render: (quantity: number) => (
				<span className="font-medium text-blue-600">
					{quantity}
				</span>
			),
		},
		{
			title: 'Lý do thay thế',
			dataIndex: 'reason',
			key: 'reason',
			render: (reason: string) => (
				<div className="text-sm text-gray-700">
					{reason}
				</div>
			),
		},
	]

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
							<Descriptions.Item label="Tiêu đề đề xuất" span={2}>
								<div className="font-medium">{request.title}</div>
							</Descriptions.Item>
							<Descriptions.Item label="Đơn vị quản lý" span={2}>
								<div className="font-medium">{request.unit}</div>
							</Descriptions.Item>
							<Descriptions.Item label="Số lượng linh kiện" span={2}>
								<span className="font-medium text-blue-600">
									{request.components.length} linh kiện
								</span>
							</Descriptions.Item>
						</Descriptions>
					</Card>

					{/* Components List */}
					<Card 
						title={`Danh sách linh kiện cần thay thế (${request.components.length})`} 
						className="shadow"
					>
						<Table
							dataSource={request.components}
							columns={componentColumns}
							rowKey="id"
							pagination={false}
							size="middle"
						/>
					</Card>

					{/* Description */}
					<Card title="Mô tả chi tiết" className="shadow">
						<p className="text-gray-700 leading-relaxed">{request.description}</p>
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
