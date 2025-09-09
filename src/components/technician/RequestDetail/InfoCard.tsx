'use client'

import { RepairRequest } from '@/types'

interface Props {
	req: RepairRequest
}

export default function InfoCard({ req }: Props) {
	return (
		<div className="bg-white shadow rounded-lg p-4 space-y-3">
			<h3 className="text-lg font-semibold text-gray-900">Thông tin báo lỗi</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
				<div>
					<p className="text-gray-500">Mã yêu cầu</p>
					<p className="font-medium">{req.requestCode}</p>
				</div>
				<div>
					<p className="text-gray-500">Tài sản</p>
					<p className="font-medium">{req.assetName} ({req.assetCode})</p>
				</div>
				{req.componentName ? (
					<div>
						<p className="text-gray-500">Linh kiện</p>
						<p className="font-medium">{req.componentName}</p>
					</div>
				) : null}
				<div>
					<p className="text-gray-500">Vị trí</p>
					<p className="font-medium">{req.roomName}</p>
				</div>
				{req.errorTypeName ? (
					<div>
						<p className="text-gray-500">Loại lỗi</p>
						<p className="font-medium">{req.errorTypeName}</p>
					</div>
				) : null}
				<div className="md:col-span-2">
					<p className="text-gray-500">Mô tả</p>
					<p className="font-medium whitespace-pre-wrap">{req.description}</p>
				</div>
				{req.mediaUrls?.length ? (
					<div className="md:col-span-2">
						<p className="text-gray-500">Tệp đính kèm</p>
						<div className="mt-2 flex flex-wrap gap-2">
							{req.mediaUrls.map((url) => (
								<span key={url} className="text-xs text-blue-600 underline">{url}</span>
							))}
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}


