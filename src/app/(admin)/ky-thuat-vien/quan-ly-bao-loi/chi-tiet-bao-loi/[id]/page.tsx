"use client"

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Breadcrumb, Steps, Tag, Card, Divider, Spin, Alert, message } from 'antd'
import { Clock, User, MapPin, Wrench, Calendar, FileText, AlertCircle, CheckCircle, Settings, Package, Monitor, Info } from 'lucide-react'
import { repairRequestStatusConfig, calculateProcessingTime } from '@/lib/constants/repairStatus'
import { RepairStatus } from '@/types'
import { ActionPanel } from '@/components/technician/requestDetailKTV'
import RepairRequestHistoryCard from '@/components/technician/requestDetailKTV/RepairRequestHistoryCard'
import ComponentReplacementSection from '@/components/technician/requestDetailKTV/ComponentReplacementSection'
import ImageViewer from '@/components/ui/ImageViewer'
import { useRepairDetailPage } from '@/hooks/useRepairs'
import { getReplacementItemsByRepairRequest } from '@/lib/api/replacement-proposals'
import { ReplacementItem } from '@/lib/api/replacement-proposals'
import { completeRepair } from '@/lib/api/repairs'
import { SuccessModal } from '@/components/modal'


export default function RepairDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)

	// Sử dụng custom hook để quản lý repair detail với auto-accept
	const {
		data: currentRequest,
		loading,
		error,
		updateStatus,
		refetch
	} = useRepairDetailPage(id, true)

	// State cho replacement items
	const [replacementItems, setReplacementItems] = useState<ReplacementItem[]>([])
	const [loadingReplacementItems, setLoadingReplacementItems] = useState(false)
	const [successModal, setSuccessModal] = useState<{
		open: boolean
		title: string
		message: string
	}>({
		open: false,
		title: '',
		message: ''
	})

	const openSuccessModal = (title: string, message: string) => {
		setSuccessModal({ open: true, title, message })
	}

	const closeSuccessModal = () => {
		setSuccessModal(prev => ({ ...prev, open: false }))
		// Sau khi đóng modal thành công, quay lại danh sách báo lỗi
		router.push('/ky-thuat-vien/quan-ly-bao-loi')
	}

	// Lấy replacement items khi repair request có status CHỜ_THAY_THẾ
	useEffect(() => {
		const fetchReplacementItems = async () => {
			if (currentRequest?.status === RepairStatus.CHỜ_THAY_THẾ) {
				setLoadingReplacementItems(true)
				try {
					const items = await getReplacementItemsByRepairRequest(id)
					setReplacementItems(items)
				} catch (error) {
					console.error('Error fetching replacement items:', error)
					// Không hiển thị lỗi nếu không có items (có thể chưa có đề xuất)
				} finally {
					setLoadingReplacementItems(false)
				}
			} else {
				setReplacementItems([])
			}
		}

		if (currentRequest) {
			fetchReplacementItems()
		}
	}, [id, currentRequest?.status])

	// Hàm kiểm tra và cập nhật trạng thái repair request khi tất cả linh kiện đã được thay thế
	const handleCheckAndCompleteRepair = async () => {
		try {
			// Refetch replacement items để cập nhật trạng thái mới nhất
			const items = await getReplacementItemsByRepairRequest(id)
			setReplacementItems(items)

			// Kiểm tra xem tất cả linh kiện đã được thay thế chưa
			const replaceableItems = items.filter(
				item => item.oldComponentId && item.oldComponent?.status !== 'REMOVED'
			)

			// Nếu tất cả linh kiện đã được thay thế và repair request đang ở trạng thái CHỜ_THAY_THẾ
			if (replaceableItems.length === 0 && currentRequest?.status === RepairStatus.CHỜ_THAY_THẾ) {
				// Tự động cập nhật trạng thái thành ĐÃ_HOÀN_THÀNH
				await completeRepair(id, 'Đã hoàn thành thay thế tất cả linh kiện')
				openSuccessModal(
					'Đã hoàn thành thay thế',
					'Tất cả linh kiện đã được thay thế và yêu cầu đã cập nhật sang ĐÃ_HOÀN_THÀNH.'
				)
				
				// Refetch repair request để cập nhật UI
				if (refetch) {
					await refetch()
				}
			}
		} catch (error) {
			console.error('Error checking and completing repair:', error)
			// Không hiển thị lỗi để tránh làm gián đoạn quá trình thay thế
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Spin size="large" />
					<p className="mt-4 text-gray-600">Đang tải thông tin yêu cầu...</p>
				</div>
			</div>
		)
	}

	if (error || !currentRequest) {
		return (
			<div className="space-y-6">
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
				<Alert
					message="Không tìm thấy yêu cầu"
					description={error || "Yêu cầu sửa chữa không tồn tại hoặc đã bị xóa."}
					type="error"
					showIcon
					action={
						<button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">
							Quay lại
						</button>
					}
				/>
			</div>
		)
	}

	const statusConfig = repairRequestStatusConfig[currentRequest.status as RepairStatus]

	// Helper function để tính bước hiện tại bao gồm cả CHỜ_THAY_THẾ
	const getCurrentStep = (status: RepairStatus): number => {
		const stepMap: Record<RepairStatus, number> = {
			[RepairStatus.CHỜ_TIẾP_NHẬN]: 0,
			[RepairStatus.ĐÃ_TIẾP_NHẬN]: 1,
			[RepairStatus.ĐANG_XỬ_LÝ]: 2,
			[RepairStatus.CHỜ_THAY_THẾ]: 3,
			[RepairStatus.ĐÃ_HOÀN_THÀNH]: 4,
			[RepairStatus.ĐÃ_HỦY]: 0, // Nếu hủy ở bước đầu
		}
		return stepMap[status] ?? 0
	}

	// Xác định status của Steps
	const getStepsStatus = (): 'wait' | 'process' | 'finish' | 'error' => {
		if (currentRequest.status === RepairStatus.ĐÃ_HỦY) return 'error'
		if (currentRequest.status === RepairStatus.ĐÃ_HOÀN_THÀNH) return 'finish'
		return 'process'
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

			{/* Header with Status */}
			<div className="bg-white shadow rounded-lg p-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<FileText className="w-8 h-8 text-blue-600" />
							{currentRequest.requestCode}
						</h1>
						<p className="mt-2 text-gray-600 flex items-center gap-2">
							<Monitor className="w-4 h-4" />
							{currentRequest.assetName} • {currentRequest.buildingName} - {currentRequest.roomName}
						</p>
					</div>
					<div className="flex flex-col items-start lg:items-end gap-2">
						<Tag 
							color={statusConfig.color.includes('yellow') ? 'orange' : 
								  statusConfig.color.includes('blue') ? 'blue' :
								  statusConfig.color.includes('green') ? 'green' :
								  statusConfig.color.includes('red') ? 'red' : 'default'}
							className="text-sm px-3 py-1"
						>
							{statusConfig.label}
						</Tag>
						<div className="text-sm text-gray-500 flex items-center gap-1">
							<Calendar className="w-4 h-4" />
							Báo lúc: {new Date(currentRequest.createdAt).toLocaleString('vi-VN')}
						</div>
					</div>
				</div>
				
				{/* Status Progress */}
				<Divider />
				<div className="mt-4">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Tiến độ xử lý</h3>
					<Steps
						current={getCurrentStep(currentRequest.status)}
						status={getStepsStatus()}
						size="small"
						items={[
							{
								title: 'Chờ tiếp nhận',
								icon: <Clock className="w-4 h-4" />,
								description: currentRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN 
									? 'Hiện tại' 
									: currentRequest.status === RepairStatus.ĐÃ_HỦY && !currentRequest.acceptedAt
									? 'Đã hủy'
									: '',
								status: currentRequest.status === RepairStatus.ĐÃ_HỦY && !currentRequest.acceptedAt ? 'error' : undefined
							},
							{
								title: 'Đã tiếp nhận',
								icon: <CheckCircle className="w-4 h-4" />,
								description: currentRequest.acceptedAt 
									? new Date(currentRequest.acceptedAt).toLocaleDateString('vi-VN')
									: currentRequest.status === RepairStatus.ĐÃ_HỦY && currentRequest.acceptedAt
									? 'Đã hủy'
									: '',
								status: currentRequest.status === RepairStatus.ĐÃ_HỦY && currentRequest.acceptedAt && !currentRequest.completedAt ? 'error' : undefined
							},
							{
								title: 'Đang xử lý',
								icon: <Settings className="w-4 h-4" />,
								description: currentRequest.status === RepairStatus.ĐANG_XỬ_LÝ 
									? 'Hiện tại' 
									: ''
							},
							{
								title: 'Chờ thay thế',
								icon: <Package className="w-4 h-4" />,
								description: currentRequest.status === RepairStatus.CHỜ_THAY_THẾ 
									? 'Hiện tại' 
									: ''
							},
							{
								title: 'Hoàn thành',
								icon: <CheckCircle className="w-4 h-4" />,
								description: currentRequest.completedAt 
									? new Date(currentRequest.completedAt).toLocaleDateString('vi-VN') 
									: ''
							}
						]}
					/>
					{/* Status-specific alerts */}
					{currentRequest.status === RepairStatus.CHỜ_THAY_THẾ && (
						<Alert
							className="mt-4"
							message="Đang chờ thay thế linh kiện"
							description="Yêu cầu đang được xử lý thay thế linh kiện. Vui lòng theo dõi tại trang Quản lý thay thế linh kiện."
							type="warning"
							icon={<Package />}
							showIcon
						/>
					)}
					{currentRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN && (
						<Alert
							className="mt-4"
							message="Yêu cầu chưa được tiếp nhận"
							description="Hệ thống sẽ tự động chuyển trạng thái sang 'Đã tiếp nhận' khi bạn xem chi tiết này."
							type="info"
							icon={<Clock />}
							showIcon
						/>
					)}
					{currentRequest.status === RepairStatus.ĐÃ_HOÀN_THÀNH && (
						<Alert
							className="mt-4"
							message="Yêu cầu đã hoàn thành"
							description={`Yêu cầu được hoàn thành lúc ${new Date(currentRequest.completedAt || '').toLocaleString('vi-VN')}. Thời gian xử lý: ${calculateProcessingTime(currentRequest.createdAt, currentRequest.completedAt)}`}
							type="success"
							icon={<CheckCircle />}
							showIcon
						/>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<div className="xl:col-span-2 space-y-6">
					{/* Enhanced Info Card */}
					<Card title={
						<div className="flex items-center gap-2">
							<Info className="w-5 h-5 text-blue-600" />
							<span>Thông tin báo lỗi</span>
						</div>
					}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Người báo lỗi</p>
									<p className="flex items-center gap-2">
										<User className="w-4 h-4 text-gray-400" />
										<span className="font-medium">{currentRequest.reporterName}</span>
										<Tag className="text-xs">{currentRequest.reporterRole}</Tag>
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Đơn vị</p>
									<p className="flex items-center gap-2">
										<Info className="w-4 h-4 text-gray-400" />
										<span className="font-medium">{currentRequest.unit}</span>
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Vị trí chi tiết</p>
									<p className="flex items-center gap-2">
										<MapPin className="w-4 h-4 text-gray-400" />
										<span className="font-medium">
											{currentRequest.buildingName} - {currentRequest.roomName} - Máy {currentRequest.machineLabel}
										</span>
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Tài sản</p>
									<p className="flex items-center gap-2">
										<Monitor className="w-4 h-4 text-gray-400" />
										<span className="font-medium">{currentRequest.ktCode} - {currentRequest.assetName}</span>
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Loại lỗi</p>
									<p className="flex items-center gap-2">
										<AlertCircle className="w-4 h-4 text-red-500" />
										<span className="font-medium">{currentRequest.errorTypeName || 'Chưa xác định'}</span>
									</p>
								</div>
								{currentRequest.assignedTechnicianName && (
									<div>
										<p className="text-sm font-medium text-gray-500 mb-1">Kỹ thuật viên phụ trách</p>
										<p className="flex items-center gap-2">
											<Wrench className="w-4 h-4 text-blue-500" />
											<span className="font-medium">{currentRequest.assignedTechnicianName}</span>
										</p>
									</div>
								)}
							</div>
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-gray-500 mb-1">Mô tả chi tiết</p>
									<div className="bg-gray-50 p-3 rounded-md">
										<p className="text-sm whitespace-pre-wrap">{currentRequest.description}</p>
									</div>
								</div>
								
								{/* Thông tin thời gian */}
								<div>
									<p className="text-sm font-medium text-gray-500 mb-2">Thông tin thời gian</p>
									<div className="bg-gray-50 p-3 rounded-md space-y-2">
										<div className="flex items-center gap-2 text-sm">
											<Calendar className="w-4 h-4 text-gray-400" />
											<span className="font-medium">Thời gian báo lỗi:</span>
											<span>{new Date(currentRequest.createdAt).toLocaleString('vi-VN')}</span>
										</div>
										{currentRequest.acceptedAt && (
											<div className="flex items-center gap-2 text-sm">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span className="font-medium">Thời gian tiếp nhận:</span>
												<span>{new Date(currentRequest.acceptedAt).toLocaleString('vi-VN')}</span>
											</div>
										)}
										{currentRequest.completedAt && (
											<div className="flex items-center gap-2 text-sm">
												<CheckCircle className="w-4 h-4 text-blue-500" />
												<span className="font-medium">Thời gian hoàn thành:</span>
												<span>{new Date(currentRequest.completedAt).toLocaleString('vi-VN')}</span>
											</div>
										)}
									</div>
								</div>

								{currentRequest.resolutionNotes && (
									<div>
										<p className="text-sm font-medium text-gray-500 mb-1">Ghi chú xử lý</p>
										<div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
										  <p className="text-sm">{currentRequest.resolutionNotes}</p>
										</div>
									</div>
								)}
							</div>
						</div>
						
						{/* Media Files */}
						{currentRequest.mediaUrls && currentRequest.mediaUrls.length > 0 && (
							<>
								<Divider />
								<div>
									<p className="text-sm font-medium text-gray-500 mb-3">
										Hình ảnh minh họa ({currentRequest.mediaUrls.length} ảnh)
									</p>
									<ImageViewer 
										images={currentRequest.mediaUrls}
										showDownload={true}
										title="Hình ảnh minh họa lỗi"
										className="w-full"
									/>
								</div>
							</>
						)}
					</Card>

					{/* Component Replacement Section */}
					{currentRequest.status === RepairStatus.CHỜ_THAY_THẾ && (
						<ComponentReplacementSection
							repairRequestId={id}
							items={replacementItems}
							onReplaced={handleCheckAndCompleteRepair}
						/>
					)}

					<ActionPanel
						initStatus={currentRequest.status}
						assetId={currentRequest.computerAssetId} // Truyền computerAssetId (assetId)
						errorTypeName={currentRequest.errorTypeName} // Truyền errorTypeName để xác định loại lỗi
						onCreateReplacement={() => {
							// Chuyển đến trang quản lý báo lỗi
							router.push('/ky-thuat-vien/quan-ly-bao-loi')
						}}
						onStatusUpdate={async (
							newStatus: RepairStatus,
							notes: string,
							componentIds?: string[],
							options?: { showSuccessModal?: boolean }
						) => {
							try {
								await updateStatus(newStatus, notes, componentIds)
								if (options?.showSuccessModal !== false) {
									openSuccessModal(
										'Cập nhật thành công',
										'Trạng thái yêu cầu đã được lưu lại. Tiếp tục theo dõi tiến độ hoặc chuyển sang bước tiếp theo nếu cần.'
									)
								}
							} catch (err) {
								console.error('Update status error:', err)
								message.error(err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại')
							}
						}}
					/>
				</div>
				<div className="xl:col-span-1">
					<RepairRequestHistoryCard repairRequestId={currentRequest.id} />
				</div>
			</div>

			<SuccessModal
				isOpen={successModal.open}
				onClose={closeSuccessModal}
				title={successModal.title}
				message={successModal.message}
			/>
		</div>
	)
}