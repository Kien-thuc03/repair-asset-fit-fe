'use client'

import { Card, Tag, Timeline, Empty } from 'antd'
import { Clock, User, Wrench, CheckCircle, AlertCircle } from 'lucide-react'
import { repairLogs } from '@/lib/mockData'

interface Props {
	assetId: string
}

export default function HistoryCard({ assetId }: Props) {
	// Get repair logs for this asset, sorted by date (newest first)
	const items = repairLogs
		.filter(log => log.computerAssetId === assetId)
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 10)

	const getStatusColor = (toStatus: string) => {
		switch (toStatus) {
			case 'ĐÃ_HOÀN_THÀNH':
				return 'green'
			case 'ĐANG_XỬ_LÝ':
				return 'blue'
			case 'CHỜ_TIẾP_NHẬN':
				return 'orange'
			case 'ĐÃ_TIẾP_NHẬN':
				return 'cyan'
			case 'CHỜ_THAY_THẾ':
				return 'purple'
			case 'ĐÃ_HỦY':
				return 'red'
			default:
				return 'default'
		}
	}

	const getStatusIcon = (toStatus: string) => {
		switch (toStatus) {
			case 'ĐÃ_HOÀN_THÀNH':
				return <CheckCircle className="w-4 h-4" />
			case 'ĐANG_XỬ_LÝ':
				return <Wrench className="w-4 h-4" />
			case 'CHỜ_TIẾP_NHẬN':
				return <Clock className="w-4 h-4" />
			case 'ĐÃ_TIẾP_NHẬN':
				return <CheckCircle className="w-4 h-4" />
			case 'CHỜ_THAY_THẾ':
				return <AlertCircle className="w-4 h-4" />
			case 'ĐÃ_HỦY':
				return <AlertCircle className="w-4 h-4" />
			default:
				return <Clock className="w-4 h-4" />
		}
	}

	const getDisplayStatus = (toStatus: string) => {
		switch (toStatus) {
			case 'CHỜ_TIẾP_NHẬN': return 'Chờ tiếp nhận'
			case 'ĐÃ_TIẾP_NHẬN': return 'Đã tiếp nhận'
			case 'ĐANG_XỬ_LÝ': return 'Đang xử lý'
			case 'CHỜ_THAY_THẾ': return 'Chờ thay thế'
			case 'ĐÃ_HOÀN_THÀNH': return 'Đã hoàn thành'
			case 'ĐÃ_HỦY': return 'Đã hủy'
			default: return toStatus
		}
	}

	return (
		<Card 
			title={
				<div className="flex items-center gap-2">
					<Clock className="w-5 h-5 text-purple-600" />
					<span>Lịch sử xử lý</span>
				</div>
			}
			className="h-fit"
		>
			{items.length === 0 ? (
				<Empty 
					description="Tài sản này chưa có lịch sử xử lý"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			) : (
				<Timeline
					items={items.map((item) => ({
						color: getStatusColor(item.toStatus),
						dot: getStatusIcon(item.toStatus),
						children: (
							<div className="pb-4" key={item.id}>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-gray-900 text-sm">
										{item.requestCode}
									</h4>
									<Tag color={getStatusColor(item.toStatus)} className="text-xs">
										{getDisplayStatus(item.toStatus)}
									</Tag>
								</div>
								<div className="mb-2">
									<p className="text-sm font-medium text-gray-700 mb-1">
										{item.action}
									</p>
									<p className="text-sm text-gray-600">
										<strong>Loại lỗi:</strong> {item.errorTypeName}
									</p>
								</div>
								<div className="bg-gray-50 p-2 rounded-md mb-2">
									<p className="text-sm text-gray-700">
										{item.comment}
									</p>
								</div>
								{item.fromStatus && (
									<div className="text-xs text-gray-500 mb-2">
										<span className="font-medium">Chuyển từ:</span> {getDisplayStatus(item.fromStatus)} 
										<span className="mx-1">→</span>
										<span className="font-medium">{getDisplayStatus(item.toStatus)}</span>
									</div>
								)}
								<div className="flex items-center justify-between text-xs text-gray-500">
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{new Date(item.createdAt).toLocaleString('vi-VN')}
									</span>
									<span className="flex items-center gap-1">
										<User className="w-3 h-3" />
										{item.actorName}
									</span>
								</div>
							</div>
						)
					}))}
				/>
			)}
		</Card>
	)
}


