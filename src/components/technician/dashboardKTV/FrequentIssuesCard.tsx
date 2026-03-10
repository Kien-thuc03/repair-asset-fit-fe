'use client'

import { Card, List, Tag, Progress, Empty, Spin } from 'antd'
import { AlertTriangle, Computer, Calendar } from 'lucide-react'
import { useRepairDashboardData } from '@/hooks/useRepairDashboardData'

export default function FrequentIssuesCard() {
	const { assetStats, loading, error } = useRepairDashboardData()
	
	if (loading) {
		return (
			<Card 
				title={
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-orange-600" />
						<span>Tài sản hay gặp sự cố</span>
					</div>
				}
				className="h-fit"
			>
				<div className="flex items-center justify-center py-6">
					<Spin />
				</div>
			</Card>
		)
	}

	if (error || assetStats.length === 0) {
		return (
			<Card 
				title={
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-orange-600" />
						<span>Tài sản hay gặp sự cố</span>
					</div>
				}
				className="h-fit"
			>
				<Empty 
					description={error || "Không có dữ liệu thống kê"}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			</Card>
		)
	}

	return (
		<Card 
			title={
				<div className="flex items-center gap-2">
					<AlertTriangle className="w-5 h-5 text-orange-600" />
					<span>Tài sản hay gặp sự cố</span>
				</div>
			}
			className="h-fit"
			extra={
				<Tag color="orange" className="text-xs">
					Top {assetStats.length}
				</Tag>
			}
		>
			<List
				dataSource={assetStats}
				renderItem={(item, index) => (
					<List.Item key={item.assetId} className="border-b-0 px-0">
						<div className="w-full">
							<div className="flex items-start justify-between mb-2">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="text-lg font-bold text-gray-400">
											#{index + 1}
										</span>
										<Computer className="w-4 h-4 text-gray-400" />
										<span className="font-medium text-gray-900 text-sm">
											{item.ktCode}
										</span>
									</div>
									<p className="text-xs text-gray-600 ml-8">
										{item.assetName}
									</p>
								</div>
								<div className="text-right">
									<div className="font-semibold text-orange-600">
										{item.totalIssues} lỗi
									</div>
									<div className="text-xs text-gray-500 flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										{item.completedIssues} đã sửa
									</div>
								</div>
							</div>
							
							<div className="ml-8">
								<div className="flex items-center justify-between text-xs text-gray-500 mb-1">
									<span>Tỷ lệ sửa thành công</span>
									<span>{item.successRate}%</span>
								</div>
								<Progress
									percent={item.successRate}
									size="small"
									strokeColor={
										item.successRate >= 80 ? '#52c41a' :
										item.successRate >= 60 ? '#faad14' : '#ff4d4f'
									}
									showInfo={false}
								/>
								
								{item.lastIssueDate && (
									<div className="text-xs text-gray-400 mt-1">
										Lần cuối: {new Date(item.lastIssueDate).toLocaleDateString('vi-VN')}
									</div>
								)}
								
								{item.commonIssues.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-1">
										{item.commonIssues.slice(0, 3).map((issue, idx) => (
											<Tag key={idx} color="red" className="text-xs">
												{issue}
											</Tag>
										))}
										{item.commonIssues.length > 3 && (
											<Tag className="text-xs">
												+{item.commonIssues.length - 3}
											</Tag>
										)}
									</div>
								)}
							</div>
						</div>
					</List.Item>
				)}
			/>
		</Card>
	)
}