'use client'

import { useEffect, useState } from 'react'
import { Card, Tag, Empty, Spin } from 'antd'
import { Clock, User, CheckCircle, AlertCircle, Settings, ArrowRight } from 'lucide-react'
import { getRepairLogs } from '@/lib/api/repairs'
import type { RepairLog } from '@/types'

interface Props {
	repairRequestId: string
}

export default function RepairRequestHistoryCard({ repairRequestId }: Props) {
	const [logs, setLogs] = useState<RepairLog[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!repairRequestId) return

		const fetchLogs = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await getRepairLogs(repairRequestId)
				// Sắp xếp theo thời gian tạo (mới nhất trước)
				const sortedLogs = response.data.sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
				setLogs(sortedLogs)
			} catch (err) {
				console.error('Error fetching repair logs:', err)
				setError(err instanceof Error ? err.message : 'Lỗi khi tải lịch sử xử lý')
				setLogs([])
			} finally {
				setLoading(false)
			}
		}

		fetchLogs()
	}, [repairRequestId])

	const getStatusColor = (toStatus: string | null | undefined) => {
		if (!toStatus) return 'default'
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

	const getStepStatusColorClass = (toStatus: string | null | undefined) => {
		if (!toStatus) return 'bg-gray-100 text-gray-600'
		switch (toStatus) {
			case 'ĐÃ_HOÀN_THÀNH':
				return 'bg-green-100 text-green-600'
			case 'ĐANG_XỬ_LÝ':
				return 'bg-blue-100 text-blue-600'
			case 'CHỜ_TIẾP_NHẬN':
				return 'bg-orange-100 text-orange-600'
			case 'ĐÃ_TIẾP_NHẬN':
				return 'bg-cyan-100 text-cyan-600'
			case 'CHỜ_THAY_THẾ':
				return 'bg-purple-100 text-purple-600'
			case 'ĐÃ_HỦY':
				return 'bg-red-100 text-red-600'
			default:
				return 'bg-gray-100 text-gray-600'
		}
	}


	const getDisplayStatus = (status: string | null | undefined) => {
		if (!status) return 'Không xác định'
		switch (status) {
			case 'CHỜ_TIẾP_NHẬN': return 'Chờ tiếp nhận'
			case 'ĐÃ_TIẾP_NHẬN': return 'Đã tiếp nhận'
			case 'ĐANG_XỬ_LÝ': return 'Đang xử lý'
			case 'CHỜ_THAY_THẾ': return 'Chờ thay thế'
			case 'ĐÃ_HOÀN_THÀNH': return 'Đã hoàn thành'
			case 'ĐÃ_HỦY': return 'Đã hủy'
			default: return status.replace(/_/g, ' ')
		}
	}

	const getActionIcon = (action: string) => {
		if (action.includes('Tạo') || action.includes('tạo')) {
			return <AlertCircle className="w-4 h-4" />
		}
		if (action.includes('Tiếp nhận') || action.includes('tiếp nhận')) {
			return <CheckCircle className="w-4 h-4" />
		}
		if (action.includes('xử lý') || action.includes('Xử lý')) {
			return <Settings className="w-4 h-4" />
		}
		if (action.includes('Hoàn') || action.includes('hoàn')) {
			return <CheckCircle className="w-4 h-4" />
		}
		if (action.includes('Hủy') || action.includes('hủy')) {
			return <AlertCircle className="w-4 h-4" />
		}
		return <ArrowRight className="w-4 h-4" />
	}

	if (loading) {
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
				<div className="flex items-center justify-center py-8">
					<Spin size="large" />
				</div>
			</Card>
		)
	}

	if (error) {
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
				<Empty 
					description={error}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			</Card>
		)
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
			{logs.length === 0 ? (
				<Empty 
					description="Yêu cầu này chưa có lịch sử xử lý"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			) : (
				<div className="space-y-4">
					{logs.map((log, index) => (
						<div
							key={log.id}
							className="relative flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
						>
							{/* Timeline line */}
							{index < logs.length - 1 && (
								<div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
							)}
							
							{/* Step icon */}
							<div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStepStatusColorClass(log.toStatus)}`}>
								{getActionIcon(log.action)}
							</div>
							
							{/* Step content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-gray-900 text-sm">
										{log.action}
									</h4>
									{log.toStatus && (
										<Tag color={getStatusColor(log.toStatus)} className="text-xs">
											{getDisplayStatus(log.toStatus)}
										</Tag>
									)}
								</div>
								
								{log.comment && (
									<div className="bg-gray-50 p-2 rounded-md mb-2">
										<p className="text-sm text-gray-700">
											{log.comment}
										</p>
									</div>
								)}
								
								{log.fromStatus && log.toStatus && (
									<div className="text-xs text-gray-500 mb-2">
										<span className="font-medium">Chuyển từ:</span> {getDisplayStatus(log.fromStatus)} 
										<span className="mx-1">→</span>
										<span className="font-medium">{getDisplayStatus(log.toStatus)}</span>
									</div>
								)}
								
								<div className="flex items-center justify-between text-xs text-gray-500">
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{new Date(log.createdAt).toLocaleString('vi-VN')}
									</span>
									<span className="flex items-center gap-1">
										<User className="w-3 h-3" />
										{log.actor.fullName}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</Card>
	)
}

