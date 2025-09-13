'use client'

import { Card, Tag, Timeline, Empty } from 'antd'
import { Clock, User, Wrench, CheckCircle, AlertCircle } from 'lucide-react'
import { mockRepairHistoryLookup } from '@/lib/mockData/assetsLookup'

interface Props {
	assetId: string
}

export default function HistoryCard({ assetId }: Props) {
	const items = mockRepairHistoryLookup.filter((h) => h.assetId === assetId).slice(0, 8)

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'hoàn thành':
			case 'đã hoàn thành':
				return 'green'
			case 'đang xử lý':
				return 'blue'
			case 'chờ tiếp nhận':
				return 'orange'
			case 'hủy bỏ':
			case 'đã hủy':
				return 'red'
			default:
				return 'default'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case 'hoàn thành':
			case 'đã hoàn thành':
				return <CheckCircle className="w-4 h-4" />
			case 'đang xử lý':
				return <Wrench className="w-4 h-4" />
			case 'chờ tiếp nhận':
				return <Clock className="w-4 h-4" />
			case 'hủy bỏ':
			case 'đã hủy':
				return <AlertCircle className="w-4 h-4" />
			default:
				return <Clock className="w-4 h-4" />
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
					items={items.map((item, index) => ({
						color: getStatusColor(item.status),
						dot: getStatusIcon(item.status),
						children: (
							<div className="pb-4" key={item.id}>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-gray-900 text-sm">
										{item.requestCode}
									</h4>
									<Tag color={getStatusColor(item.status)} className="text-xs">
										{item.status}
									</Tag>
								</div>
								<p className="text-sm text-gray-600 mb-2">
									<strong>Lỗi:</strong> {item.errorType}
								</p>
								<p className="text-sm text-gray-600 mb-2">
									{item.description}
								</p>
								{item.solution && (
									<div className="bg-green-50 p-2 rounded-md mb-2 border-l-4 border-green-400">
										<p className="text-sm text-green-800">
											<strong>Giải pháp:</strong> {item.solution}
										</p>
									</div>
								)}
								<div className="flex items-center justify-between text-xs text-gray-500">
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{new Date(item.reportDate).toLocaleDateString('vi-VN')}
										{item.completedDate && item.completedDate !== item.reportDate && (
											<> → {new Date(item.completedDate).toLocaleDateString('vi-VN')}</>
										)}
									</span>
									<span className="flex items-center gap-1">
										<User className="w-3 h-3" />
										{item.technicianName}
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


