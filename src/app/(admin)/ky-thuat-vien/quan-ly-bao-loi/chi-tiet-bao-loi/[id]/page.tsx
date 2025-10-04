"use client"

import { useMemo, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, Steps, Tag, Card, Divider, Spin, Alert } from 'antd'
import { Clock, User, MapPin, Wrench, Calendar, FileText, AlertCircle, CheckCircle, Settings, Package, Monitor, Info } from 'lucide-react'
import { mockRepairRequests, repairRequestStatusConfig } from '@/lib/mockData'
import { RepairStatus, RepairRequest } from '@/types'
import { ActionPanel, HistoryCard } from '@/components/technician/requestDetailKTV'
import ImageViewer from '@/components/ui/ImageViewer'


export default function RepairDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string)
	const [currentRequest, setCurrentRequest] = useState<RepairRequest | null>(null)
	const [loading, setLoading] = useState(true)

	const req = useMemo(() => mockRepairRequests.find((r) => r.id === id), [id])

	// Tự động cập nhật trạng thái khi xem chi tiết
	useEffect(() => {
		// Simulate loading
		const timer = setTimeout(() => {
			if (req && req.status === RepairStatus.CHỜ_TIẾP_NHẬN) {
				// Tự động chuyển trạng thái sang ĐÃ_TIẾP_NHẬN
				const updatedReq = {
					...req,
					status: RepairStatus.ĐÃ_TIẾP_NHẬN,
					acceptedAt: new Date().toISOString()
				}
				setCurrentRequest(updatedReq)
				
				
				// Trong thực tế, đây sẽ là API call để cập nhật trạng thái
				// await updateRepairRequestStatus(req.id, RepairStatus.ĐÃ_TIẾP_NHẬN)
			} else {
				setCurrentRequest(req || null)
			}
			setLoading(false)
		}, 500)

		return () => clearTimeout(timer)
	}, [req])

	// Helper function to get status step
	const getStatusStep = (status: RepairStatus) => {
		const steps = [
			RepairStatus.CHỜ_TIẾP_NHẬN,
			RepairStatus.ĐÃ_TIẾP_NHẬN,
			RepairStatus.ĐANG_XỬ_LÝ,
			RepairStatus.ĐÃ_HOÀN_THÀNH
		]
		const currentIndex = steps.indexOf(status)
		return currentIndex >= 0 ? currentIndex : 0
	}

	// Helper function to calculate processing time
	const getProcessingTime = (createdAt: string, completedAt?: string) => {
		const start = new Date(createdAt)
		const end = completedAt ? new Date(completedAt) : new Date()
		const diffMs = end.getTime() - start.getTime()
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		const diffDays = Math.floor(diffHours / 24)
		
		if (diffDays > 0) {
			return `${diffDays} ngày ${diffHours % 24} giờ`
		}
		return `${diffHours} giờ`
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

	if (!currentRequest) {
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
					description="Yêu cầu sửa chữa không tồn tại hoặc đã bị xóa."
					type="error"
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
						current={getStatusStep(currentRequest.status)}
						status={currentRequest.status === RepairStatus.ĐÃ_HỦY ? 'error' : 'process'}
						size="small"
						items={[
							{
								title: 'Chờ tiếp nhận',
								icon: <Clock className="w-4 h-4" />,
								description: currentRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN ? 'Hiện tại' : ''
							},
							{
								title: 'Đã tiếp nhận',
								icon: <CheckCircle className="w-4 h-4" />,
								description: currentRequest.acceptedAt ? new Date(currentRequest.acceptedAt).toLocaleDateString('vi-VN') : ''
							},
							{
								title: 'Đang xử lý',
								icon: <Settings className="w-4 h-4" />,
								description: currentRequest.status === RepairStatus.ĐANG_XỬ_LÝ ? 'Hiện tại' : ''
							},
							{
								title: 'Hoàn thành',
								icon: <CheckCircle className="w-4 h-4" />,
								description: currentRequest.completedAt ? new Date(currentRequest.completedAt).toLocaleDateString('vi-VN') : ''
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
							description={`Yêu cầu được hoàn thành lúc ${new Date(currentRequest.completedAt || '').toLocaleString('vi-VN')}. Thời gian xử lý: ${getProcessingTime(currentRequest.createdAt, currentRequest.completedAt)}`}
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
										<span className="font-medium">{currentRequest.assetCode} - {currentRequest.assetName}</span>
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

					<ActionPanel
						initStatus={currentRequest.status}
						assetId={currentRequest.computerAssetId} // Truyền computerAssetId
						errorTypeName={currentRequest.errorTypeName} // Truyền errorTypeName để xác định loại lỗi
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
							
						}}
					/>
				</div>
				<div className="xl:col-span-1">
					<HistoryCard assetId={currentRequest.computerAssetId} />
				</div>
			</div>
		</div>
	)
}


