'use client'

import { Card, Row, Col, Statistic, Progress } from 'antd'
import { CheckCircle, Clock, XCircle, Wrench, TrendingUp, Timer } from 'lucide-react'
import { useRepairDashboardData } from '@/hooks/useRepairDashboardData'

export default function RepairHistoryStats() {
	const { repairHistoryStats: stats, loading, error } = useRepairDashboardData()

	const completionRate = stats.completionRate
	
	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
				<TrendingUp className="w-5 h-5 text-blue-600" />
				Thống kê lịch sử sửa chữa
			</h2>
			
			{error && (
				<div className="text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
					{error}
				</div>
			)}

			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="Tổng số yêu cầu"
							value={loading ? undefined : stats.total}
							prefix={<Wrench className="w-4 h-4" />}
							valueStyle={{ color: '#3f6600' }}
						/>
					</Card>
				</Col>
				
				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="Đã hoàn thành"
							value={loading ? undefined : stats.completed}
							prefix={<CheckCircle className="w-4 h-4" />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				
				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="Đang xử lý"
							value={loading ? undefined : stats.inProgress}
							prefix={<Clock className="w-4 h-4" />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				
				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="Đã hủy"
							value={loading ? undefined : stats.cancelled}
							prefix={<XCircle className="w-4 h-4" />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Card title={
						<div className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							<span>Tỷ lệ hoàn thành</span>
						</div>
					}>
						<div className="text-center">
							<Progress
								type="circle"
								percent={loading ? 0 : completionRate}
								strokeColor={{
									'0%': '#108ee9',
									'100%': '#87d068',
								}}
								size={120}
							/>
							<p className="mt-4 text-sm text-gray-600">
								{stats.completed} trong {stats.total} yêu cầu đã hoàn thành
							</p>
						</div>
					</Card>
				</Col>
				
				<Col xs={24} lg={12}>
					<Card title={
						<div className="flex items-center gap-2">
							<Timer className="w-5 h-5 text-blue-600" />
							<span>Thời gian xử lý trung bình</span>
						</div>
					}>
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-600 mb-2">
								{loading ? '...' : stats.avgProcessingTimeHours}
							</div>
							<div className="text-lg text-gray-600 mb-2">giờ</div>
							<p className="text-sm text-gray-500">
								Thời gian trung bình từ tiếp nhận đến hoàn thành
							</p>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	)
}