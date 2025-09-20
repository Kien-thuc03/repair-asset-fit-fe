'use client'

import { RepairStatus } from '@/types'
import { useState, useEffect } from 'react'
import { Button, Form, Input, Radio, Card, Alert } from 'antd'
import { CheckCircle, Settings, Package, FileText } from 'lucide-react'
import ReplacementPartsInput, { ReplacementPart } from './ReplacementPartsInput'

const { TextArea } = Input

interface Props {
	initStatus: RepairStatus
	requestId?: string
	assetId?: string // Thêm prop assetId
	errorTypeName?: string // Thêm prop errorTypeName để xác định loại lỗi
	onCreateReplacement: (parts: ReplacementPart[]) => void
	onStatusUpdate?: (newStatus: RepairStatus, notes: string) => void
}

export default function ActionPanel({ initStatus, requestId, assetId, errorTypeName, onCreateReplacement, onStatusUpdate }: Props) {
	const [form] = Form.useForm()
	const [status, setStatus] = useState<RepairStatus>(initStatus)
	const [inspectionResult, setInspectionResult] = useState<'software' | 'hardware' | 'replacement' | ''>('')
	const [showReplacementParts, setShowReplacementParts] = useState(false)

	// Xác định loại lỗi dựa trên errorTypeName
	const getErrorCategory = () => {
		if (!errorTypeName) return 'unknown'
		
		// Kiểm tra nếu là lỗi phần mềm
		const softwareKeywords = ['phần mềm', 'software', 'ứng dụng', 'hệ điều hành', 'driver', 'virus', 'bảo mật']
		const hardwareKeywords = ['phần cứng', 'hardware', 'màn hình', 'bàn phím', 'chuột', 'CPU', 'RAM', 'ổ cứng', 'nguồn', 'card']
		
		const lowerErrorType = errorTypeName.toLowerCase()
		
		if (softwareKeywords.some(keyword => lowerErrorType.includes(keyword))) {
			return 'software'
		}
		if (hardwareKeywords.some(keyword => lowerErrorType.includes(keyword))) {
			return 'hardware'
		}
		
		// Mặc định là phần mềm nếu không xác định được
		return 'software'
	}

	const errorCategory = getErrorCategory()



	const onFinish = (values: {
		inspectionResult: string
		notes: string
		replacementParts?: ReplacementPart[]
	}) => {
		console.log('Form values:', values)
		
		// Xác định trạng thái mới dựa trên kết quả kiểm tra
		let newStatus = status
		if (values.inspectionResult === 'software') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
		} else if (values.inspectionResult === 'hardware') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
		} else if (values.inspectionResult === 'replacement') {
			newStatus = RepairStatus.CHỜ_THAY_THẾ
			// Nếu có linh kiện cần thay thế, tạo đề xuất
			if (values.replacementParts && values.replacementParts.length > 0) {
				onCreateReplacement(values.replacementParts)
			}
		}
		
		// Gọi callback để cập nhật trạng thái
		if (onStatusUpdate) {
			onStatusUpdate(newStatus, values.notes || '')
		}
	}

	// Hiển thị UI khác nhau tùy theo trạng thái
	const renderContent = () => {
		if (status === RepairStatus.CHỜ_TIẾP_NHẬN) {
			return (
				<Alert
					message="Yêu cầu đã được tiếp nhận"
					description="Hệ thống đã tự động cập nhật trạng thái. Vui lòng đến kiểm tra thực tế và cập nhật kết quả."
					type="info"
					icon={<CheckCircle />}
					showIcon
				/>
			)
		}

		if (status === RepairStatus.ĐÃ_TIẾP_NHẬN) {
			return (
				<Form
					form={form}
					onFinish={onFinish}
					layout="vertical"
					initialValues={{ status: RepairStatus.ĐANG_XỬ_LÝ }}
				>
					<Form.Item>
						<Button 
							type="primary" 
							icon={<Settings />}
							onClick={() => {
								setStatus(RepairStatus.ĐANG_XỬ_LÝ)
								if (onStatusUpdate) {
									onStatusUpdate(RepairStatus.ĐANG_XỬ_LÝ, 'Bắt đầu kiểm tra và xử lý')
								}
							}}
						>
							Bắt đầu kiểm tra
						</Button>
					</Form.Item>
				</Form>
			)
		}

		if (status === RepairStatus.ĐANG_XỬ_LÝ) {
			return (
				<Form
					form={form}
					onFinish={onFinish}
					layout="vertical"
				>
					<Alert
						message={`Xử lý lỗi ${errorCategory === 'hardware' ? 'phần cứng' : errorCategory === 'software' ? 'phần mềm' : 'không xác định'}`}
						description={
							errorCategory === 'hardware' 
								? "Đối với lỗi phần cứng, bạn có thể sửa chữa tại chỗ hoặc yêu cầu thay thế linh kiện." 
								: errorCategory === 'software'
								? "Đối với lỗi phần mềm, thường có thể khắc phục bằng cách cài đặt lại, cập nhật driver hoặc xử lý virus."
								: "Vui lòng kiểm tra và xác định loại lỗi để xử lý phù hợp."
						}
						type="info"
						showIcon
						className="mb-4"
					/>

					<Form.Item 
						name="inspectionResult" 
						label="Kết quả kiểm tra thực tế"
						rules={[{ required: true, message: 'Vui lòng chọn kết quả kiểm tra!' }]}
					>
						<Radio.Group onChange={(e) => {
							setInspectionResult(e.target.value)
							setShowReplacementParts(e.target.value === 'replacement')
						}}>
							<div className="space-y-3">
								{/* Hiển thị option phần mềm chỉ khi errorCategory là software */}
								{errorCategory === "software" && (
									<Radio value="software" className="flex items-start">
										<div className="ml-2">
											<div className="font-medium">Lỗi phần mềm - Đã sửa được</div>
											<div className="text-sm text-gray-500">Cài đặt lại phần mềm, cập nhật driver, khắc phục virus...</div>
										</div>
									</Radio>
								)}
								
								{/* Hiển thị options phần cứng chỉ khi errorCategory là hardware */}
								{errorCategory === "hardware" && (
									<>
										<Radio value="hardware" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Lỗi phần cứng - Đã sửa được</div>  
												<div className="text-sm text-gray-500">Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp xúc...</div>
											</div>
										</Radio>
										<Radio value="replacement" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Cần thay thế linh kiện</div>
												<div className="text-sm text-gray-500">Linh kiện hỏng không thể sửa chữa, cần thay thế mới</div>
											</div>
										</Radio>
									</>
								)}
								
								{/* Hiển thị tất cả options nếu không xác định được loại lỗi */}
								{errorCategory === "unknown" && (
									<>
										<Radio value="software" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Lỗi phần mềm - Đã sửa được</div>
												<div className="text-sm text-gray-500">Cài đặt lại phần mềm, cập nhật driver, khắc phục virus...</div>
											</div>
										</Radio>
										<Radio value="hardware" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Lỗi phần cứng - Đã sửa được</div>
												<div className="text-sm text-gray-500">Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp xúc...</div>
											</div>
										</Radio>
										<Radio value="replacement" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Cần thay thế linh kiện</div>
												<div className="text-sm text-gray-500">Linh kiện hỏng không thể sửa chữa, cần thay thế mới</div>
											</div>
										</Radio>
									</>
								)}
							</div>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						name="notes"
						label="Mô tả chi tiết quá trình xử lý"
						rules={[{ required: true, message: 'Vui lòng mô tả quá trình xử lý!' }]}
					>
						<TextArea 
							rows={4} 
							placeholder="Mô tả các bước đã thực hiện, nguyên nhân lỗi, cách khắc phục..."
						/>
					</Form.Item>

					{showReplacementParts && (
						<Form.Item 
							name="replacementParts" 
							label="Linh kiện cần thay thế"
						>
							<ReplacementPartsInput assetId={assetId} />
						</Form.Item>
					)}

					{/* Thông báo trạng thái sẽ được cập nhật */}
					{inspectionResult && (
						<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
							<div className="text-sm text-blue-800">
								<strong>💡 Trạng thái sẽ được cập nhật:</strong>
								<div className="mt-1">
									{inspectionResult === 'software' ? (
										<div>
											<span className="text-green-600 font-medium">→ Đã hoàn thành</span>
											<div className="text-xs text-gray-600 mt-1">Lỗi phần mềm đã được khắc phục hoàn toàn</div>
										</div>
									) : inspectionResult === 'hardware' ? (
										<div>
											<span className="text-green-600 font-medium">→ Đã hoàn thành</span>
											<div className="text-xs text-gray-600 mt-1">Lỗi phần cứng đã được sửa chữa thành công</div>
										</div>
									) : inspectionResult === 'replacement' ? (
										<div>
											<span className="text-orange-600 font-medium">→ Chờ thay thế linh kiện</span>
											<div className="text-xs text-gray-600 mt-1">Yêu cầu sẽ chuyển sang quy trình thay thế linh kiện</div>
										</div>
									) : (
										<span className="text-blue-900 font-medium">→ Đang xử lý</span>
									)}
								</div>
							</div>
						</div>
					)}

					<Form.Item>
						<Button type="primary" htmlType="submit" icon={<FileText />}>
							Cập nhật kết quả xử lý
						</Button>
					</Form.Item>
				</Form>
			)
		}

		if (status === RepairStatus.CHỜ_THAY_THẾ) {
			return (
				<Card>
					<Alert
						message="Đang chờ thay thế linh kiện"
						description="Đã tạo đề xuất thay thế linh kiện. Vui lòng theo dõi tiến độ tại trang 'Quản lý thay thế linh kiện'."
						type="warning"
						icon={<Package />}
						showIcon
						action={
							<Button 
								size="small" 
								type="link"
								onClick={() => window.open('/ky-thuat-vien/quan-ly-thay-the-linh-kien', '_blank')}
							>
								Xem danh sách
							</Button>
						}
					/>
				</Card>
			)
		}

		if (status === RepairStatus.ĐÃ_HOÀN_THÀNH) {
			return (
				<Alert
					message="Yêu cầu đã hoàn thành"
					description="Quá trình sửa chữa/thay thế đã hoàn tất."
					type="success"
					icon={<CheckCircle />}
					showIcon
				/>
			)
		}

		return null
	}

	return (
		<div className="bg-white shadow rounded-lg p-6 space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
				<Settings className="w-5 h-5" />
				Xử lý yêu cầu
			</h3>
			{renderContent()}
		</div>
	)
}



