'use client'

import { useEffect, useState } from 'react'
import { Card, Tag, Timeline, Empty, Spin } from 'antd'
import { Clock, User, Wrench, CheckCircle, AlertCircle } from 'lucide-react'
import { getRepairs } from '@/lib/api/repairs'
import { RepairRequest, RepairStatus } from '@/types'

interface Props {
	assetId: string
}

export default function HistoryCard({ assetId }: Props) {
	const [items, setItems] = useState<RepairRequest[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!assetId) return

		const fetchHistory = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await getRepairs({
					computerAssetId: assetId,
					page: 1,
					limit: 20,
					sortBy: 'createdAt',
					sortOrder: 'DESC',
				})
				setItems(response.data)
			} catch (err) {
				console.error('Error loading asset history', err)
				setError(err instanceof Error ? err.message : 'Không thể tải lịch sử xử lý')
				setItems([])
			} finally {
				setLoading(false)
			}
		}

		fetchHistory()
	}, [assetId])

	const getStatusColor = (status: string) => {
		switch (status) {
			case RepairStatus.ĐÃ_HOÀN_THÀNH:
			 return 'green'
			case RepairStatus.ĐANG_XỬ_LÝ:
				return 'blue'
			case RepairStatus.CHỜ_TIẾP_NHẬN:
				return 'orange'
			case RepairStatus.ĐÃ_TIẾP_NHẬN:
				return 'cyan'
			case RepairStatus.CHỜ_THAY_THẾ:
				return 'purple'
			case RepairStatus.ĐÃ_HỦY:
				return 'red'
			default:
				return 'default'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case RepairStatus.ĐÃ_HOÀN_THÀNH:
				return <CheckCircle className="w-4 h-4" />
			case RepairStatus.ĐANG_XỬ_LÝ:
				return <Wrench className="w-4 h-4" />
			case RepairStatus.CHỜ_TIẾP_NHẬN:
				return <Clock className="w-4 h-4" />
			case RepairStatus.ĐÃ_TIẾP_NHẬN:
				return <CheckCircle className="w-4 h-4" />
			case RepairStatus.CHỜ_THAY_THẾ:
				return <AlertCircle className="w-4 h-4" />
			case RepairStatus.ĐÃ_HỦY:
				return <AlertCircle className="w-4 h-4" />
			default:
				return <Clock className="w-4 h-4" />
		}
	}

	const getDisplayStatus = (status: string) => {
		switch (status) {
			case RepairStatus.CHỜ_TIẾP_NHẬN: return 'Chờ tiếp nhận'
			case RepairStatus.ĐÃ_TIẾP_NHẬN: return 'Đã tiếp nhận'
			case RepairStatus.ĐANG_XỬ_LÝ: return 'Đang xử lý'
			case RepairStatus.CHỜ_THAY_THẾ: return 'Chờ thay thế'
			case RepairStatus.ĐÃ_HOÀN_THÀNH: return 'Đã hoàn thành'
			case RepairStatus.ĐÃ_HỦY: return 'Đã hủy'
			default: return status
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
			{loading ? (
				<div className="flex items-center justify-center py-6">
					<Spin />
				</div>
			) : error ? (
				<Empty 
					description={error}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			) : items.length === 0 ? (
				<Empty 
					description="Tài sản này chưa có lịch sử xử lý"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			) : (
				<Timeline
					items={items.map((item) => ({
						color: getStatusColor(item.status),
						dot: getStatusIcon(item.status),
						children: (
							<div className="pb-4" key={item.id}>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-gray-900 text-sm">
										{item.requestCode}
									</h4>
									<Tag color={getStatusColor(item.status)} className="text-xs">
										{getDisplayStatus(item.status)}
									</Tag>
								</div>
								<div className="mb-2">
									<p className="text-sm font-medium text-gray-700 mb-1">
										{item.description || 'Không có mô tả'}
									</p>
									<p className="text-sm text-gray-600">
										<strong>Loại lỗi:</strong> {item.errorTypeName || 'Chưa xác định'}
									</p>
								</div>
								<div className="flex items-center justify-between text-xs text-gray-500">
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{new Date(item.createdAt).toLocaleString('vi-VN')}
									</span>
									<span className="flex items-center gap-1">
										<User className="w-3 h-3" />
										{item.reporterName || 'Ẩn danh'}
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
