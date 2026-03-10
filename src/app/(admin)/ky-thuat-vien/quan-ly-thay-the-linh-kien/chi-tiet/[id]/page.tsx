"use client"

import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, Card, Tag, Descriptions, Timeline, Alert, Table, Button } from 'antd'
import { Loader2, Package, ExternalLink } from 'lucide-react'
import { useReplacementProposal } from '@/hooks/useReplacementProposals'
import { ReplacementItem } from '@/lib/api/replacement-proposals'
import { ReplacementProposalStatus } from '@/types'
import { getReplacementProposalStatusConfig } from '@/lib/constants/replacement-proposal-status'

export default function ChiTietThayThePage() {
	const params = useParams()
	const router = useRouter()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)

	// Fetch dữ liệu từ API
	const { data: request, loading, error, refetch } = useReplacementProposal(id)

	// Loading State
	if (loading) {
		return (
			<div className="space-y-4">
				<Breadcrumb
					items={[
						{ href: '/ky-thuat-vien', title: 'Trang chủ' },
						{ href: '/ky-thuat-vien/quan-ly-thay-the-linh-kien', title: 'Quản lý thay thế linh kiện' },
						{ title: 'Chi tiết' },
					]}
				/>
				<div className="flex justify-center items-center py-12">
					<Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
					<span className="text-gray-600">Đang tải thông tin đề xuất...</span>
				</div>
			</div>
		)
	}

	// Error State
	if (error) {
		return (
			<div className="space-y-4">
				<Breadcrumb
					items={[
						{ href: '/ky-thuat-vien', title: 'Trang chủ' },
						{ href: '/ky-thuat-vien/quan-ly-thay-the-linh-kien', title: 'Quản lý thay thế linh kiện' },
						{ title: 'Chi tiết' },
					]}
				/>
				<div className="flex flex-col justify-center items-center py-12">
					<p className="text-red-600 mb-4">❌ {error}</p>
					<Button type="primary" onClick={() => refetch()}>
						Thử lại
					</Button>
				</div>
			</div>
		)
	}

	// Not Found State
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

	// Lấy cấu hình trạng thái từ constant
	const currentStatus = getReplacementProposalStatusConfig(request.status)

	// Cấu hình cột cho bảng linh kiện
	const componentColumns = [
		{
			title: 'STT',
			key: 'index',
			width: 60,
			render: (_: unknown, __: unknown, index: number) => index + 1,
		},
		{
			title: 'Tên linh kiện mới',
			dataIndex: 'newItemName',
			key: 'newItemName',
			render: (text: string, record: ReplacementItem) => (
				<div>
					<div className="font-medium">{text}</div>
					{record.newItemSpecs && (
						<div className="text-sm text-gray-500">{record.newItemSpecs}</div>
					)}
				</div>
			),
		},
		{
			title: 'Linh kiện cũ',
			key: 'oldComponent',
			render: (record: ReplacementItem) => (
				<div>
					{record.oldComponent ? (
						<>
							<div className="font-medium">{record.oldComponent.name}</div>
							<div className="text-sm text-gray-500">
								{record.oldComponent.componentType}
							</div>
							{record.oldComponent.roomLocation && (
								<div className="text-xs text-gray-500">{record.oldComponent.roomLocation}</div>
							)}
						</>
					) : (
						<span className="text-gray-400">N/A</span>
					)}
				</div>
			),
		},
		{
			title: 'Mã YCSC',
			key: 'requestCode',
			width: 150,
			render: (_: unknown, record: ReplacementItem) => {
				// Hiển thị ID và mã YCSC từ requestCode của từng component
				if (record.repairRequestId || record.requestCode) {
					return (
						<div className="space-y-1">
							{record.requestCode && record.repairRequestId && (
								<button
									onClick={() => {
										router.push(`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.repairRequestId}`)
									}}
									className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
									title="Xem chi tiết yêu cầu sửa chữa"
								>
									{record.requestCode}
									<ExternalLink className="w-3 h-3" />
								</button>
							)}
							{record.requestCode && !record.repairRequestId && (
								<div className="font-mono text-sm text-blue-600">
									{record.requestCode}
								</div>
							)}
						</div>
					)
				}
				return <span className="text-gray-400 text-sm">N/A</span>
			},
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
			render: (reason: string | undefined) => (
				<div className="text-sm text-gray-700">
					{reason || 'N/A'}
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
						Người tạo: {request.proposer?.fullName || 'N/A'}
					</p>
					<p className="text-sm text-gray-500">
						{new Date(request.createdAt).toLocaleString('vi-VN')}
					</p>
				</div>
			),
		},
		...(request.status !== ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT ? [{
			color: request.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ? 'red' : 'green',
			children: (
				<div>
					<p className="font-medium">
						{request.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ? 'Từ chối đề xuất' : 'Chấp thuận đề xuất'}
					</p>
					{request.teamLeadApprover && (
						<p className="text-sm text-gray-500">
							Người duyệt: {request.teamLeadApprover.fullName}
						</p>
					)}
					<p className="text-sm text-gray-500">
						{new Date(request.updatedAt).toLocaleString('vi-VN')}
					</p>
				</div>
			),
		}] : []),
		...(request.status === ReplacementProposalStatus.ĐÃ_XÁC_MINH && request.adminVerifier ? [{
			color: 'purple',
			children: (
				<div>
					<p className="font-medium">Đã xác minh</p>
					<p className="text-sm text-gray-500">
						Người xác minh: {request.adminVerifier.fullName}
					</p>
					<p className="text-sm text-gray-500">
						{new Date(request.updatedAt).toLocaleString('vi-VN')}
					</p>
				</div>
			),
		}] : []),
		...(request.status === ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM ? [{
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
						title: `Chi tiết • ${request.proposalCode}`,
					},
				]}
			/>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
						Chi tiết đề xuất • {request.proposalCode}
					</h1>
					<p className="mt-2 text-gray-600">
						Thông tin chi tiết về đề xuất thay thế linh kiện
					</p>
				</div>
			</div>

			{/* Status Alert */}
			{request.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI && (
				<Alert
					message="Đề xuất đã bị từ chối"
					description="Đề xuất này đã bị từ chối bởi tổ trưởng"
					type="error"
					showIcon
				/>
			)}

			{request.status === ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM && (
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
									{request.proposalCode}
								</span>
							</Descriptions.Item>
						<Descriptions.Item label="Trạng thái">
							<Tag color={currentStatus.color} className="inline-flex items-center gap-1">
								<span>{currentStatus.text}</span>
							</Tag>
						</Descriptions.Item>
							<Descriptions.Item label="Tiêu đề đề xuất" span={2}>
								<div className="font-medium">{request.title || 'N/A'}</div>
							</Descriptions.Item>
							<Descriptions.Item label="Mô tả chi tiết" span={2}>
								<div className="text-gray-700 leading-relaxed">{request.description || 'Không có mô tả'}</div>
							</Descriptions.Item>
							<Descriptions.Item label="Người tạo" span={2}>
								<div className="font-medium">{request.proposer?.fullName || 'N/A'}</div>
							</Descriptions.Item>
							<Descriptions.Item label="Số lượng linh kiện" span={2}>
								<span className="font-medium text-blue-600">
									{request.items?.length || request.itemsCount || 0} linh kiện
								</span>
							</Descriptions.Item>
							{request.teamLeadApprover && (
								<Descriptions.Item label="Tổ trưởng duyệt" span={2}>
									<div className="font-medium">{request.teamLeadApprover.fullName}</div>
								</Descriptions.Item>
							)}
							{request.adminVerifier && (
								<Descriptions.Item label="Người xác minh" span={2}>
									<div className="font-medium">{request.adminVerifier.fullName}</div>
								</Descriptions.Item>
							)}
						</Descriptions>
					</Card>


					{/* Components List */}
					<Card 
						title={
							<div className="flex items-center gap-2">
								<Package className="w-5 h-5 text-gray-600" />
								<span>Danh sách linh kiện cần thay thế</span>
								<Tag color="blue" className="ml-auto">
									{request.items?.length || 0} linh kiện
								</Tag>
							</div>
						}
						className="shadow-lg"
					>
						<Table
							dataSource={request.items || []}
							columns={componentColumns}
							rowKey="id"
							pagination={false}
							size="middle"
						/>
					</Card>


					{/* Files */}
					{(request.submissionFormUrl || request.verificationReportUrl) && (
						<Card title="Tài liệu đính kèm" className="shadow">
							<div className="space-y-2">
								{request.submissionFormUrl && (
									<div>
										<a 
											href={request.submissionFormUrl} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 underline"
										>
											Tờ trình đề xuất
										</a>
									</div>
								)}
								{request.verificationReportUrl && (
									<div>
										<a 
											href={request.verificationReportUrl} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 underline"
										>
											📋 Biên bản xác minh
										</a>
									</div>
								)}
							</div>
						</Card>
					)}
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
