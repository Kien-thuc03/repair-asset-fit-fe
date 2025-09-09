"use client"

import { useAuth } from '@/contexts/AuthContext'
import StatsCards from '@/components/technician/Dashboard/StatsCards'
import RecentRequests from '@/components/technician/Dashboard/RecentRequests'
import Announcements from '@/components/technician/Dashboard/Announcements'
import QuickLinks from '@/components/technician/Dashboard/QuickLinks'

export default function KyThuatVienDashboard() {
	const { user } = useAuth()

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Dashboard Kỹ thuật viên</h1>
				<p className="mt-2 text-gray-600">Chào mừng {user?.fullName}! Quản lý công việc sửa chữa của bạn.</p>
			</div>

			<StatsCards />

			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RecentRequests />
				</div>
				<div className="lg:col-span-1">
					<Announcements />
				</div>
			</div>

			<QuickLinks />
		</div>
	)
}
