"use client"

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Breadcrumb, Card, Tag, Descriptions, Timeline, Alert, Table, Button, Input, Form, message } from 'antd'
import { Clock, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import { useReplacementProposal } from '@/hooks/useReplacementProposals'
import { ReplacementItem } from '@/lib/api/replacement-proposals'
import { ReplacementProposalStatus } from '@/types'
import { replaceComponent } from '@/lib/api/components'
import { getRepairById } from '@/lib/api/repairs'
import { getComputerDetail } from '@/lib/api/computers'

export default function ChiTietThayThePage() {
	const params = useParams()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)
	const [form] = Form.useForm()

	// Fetch dữ liệu từ API
	const { data: request, loading, error, refetch } = useReplacementProposal(id)
	
	// State cho việc thay thế linh kiện
	const [replacingItemId, setReplacingItemId] = useState<string | null>(null)
	const [replaceFormVisible, setReplaceFormVisible] = useState<Record<string, boolean>>({})

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

	// Cấu hình trạng thái
	const statusConfig: Record<ReplacementProposalStatus, { color: string; text: string; icon: React.ElementType }> = {
		[ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: { 
			color: 'orange', 
			text: 'Chờ Tổ trưởng duyệt',
			icon: Clock
		},
		[ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: { 
			color: 'lime', 
			text: 'Khoa đã duyệt tờ trình',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.CHỜ_XÁC_MINH]: { 
			color: 'blue', 
			text: 'Chờ xác minh',
			icon: AlertTriangle
		},
		[ReplacementProposalStatus.ĐÃ_DUYỆT]: { 
			color: 'green', 
			text: 'Đã duyệt',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: { 
			color: 'red', 
			text: 'Đã từ chối',
			icon: XCircle
		},
		[ReplacementProposalStatus.ĐÃ_XÁC_MINH]: { 
			color: 'purple', 
			text: 'Đã xác minh',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: { 
			color: 'geekblue', 
			text: 'Đã lập tờ trình',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH]: { 
			color: 'lime', 
			text: 'Đã duyệt tờ trình',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH]: { 
			color: 'volcano', 
			text: 'Đã từ chối tờ trình',
			icon: XCircle
		},
		[ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: { 
			color: 'purple', 
			text: 'Đã gửi biên bản',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: { 
			color: 'geekblue', 
			text: 'Đã ký biên bản',
			icon: CheckCircle
		},
		[ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: { 
			color: 'cyan', 
			text: 'Đã hoàn tất mua sắm',
			icon: CheckCircle
		},
	}

	const currentStatus = statusConfig[request.status] || { 
		color: 'default', 
		text: request.status,
		icon: Clock
	}

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
							{record.requestCode && (
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

	// Hàm xử lý thay thế linh kiện
	const handleReplaceComponent = async (item: ReplacementItem) => {
		if (!request || !item.oldComponentId) {
			message.error('Thiếu thông tin linh kiện cần thay thế')
			return
		}

		try {
			setReplacingItemId(item.id)
			
			// Lấy giá trị từ form
			const formValues = form.getFieldsValue()
			const itemKey = `item_${item.id}`
			const newItemName = formValues[`${itemKey}_name`] || item.newItemName
			const newItemSpecs = formValues[`${itemKey}_specs`] || item.newItemSpecs || ''
			const serialNumber = formValues[`${itemKey}_serial`] || undefined
			const notes = formValues[`${itemKey}_notes`] || `Thay thế từ đề xuất ${request.proposalCode}: ${item.reason || 'Không có lý do'}`

			// Bước 1: Lấy computerId từ repairRequest
			let computerId: string | null = null
			
			// Thử lấy từ repairRequest đầu tiên
			if (request.repairRequests && request.repairRequests.length > 0) {
				const repairRequest = request.repairRequests[0]
				try {
					const repairDetail = await getRepairById(repairRequest.id)
					if (repairDetail?.computerAssetId) {
						// Lấy computerId từ assetId
						const computerDetail = await getComputerDetail(repairDetail.computerAssetId)
						if (computerDetail?.id) {
							computerId = computerDetail.id
						}
					}
				} catch (error) {
					console.error('Error getting repair detail:', error)
				}
			}

			if (!computerId) {
				throw new Error(
					'Không thể xác định máy tính chứa linh kiện này. Vui lòng kiểm tra lại thông tin đề xuất.'
				)
			}

			// Bước 2: Gọi API thay thế linh kiện
			await replaceComponent(computerId, {
				oldComponentId: item.oldComponentId,
				newItemName,
				newItemSpecs,
				serialNumber,
				notes,
			})

			message.success(`Đã thay thế linh kiện "${newItemName}" thành công!`)
			
			// Đóng form và refetch dữ liệu
			setReplaceFormVisible(prev => ({ ...prev, [item.id]: false }))
			await refetch()
		} catch (error) {
			console.error('Error replacing component:', error)
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi thay thế linh kiện!'
			message.error(errorMessage)
		} finally {
			setReplacingItemId(null)
		}
	}

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

			{request.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH && (
				<Alert
					message="Tờ trình đã bị từ chối"
					description="Tờ trình đề xuất này đã bị từ chối"
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
								<Tag color={currentStatus.color}>
									<div className="flex items-center gap-1">
										<currentStatus.icon className="w-3 h-3" />
										<span>{currentStatus.text}</span>
									</div>
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
						title={`Danh sách linh kiện cần thay thế (${request.items?.length || 0})`} 
						className="shadow"
					>
						<Table
							dataSource={request.items || []}
							columns={componentColumns}
							rowKey="id"
							pagination={false}
							size="middle"
						/>
					</Card>

					{/* Component Replacement Section */}
					{request.items && request.items.length > 0 && request.status === ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM && (
						<Card 
							title="Xử lý thay thế linh kiện" 
							className="shadow"
						>
							<Alert
								message="Linh kiện đã sẵn sàng"
								description="Vui lòng thực hiện thay thế linh kiện cho các linh kiện trong danh sách bên dưới. Sau khi thay thế, linh kiện cũ sẽ được chuyển sang trạng thái REMOVED và linh kiện mới sẽ có trạng thái INSTALLED."
								type="info"
								showIcon
								className="mb-4"
							/>
							<div className="space-y-4">
								{request.items.map((item) => {
									const isReplacing = replacingItemId === item.id
									const showForm = replaceFormVisible[item.id]
									const canReplace = item.oldComponentId && item.oldComponent?.status !== 'REMOVED'

									if (!canReplace) {
										return (
											<div key={item.id} className="border-l-4 border-gray-300 pl-4 py-2">
												<div className="font-medium text-gray-900">{item.newItemName}</div>
												<div className="text-gray-500 text-sm mt-1">
													{item.oldComponent?.status === 'REMOVED' 
														? '✅ Đã được thay thế' 
														: '⚠️ Không thể thay thế (thiếu thông tin linh kiện cũ)'}
												</div>
												{item.oldComponent && (
													<div className="text-xs text-gray-500 mt-1">
														Linh kiện cũ: {item.oldComponent.name} ({item.oldComponent.componentType})
													</div>
												)}
											</div>
										)
									}

									return (
										<div key={item.id} className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
											<div className="flex items-start justify-between mb-2">
												<div className="flex-1">
													<div className="font-medium text-gray-900">{item.newItemName}</div>
													{item.newItemSpecs && (
														<div className="text-sm text-gray-600 mt-1">{item.newItemSpecs}</div>
													)}
													{item.oldComponent && (
														<div className="text-xs text-gray-500 mt-1">
															Thay thế cho: <span className="font-medium">{item.oldComponent.name}</span> ({item.oldComponent.componentType})
														</div>
													)}
												</div>
												{!showForm && (
													<Button
														type="primary"
														size="small"
														icon={<RefreshCw className="w-4 h-4" />}
														onClick={() => {
															setReplaceFormVisible(prev => ({ ...prev, [item.id]: true }))
															form.setFieldsValue({
																[`item_${item.id}_name`]: item.newItemName,
																[`item_${item.id}_specs`]: item.newItemSpecs || '',
																[`item_${item.id}_serial`]: '',
																[`item_${item.id}_notes`]: `Thay thế từ đề xuất ${request.proposalCode}: ${item.reason || 'Không có lý do'}`,
															})
														}}
													>
														Thay thế
													</Button>
												)}
											</div>

											{showForm && (
												<Form
													form={form}
													layout="vertical"
													className="mt-3 bg-white p-4 rounded border"
												>
													<Form.Item
														label="Tên linh kiện mới"
														name={`item_${item.id}_name`}
														rules={[{ required: true, message: 'Vui lòng nhập tên linh kiện' }]}
													>
														<Input placeholder="Nhập tên linh kiện mới" />
													</Form.Item>

													<Form.Item
														label="Thông số kỹ thuật"
														name={`item_${item.id}_specs`}
														rules={[{ required: true, message: 'Vui lòng nhập thông số kỹ thuật' }]}
													>
														<Input.TextArea 
															rows={2} 
															placeholder="Nhập thông số kỹ thuật linh kiện mới" 
														/>
													</Form.Item>

													<Form.Item
														label="Số serial (tùy chọn)"
														name={`item_${item.id}_serial`}
													>
														<Input placeholder="Nhập số serial nếu có" />
													</Form.Item>

													<Form.Item
														label="Ghi chú"
														name={`item_${item.id}_notes`}
													>
														<Input.TextArea 
															rows={2} 
															placeholder="Ghi chú về việc thay thế" 
														/>
													</Form.Item>

													<div className="flex gap-2">
														<Button
															type="primary"
															loading={isReplacing}
															onClick={() => handleReplaceComponent(item)}
														>
															{isReplacing ? 'Đang thay thế...' : 'Xác nhận thay thế'}
														</Button>
														<Button
															onClick={() => {
																setReplaceFormVisible(prev => ({ ...prev, [item.id]: false }))
															}}
														>
															Hủy
														</Button>
													</div>
												</Form>
											)}
										</div>
									)
								})}
							</div>
						</Card>
					)}

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
											📄 Tờ trình đề xuất
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
