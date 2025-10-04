'use client'

import Link from 'next/link'
import { FileText, Search, PlusCircle, ListChecks, Package } from 'lucide-react'

const links = [
	{ href: '/ky-thuat-vien/quan-ly-bao-loi', label: 'Danh sách yêu cầu sửa chữa', icon: ListChecks, color: 'bg-sky-600' },
	{ href: '/ky-thuat-vien/quan-ly-thay-the-linh-kien', label: 'Quản lý thay thế linh kiện', icon: Package, color: 'bg-indigo-600' },
	{ href: '/ky-thuat-vien/lap-phieu-yeu-cau-thay-the', label: 'Tạo Đề xuất Thay thế', icon: FileText, color: 'bg-purple-600' },
	{ href: '/ky-thuat-vien/tra-cuu-thiet-bi', label: 'Tra cứu Tài sản/Linh kiện', icon: Search, color: 'bg-emerald-600' },
	{ href: '/ky-thuat-vien/bao-cao-loi', label: 'Tạo Yêu cầu Mới', icon: PlusCircle, color: 'bg-orange-600' },
]

export default function QuickLinks() {
	return (
		<div className="bg-white shadow rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Lối tắt</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{links.map((l) => (
						<Link key={l.href} href={l.href} className="relative group bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
							<span className={`rounded-lg inline-flex p-3 ${l.color} text-white`}>
								<l.icon className="h-6 w-6" />
							</span>
							<div className="mt-4">
								<h3 className="text-base font-medium text-gray-900">{l.label}</h3>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}


