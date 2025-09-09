'use client'

// Tạm thời dùng mock static, có thể nối với store/BE sau
const announcements = [
	{
		id: 'ann-001',
		title: 'Đề xuất thay thế DXTT-2025-0003 đã được duyệt',
		description: 'Card đồ họa GTX 1050 đã được phê duyệt thay thế, chờ mua sắm',
		createdAt: '2025-01-18T10:00:00Z',
		type: 'approved',
	},
	{
		id: 'ann-002',
		title: 'Đề xuất DXTT-2025-0005 bị từ chối',
		description: 'Lý do: Thiếu biên bản xác minh hiện trường',
		createdAt: '2025-01-17T16:30:00Z',
		type: 'rejected',
	},
]

export default function Announcements() {
	return (
		<div className="bg-white shadow rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Thông báo</h3>
				<ul className="space-y-3">
					{announcements.map((a) => (
						<li key={a.id} className="border rounded-md p-3 hover:bg-gray-50">
							<p className="text-sm font-medium text-gray-900">{a.title}</p>
							<p className="text-sm text-gray-600">{a.description}</p>
							<p className="text-xs text-gray-500 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}


