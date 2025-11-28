"use client"

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Breadcrumb, Card, Tag, Descriptions, Timeline, Alert, Table, Button, Input, Form, message } from 'antd'
import { Clock, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw, Package, ArrowRight, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useReplacementProposal } from '@/hooks/useReplacementProposals'
import { ReplacementItem } from '@/lib/api/replacement-proposals'
import { ReplacementProposalStatus } from '@/types'
import { replaceComponent, getComponentById } from '@/lib/api/components'

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

			// Bước 1: Lấy computerId trực tiếp từ oldComponent
			// Đây là cách chính xác nhất vì mỗi component đã có computerAssetId (chính là computer.id)
			let computerId: string | null = null
			
			if (item.oldComponentId) {
				try {
					// Lấy thông tin component và computer của nó
					const componentDetail = await getComponentById(item.oldComponentId)
					if (componentDetail?.computer?.id) {
						computerId = componentDetail.computer.id
					}
				} catch (error) {
					console.error('Error getting component detail:', error)
					// Fallback: Thử lấy từ repairRequest nếu có
					if (request.repairRequests && request.repairRequests.length > 0) {
						const repairRequest = request.repairRequests[0]
						try {
							const { getRepairById } = await import('@/lib/api/repairs')
							const { getComputerDetail } = await import('@/lib/api/computers')
							const repairDetail = await getRepairById(repairRequest.id)
							if (repairDetail?.computerAssetId) {
								const computerDetail = await getComputerDetail(repairDetail.computerAssetId)
								if (computerDetail?.id) {
									computerId = computerDetail.id
								}
							}
						} catch (fallbackError) {
							console.error('Error in fallback method:', fallbackError)
						}
					}
				}
			}

			if (!computerId) {
				throw new Error(
					'Không thể xác định máy tính chứa linh kiện này. Vui lòng kiểm tra lại thông tin linh kiện cũ.'
				)
			}

			// Bước 2: Gọi API thay thế linh kiện
			await replaceComponent(computerId, {
				oldComponentId: item.oldComponentId,
				newItemName,
				newItemSpecs,
				serialNumber,
				notes,
				// Nếu có linh kiện mới đã được mua sắm, gửi ID để cập nhật thay vì tạo mới
				newlyPurchasedComponentId: item.newlyPurchasedComponentId,
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

					{/* Component Replacement Section */}
					{request.items && request.items.length > 0 && request.status === ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM && (
						<Card 
							title={
								<div className="flex items-center gap-2">
									<Package className="w-5 h-5 text-blue-600" />
									<span>Xử lý thay thế linh kiện</span>
									<Tag color="blue" className="ml-auto">
										{request.items.filter(item => item.oldComponentId && item.oldComponent?.status !== 'REMOVED').length} cần thay thế
									</Tag>
								</div>
							}
							className="shadow-lg border-2 border-blue-100"
						>
							<Alert
								message="Linh kiện đã sẵn sàng để thay thế"
								description={
									<div className="mt-2">
										<p className="mb-1">Vui lòng thực hiện thay thế linh kiện cho các linh kiện trong danh sách bên dưới.</p>
										<ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
											<li>Linh kiện cũ sẽ được chuyển sang trạng thái <strong>REMOVED</strong></li>
											<li>Linh kiện mới sẽ có trạng thái <strong>INSTALLED</strong></li>
											<li>Hệ thống sẽ tự động cập nhật thời gian và log liên quan</li>
										</ul>
									</div>
								}
								type="info"
								icon={<Info className="w-5 h-5" />}
								className="mb-6"
							/>
							<div className="space-y-4">
								{request.items.map((item) => {
									const isReplacing = replacingItemId === item.id
									const showForm = replaceFormVisible[item.id]
									const canReplace = item.oldComponentId && item.oldComponent?.status !== 'REMOVED'
									const isReplaced = item.oldComponent?.status === 'REMOVED'

									if (!canReplace) {
										return (
											<div 
												key={item.id} 
												className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50 transition-all hover:shadow-md"
											>
												<div className="flex items-start gap-3">
													<div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
														isReplaced ? 'bg-green-100' : 'bg-yellow-100'
													}`}>
														{isReplaced ? (
															<CheckCircle2 className="w-6 h-6 text-green-600" />
														) : (
															<AlertCircle className="w-6 h-6 text-yellow-600" />
														)}
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between gap-3 mb-2">
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 flex-wrap mb-1">
																	<h4 className="font-semibold text-gray-900 text-base">{item.newItemName}</h4>
																	{isReplaced && (
																		<Tag color="success" icon={<CheckCircle2 className="w-3 h-3" />}>
																			Đã thay thế
																		</Tag>
																	)}
																	{item.repairRequestId && item.requestCode && (
																		<Tag color="blue" className="font-mono text-xs">
																			{item.requestCode}
																		</Tag>
																	)}
																</div>
																{item.newItemSpecs && (
																	<p className="text-sm text-gray-600 mb-2">{item.newItemSpecs}</p>
																)}
															</div>
														</div>
														<div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs ${
															isReplaced 
																? 'bg-green-50 text-green-700' 
																: 'bg-yellow-50 text-yellow-700'
														}`}>
															{isReplaced ? (
																<>
																	<CheckCircle2 className="w-3.5 h-3.5" />
																	<span>Đã được thay thế thành công</span>
																</>
															) : (
																<>
																	<AlertCircle className="w-3.5 h-3.5" />
																	<span>Không thể thay thế (thiếu thông tin linh kiện cũ)</span>
																</>
															)}
														</div>
														{item.oldComponent && (
															<div className="mt-2 pt-2 border-t border-gray-200">
																<p className="text-xs text-gray-500">
																	Linh kiện cũ: <span className="font-medium text-gray-700">{item.oldComponent.name}</span> ({item.oldComponent.componentType})
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
										)
									}

									return (
										<div 
											key={item.id} 
											className={`relative border-2 rounded-lg p-4 transition-all duration-300 ${
												showForm 
													? 'border-blue-400 bg-blue-50 shadow-lg' 
													: 'border-blue-200 bg-white hover:border-blue-300 hover:shadow-md'
											}`}
										>
											{/* Header Section */}
											<div className="flex items-start gap-3 mb-3">
												<div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
													<Package className="w-5 h-5 text-blue-600" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-3 mb-2">
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 flex-wrap mb-1">
																<h4 className="font-semibold text-gray-900 text-base">{item.newItemName}</h4>
																{item.repairRequestId && item.requestCode && (
																	<Tag color="blue" className="font-mono text-xs">
																		{item.requestCode}
																	</Tag>
																)}
															</div>
															{item.newItemSpecs && (
																<p className="text-sm text-gray-600 mb-2">{item.newItemSpecs}</p>
															)}
															{item.oldComponent && (
																<div className="flex items-center gap-2 text-sm flex-wrap">
																	<span className="text-gray-500">Thay thế cho:</span>
																	<span className="font-medium text-gray-900">{item.oldComponent.name}</span>
																	<Tag color="default" className="text-xs">{item.oldComponent.componentType}</Tag>
																</div>
															)}
														</div>
														{!showForm && (
															<Button
																type="primary"
																size="middle"
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
																className="shrink-0"
															>
																Bắt đầu thay thế
															</Button>
														)}
													</div>
												</div>
											</div>

											{/* Form Section */}
											{showForm && (
												<div className="mt-4 pt-4 border-t-2 border-blue-200">
													<div className="mb-3 flex items-center gap-2 text-blue-700">
														<Info className="w-4 h-4" />
														<span className="text-sm font-medium">Điền thông tin linh kiện mới</span>
													</div>
													
													{/* Comparison View - Compact */}
													<div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
														<div className="flex items-center gap-3">
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
																	<Package className="w-3.5 h-3.5 text-red-500" />
																	Linh kiện cũ
																</div>
																{item.oldComponent && (
																	<>
																		<p className="font-semibold text-sm text-gray-900 truncate">{item.oldComponent.name}</p>
																		{item.oldComponent.componentSpecs && (
																			<p className="text-xs text-gray-600 truncate">{item.oldComponent.componentSpecs}</p>
																		)}
																		<Tag color="red" className="text-xs mt-1">{item.oldComponent.status}</Tag>
																	</>
																)}
															</div>
															<div className="shrink-0 px-2">
																<ArrowRight className="w-5 h-5 text-blue-400" />
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
																	<Package className="w-3.5 h-3.5 text-green-500" />
																	Linh kiện mới
																</div>
																<p className="text-xs text-gray-500 italic">Sẽ được cập nhật sau khi điền form</p>
															</div>
														</div>
													</div>

													<Form
														form={form}
														layout="vertical"
														className="space-y-3"
													>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
															<Form.Item
																label={<span className="font-medium text-sm">Tên linh kiện mới <span className="text-red-500">*</span></span>}
																name={`item_${item.id}_name`}
																rules={[{ required: true, message: 'Vui lòng nhập tên linh kiện' }]}
																className="mb-0"
															>
																<Input 
																	placeholder="Nhập tên linh kiện mới" 
																	size="middle"
																	prefix={<Package className="w-4 h-4 text-gray-400" />}
																/>
															</Form.Item>

															<Form.Item
																label={<span className="font-medium text-sm">Số serial (tùy chọn)</span>}
																name={`item_${item.id}_serial`}
																className="mb-0"
															>
																<Input 
																	placeholder="Nhập số serial nếu có" 
																	size="middle"
																/>
															</Form.Item>
														</div>

														<Form.Item
															label={<span className="font-medium text-sm">Thông số kỹ thuật <span className="text-red-500">*</span></span>}
															name={`item_${item.id}_specs`}
															rules={[{ required: true, message: 'Vui lòng nhập thông số kỹ thuật' }]}
															className="mb-0"
														>
															<Input.TextArea 
																rows={2} 
																placeholder="Nhập thông số kỹ thuật linh kiện mới" 
																className="resize-none"
															/>
														</Form.Item>

														<Form.Item
															label={<span className="font-medium text-sm">Ghi chú</span>}
															name={`item_${item.id}_notes`}
															className="mb-0"
														>
															<Input.TextArea 
																rows={2} 
																placeholder="Ghi chú về việc thay thế (tùy chọn)" 
																className="resize-none"
															/>
														</Form.Item>

														<div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
															<Button
																size="middle"
																onClick={() => {
																	setReplaceFormVisible(prev => ({ ...prev, [item.id]: false }))
																}}
															>
																Hủy
															</Button>
															<Button
																type="primary"
																size="middle"
																loading={isReplacing}
																icon={!isReplacing && <CheckCircle className="w-4 h-4" />}
																onClick={() => handleReplaceComponent(item)}
															>
																{isReplacing ? 'Đang xử lý...' : 'Xác nhận thay thế'}
															</Button>
														</div>
													</Form>
												</div>
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
